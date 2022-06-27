"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var firestore_1 = require("firebase/firestore");
var chrome_aws_lambda_1 = __importDefault(require("chrome-aws-lambda"));
var dotenv_1 = __importDefault(require("dotenv"));
var app_1 = require("firebase/app");
var path_1 = __importDefault(require("path"));
var twilio_1 = __importDefault(require("twilio"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "..", ".env") });
var complexConfig = {
    "the-harrison": {
        name: "The Harrison",
        page: "https://www.theharrisonatbraselton.com/floorplans",
        init: function (page) { return __awaiter(void 0, void 0, void 0, function () {
            var modalDismissEl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.waitForTimeout(1000)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, page.waitForSelector("a[data-dismiss='modal']", {
                                visible: true
                            })];
                    case 2:
                        modalDismissEl = _a.sent();
                        if (modalDismissEl) {
                            modalDismissEl.click();
                        }
                        return [2 /*return*/];
                }
            });
        }); },
        getAvailability: function (page) { return __awaiter(void 0, void 0, void 0, function () {
            var plans, index, heading, subheading, e_1, name_1, label, amtAvail, availText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        plans = {};
                        index = 0;
                        _a.label = 1;
                    case 1:
                        if (!(index + 1)) return [3 /*break*/, 12];
                        heading = void 0, subheading = void 0;
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, page.waitForSelector("h2#fp-header-" + index, {
                                visible: true,
                                timeout: 500
                            })];
                    case 3:
                        heading = (_a.sent());
                        return [4 /*yield*/, page.waitForSelector("span[data-selenium-id='Floorplan" + index + " Availability']", {
                                visible: true,
                                timeout: 500
                            })];
                    case 4:
                        subheading = (_a.sent());
                        return [3 /*break*/, 6];
                    case 5:
                        e_1 = _a.sent();
                        return [3 /*break*/, 6];
                    case 6:
                        if (!(heading && subheading)) return [3 /*break*/, 10];
                        return [4 /*yield*/, heading.evaluate(function (h) { return h.innerText; })];
                    case 7:
                        name_1 = (_a.sent())
                            .trim()
                            .toLowerCase()
                            .replace(/ /g, "-");
                        return [4 /*yield*/, heading.evaluate(function (h) { return h.innerText; })];
                    case 8:
                        label = (_a.sent()).trim();
                        amtAvail = 0;
                        return [4 /*yield*/, subheading.evaluate(function (h) { return h.innerText; })];
                    case 9:
                        availText = _a.sent();
                        if (availText.includes("Available"))
                            amtAvail = parseInt(availText.split(" ")[0], 10);
                        plans[name_1] = { name: name_1, label: label, amtAvail: amtAvail };
                        index += 1;
                        return [3 /*break*/, 11];
                    case 10: return [3 /*break*/, 12];
                    case 11: return [3 /*break*/, 1];
                    case 12: return [2 /*return*/, plans];
                }
            });
        }); }
    }
};
function getRemoteFloorPlans(complex, db) {
    return __awaiter(this, void 0, void 0, function () {
        var complexCol, ref, floorPlans, floorPlansCol, floorPlansSnapshot;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    complexCol = (0, firestore_1.collection)(db, "complexes");
                    ref = (0, firestore_1.doc)(complexCol, complex.id);
                    return [4 /*yield*/, (0, firestore_1.setDoc)(ref, { id: complex.id, name: complex.name })];
                case 1:
                    _a.sent();
                    floorPlans = [];
                    floorPlansCol = (0, firestore_1.collection)(ref, "floorplans");
                    return [4 /*yield*/, (0, firestore_1.getDocs)(floorPlansCol)];
                case 2:
                    floorPlansSnapshot = _a.sent();
                    floorPlansSnapshot.forEach(function (floorPlan) {
                        return floorPlans.push(__assign({ id: floorPlan.id }, floorPlan.data()));
                    });
                    return [2 /*return*/, { floorPlans: floorPlans, floorPlansCol: floorPlansCol }];
            }
        });
    });
}
function checkFloorPlanDifferences(current, remote) {
    var e_2, _a;
    var notifyNeeded = false;
    var _loop_1 = function (name_2, plan) {
        var existingPlan = remote.find(function (p) { return p.id === name_2; });
        if (!existingPlan ||
            (existingPlan &&
                existingPlan.amtAvail !== plan.amtAvail &&
                plan.amtAvail > 0))
            notifyNeeded = true;
    };
    try {
        for (var _b = __values(Object.entries(current)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2), name_2 = _d[0], plan = _d[1];
            _loop_1(name_2, plan);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return notifyNeeded;
}
function updateRemoteFloorPlans(current, collection) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, _c, name_3, plan, e_3_1;
        var e_3, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 5, 6, 7]);
                    _a = __values(Object.entries(current)), _b = _a.next();
                    _e.label = 1;
                case 1:
                    if (!!_b.done) return [3 /*break*/, 4];
                    _c = __read(_b.value, 2), name_3 = _c[0], plan = _c[1];
                    return [4 /*yield*/, (0, firestore_1.setDoc)((0, firestore_1.doc)(collection, plan.name), {
                            label: plan.label,
                            amtAvail: plan.amtAvail
                        })];
                case 2:
                    _e.sent();
                    _e.label = 3;
                case 3:
                    _b = _a.next();
                    return [3 /*break*/, 1];
                case 4: return [3 /*break*/, 7];
                case 5:
                    e_3_1 = _e.sent();
                    e_3 = { error: e_3_1 };
                    return [3 /*break*/, 7];
                case 6:
                    try {
                        if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                    }
                    finally { if (e_3) throw e_3.error; }
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function formatPlansMessage(complexName, plans) {
    var e_4, _a;
    var message = complexName + " Availability\n";
    try {
        for (var _b = __values(Object.entries(plans)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2), name_4 = _d[0], plan = _d[1];
            message += plan.label + ": " + plan.amtAvail + " available\n";
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_4) throw e_4.error; }
    }
    return message;
}
function sendMessage(message, twilioClient) {
    return __awaiter(this, void 0, void 0, function () {
        var recipients, recipients_1, recipients_1_1, recipient, e_5_1;
        var e_5, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    recipients = process.env.TWILIO_TO_PHONE.split(",");
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 8]);
                    recipients_1 = __values(recipients), recipients_1_1 = recipients_1.next();
                    _b.label = 2;
                case 2:
                    if (!!recipients_1_1.done) return [3 /*break*/, 5];
                    recipient = recipients_1_1.value;
                    return [4 /*yield*/, twilioClient.messages.create({
                            body: message,
                            from: process.env.TWILIO_PHONE,
                            to: recipient
                        })];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    recipients_1_1 = recipients_1.next();
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 8];
                case 6:
                    e_5_1 = _b.sent();
                    e_5 = { error: e_5_1 };
                    return [3 /*break*/, 8];
                case 7:
                    try {
                        if (recipients_1_1 && !recipients_1_1.done && (_a = recipients_1.return)) _a.call(recipients_1);
                    }
                    finally { if (e_5) throw e_5.error; }
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var firebaseConfig, app, db, twilioClient, browser, _a, _b, page, _c, _d, _e, key, complex, currentPlans, _f, floorPlans, floorPlansCol, notifyNeeded, message, e_6_1;
        var _g, e_6, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    firebaseConfig = {
                        apiKey: process.env.API_KEY,
                        authDomain: process.env.AUTH_DOMAIN,
                        projectId: process.env.PROJECT_ID,
                        storageBucket: process.env.STORAGE_BUCKET,
                        messagingSenderId: process.env.MESSAGING_SENDER_ID,
                        appId: process.env.APP_ID
                    };
                    app = (0, app_1.initializeApp)(firebaseConfig);
                    db = (0, firestore_1.getFirestore)(app);
                    twilioClient = (0, twilio_1.default)(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
                    _b = (_a = chrome_aws_lambda_1.default.puppeteer).launch;
                    _g = {
                        args: __spreadArray(__spreadArray([], __read(chrome_aws_lambda_1.default.args), false), ["--hide-scrollbars", "--disable-web-security"], false),
                        defaultViewport: chrome_aws_lambda_1.default.defaultViewport
                    };
                    return [4 /*yield*/, chrome_aws_lambda_1.default.executablePath];
                case 1: return [4 /*yield*/, _b.apply(_a, [(_g.executablePath = _j.sent(),
                            _g.headless = true,
                            _g.ignoreHTTPSErrors = true,
                            _g)])];
                case 2:
                    browser = _j.sent();
                    return [4 /*yield*/, browser.newPage()];
                case 3:
                    page = _j.sent();
                    _j.label = 4;
                case 4:
                    _j.trys.push([4, 14, 15, 16]);
                    _c = __values(Object.entries(complexConfig)), _d = _c.next();
                    _j.label = 5;
                case 5:
                    if (!!_d.done) return [3 /*break*/, 13];
                    _e = __read(_d.value, 2), key = _e[0], complex = _e[1];
                    return [4 /*yield*/, page.goto(complex.page)];
                case 6:
                    _j.sent();
                    return [4 /*yield*/, complex.init(page)];
                case 7:
                    _j.sent();
                    return [4 /*yield*/, complex.getAvailability(page)];
                case 8:
                    currentPlans = _j.sent();
                    return [4 /*yield*/, getRemoteFloorPlans({ name: complex.name, id: key }, db)];
                case 9:
                    _f = _j.sent(), floorPlans = _f.floorPlans, floorPlansCol = _f.floorPlansCol;
                    notifyNeeded = checkFloorPlanDifferences(currentPlans, floorPlans);
                    return [4 /*yield*/, updateRemoteFloorPlans(currentPlans, floorPlansCol)];
                case 10:
                    _j.sent();
                    if (!!notifyNeeded) return [3 /*break*/, 12];
                    message = formatPlansMessage(complex.name, currentPlans);
                    return [4 /*yield*/, sendMessage(message, twilioClient)];
                case 11:
                    _j.sent();
                    _j.label = 12;
                case 12:
                    _d = _c.next();
                    return [3 /*break*/, 5];
                case 13: return [3 /*break*/, 16];
                case 14:
                    e_6_1 = _j.sent();
                    e_6 = { error: e_6_1 };
                    return [3 /*break*/, 16];
                case 15:
                    try {
                        if (_d && !_d.done && (_h = _c.return)) _h.call(_c);
                    }
                    finally { if (e_6) throw e_6.error; }
                    return [7 /*endfinally*/];
                case 16:
                    browser.close();
                    return [2 /*return*/];
            }
        });
    });
}
if (require.main === module) {
    main();
}
function handler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var e_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, main()];
                case 1:
                    _a.sent();
                    res.status(204).end();
                    return [3 /*break*/, 3];
                case 2:
                    e_7 = _a.sent();
                    res.status(500).send({ error: e_7 });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.default = handler;
