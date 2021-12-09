function parseData(data) {
  data = data.map((d) => d.split("").map((char) => parseInt(char)));
  return data;
}

function solvePart1(data) {
  console.log("Solving Part 1");
  var data = parseData(data);
  const width = data[0].length;
  const height = data.length;
  data = data.map((d) => [10].concat(d).concat(10));
  const filler = new Array(width + 2).fill(10);
  data = [filler].concat(data).concat([filler]);

  // console.log({ data });
  const lowPoints = [];
  for (i = 1; i <= width; i = i + 1) {
    for (j = 1; j <= height; j = j + 1) {
      // console.log({ i, j });
      // console.log(data[j]);
      const value = data[j][i];
      const above = data[j - 1][i];
      const below = data[j + 1][i];
      const left = data[j][i - 1];
      const right = data[j][i + 1];
      // console.log({ value });
      if (value < above && value < below && value < left && value < right) {
        lowPoints.push(value);
      }
    }
  }
  console.log({ lowPoints });
  const answer = lowPoints.reduce((a, c) => a + c + 1, 0);
  console.log({ answer });
  return;
}

function getLowPoints(data) {
  const width = data[0].length;
  const height = data.length;
  data = data.map((d) => [10].concat(d).concat(10));
  const filler = new Array(width + 2).fill(10);
  data = [filler].concat(data).concat([filler]);
  // console.log({ data });
  const lowPoints = [];
  for (i = 1; i <= width; i = i + 1) {
    for (j = 1; j <= height; j = j + 1) {
      // console.log({ i, j });
      // console.log(data[j]);
      const value = data[j][i];
      const above = data[j - 1][i];
      const below = data[j + 1][i];
      const left = data[j][i - 1];
      const right = data[j][i + 1];
      // console.log({ value });
      if (value < above && value < below && value < left && value < right) {
        lowPoints.push({
          x: i,
          y: j,
          value,
        });
      }
    }
  }
  return lowPoints;
}

function padData(data) {
  const width = data[0].length;
  const height = data.length;
  data = data.map((d) => [9].concat(d).concat(9));
  const filler = new Array(width + 2).fill(9);
  data = [filler].concat(data).concat([filler]);
  return data;
}

function markBasins(data, lowPoints) {
  var basinCount = 1;

  lowPoints.forEach((lowPoint) => {
    var currentBasin = basinCount.toString();
    var j = lowPoint.y;
    var i = lowPoint.x;
    expandPoint(data, j, i, currentBasin);
    basinCount = basinCount + 1;
  });

  return data;
}

function isExpandable(value) {
  if (typeof value != "string" && value >= 9) {
    return false;
  }

  if (typeof value == "string") {
    return false;
  }

  return true;
}

function expandPoint(data, j, i, value) {
  data[j][i] = value;

  // prettyPrint(data, j, i);
  const north = data[j - 1][i];
  if (isExpandable(north)) {
    data = expandPoint(data, j - 1, i, value);
  }

  const east = data[j][i + 1];
  if (isExpandable(east)) {
    data = expandPoint(data, j, i + 1, value);
  }

  const south = data[j + 1][i];
  // console.log(`(${j},${i}) South: ${south}`);
  if (isExpandable(south)) {
    data = expandPoint(data, j + 1, i, value);
  }

  const west = data[j][i - 1];
  if (isExpandable(west)) {
    data = expandPoint(data, j, i - 1, value);
  }

  return data;
}

function dataCheck(data) {
  console.log("Running Contiguous Sets Check");
  var thereWereContiguousSets = false;
  const width = data[0].length;
  const height = data.length;
  for (var j = 1; j < height - 1; j = j + 1) {
    for (var i = 1; i < width - 1; i = i + 1) {
      const value = data[j][i];
      if (typeof value != "string" && value < 9) {
        console.log(`We have a problem: ${value}  at ${i} ${j}`);
      }
      if (typeof value != "string" && value >= 9) {
        continue;
      }

      const above = data[j - 1][i];
      const below = data[j + 1][i];
      const left = data[j][i - 1];
      const right = data[j][i + 1];
      const points = [value, above, below, left, right];

      const basin = points.filter((a) => typeof a == "string");

      const basinSet = new Set(basin);
      if (basinSet.size > 1) {
        const contiguous = [];
        basinSet.forEach((b) => contiguous.push(b));
        console.log(`There are contiguous basins: ${contiguous.join(",")}`);
        thereWereContiguousSets = true;
        const mainSet = contiguous.shift();
        // console.log(`Main Basin: ${mainSet}`);
        // console.log({ contiguous });

        // const before = countBasins(data);
        prettyPrint(data, j, i);
        console.log("****");
        for (var y = 1; y < height - 1; y = y + 1) {
          for (var x = 1; x < width - 1; x = x + 1) {
            const value = data[y][x];
            if (contiguous.includes(value)) {
              data[y][x] = mainSet;
            }
          }
        }
        // const after = countBasins(data);
        prettyPrint(data, j, i);
        // console.log(`Before: ${before} and After: ${after}`);
        // process.exit();
      }
    }
  }
  if (thereWereContiguousSets) {
    return dataCheck(data);
  } else {
    return data;
  }
}

function prettyPrint(data, j, i) {
  const lines = [];
  var count = 0;
  for (var y = j - 1; y <= j + 1; y = y + 1) {
    for (var x = i - 1; x <= i + 1; x = x + 1) {
      if (!lines[count]) {
        lines[count] = [];
      }
      lines[count].push(data[y][x]);
    }
    count = count + 1;
  }

  lines.forEach((line) => {
    console.log(line.join(" "));
  });
  console.log("");
  console.log("# # #");
  console.log("");
}

function solvePart2(data) {
  console.log("Solving Part 2");
  var data = parseData(data);
  const lowPoints = getLowPoints(data);
  data = padData(data);
  var data = markBasins(data, lowPoints);

  dataCheck(data);
  var counts = {};
  data.forEach((col) => {
    col.forEach((char) => {
      if (typeof char == "string") {
        counts[char] = !counts[char]
          ? { basin: char, value: 1 }
          : { basin: char, value: counts[char].value + 1 };
      }
    });
  });

  const results = [];
  Object.keys(counts).forEach((key) => {
    return results.push(counts[key]);
  });

  console.log(`There were ${lowPoints.length} low points`);
  console.log(`There were ${results.length} results`);
  results.sort((a, b) => b.value - a.value);
  const answer = results[0].value * results[1].value * results[2].value;
  console.log({ answer });
  return;
}

function solve(data, partTwo) {
  if (!partTwo) {
    return solvePart1(data);
  } else {
    return solvePart2(data);
    //   63756 is too low
    //   71484 is too low
    //  120408 is too low
    //   65688 is too low
    // 1075536 is correct
  }
}

module.exports = solve;
