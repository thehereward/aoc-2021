function parseData(data) {
  return data.map((line) => parseLine(line));
}

function formatAxis(a, b) {
  return [parseInt(a), parseInt(b)];
}

function parseLine(line) {
  const regEx =
    /^(on|off) x=(-?\d+)..(-?\d+),y=(-?\d+)..(-?\d+),z=(-?\d+)..(-?\d+)$/;
  var match = line.match(regEx);
  return {
    action: match[1],
    x: formatAxis(match[2], match[3]),
    y: formatAxis(match[4], match[5]),
    z: formatAxis(match[6], match[7]),
  };
  return match;
}

function rangesOverlap(a, b) {
  return a[0] <= b[1] && b[0] <= a[1];
}

function inside(a, b) {
  return a[0] <= b[0] && b[1] <= a[1];
}

function rangeOverlapsTarget(a) {
  return rangesOverlap(a, [-50, 50]);
}

function shouldApplyRulePart1(rule) {
  return (
    rangeOverlapsTarget(rule.x) &&
    rangeOverlapsTarget(rule.y) &&
    rangeOverlapsTarget(rule.z)
  );
}

function testOverlap(a, b) {
  return (
    rangesOverlap(a.x, b.x) &&
    rangesOverlap(a.y, b.y) &&
    rangesOverlap(a.z, b.z)
  );
}

function testInside(a, b) {
  return inside(a.x, b.x) && inside(a.y, b.y) && inside(a.z, b.z);
}

function equal(a, b) {
  return a[0] == b[0] && a[1] == b[1];
}

function testEqual(a, b) {
  return equal(a.x, b.x) && equal(a.y, b.y) && equal(a.z, b.z);
}

function getAction(action1, action2) {
  if (action1 == "on" && action2 == "on") {
    return "off";
  } else {
    return action2;
  }
}

function getOverlap(rule1, rule2) {
  return {
    action: getAction(rule1.action, rule2.action),
    x: [Math.max(rule1.x[0], rule2.x[0]), Math.min(rule1.x[1], rule2.x[1])],
    y: [Math.max(rule1.y[0], rule2.y[0]), Math.min(rule1.y[1], rule2.y[1])],
    z: [Math.max(rule1.z[0], rule2.z[0]), Math.min(rule1.z[1], rule2.z[1])],
  };
}

function getOverlapWithoutAction(rule1, rule2) {
  return {
    x: [Math.max(rule1.x[0], rule2.x[0]), Math.min(rule1.x[1], rule2.x[1])],
    y: [Math.max(rule1.y[0], rule2.y[0]), Math.min(rule1.y[1], rule2.y[1])],
    z: [Math.max(rule1.z[0], rule2.z[0]), Math.min(rule1.z[1], rule2.z[1])],
  };
}

function applyRule(state, rule) {
  for (var x = rule.x[0]; x <= rule.x[1]; x = x + 1) {
    for (var y = rule.y[0]; y <= rule.y[1]; y = y + 1) {
      for (var z = rule.z[0]; z <= rule.z[1]; z = z + 1) {
        if (rule.action == "on") {
          state[`${x}|${y}|${z}`] = true;
        } else {
          delete state[`${x}|${y}|${z}`];
        }
      }
    }
  }
  return state;
}

function ruleToCube(rule) {
  return {
    x: rule.x,
    y: rule.y,
    z: rule.z,
  };
}

function applyRuleToCubes(cubes, rule) {
  if (cubes.length == 0 && rule.action == "on") {
    return [ruleToCube(rule)];
  }
  // var cube = cubes.shift();
  return cubes.map((cube) => splitAndFilter(cube, rule)).flat();
}

function applyToImpactedCubes(cubes, rule) {
  var impactedCubes = [];
  var otherCubes = [];
  cubes.forEach((cube) => {
    if (testOverlap(rule, cube)) {
      impactedCubes.push(cube);
    } else {
      otherCubes.push(cube);
    }
  });
}

function split(a, b) {
  const xRanges = [
    [a.x[0], b.x[0] - 1],
    [b.x[0], b.x[1]],
    [b.x[1] + 1, a.x[1]],
  ];
  const yRanges = [
    [a.y[0], b.y[0] - 1],
    [b.y[0], b.y[1]],
    [b.y[1] + 1, a.y[1]],
  ];
  const zRanges = [
    [a.z[0], b.z[0] - 1],
    [b.z[0], b.z[1]],
    [b.z[1] + 1, a.z[1]],
  ];

  const splitRegions = [];
  for (const xRange of xRanges) {
    for (const yRange of yRanges) {
      for (const zRange of zRanges) {
        const splitRegion = {
          x: [xRange[0], xRange[1]],
          y: [yRange[0], yRange[1]],
          z: [zRange[0], zRange[1]],
        };
        if (validCube(splitRegion)) {
          splitRegions.push(splitRegion);
        }
      }
    }
  }

  return splitRegions;
}

function findOverlap(a, b) {
  const overlap = {
    x: [Math.max(a.x[0], b.x[0]), Math.min(a.x[1], b.x[1])],
    y: [Math.max(a.y[0], b.y[0]), Math.min(a.y[1], b.y[1])],
    z: [Math.max(a.z[0], b.z[0]), Math.min(a.z[1], b.z[1])],
  };
  return validCube(overlap) ? overlap : false;
}

function solvePart1(data) {
  console.log("Solving Part 1");
  var rules = parseData(data);

  var onCubes = [];

  for (var i = 0; i < rules.length; ++i) {
    const rule = rules[i];
    if (!shouldApplyRulePart1(rule)) {
      continue;
    }
    const sw = rule.action !== "off";
    // console.log(`${i} / ${rules.length}`);
    // console.log(rules);
    const ruleRegions = [rule];
    while (ruleRegions.length) {
      const ruleRegion = ruleRegions.pop();
      let overlap;
      for (var j = 0; j < onCubes.length; ++j) {
        const onCube = onCubes[j];
        overlap = findOverlap(onCube, ruleRegion);
        if (overlap) {
          const newOnCubes = split(onCube, overlap);
          if (sw === false) {
            const index = newOnCubes.findIndex((reg) =>
              testEqual(reg, overlap)
            );
            newOnCubes.splice(index, 1);
          }
          onCubes.splice(j, 1, ...newOnCubes);
          const newRules = split(ruleRegion, overlap);
          const index = newRules.findIndex((reg) => testEqual(reg, overlap));
          newRules.splice(index, 1);
          ruleRegions.push(...newRules);
          break;
        }
      }

      if (!overlap) {
        if (sw) {
          onCubes.push(ruleRegion);
        }
      }
    }
  }

  // console.log(onCubes);
  var answer = onCubes.reduce((a, cube) => {
    var size = getRuleSize(cube);
    return a + size;
  }, 0);
  return answer;

  return false;
  var firstCube = rules.shift();
  var cubes = [firstCube];
  console.log({ firstCube });
  rules.forEach((rule) => {
    i = i + 1;
    if (!shouldApplyRulePart1(rule)) {
      return;
    }
    var impactedCubes = [];
    var otherCubes = [];
    cubes.forEach((cube) => {
      if (testOverlap(rule, cube)) {
        impactedCubes.push(cube);
      } else {
        otherCubes.push(cube);
      }
    });

    var newCubes = applyRuleToCubes(impactedCubes, rule);
    cubes = newCubes.concat(otherCubes);
    var cubeObj = {};
    cubes.forEach((cube) => (cubeObj[JSON.stringify(cube)] = true));
    cubes = Object.keys(cubeObj).map((key) => JSON.parse(key));
    console.log(cubes.length);
    // if (i == 2) {
    //   process.exit();
    // }
  });

  var answer = cubes.reduce((a, cube) => {
    var size = getRuleSize(cube);
    return a + size;
  }, 0);
  return answer;
  var state = {};

  rules.forEach((rule) => {
    if (shouldApplyRulePart1(rule)) {
      state = applyRule(state, rule);
      // var size = getRuleSize(rule);
      // if (rule.action == "on") {
      //   count = count + size;
      // } else {
      //   count = count - size;
      // }
      var stateCount = Object.keys(state).length;
      // console.log({ rule, size, count, stateCount });
    }
  });

  return Object.keys(state).length;
}

function getRuleSize(rule) {
  var x = rule.x[1] - rule.x[0] + 1;
  var y = rule.y[1] - rule.y[0] + 1;
  var z = rule.z[1] - rule.z[0] + 1;
  return x * y * z;
}

function getRelevantRules(rules) {
  var rulesAndOverlaps = [];
  for (var i = 0; i < rules.length; i = i + 1) {
    var newRules = [];
    var newRule = rules[i];
    for (var j = 0; j <= i; j = j + 1) {
      if (i == j) {
        if (newRule.action == "on") {
          newRules.push(newRule);
        }
        continue;
      }
      var oldRule = rules[j];

      if (testOverlap(oldRule, newRule)) {
        if (oldRule.action == "off" && newRule.action == "off") {
        } else {
          var overlap = getOverlap(oldRule, newRule);
          newRules.push(overlap);
        }
      }
    }

    var rulesToAdd = [];
    var previousRule = newRules[0];
    rulesToAdd.push(previousRule);
    for (var i = 1; i < newRules.length; i = i + 1) {
      var newRule = newRules[i];
      // console.log({ newRule });
      if (
        testInside(previousRule, newRule) &&
        previousRule.action == newRule.action
      ) {
      } else {
        rulesToAdd.push(newRule);
      }
    }
    rulesAndOverlaps.concat(...rulesToAdd);
  }

  return rulesAndOverlaps;

  if (rules.length == rulesAndOverlaps.length) {
    return rules;
  } else {
    console.log({ rules }, { rulesAndOverlaps });
    return getRelevantRules(rulesAndOverlaps);
  }
}

function solvePart2(data) {
  console.log("Solving Part 2");
  var rules = parseData(data);

  var onCubes = [];

  for (var i = 0; i < rules.length; ++i) {
    const rule = rules[i];
    const sw = rule.action !== "off";
    console.log(`${i} / ${rules.length}`);
    // console.log(rules);
    const ruleRegions = [rule];
    while (ruleRegions.length) {
      const ruleRegion = ruleRegions.pop();
      let overlap;
      for (var j = 0; j < onCubes.length; ++j) {
        const onCube = onCubes[j];
        overlap = findOverlap(onCube, ruleRegion);
        if (overlap) {
          const newOnCubes = split(onCube, overlap);
          if (sw === false) {
            const index = newOnCubes.findIndex((reg) =>
              testEqual(reg, overlap)
            );
            newOnCubes.splice(index, 1);
          }
          onCubes.splice(j, 1, ...newOnCubes);
          const newRules = split(ruleRegion, overlap);
          const index = newRules.findIndex((reg) => testEqual(reg, overlap));
          newRules.splice(index, 1);
          ruleRegions.push(...newRules);
          break;
        }
      }

      if (!overlap) {
        if (sw) {
          onCubes.push(ruleRegion);
        }
      }
    }
  }

  // console.log(onCubes);
  var answer = onCubes.reduce((a, cube) => {
    var size = getRuleSize(cube);
    return a + size;
  }, 0);
  return answer;
}

function solve(data, partTwo) {
  var answer = !partTwo ? solvePart1(data) : solvePart2(data);
  console.log({ answer });
  return answer;
}

function add(result, x1, x2) {
  var below = { x: [x1, x2] };
  if (below.x[1] >= below.x[0]) {
    result.push(below);
  }
  return result;
}

function getPairs(a, b, overlap, x) {
  var overlapX = overlap[x];
  var minX = Math.min(a[x][0], b[x][0]);
  var belowOverlap = overlapX[0] - 1;
  var aboveOverlap = overlapX[1] + 1;
  var maxX = Math.max(a[x][1], b[x][1]);
  return [[minX, belowOverlap], overlapX, [aboveOverlap, maxX]];
}

function validCube(pairToValidate) {
  return (
    pairToValidate.x[1] >= pairToValidate.x[0] &&
    pairToValidate.y[1] >= pairToValidate.y[0] &&
    pairToValidate.z[1] >= pairToValidate.z[0]
  );
}

function splitAndFilter(a, b) {
  var isAdding = b.action == "on";
  if (isAdding && testInside(a, b)) {
    return ruleToCube(a);
  } else if (isAdding && testInside(b, a)) {
    return ruleToCube(b);
  }
  return splitCubes(a, b, isAdding);
}

function splitCubes(a, b, adding = true) {
  var overlap = getOverlapWithoutAction(a, b);

  function fooCube(cube) {
    if (adding) {
      return testOverlap(cube, a) || testOverlap(cube, b);
    } else {
      return testOverlap(cube, a) && !testOverlap(cube, b);
    }
  }

  function shouldIncludeCube(cubeToConsider) {
    return validCube(cubeToConsider) && fooCube(cubeToConsider);
  }

  var result = [];
  var xPairs = getPairs(a, b, overlap, "x");
  var yPairs = getPairs(a, b, overlap, "y");
  var zPairs = getPairs(a, b, overlap, "z");
  xPairs = xPairs.map((pair) => {
    return {
      x: [pair[0], pair[1]],
    };
  });

  var xYPairs = xPairs
    .map((xPair) => {
      return yPairs.map((yPair) => {
        return {
          ...xPair,
          y: [yPair[0], yPair[1]],
        };
      });
    })
    .flat();

  var xYZPairs = xYPairs
    .map((xYPair) => {
      return zPairs.map((zPair) => {
        return {
          ...xYPair,
          z: [zPair[0], zPair[1]],
        };
      });
    })
    .flat();

  xYZPairs.forEach((pair) => {
    if (shouldIncludeCube(pair)) {
      result.push(pair);
    }
  });

  // yPairs = yPairs.map((pair) => {
  //   return {
  //     x: [pair[0], pair[1]],
  //   };
  // });
  // yPairs.forEach((pair) => {
  //   if (validPair(pair)) {
  //     result.push(pair);
  //   }
  // });

  return result;
}

module.exports = {
  solve,
  parseLine,
  shouldApplyRulePart1,
  applyRule,
  solvePart1,
  solvePart2,
  getOverlap,
  testOverlap,
  getRelevantRules,
  parseData,
  getRuleSize,
  splitCubes,
  splitAndFilter,
  applyRuleToCubes,
};
