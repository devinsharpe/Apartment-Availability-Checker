import {
  CollectionReference,
  Firestore,
  collection,
  doc,
  getDocs,
  getFirestore,
  setDoc
} from "firebase/firestore";
import type { ElementHandle, Page } from "puppeteer-core";
import { VercelRequest, VercelResponse } from "@vercel/node";

import chromium from "chrome-aws-lambda";
import dotenv from "dotenv";
import { initializeApp } from "firebase/app";
import path from "path";
import twilio from "twilio";

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

interface FloorPlan {
  name: string;
  label: string;
  amtAvail: number;
}

interface FloorPlanObject {
  [key: string]: FloorPlan;
}

const complexConfig = {
  "the-harrison": {
    name: "The Harrison",
    page: "https://www.theharrisonatbraselton.com/floorplans",
    init: async (page: Page) => {
      await page.waitForTimeout(1000);
      const modalDismissEl = await page.waitForSelector(
        "a[data-dismiss='modal']",
        {
          visible: true
        }
      );
      if (modalDismissEl) {
        modalDismissEl.click();
      }
    },
    getAvailability: async (page: Page) => {
      const plans = {} as FloorPlanObject;
      let index = 0;
      while (index + 1) {
        let heading, subheading;
        try {
          heading = (await page.waitForSelector(`h2#fp-header-${index}`, {
            visible: true,
            timeout: 500
          })) as ElementHandle<HTMLHeadingElement>;
          subheading = (await page.waitForSelector(
            `span[data-selenium-id='Floorplan${index} Availability']`,
            {
              visible: true,
              timeout: 500
            }
          )) as ElementHandle<HTMLHeadingElement>;
        } catch (e) {}

        if (heading && subheading) {
          const name = (await heading.evaluate((h) => h.innerText))
            .trim()
            .toLowerCase()
            .replace(/ /g, "-");
          const label = (await heading.evaluate((h) => h.innerText)).trim();
          let amtAvail = 0;
          const availText = await subheading.evaluate((h) => h.innerText);
          if (availText.includes("Available"))
            amtAvail = parseInt(availText.split(" ")[0], 10);
          plans[name] = { name, label, amtAvail };
          index += 1;
        } else {
          break;
        }
      }
      return plans;
    }
  }
} as {
  [key: string]: {
    name: string;
    page: string;
    init: (page: Page) => Promise<void>;
    getAvailability: (page: Page) => Promise<FloorPlanObject>;
  };
};

async function getRemoteFloorPlans(
  complex: { name: string; id: string },
  db: Firestore
) {
  const complexCol = collection(db, "complexes");
  const ref = doc(complexCol, complex.id);
  await setDoc(ref, { id: complex.id, name: complex.name });
  const floorPlans = [] as { id: string; label: string; amtAvail: number }[];
  const floorPlansCol = collection(ref, "floorplans") as CollectionReference<{
    label: string;
    amtAvail: number;
  }>;
  const floorPlansSnapshot = await getDocs(floorPlansCol);
  floorPlansSnapshot.forEach((floorPlan) =>
    floorPlans.push({ id: floorPlan.id, ...floorPlan.data() })
  );
  return { floorPlans, floorPlansCol };
}

function checkFloorPlanDifferences(
  current: FloorPlanObject,
  remote: { id: string; label: string; amtAvail: number }[]
) {
  let notifyNeeded = false;
  for (const [name, plan] of Object.entries(current)) {
    const existingPlan = remote.find((p) => p.id === name);
    if (
      !existingPlan ||
      (existingPlan &&
        existingPlan.amtAvail !== plan.amtAvail &&
        plan.amtAvail > 0)
    )
      notifyNeeded = true;
  }
  return notifyNeeded;
}

async function updateRemoteFloorPlans(
  current: FloorPlanObject,
  collection: CollectionReference
) {
  for (const [name, plan] of Object.entries(current)) {
    await setDoc(doc(collection, plan.name), {
      label: plan.label,
      amtAvail: plan.amtAvail
    });
  }
}

function formatPlansMessage(complexName: string, plans: FloorPlanObject) {
  let message = `${complexName} Availability\n`;
  for (const [name, plan] of Object.entries(plans)) {
    message += `${plan.label}: ${plan.amtAvail} available\n`;
  }
  return message;
}

async function sendMessage(message: string, twilioClient: twilio.Twilio) {
  const recipients = process.env.TWILIO_TO_PHONE.split(",");
  for (const recipient of recipients) {
    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to: recipient
    });
  }
}

async function main() {
  const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID
  };
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  const browser = await chromium.puppeteer.launch({
    args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: true,
    ignoreHTTPSErrors: true
  });
  const page = await browser.newPage();

  for (const [key, complex] of Object.entries(complexConfig)) {
    await page.goto(complex.page);
    await complex.init(page);
    let currentPlans = await complex.getAvailability(page);
    const { floorPlans, floorPlansCol } = await getRemoteFloorPlans(
      { name: complex.name, id: key },
      db
    );
    const notifyNeeded = checkFloorPlanDifferences(currentPlans, floorPlans);
    await updateRemoteFloorPlans(currentPlans, floorPlansCol);
    if (!notifyNeeded) {
      const message = formatPlansMessage(complex.name, currentPlans);
      await sendMessage(message, twilioClient);
    }
  }
  browser.close();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await main();
    res.status(204).end();
  } catch (e) {
    res.status(500).send({ error: e });
  }
}
