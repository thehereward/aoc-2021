function parseData(data) {
  const startCondition = data.shift();
  data.shift();
  const mappings = {};
  data = data.forEach((d) => {
    const parts = d.split(" -> ");
    mappings[parts[0]] = parts[1];
  });
  return { startCondition, mappings };
}

function iterate(input, mappings) {
  var output = "";
  for (var i = 0; i < input.length - 1; i = i + 1) {
    var left = input[i];
    var right = input[i + 1];
    output = output + left;
    var insert = mappings[`${left}${right}`];
    output = output + insert;
  }
  output = output + input[input.length - 1];
  return output;
}

function solvePart1(data) {
  console.log("Solving Part 1");
  data = parseData(data);
  var input = data.startCondition;
  const mappings = data.mappings;

  for (var i = 0; i < 10; i = i + 1) {
    input = iterate(input, mappings);
  }

  var result = input.split("").reduce((a, c) => {
    if (!a[c]) {
      a[c] = 1;
    } else {
      a[c] = a[c] + 1;
    }
    return a;
  }, {});

  var min = 0;
  var max = 0;
  Object.keys(result).forEach((key) => {
    var value = result[key];
    if (value > max || max == 0) {
      max = value;
    }

    if (value < min || min == 0) {
      min = value;
    }
  });
  console.log({ max, min });
  console.log(max - min);
}

function augmentPairs(pairs, mappings, duplicates) {
  const newPairs = {};
  Object.keys(pairs).forEach((key) => {
    const newPairValues = mappings[key];
    const number = pairs[key];

    newPairValues.forEach((value) => {
      if (!newPairs[value]) {
        newPairs[value] = number;
      } else {
        newPairs[value] = newPairs[value] + number;
      }
    });

    var duplicateCharacter = newPairValues[0][1];
    if (!duplicates[duplicateCharacter]) {
      duplicates[duplicateCharacter] = number;
    } else {
      duplicates[duplicateCharacter] = duplicates[duplicateCharacter] + number;
    }
  });
  return { pairs: newPairs, duplicates };
}

function solvePart2(data) {
  console.log("Solving Part 2");
  data = parseData(data);
  var input = data.startCondition;
  console.log(input);
  const mappings = data.mappings;

  const updatedMappings = {};
  Object.keys(mappings).forEach((key) => {
    const value = mappings[key];
    const chars = key.split("");
    updatedMappings[key] = [`${chars[0]}${value}`, `${value}${chars[1]}`];
  });

  console.log(updatedMappings);

  var duplicates = {};
  var pairs = {};
  for (var i = 0; i < input.length - 1; i = i + 1) {
    var nextChar = input[i + 1];
    var pair = `${input[i]}${nextChar}`;
    if (!pairs[pair]) {
      pairs[pair] = 1;
    } else {
      pairs[pair] = pairs[pair] + 1;
    }

    if (!duplicates[nextChar]) {
      duplicates[nextChar] = 1;
    } else {
      duplicates[nextChar] = duplicates[nextChar] + 1;
    }
  }

  const finalCharacter = input.slice(input.length - 1);
  duplicates[finalCharacter] = duplicates[finalCharacter] - 1;

  for (var i = 0; i < 40; i = i + 1) {
    ({ pairs, duplicates } = augmentPairs(pairs, updatedMappings, duplicates));
  }

  const counts = [];
  Object.keys(pairs).forEach((key) => {
    var count = pairs[key];
    var chars = key.split("");
    chars.forEach((char) => {
      if (!counts[char]) {
        counts[char] = count;
      } else {
        counts[char] = counts[char] + count;
      }
    });
  });

  Object.keys(duplicates).forEach((key) => {
    var count = duplicates[key];
    var chars = key.split("");
    chars.forEach((char) => {
      if (!counts[char]) {
        counts[char] = -count;
      } else {
        counts[char] = counts[char] - count;
      }
    });
  });

  var min = 0;
  var max = 0;
  Object.keys(counts).forEach((key) => {
    var value = counts[key];
    if (value > max || max == 0) {
      max = value;
    }

    if (value < min || min == 0) {
      min = value;
    }
  });
  console.log({ max, min });
  console.log(max - min);
}

function solve(data, partTwo) {
  if (!partTwo) {
    return solvePart1(data);
  } else {
    return solvePart2(data);
  }
}

module.exports = solve;
