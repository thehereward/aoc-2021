const fs = require("fs");
const { EOL } = require("os");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

const solve = require("./solve");

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
      const timeRun = argv.timeRun;
      const fileName = `./inputs/${puzzleNumber}${useTestData ? "_test" : ""}`;
      let data = "";
      try {
        data = fs.readFileSync(fileName, "utf8");
        data = data.split(EOL);
      } catch (err) {
        console.error(err);
      }
      solve(puzzleNumber.toString(), data, runSecondPart, timeRun);
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
  .option("time-run", {
    type: "boolean",
    default: false,
  })
  .parse();
