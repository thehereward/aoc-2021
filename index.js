const fs = require("fs");
const { EOL } = require("os");

const solve01 = require("./01");
const solve02 = require("./02");
const solve03 = require("./03");

let puzzleNumber = process.argv[2];

console.log("Advent of Code 2021");
console.log(`Puzzle Number: ${puzzleNumber}`);

let data = "";
try {
  data = fs.readFileSync(`./inputs/${puzzleNumber}`, "utf8");
  data = data.split(EOL);
} catch (err) {
  console.error(err);
}

console.log("Data loaded");

switch (puzzleNumber) {
  case "01":
    solve01(data);
  case "02":
    solve02(data);
  case "03":
    solve03(data);
}
