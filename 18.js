function parseData(data) {
  return data.map((d) => JSON.parse(d));
}

function add(a, b) {
  var result = [a, b];
  return explodeOrSplit(result);
}

function explodeOrSplit(a) {
  // console.log(JSON.stringify(a));
  var result = explode(a);
  var didExplode = JSON.stringify(result) != JSON.stringify(a);
  if (didExplode) {
    return explodeOrSplit(result);
  }

  result = split(a);
  var didSplit = JSON.stringify(result) != JSON.stringify(a);
  if (didSplit) {
    return explodeOrSplit(result);
  }

  return result;
}

function explodeRecursive(a, nesting, hasExploded) {
  if (typeof a == "number") {
    return {
      value: a,
    };
  }

  if (nesting == 5 && !hasExploded) {
    // Explode
    // console.log({ a });
    return {
      before: a[0],
      after: a[1],
      value: 0,
      hasExploded: true,
    };
  }

  const partA = explodeRecursive(a[0], nesting + 1, hasExploded);
  hasExploded = hasExploded || partA.hasExploded;
  const partB = explodeRecursive(a[1], nesting + 1, hasExploded);
  hasExploded = hasExploded || partB.hasExploded;

  // if (hasExploded) {
  //   console.log({ partA, partB });
  // }

  if (typeof partA.after == "number") {
    var newValue = prepend(partA.after, partB.value);
    return {
      value: [partA.value, newValue],
      before: partA.before,
      hasExploded,
    };
  }

  if (typeof partB.before == "number") {
    // console.log(partB);
    var newValue = append(partA.value, partB.before);
    // console.log(newValue);
    return {
      value: [newValue, partB.value],
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

function prepend(value, data) {
  if (typeof data == "number") {
    return data + value;
  }
  if (typeof data[0] == "number") {
    return [data[0] + value, data[1]];
  } else {
    return [prepend(value, data[0]), data[1]];
  }
}

function append(data, value) {
  // console.log({ data, value });
  if (typeof data == "number") {
    return data + value;
  }
  if (typeof data[1] == "number") {
    return [data[0], data[1] + value];
  } else {
    return [data[0], append(data[1], value)];
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
    var result = parseInt(match[1]);
    result = JSON.stringify([Math.floor(result / 2), Math.ceil(result / 2)]);
    var before = data.slice(0, match.index);
    var after = data.slice(match.index + 2);
    data = `${before}${result}${after}`;
  }

  return JSON.parse(data);
}

function splitRecursive(data, hasSplit) {
  if (hasSplit) {
    return { value: data, hasSplit };
  }
  if (typeof data == "number") {
    if (data > 9) {
      data = [Math.floor(data / 2), Math.ceil(data / 2)];
    }
    return { value: data, hasSplit: true };
  }
  var a = data[0];
  var b = data[1];
  return {
    value: [splitRecursive(a).value, splitRecursive(b).value],
    hasSplit,
  };
}

function addList(data) {
  return data.reduce((a, c) => {
    return add(a, c);
  });
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
  console.log({ data });
}

function solve(data, partTwo) {
  if (!partTwo) {
    return solvePart1(data);
  } else {
    return solvePart2(data);
  }
}

function magnitude(data) {
  if (typeof data == "number") {
    return data;
  }

  return magnitude(data[0]) * 3 + magnitude(data[1]) * 2;
}

module.exports = { solve, add, explode, split, addList, magnitude };
