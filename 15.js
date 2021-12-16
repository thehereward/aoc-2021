function parseData(data) {
  return data.map((d) => d.split("").map((char) => parseInt(char)));
}

function initialise2DArray(width, height, contents) {
  var newArray = new Array(height);
  for (var i = 0; i < width; i = i + 1) {
    newArray[i] = new Array(width).fill(contents);
  }
  return newArray;
}

function setRisk(riskMap, data, risk, j, i) {
  var somethingChanged = false;
  const existingRisk = riskMap[j][i];
  const newRisk = risk + data[j][i];
  if (existingRisk == undefined || newRisk < existingRisk) {
    riskMap[j][i] = newRisk;
    somethingChanged = true;
  }
  return somethingChanged;
}

function expandData(data) {
  var height = data.length;
  var width = data[0].length;
  var newData = initialise2DArray(width * 5, height * 5);

  for (var j = 0; j < height; j = j + 1) {
    for (var i = 0; i < width; i = i + 1) {
      for (var jx = 0; jx < 5; jx = jx + 1) {
        for (var ix = 0; ix < 5; ix = ix + 1) {
          var existingValue = data[j][i] + ix + jx;
          existingValue = existingValue > 9 ? existingValue - 9 : existingValue;
          newData[j + jx * height][i + ix * width] = existingValue;
        }
      }
    }
  }
  return newData;
}

function updateRisk(riskMap, data, height, width) {
  var thereWasChange = false;
  for (var j = 0; j < height; j = j + 1) {
    for (var i = 0; i < width; i = i + 1) {
      thereWasChange = updateRiskForNeighbouringCells(
        riskMap,
        j,
        i,
        data,
        width,
        height
      );
    }
  }
  if (thereWasChange) {
    return updateRisk(riskMap, data, height, width);
  } else {
    return riskMap;
  }
}

function updateRiskForNeighbouringCells(riskMap, j, i, data, width, height) {
  var thereWasChange = false;
  const risk = riskMap[j][i];
  if (i > 0) {
    thereWasChange = setRisk(riskMap, data, risk, j, i - 1) || thereWasChange;
  }
  if (i < width - 1) {
    thereWasChange = setRisk(riskMap, data, risk, j, i + 1) || thereWasChange;
  }
  if (j > 0) {
    thereWasChange = setRisk(riskMap, data, risk, j - 1, i) || thereWasChange;
  }
  if (j < height - 1) {
    thereWasChange = setRisk(riskMap, data, risk, j + 1, i) || thereWasChange;
  }
  return thereWasChange;
}

function findSmallestPath(data) {
  var height = data.length;
  var width = data[0].length;

  var riskMap = initialise2DArray(width, height);

  riskMap[0][0] = 0;
  riskMap = updateRisk(riskMap, data, height, width);

  const finalRisk = riskMap[height - 1][width - 1];
  return finalRisk;
}

function solvePart1(data) {
  console.log("Solving Part 1");
  data = parseData(data);

  const finalRisk = findSmallestPath(data);

  console.log({ finalRisk });
}

function solvePart2(data) {
  console.log("Solving Part 2");
  data = parseData(data);
  data = expandData(data);

  const finalRisk = findSmallestPath(data);

  console.log({ finalRisk });
}

function solve(data, partTwo) {
  if (!partTwo) {
    return solvePart1(data);
  } else {
    return solvePart2(data);
  }
}

module.exports = solve;
