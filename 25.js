function parseData(data) {
  data = data.map((line) => line.split("")).filter((l) => l.length > 0);
  return data;
}

function printGrid(data) {
  data.forEach((line) => {
    console.log(line.join(""));
  });
}

function initialise2DArray(width, height, contents) {
  var newArray = new Array(height);
  for (var i = 0; i < height; i = i + 1) {
    newArray[i] = new Array(width).fill(contents);
  }
  return newArray;
}

function moveEastFacing(data) {
  var width = data[0].length;
  var height = data.length;
  var newData = initialise2DArray(width, height, ".");
  for (var j = 0; j < height; ++j) {
    for (var i = 0; i < width; ++i) {
      if (data[j][i] == ">") {
        var nextI = i + 1 == width ? 0 : i + 1;
        var shouldMove = data[j][nextI] == ".";
        if (shouldMove) {
          newData[j][nextI] = ">";
          thereWasAMove = true;
        } else {
          newData[j][i] = ">";
        }
      } else if (data[j][i] == "v") {
        newData[j][i] = "v";
      }
    }
  }
  return newData;
}

function moveSouthFacing(data) {
  var width = data[0].length;
  var height = data.length;
  var newData = initialise2DArray(width, height, ".");
  for (var i = 0; i < width; ++i) {
    for (var j = 0; j < height; ++j) {
      if (data[j][i] == "v") {
        var nextJ = j + 1 == height ? 0 : j + 1;
        var shouldMove = data[nextJ][i] == ".";
        if (shouldMove) {
          newData[nextJ][i] = "v";
          thereWasAMove = true;
        } else {
          newData[j][i] = "v";
        }
      } else if (data[j][i] == ">") {
        newData[j][i] = ">";
      }
    }
  }
  return newData;
}

var thereWasAMove = false;

function oneStep(data) {
  data = moveEastFacing(data);
  data = moveSouthFacing(data);
  return data;
}

function solveVersion1(data) {
  data = parseData(data);

  var count = 0;

  do {
    thereWasAMove = false;
    data = oneStep(data);
    ++count;
  } while (thereWasAMove);
  printGrid(data);

  console.log({ count });
}

function solvePart1(data) {
  solveVersion1(data);
}

function solvePart2(data) {
  console.log("Solving Part 2");
  data = parseData(data);
  console.log({ data });
}

function solve(data, partTwo) {
  if (!partTwo) {
    return solvePart1(data);
    // 2116 was wrong
  } else {
    return solvePart2(data);
  }
}

module.exports = {
  solve,
  parseData,
  oneStep,
};
