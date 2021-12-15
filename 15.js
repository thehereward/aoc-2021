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
  if (existingRisk == undefined) {
    riskMap[j][i] = newRisk;
    somethingChanged = true;
  } else if (newRisk < existingRisk) {
    riskMap[j][i] = newRisk;
    somethingChanged = true;
  }
  return somethingChanged;
}

function expandData(data) {
  var height = data.length * 5;
  var width = data[0].length * 5;
  var newData = initialise2DArray(width, height);

  for (var j = 0; j < data.length; j = j + 1) {
    for (var i = 0; i < data[0].length; i = i + 1) {
      for (var jx = 0; jx < 5; jx = jx + 1) {
        for (var ix = 0; ix < 5; ix = ix + 1) {
          var existingValue = data[j][i] + ix + jx;
          existingValue = existingValue > 9 ? existingValue - 9 : existingValue;
          newData[j + jx * data.length][i + ix * data[0].length] =
            existingValue;
        }
      }
    }
  }
  return newData;
}

function updateRisk(riskMap, data, height, width) {
  var somethingChanged = false;
  for (var j = 0; j < height; j = j + 1) {
    for (var i = 0; i < width; i = i + 1) {
      const risk = riskMap[j][i];
      if (i > 0) {
        somethingChanged =
          setRisk(riskMap, data, risk, j, i - 1) || somethingChanged;
      }
      if (i < width - 1) {
        somethingChanged =
          setRisk(riskMap, data, risk, j, i + 1) || somethingChanged;
      }
      if (j > 0) {
        somethingChanged =
          setRisk(riskMap, data, risk, j - 1, i) || somethingChanged;
      }
      if (j < height - 1) {
        somethingChanged =
          setRisk(riskMap, data, risk, j + 1, i) || somethingChanged;
      }
    }
  }
  if (somethingChanged) {
    return updateRisk(riskMap, data, height, width);
  } else {
    return riskMap;
  }
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
