const { options } = require("yargs");

function parseData(data) {
  data = data.map((d) => d.split("-"));
  return data;
}

function solvePart1(data) {
  console.log("Solving Part 1");
  var data = parseData(data);
  console.log(data);
}

function solvePart2(data) {
  console.log("Solving Part 2");
  var data = parseData(data);
  console.log(data);
}

function solve(data, partTwo) {
  if (!partTwo) {
    return solvePart1(data);
  } else {
    return solvePart2(data);
  }
}

module.exports = solve;
