function parseData(data) {
  var newData = data[0].split(",");
  newData = newData.map((d) => parseInt(d));
  return newData.sort((a, b) => a - b);
}

function findFuelUse(data, x) {
  const fuelUse = data.reduce((a, c) => {
    return a + Math.abs(c - x);
  }, 0);
  return fuelUse;
}

function getFuelForSteps(value) {
  var abs = Math.abs(value);
  return (abs / 2) * (abs + 1) * (abs / value) || 0;
}

function findFuelUseSecondPart(data, x) {
  const fuelUse = data.reduce((a, c) => {
    var steps = Math.abs(c - x);
    return a + getFuelForSteps(steps);
  }, 0);
  return fuelUse;
}

function solvePart1(data) {
  console.log("Solving Part 1");
  var data = parseData(data);
  const min = data[0];
  const max = data[data.length - 1];
  var lowestFuelUse = undefined;
  for (var i = min; i <= max; i = i + 1) {
    const fuelUse = findFuelUse(data, i);
    if (!lowestFuelUse || fuelUse < lowestFuelUse) {
      lowestFuelUse = fuelUse;
    } else {
      console.log(`Lowest Fuel Use: ${lowestFuelUse} at number ${i - 1}`);
      return;
    }
  }
}

function solvePart2(data) {
  console.log("Solving Part 2");
  var data = parseData(data);
  const min = data[0];
  const max = data[data.length - 1];
  var lowestFuelUse = undefined;
  for (var i = min; i <= max; i = i + 1) {
    const fuelUse = findFuelUseSecondPart(data, i);
    if (!lowestFuelUse || fuelUse < lowestFuelUse) {
      lowestFuelUse = fuelUse;
    } else {
      console.log(`Lowest Fuel Use: ${lowestFuelUse} at number ${i - 1}`);
      return;
    }
  }
}

function solve(data, partTwo) {
  if (!partTwo) {
    return solvePart1(data);
  } else {
    return solvePart2(data);
  }
}

module.exports = solve;
