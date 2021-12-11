var totalFlashCount = 0;
var stepFlashCount = 0;

function parseData(data) {
  data = data.map((d) => d.split("").map((char) => parseInt(char)));

  const width = data[0].length;
  const height = data.length;
  data = data.map((d) => ["E"].concat(d).concat("E"));
  const filler = new Array(width + 2).fill("E");
  data = [filler].concat(data).concat([filler]);

  return data;
}

function increaseEnergyCell(data, i, j) {
  const value = data[j][i];
  if (typeof value != "string") {
    data[j][i] = value + 1;
  }
  return data;
}

function increaseEnergy(data) {
  const width = data[0].length;
  const height = data.length;
  for (i = 1; i <= width - 2; i = i + 1) {
    for (j = 1; j <= height - 2; j = j + 1) {
      const value = data[j][i];
      if (typeof value != "string") {
        data[j][i] = value + 1;
      }
    }
  }
  return data;
}

function flashCells(data) {
  var thereWasAFlash = false;
  const width = data[0].length;
  const height = data.length;
  for (i = 1; i <= width - 2; i = i + 1) {
    for (j = 1; j <= height - 2; j = j + 1) {
      const value = data[j][i];

      if (value > 9) {
        totalFlashCount = totalFlashCount + 1;
        stepFlashCount = stepFlashCount + 1;
        thereWasAFlash = true;
        data[j][i] = "F";
        increaseEnergyCell(data, i - 1, j - 1);
        increaseEnergyCell(data, i - 1, j);
        increaseEnergyCell(data, i - 1, j + 1);
        increaseEnergyCell(data, i, j - 1);
        increaseEnergyCell(data, i, j + 1);
        increaseEnergyCell(data, i + 1, j - 1);
        increaseEnergyCell(data, i + 1, j);
        increaseEnergyCell(data, i + 1, j + 1);
      }
    }
  }
  if (thereWasAFlash) {
    return flashCells(data);
  } else {
    return data;
  }
}

function resetCells(data) {
  const width = data[0].length;
  const height = data.length;
  for (i = 1; i <= width - 2; i = i + 1) {
    for (j = 1; j <= height - 2; j = j + 1) {
      const value = data[j][i];
      if (value == "F") {
        data[j][i] = 0;
      }
    }
  }
  return data;
}

function solvePart1(data) {
  console.log("Solving Part 1");
  var data = parseData(data);

  for (var count = 0; count < 100; count = count + 1) {
    data = increaseEnergy(data);
    data = flashCells(data);
    data = resetCells(data);
  }

  console.log({ flashCount: totalFlashCount });
}

function solvePart2(data) {
  console.log("Solving Part 2");
  var data = parseData(data);

  for (var count = 1; count <= 1000; count = count + 1) {
    stepFlashCount = 0;
    data = increaseEnergy(data);
    data = flashCells(data);
    data = resetCells(data);
    if (stepFlashCount == 100) {
      break;
    }
  }
  console.log({ count });
}

function solve(data, partTwo) {
  if (!partTwo) {
    return solvePart1(data);
  } else {
    return solvePart2(data);
  }
}

module.exports = solve;
