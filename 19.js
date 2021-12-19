const {
  matrix,
  multiply,
  inv,
  transpose,
  column,
  identity,
} = require("mathjs");

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

function getTransformation(matchingBeacons0, matchingBeacons1) {
  const b00 = matchingBeacons0[0];
  const b01 = matchingBeacons0[1];
  const b02 = matchingBeacons0[2];

  const targetMatrix = transpose(matrix([b00, b01, b02]));

  const b10 = matchingBeacons1[0];
  const b11 = matchingBeacons1[1];
  const b12 = matchingBeacons1[2];

  const sourceMatrix = transpose(matrix([b10, b11, b12]));

  var inverse = inv(sourceMatrix);
  var transform = multiply(targetMatrix, inverse);

  return transform;
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
    if (maxCount >= 12) {
      count = count.indexOf(maxCount);
    } else {
      count = undefined;
    }
    return count;
  });

  var matchingBeacons0 = [];
  var matchingBeacons1 = [];
  counts.forEach((value, index) => {
    if (value != undefined) {
      matchingBeacons0.push(scanner0[index]);
      matchingBeacons1.push(scanner1[value]);
    }
  });

  console.log({ matchingBeacons0 });
  console.log({ matchingBeacons1 });

  const diff0_01 = subtract(matchingBeacons0[1], matchingBeacons0[0]);
  const diff1_01 = subtract(matchingBeacons1[1], matchingBeacons1[0]);
  console.log({ diff0_01, diff1_01 });

  function getMapping(aa, bb) {
    var absbb = bb.map((char) => Math.abs(char));
    var index = absbb.indexOf(Math.abs(aa));
    var isInverse = bb[index] == aa * -1;
    console.log({ index, isInverse });

    return function (cc) {
      if (isInverse) {
        return -cc[index];
      }
      return cc[index];
    };
  }

  var xMap = getMapping(diff0_01[0], diff1_01);
  var yMap = getMapping(diff0_01[1], diff1_01);
  var zMap = getMapping(diff0_01[2], diff1_01);

  var newX = xMap(diff1_01);
  var newY = yMap(diff1_01);
  var newZ = zMap(diff1_01);
  console.log({ newX, newY, newZ });
  // const diff0_02 = subtract(matchingBeacons0[2], matchingBeacons0[0]);
  // const diff1_02 = subtract(matchingBeacons1[2], matchingBeacons1[0]);
  // console.log({ diff0_02, diff1_02 });
  return;
  // var transform = getTransformation(matchingBeacons0, matchingBeacons1);
  var transform = rotateY(rotateY(identity(3)));
  console.log(transform);
  transform = matrix(transform);

  var transformed = matchingBeacons1.map((b) => {
    return multiply(transform, b)
      .toArray()
      .map((c) => Math.round(c));
  });

  console.log({ transform: transform.toArray() });
  console.log({ matchingBeacons0 });
  console.log({ transformed });

  return;
  var isMatch = isSameCoordinateSystem(matchingBeacons0, matchingBeacons1);

  if (!isMatch) {
    matchingBeacons1 = matchingBeacons1.map((beacon) => {
      return rotateY(rotateY(beacon));
    });
  }

  isMatch = isSameCoordinateSystem(matchingBeacons0, matchingBeacons1);

  console.log({ isMatch });
}

function isSameCoordinateSystem(matchingBeacons0, matchingBeacons1) {
  var matches = matchingBeacons0.map((match, index) => {
    return subtract(matchingBeacons1[index], match);
  });

  var match0 = matches.shift();
  var isMatch = true;
  matches.forEach((match) => {
    isMatch = isMatch && identical(match, match0);
  });
  return isMatch;
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
