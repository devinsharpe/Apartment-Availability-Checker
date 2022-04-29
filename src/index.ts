async function main() {
  console.log("hello world");
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((err) => {
      console.log(err);
      process.exit(0);
    });
}
