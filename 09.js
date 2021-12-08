function parseData(data) {
  data = data.map((d) => d.split("|"));
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

function findFuelUse(data, x) {
  const fuelUse = data.reduce((a, c) => {
    return a + Math.abs(c - x);
  }, 0);
  return fuelUse;
}

function getFuelForSteps(value) {
  var abs = Math.abs(value);
  return (abs / 2) * (abs + 1) * (abs / value) || 0;
}

function findFuelUseSecondPart(data, x) {
  const fuelUse = data.reduce((a, c) => {
    var steps = Math.abs(c - x);
    return a + getFuelForSteps(steps);
  }, 0);
  return fuelUse;
}

function solvePart1(data) {
  console.log("Solving Part 1");
  var data = parseData(data);
  const uniqueLengths = [2, 4, 3, 7];
  var outputValues = data.map((d) => d.outputValues).flat();
  const count = outputValues.reduce((a, c) => {
    if (uniqueLengths.some((u) => u == c.length)) {
      return a + 1;
    } else {
      return a;
    }
  }, 0);
  console.log({ count });
}

const LETTERS = ["a", "b", "c", "d", "e", "f", "g"];
const mapBase = {
  a: ["a", "b", "c", "d", "e", "f", "g"],
  b: ["a", "b", "c", "d", "e", "f", "g"],
  c: ["a", "b", "c", "d", "e", "f", "g"],
  d: ["a", "b", "c", "d", "e", "f", "g"],
  e: ["a", "b", "c", "d", "e", "f", "g"],
  f: ["a", "b", "c", "d", "e", "f", "g"],
  g: ["a", "b", "c", "d", "e", "f", "g"],
};

function intersection(data, filter) {
  return data.filter((v) => filter.includes(v));
}

function filter(mapping, pattern, filter) {
  pattern.split("").map((char) => {
    mapping[char] = intersection(mapping[char], filter);
  });
  return mapping;
}

function solvePart2(data) {
  console.log("Solving Part 2");
  data = parseData(data);
  const answer = data.map((d) => solveForOne(d)).reduce((a, c) => a + c);
  console.log({ answer });
}

function solveForOne(data0) {
  var signalPatterns = data0.signalPatterns;
  var outputValues = data0.outputValues;
  signalPatterns = signalPatterns.sort((a, b) => a.length - b.length);

  var mapping = Object.assign({}, mapBase);
  // console.log({ mapping });
  var uniqueSignals = {};
  signalPatterns.forEach((pattern) => {
    switch (pattern.length) {
      case 2:
        // Number 1
        uniqueSignals[1] = pattern;
        // console.log("Solving 1");
        mapping = filter(mapping, pattern, ["c", "f"]);
        LETTERS.filter((l) => !pattern.split("").includes(l)).map((char) => {
          mapping[char] = mapping[char].filter((m) => !["c", "f"].includes(m));
        });
        // console.log({ mapping });
        break;
      case 3:
        // Number 7
        uniqueSignals[7] = pattern;
        // console.log("Solving 7");
        mapping = filter(mapping, pattern, ["a", "c", "f"]);
        const characterA = uniqueSignals[7]
          .split("")
          .filter((u) => !uniqueSignals[1].split("").includes(u));
        LETTERS.filter((l) => l != characterA).map((char) => {
          mapping[char] = mapping[char].filter((m) => !["a"].includes(m));
        });
        // console.log({ mapping });

        break;
      case 4:
        // Number 4
        uniqueSignals[4] = pattern;
        // console.log("Solving 4");
        mapping = filter(mapping, pattern, ["b", "c", "d", "f"]);
        LETTERS.filter((l) => !pattern.split("").includes(l)).map((char) => {
          mapping[char] = mapping[char].filter(
            (m) => !["b", "c", "d", "f"].includes(m)
          );
        });
        break;
    }
  });

  const charCount = signalPatterns.reduce((a, c) => {
    c.split("").map((char) => {
      a[char] = !a[char] ? 1 : a[char] + 1;
    });
    return a;
  }, {});

  LETTERS.forEach((letter) => {
    switch (charCount[letter]) {
      case 4:
        // e
        filter(mapping, letter, "e");
        LETTERS.filter((l) => l != letter).map((char) => {
          mapping[char] = mapping[char].filter((m) => !["e"].includes(m));
        });
        break;
      case 6:
        // f
        filter(mapping, letter, "b");
        LETTERS.filter((l) => l != letter).map((char) => {
          mapping[char] = mapping[char].filter((m) => !["b"].includes(m));
        });
        break;
      case 9:
        // e
        filter(mapping, letter, "f");
        LETTERS.filter((l) => l != letter).map((char) => {
          mapping[char] = mapping[char].filter((m) => !["f"].includes(m));
        });
        break;
    }
  });

  outputValues = mapOutputs(mapping, outputValues);
  outputValues = parseInt(
    outputValues.map((value) => MAPPINGS[value]).join("")
  );
  return outputValues;
}

function mapOutputs(mapping, outputs) {
  return outputs.map((output) =>
    output
      .split("")
      .map((char) => mapping[char])
      .sort()
      .join("")
  );
}

const MAPPINGS = {
  abcefg: "0",
  cf: "1",
  acdeg: "2",
  acdfg: "3",
  bcdf: "4",
  abdfg: "5",
  abdefg: "6",
  acf: "7",
  abcdefg: "8",
  abcdfg: "9",
};

function solve(data, partTwo) {
  if (!partTwo) {
    return solvePart1(data);
  } else {
    return solvePart2(data);
  }
}

module.exports = solve;
