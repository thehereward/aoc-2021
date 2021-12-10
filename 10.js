function parseData(data) {
  data = data.map((d) => d.split(""));
  return data;
}

const OPEN = ["[", "(", "{", "<"];
const CLOSE = ["]", ")", "}", ">"];
const VALID_PAIRS = ["[]", "()", "{}", "<>"];

const SCORE_PART_ONE = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137,
};

const SCORE_PART_TWO = {
  "(": 1,
  "[": 2,
  "{": 3,
  "<": 4,
};

function checkLine(line) {
  var openBrackets = [];
  var mismatches = [];
  line.forEach((char) => {
    if (OPEN.includes(char)) {
      openBrackets.push(char);
      return;
    }

    if (CLOSE.includes(char)) {
      var match = openBrackets.pop();
      var pair = `${match}${char}`;
      if (!VALID_PAIRS.includes(pair)) {
        mismatches.push(char);
      }
    }
  });
  return {
    mismatches,
    openBrackets,
  };
}

function solvePart1(data) {
  console.log("Solving Part 1");
  var data = parseData(data);

  data = data.map((line) => {
    return checkLine(line);
  });

  var score = data
    .filter((a) => a.mismatches.length > 0)
    .map((b) => b.mismatches)
    .reduce((a, c) => {
      return a + SCORE_PART_ONE[c];
    }, 0);
  console.log({ score });
  return;
}

function solvePart2(data) {
  console.log("Solving Part 2");
  var data = parseData(data);

  data = data.map((line) => {
    return checkLine(line);
  });
  data = data
    .filter((line) => {
      return line.mismatches.length == 0;
    })
    .map((l) => l.openBrackets);

  data = data.map((d) => {
    var reverse = d.reverse();
    return reverse.reduce((a, c) => {
      var score = a * 5;
      score = score + SCORE_PART_TWO[c];
      return score;
    }, 0);
  });

  data.sort((a, b) => a - b);
  const winningIndex = (data.length - 1) / 2;
  console.log(`Winner: ${data[winningIndex]}`);
}

function solve(data, partTwo) {
  if (!partTwo) {
    return solvePart1(data);
  } else {
    return solvePart2(data);
  }
}

module.exports = solve;
