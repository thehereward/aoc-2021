function parseData(data) {
  return data.map((d) => JSON.parse(d));
}

function add(a, b) {
  var result = [a, b];
  return explodeOrSplit(result);
}

function numberChanged(before, after) {
  return JSON.stringify(before) != JSON.stringify(after);
}

function explodeOrSplit(input) {
  var output = explode(input);
  if (numberChanged(input, output)) {
    return explodeOrSplit(output);
  }

  output = split(input);
  if (numberChanged(input, output)) {
    return explodeOrSplit(output);
  }

  return output;
}

function explodeRecursive(node, nesting, hasExploded) {
  if (typeof node == "number") {
    return {
      value: node,
    };
  }

  if (nesting == 5 && !hasExploded) {
    return {
      before: node[0],
      after: node[1],
      value: 0,
      hasExploded: true,
    };
  }

  const partA = explodeRecursive(node[0], nesting + 1, hasExploded);
  hasExploded = hasExploded || partA.hasExploded;
  const partB = explodeRecursive(node[1], nesting + 1, hasExploded);
  hasExploded = hasExploded || partB.hasExploded;

  if (typeof partA.after == "number") {
    return {
      value: [partA.value, prepend(partA.after, partB.value)],
      before: partA.before,
      hasExploded,
    };
  }

  if (typeof partB.before == "number") {
    return {
      value: [append(partA.value, partB.before), partB.value],
      after: partB.after,
      hasExploded,
    };
  }

  return {
    value: [partA.value, partB.value],
    before: partA.before,
    after: partB.after,
    hasExploded,
  };
}

function prepend(value, node) {
  if (typeof node == "number") {
    return node + value;
  }
  if (typeof node[0] == "number") {
    return [node[0] + value, node[1]];
  } else {
    return [prepend(value, node[0]), node[1]];
  }
}

function append(node, value) {
  if (typeof node == "number") {
    return node + value;
  }
  if (typeof node[1] == "number") {
    return [node[0], node[1] + value];
  } else {
    return [node[0], append(node[1], value)];
  }
}

function explode(data) {
  var result = explodeRecursive(data, 1);
  return result.value;
}

function split(data) {
  data = JSON.stringify(data);

  const re = /(\d\d)/;
  if (re.test(data)) {
    var match = data.match(re);
    var before = data.slice(0, match.index);
    var after = data.slice(match.index + 2);
    var result = parseInt(match[1]);
    result = JSON.stringify([Math.floor(result / 2), Math.ceil(result / 2)]);
    data = `${before}${result}${after}`;
  }

  return JSON.parse(data);
}

function addList(data) {
  return data.reduce((a, c) => {
    return add(a, c);
  });
}

function magnitude(data) {
  if (typeof data == "number") {
    return data;
  }

  return magnitude(data[0]) * 3 + magnitude(data[1]) * 2;
}

function solvePart1(data) {
  console.log("Solving Part 1");
  data = parseData(data);
  data = addList(data);
  data = magnitude(data);
  console.log({ data });
}

function solvePart2(data) {
  console.log("Solving Part 2");
  data = parseData(data);
  var sums = [];
  for (var i = 0; i < data.length; i = i + 1) {
    for (var j = 0; j < data.length; j = j + 1) {
      if (i == j) {
        continue;
      }
      sums.push(magnitude(add(data[i], data[j])));
    }
  }

  sums = Math.max(...sums);
  console.log({ sums });
}

function solve(data, partTwo) {
  if (!partTwo) {
    return solvePart1(data);
  } else {
    return solvePart2(data);
  }
}

module.exports = { solve, add, explode, split, addList, magnitude };
