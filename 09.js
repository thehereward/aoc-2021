function parseData(data) {
  data = data.map((d) => d.split("").map((char) => parseInt(char)));
  return data;
  data = data.map((d) => {
    return {
      signalPatterns: d[0]
        .trim()
        .split(" ")
        .map((a) => a.trim()),
      outputValues: d[1]
        .trim()
        .split(" ")
        .map((a) => a.trim()),
    };
  });
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

function findBasin(data, lowPoint) {
  const { x, y } = lowPoint;
  console.log({ x, y });

  console.log({ data });
}

// function markBasins(data) {
//   var basinCounter = 0;
//   for (var i = 0; i < data[0].length; i = i + 1) {
//   for (var j = 0; j < data.length; j = j + 1) {
//     const value = data[j][i]
//       if ()
//     }
//   }
// }

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
    // console.log({ lowPoint });
    var currentBasin = basinCount.toString();
    data[lowPoint.y][lowPoint.x] = currentBasin;
    var j = lowPoint.y;
    var i = lowPoint.x;
    data[j - 1][i] = data[j - 1][i] >= 9 ? 9 : currentBasin;
    data[j + 1][i] = data[j + 1][i] >= 9 ? 9 : currentBasin;
    data[j][i - 1] = data[j][i - 1] >= 9 ? 9 : currentBasin;
    data[j][i + 1] = data[j][i + 1] >= 9 ? 9 : currentBasin;
    basinCount = basinCount + 1;
  });

  return data;
}

function expandPoint(data, j, i, value) {}

function expandBasins(data) {
  // console.log("Expanding...");
  var madeAChange = true;
  const width = data[0].length;
  const height = data.length;

  // console.log({ data });
  while (madeAChange) {
    madeAChange = false;
    for (var j = 1; j < height - 1; j = j + 1) {
      for (var i = 1; i < width - 1; i = i + 1) {
        const value = data[j][i];
        if (typeof value != "string" && value >= 9) {
          continue;
        }

        const above = data[j - 1][i];
        const below = data[j + 1][i];
        const left = data[j][i - 1];
        const right = data[j][i + 1];
        const points = [above, below, left, right];
        // prettyPrint(data, j, i);
        if (points.some((v) => typeof v != "string" && v < 9)) {
          data[j - 1][i] = data[j - 1][i] >= 9 ? 9 : value;
          data[j + 1][i] = data[j + 1][i] >= 9 ? 9 : value;
          data[j][i - 1] = data[j][i - 1] >= 9 ? 9 : value;
          data[j][i + 1] = data[j][i + 1] >= 9 ? 9 : value;
          madeAChange = true;
        }
        // prettyPrint(data, j, i);

        // const basin = points.filter((a) => typeof a == "string");
        // if (basin.length > 0) {
        //   currentBasin = basin[0];
        //   data[j][i] = currentBasin;
        // } else {
        //   currentBasin = `${basinCount}`;
        //   data[j][i] = currentBasin;
        //   basinCount = basinCount + 1;
        // }
      }
    }
  }
  return data;
  // if (madeAChange) {
  //   return expandBasins(data);
  // } else {
  //   return data;
  // }
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

function countBasins(data) {
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
  return results.length;
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
  data = expandBasins(data);
  // console.log(data);
  process.exit();

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
  // findBasin(data, lowPoints[0]);

  // console.log({ lowPoints });
  // const answer = lowPoints.reduce((a, c) => a + c.value + 1, 0);
  // console.log({ answer });
  return;
}

function solve(data, partTwo) {
  if (!partTwo) {
    return solvePart1(data);
  } else {
    return solvePart2(data);
    //  63756 is too low
    //  71484 is too low
    // 120408 is too low
    //  65688 is too low
  }
}

module.exports = solve;
