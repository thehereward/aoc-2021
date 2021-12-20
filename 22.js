function parseData(data) {
  return data;
}

function solvePart1(data) {
  console.log("Solving Part 1");
  data = parseData(data);
  console.log({ data });
}

function solvePart2(data) {
  console.log("Solving Part 2");
  data = parseData(data);
  console.log({ data });
}

function solve(data, partTwo) {
  if (!partTwo) {
    return solvePart1(data);
  } else {
    return solvePart2(data);
  }
}

module.exports = {
  solve,
};
