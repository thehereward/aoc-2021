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

function solvePart1(data) {
  console.log("Solving Part 1");
  var rules = parseData(data);
  rules = getRelevantRules(rules);

  var count = 0;
  var state = {};

  // console.log(rules);
  rules.forEach((rule) => {
    if (shouldApplyRulePart1(rule)) {
      state = applyRule(state, rule);
      var size = getRuleSize(rule);
      if (rule.action == "on") {
        count = count + size;
      } else {
        count = count - size;
      }
      var stateCount = Object.keys(state).length;
      console.log({ rule, size, count, stateCount });
    }
  });

  return count;
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
      console.log({ newRule });
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

  var rulesAndOverlaps = getRelevantRules(rules);

  console.log(rulesAndOverlaps);
  return "";
  var state = {};

  rules.forEach((rule) => {
    console.log(`Applying Rule: ${rule}`);
    state = applyRule(state, rule);
  });

  const answer = Object.keys(state).length;

  return answer;
}

function solve(data, partTwo) {
  var answer = !partTwo ? solvePart1(data) : solvePart2(data);
  console.log({ answer });
  return answer;
}

function validPair(below) {
  return (
    below.x[1] >= below.x[0] &&
    below.y[1] >= below.y[0] &&
    below.z[1] >= below.z[0]
  );
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

function splitCubes(a, b) {
  var overlap = getOverlapWithoutAction(a, b);
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
    if (validPair(pair)) {
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
};
