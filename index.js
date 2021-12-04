const fs = require("fs");
const { EOL } = require("os");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

const solve01 = require("./01");
const solve02 = require("./02");
const solve03 = require("./03");
const solve04 = require("./04");

yargs(hideBin(process.argv))
  .command(
    "run [day]",
    "run process for day",
    (yargs) => {
      return yargs.positional("day", {
        describe: "day to run",
      });
    },
    (argv) => {
      const puzzleNumber = argv.day;
      if (argv.verbose) console.info(`Running Day: ${puzzleNumber}`);
      const runSecondPart = argv.secondPart;
      if (argv.verbose) console.info(`Running Part: ${runSecondPart ? 2 : 1}`);
      const useTestData = argv.useTestData;
      const fileName = `./inputs/${puzzleNumber}${useTestData ? "_test" : ""}`;
      let data = "";
      try {
        data = fs.readFileSync(fileName, "utf8");
        data = data.split(EOL);
      } catch (err) {
        console.error(err);
      }
      runDay(puzzleNumber, data, runSecondPart);
    }
  )
  .option("verbose", {
    alias: "v",
    type: "boolean",
    description: "Run with verbose logging",
  })
  .option("use-test-data", {
    alias: "t",
    type: "boolean",
    description: "Run with test file",
  })
  .option("second-part", {
    alias: "s",
    type: "boolean",
    description: "Run second part",
    default: false,
  })
  .parse();

// console.log(argv);

// let puzzleNumber = process.argv[2];

// console.log("Advent of Code 2021");
// console.log(`Puzzle Number: ${puzzleNumber}`);

// let data = "";
// try {
//   data = fs.readFileSync(`./inputs/${puzzleNumber}`, "utf8");
//   data = data.split(EOL);
// } catch (err) {
//   console.error(err);
// }

// console.log("Data loaded");

function runDay(p, data, runSecondPart) {
  switch (p) {
    case "01":
      solve01(data, runSecondPart);
    case "02":
      solve02(data, runSecondPart);
    case "03":
      solve03(data, runSecondPart);
    case "04":
      solve04(data, runSecondPart);
  }
}
