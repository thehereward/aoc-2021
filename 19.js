const { matrix, multiply, max } = require("mathjs");

function parseData(data) {
  var scanners = [];
  data.forEach((line) => {
    if (line.startsWith("---")) {
      scanners.push([]);
    } else if (line.trim() != "") {
      scanners[scanners.length - 1].push(split(line));
    }
  });
  return scanners;
}

function split(line) {
  return line.split(",").map((char) => parseInt(char));
}

function subtract(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function add(a, b) {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function areEquivalent(a, b) {
  return Math.abs(a) == Math.abs(b);
}

function areIdentical(a, b) {
  return a == b;
}

function identical(a, b) {
  var xMatch = areIdentical(a[0], b[0]);
  var yMatch = areIdentical(a[1], b[1]);
  var zMatch = areIdentical(a[2], b[2]);
  return xMatch && yMatch && zMatch;
}

function getVectorMagnitude(a) {
  return a[0] ** 2 + a[1] ** 2 + a[2] ** 2;
}

function equalVectorMagnitude(a, b) {
  return getVectorMagnitude(a) == getVectorMagnitude(b);
}

function equalMagnitude(a, b) {
  var xMatch = areEquivalent(a[0], b[0]);
  var yMatch = areEquivalent(a[1], b[1]);
  var zMatch = areEquivalent(a[2], b[2]);
  return xMatch && yMatch && zMatch;
}

function rotateX(a) {
  const rotate90 = matrix([
    [1, 0, 0],
    [0, 0, -1],
    [0, 1, 0],
  ]);
  var result = multiply(a, rotate90);
  return result.toArray();
}

function rotateY(a) {
  const rotate90 = matrix([
    [0, 0, 1],
    [0, 1, 0],
    [-1, 0, 0],
  ]);
  var result = multiply(a, rotate90);
  return result.toArray();
}

function rotateZ(a) {
  const rotate90 = matrix([
    [0, -1, 0],
    [1, 0, 0],
    [0, 0, 1],
  ]);
  var result = multiply(a, rotate90);
  return result.toArray();
}

function equivalent(a, b) {
  if (equalMagnitude(a, b)) {
    return true;
  }

  var bX = rotateX(b);
  if (equalMagnitude(a, bX)) {
    return true;
  }

  var bY = rotateY(b);
  if (equalMagnitude(a, bY)) {
    return true;
  }

  var bXY = rotateY(bX);
  if (equalMagnitude(a, bXY)) {
    return true;
  }

  var bZ = rotateZ(b);
  if (equalMagnitude(a, bZ)) {
    return true;
  }

  var bXZ = rotateX(bZ);
  if (equalMagnitude(a, bXZ)) {
    return true;
  }

  var bYZ = rotateY(bZ);
  if (equalMagnitude(a, bYZ)) {
    return true;
  }
  return false;
}

function getVectorsForBeacon(a, beacon) {
  return a.map((otherBeacon) => {
    return subtract(beacon, otherBeacon);
  });
}

function getVectorsBetweenBeacons(a) {
  var vectorDiffs = a.map((beacon) => {
    return getVectorsForBeacon(a, beacon);
  });
  return vectorDiffs;
}

function countMatchingMagnitudes(a, b) {
  var count = 0;
  a.forEach((diffA) => {
    b.forEach((diffB) => {
      if (equalVectorMagnitude(diffA, diffB)) {
        count = count + 1;
      }
    });
  });
  return count;
}

function solvePart1(data) {
  console.log("Solving Part 1");
  data = parseData(data);
  var scanner0 = data[0];
  var scanner1 = data[1];
  var scanner0Diffs = getVectorsBetweenBeacons(scanner0);
  var scanner1Diffs = getVectorsBetweenBeacons(scanner1);

  var counts = scanner0Diffs.map((vectorsFromBeacon0) => {
    var count = scanner1Diffs.map((beacon) => {
      return countMatchingMagnitudes(vectorsFromBeacon0, beacon);
    });
    const maxCount = Math.max(...count);
    if (maxCount > 10) {
      count = count.indexOf(maxCount);
    } else {
      count = undefined;
    }
    return count;
  });

  var matchingBeacons = [];
  counts.forEach((value, index) => {
    if (value != undefined) {
      matchingBeacons.push([scanner0[index], scanner1[value]]);
    }
  });

  var matches = matchingBeacons.map((match) => {
    return subtract(match[1], match[0]);
  });

  var max = Math.max(...matches);
  var min = Math.min(...matches);
  if (max != min) {
  }

  console.log(matches);
}

function findTransformation(matches) {}

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
  split,
  parseData,
  subtract,
  equivalent,
  identical,
  equalMagnitude,
  getVectorMagnitude,
};
