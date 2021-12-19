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

function manhattanDistance(vector) {
  return Math.abs(vector[0]) + Math.abs(vector[1]) + Math.abs(vector[2]);
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

function getVectorMagnitude(a) {
  return a[0] ** 2 + a[1] ** 2 + a[2] ** 2;
}

function equalVectorMagnitude(a, b) {
  return getVectorMagnitude(a) == getVectorMagnitude(b);
}

function getVectorsForBeacon(a, beacon) {
  return a.map((otherBeacon) => {
    return subtract(beacon, otherBeacon);
  });
}

function getVectorsBetweenAllBeacons(a) {
  var vectorDiffs = a.map((beacon) => {
    return getVectorsForBeacon(a, beacon);
  });
  return vectorDiffs;
}

function countMatchingMagnitudes(vectorsA, vectorsB) {
  var count = 0;
  vectorsA.forEach((vectorA) => {
    vectorsB.forEach((vectorB) => {
      if (equalVectorMagnitude(vectorA, vectorB)) {
        count = count + 1;
      }
    });
  });
  return count;
}

function getMappingForComponent(targetComponent, sourceVector) {
  var absoluteValues = sourceVector.map((char) => Math.abs(char));
  var index = absoluteValues.indexOf(Math.abs(targetComponent));
  var isInverse = sourceVector[index] == targetComponent * -1;

  return function (vectorToMap) {
    if (isInverse) {
      return -vectorToMap[index];
    }
    return vectorToMap[index];
  };
}

function getMappingFunction(targetVector, sourceVector) {
  var xMap = getMappingForComponent(targetVector[0], sourceVector);
  var yMap = getMappingForComponent(targetVector[1], sourceVector);
  var zMap = getMappingForComponent(targetVector[2], sourceVector);

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

function mapMatchedBeaconSet(knownBeacons, unknownBeacons) {
  const vectorInKnownSystem = subtract(knownBeacons[5], knownBeacons[0]);
  const vectorInUnknownSystem = subtract(unknownBeacons[5], unknownBeacons[0]);

  const rotate = getMappingFunction(vectorInKnownSystem, vectorInUnknownSystem);
  var mappedBeacons = unknownBeacons.map((b) => rotate(b));
  const offset = subtract(knownBeacons[0], mappedBeacons[0]);

  function mappingFunction(vectorToMap) {
    return add(rotate(vectorToMap), offset);
  }

  return { mappingFunction, offset };
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
  const vectorsInCoordinateA_ByBeacon = getVectorsBetweenAllBeacons(beaconsInA);
  var vectorsInCoordinateB_byBeacon = getVectorsBetweenAllBeacons(beaconsInB);
  var numberOfMatchingMagnitudes_byBeacon = vectorsInCoordinateA_ByBeacon.map(
    (vectorsInA) => {
      return vectorsInCoordinateB_byBeacon.map((vectorsInB) => {
        return countMatchingMagnitudes(vectorsInA, vectorsInB);
      });
    }
  );

  var mapping = numberOfMatchingMagnitudes_byBeacon.map((matches) => {
    const maxCount = Math.max(...matches);
    return maxCount >= 12 ? matches.indexOf(maxCount) : undefined;
  });

  return mapping;
}

function getOverlappingSensors(data) {
  var overlappingSensors = [];
  for (var i = 0; i < data.length; i = i + 1) {
    for (var j = i + 1; j < data.length; j = j + 1) {
      var match = getMatchedBeacons(data[i].beacons, data[j].beacons);
      if (match.thereAreMatches) {
        overlappingSensors.push({ match, scanner1: i, scanner2: j });
      }
    }
  }
  return overlappingSensors;
}

function buildCommonCoordinatorSystem(data) {
  var mappingFunctions = new Array(data.length);
  mappingFunctions[0] = (vector) => vector; // No mapping required.
  var offsetsToScanners = new Array(data.length);
  offsetsToScanners[0] = [0, 0, 0];

  var overlappingSensors = getOverlappingSensors(data);

  var overlap = overlappingSensors.shift();
  do {
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
      var { mappingFunction, offset } = mapMatchedBeaconSet(
        referenceBeacons,
        newBeacons
      );
      mappingFunctions[newScannerIndex] = mappingFunction;
      offsetsToScanners[newScannerIndex] = offset;
    }
    overlap = overlappingSensors.shift();
  } while (overlap);

  return { mappingFunctions, offsetsToScanners };
}

function solvePart1(data) {
  console.log("Solving Part 1");
  data = parseData(data);
  var { mappingFunctions } = buildCommonCoordinatorSystem(data);

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
}

function solvePart2(data) {
  console.log("Solving Part 2");
  data = parseData(data);

  var { offsetsToScanners } = buildCommonCoordinatorSystem(data);

  var vectorsBetweenScanners = [];
  for (var i = 0; i < offsetsToScanners.length; i = i + 1) {
    for (var j = i + 1; j < offsetsToScanners.length; j = j + 1) {
      vectorsBetweenScanners.push(
        subtract(offsetsToScanners[i], offsetsToScanners[j])
      );
    }
  }
  var magDiff = vectorsBetweenScanners.map((vector) => {
    return manhattanDistance(vector);
  });
  console.log(Math.max(...magDiff));
}

function solve(data, partTwo) {
  if (!partTwo) {
    return solvePart1(data);
  } else {
    return solvePart2(data);
    // 3621 is too low
  }
}

module.exports = {
  solve,
  split,
  parseData,
  subtract,
  getVectorMagnitude,
};
