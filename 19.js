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
  scanners = scanners.map((d, index) => {
    return { scanner: index, beacons: d };
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

function getMapping(targetComponent, sourceVector) {
  var absoluteValues = sourceVector.map((char) => Math.abs(char));
  // console.log({ absoluteValues });
  var index = absoluteValues.indexOf(Math.abs(targetComponent));
  var isInverse = sourceVector[index] == targetComponent * -1;

  // console.log({ index, isInverse });
  return function (vectorToMap) {
    if (isInverse) {
      return -vectorToMap[index];
    }
    return vectorToMap[index];
  };
}

function getMappingFunction(targetVector, sourceVector) {
  var xMap = getMapping(targetVector[0], sourceVector);
  var yMap = getMapping(targetVector[1], sourceVector);
  var zMap = getMapping(targetVector[2], sourceVector);

  return function (vectorToMap) {
    return [xMap(vectorToMap), yMap(vectorToMap), zMap(vectorToMap)];
  };
}

function getMatchedBeacons(setOne, setTwo) {
  var mapOfMatchingBeacons = getMapOfMatchingBeacons(setOne, setTwo);
  var { matchingBeaconsBaseSet, matchingBeaconsNewSet } = getBeacons(
    mapOfMatchingBeacons,
    setOne,
    setTwo
  );
  return {
    matchingBeaconsBaseSet,
    matchingBeaconsNewSet,
    thereAreMatches: matchingBeaconsBaseSet.length > 0,
  };
}

function fooBar(baseBeaconSet, input) {
  console.log(`Scanner: ${input.scanner}`);
  const newBeacons = input.beacons;

  var { matchingBeaconsBaseSet, matchingBeaconsNewSet } = getMatchedBeacons(
    baseBeaconSet,
    newBeacons
  );

  if (matchingBeaconsBaseSet.length == 0) {
    return {
      mappedBeacons: [],
    };
  }

  const vectorInKnownSystem = subtract(
    matchingBeaconsBaseSet[5],
    matchingBeaconsBaseSet[0]
  );
  const vectorInUnknownSystem = subtract(
    matchingBeaconsNewSet[5],
    matchingBeaconsNewSet[0]
  );

  const mappingFunction = getMappingFunction(
    vectorInKnownSystem,
    vectorInUnknownSystem
  );
  const beacons1Matched = matchingBeaconsNewSet.map((b) => mappingFunction(b));

  const offset = subtract(matchingBeaconsBaseSet[0], beacons1Matched[0]);

  console.log({ offset });
  if (input.scanner == 4) {
    var mapMatched = beacons1Matched.map((b) => add(offset, b));
    console.log({ mapMatched });
  }

  // matchingBeacons0.forEach((value, index) => {
  //   console.log(subtract(value, beacons1Matched[index]));
  // });

  const mappedBeacons = newBeacons.map((beacon) => add(offset, beacon));
  return {
    mappedBeacons,
  };
}

function mapMatchedBeaconSet(matchingBeaconsBaseSet, matchingBeaconsNewSet) {
  const vectorInKnownSystem = subtract(
    matchingBeaconsBaseSet[5],
    matchingBeaconsBaseSet[0]
  );
  const vectorInUnknownSystem = subtract(
    matchingBeaconsNewSet[5],
    matchingBeaconsNewSet[0]
  );

  const rotationFunction = getMappingFunction(
    vectorInKnownSystem,
    vectorInUnknownSystem
  );
  var mappedBeacons = matchingBeaconsNewSet.map((b) => rotationFunction(b));

  const offset = subtract(matchingBeaconsBaseSet[0], mappedBeacons[0]);
  mappedBeacons = mappedBeacons.map((m) => add(m, offset));

  function mappingFunction(vectorToMap) {
    var result = rotationFunction(vectorToMap);
    return add(result, offset);
  }

  return { mappingFunction, offset, mappedBeacons };
}

function getBeacons(mapOfMatchingBeacons, baseBeaconSet, newBeacons) {
  var matchingBeaconsBaseSet = [];
  var matchingBeaconsNewSet = [];
  mapOfMatchingBeacons.forEach((newBeaconIndex, knownBeaconIndex) => {
    if (newBeaconIndex != undefined) {
      matchingBeaconsBaseSet.push(baseBeaconSet[knownBeaconIndex]);
      matchingBeaconsNewSet.push(newBeacons[newBeaconIndex]);
    }
  });
  return { matchingBeaconsBaseSet, matchingBeaconsNewSet };
}

function getMapOfMatchingBeacons(beaconsInA, beaconsInB) {
  const vectorsInCoordinateA_ByBeacon = getVectorsBetweenBeacons(beaconsInA);
  var vectorsInCoordinateB_byBeacon = getVectorsBetweenBeacons(beaconsInB);
  var numberOfMatchingMagnitudes_byBeacon = vectorsInCoordinateA_ByBeacon.map(
    (vectorsInA) => {
      return vectorsInCoordinateB_byBeacon.map((vectorsInB) => {
        return countMatchingMagnitudes(vectorsInA, vectorsInB);
      });
    }
  );

  var mapping = numberOfMatchingMagnitudes_byBeacon.map(
    (matchingMagnitudes) => {
      const maxCount = Math.max(...matchingMagnitudes);
      if (maxCount >= 12) {
        matchingMagnitudes = matchingMagnitudes.indexOf(maxCount);
      } else {
        matchingMagnitudes = undefined;
      }
      return matchingMagnitudes;
    }
  );

  return mapping;
}

function getOverlappingSensors(data) {
  var overlappingSensors = [];
  for (var i = 0; i < data.length; i = i + 1) {
    for (var j = i; j < data.length; j = j + 1) {
      if (i == j) {
        continue;
      }
      var match = getMatchedBeacons(data[i].beacons, data[j].beacons);
      if (match.thereAreMatches) {
        overlappingSensors.push({ match, scanner1: i, scanner2: j });
      }
    }
  }
  return overlappingSensors;
}

function solvePart1(data) {
  console.log("Solving Part 1");
  data = parseData(data);

  var beaconsInBaseCoordinateSystem = new Array(data.length);
  beaconsInBaseCoordinateSystem[0] = data[0]; // Use Scanner0 as the reference system
  var mappingFunctions = new Array(data.length);
  mappingFunctions[0] = (vector) => vector; // No mapping required.

  var overlappingSensors = getOverlappingSensors(data);

  var overlap = overlappingSensors.shift();

  do {
    // console.log(overlap);
    var mappingFunctionScanner1 = mappingFunctions[overlap.scanner1];
    var mappingFunctionScanner2 = mappingFunctions[overlap.scanner2];
    if (!mappingFunctionScanner1 && !mappingFunctionScanner2) {
      overlappingSensors.push(overlap);
    } else {
      var knownBeacons = !mappingFunctionScanner1
        ? overlap.match.matchingBeaconsNewSet
        : overlap.match.matchingBeaconsBaseSet;
      var newBeacons = !mappingFunctionScanner1
        ? overlap.match.matchingBeaconsBaseSet
        : overlap.match.matchingBeaconsNewSet;
      var referenceMappingFunction = !mappingFunctionScanner1
        ? mappingFunctionScanner2
        : mappingFunctionScanner1;
      var newScannerIndex = !mappingFunctionScanner1
        ? overlap.scanner1
        : overlap.scanner2;

      var referenceBeacons = knownBeacons.map((b) =>
        referenceMappingFunction(b)
      );
      var { mappingFunction, offset, mappedBeacons } = mapMatchedBeaconSet(
        referenceBeacons,
        newBeacons
      );
      // console.log({ newScannerIndex });
      // console.log({ offset });
      mappingFunctions[newScannerIndex] = mappingFunction;
    }
    overlap = overlappingSensors.shift();
  } while (overlap);

  var mappedVectors = data
    .map((d, index) => {
      var map = mappingFunctions[index];
      return d.beacons.map((vector) => map(vector));
    })
    .flat();
  var uniqueBeacons = [
    ...new Set(mappedVectors.map((vector) => JSON.stringify(vector))),
  ].map((str) => JSON.parse(str));
  console.log(uniqueBeacons.length);
  process.exit();

  var baseBeaconSet = data.shift().beacons;

  var newBeaconSet = data.shift();
  do {
    // console.log(baseBeaconSet);
    var { mappedBeacons } = fooBar(baseBeaconSet, newBeaconSet);
    if (mappedBeacons.length) {
      baseBeaconSet = baseBeaconSet.concat(mappedBeacons);
      baseBeaconSet = [
        ...new Set(baseBeaconSet.map((b) => JSON.stringify(b))),
      ].map((b) => JSON.parse(b));
    } else {
      data.push(newBeaconSet);
    }
    newBeaconSet = data.shift();
  } while (newBeaconSet);

  console.log(baseBeaconSet.length);
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
