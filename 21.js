function parseData(data) {
  // Actual
  //   Player 1 starting position: 8
  //   Player 2 starting position: 5

  // Test
  return [4 - 1, 8 - 1];

  // Actual
  return [8 - 1, 5 - 1];
}

var value = 0;
var numberOfRolls = 0;
function getDeterministicDie() {
  function rollDie() {
    value = value + 1;
    numberOfRolls = numberOfRolls + 1;
    return value;
  }
  return rollDie;
}

function solvePart1(data) {
  console.log("Solving Part 1");
  var positions = parseData(data);
  var rollDie = getDeterministicDie();
  var scores = [0, 0];
  var currentPlayer = 0;

  while (Math.max(...scores) < 1000) {
    var move = rollDie() + rollDie() + rollDie();
    var newPosition = (positions[currentPlayer] + move) % 10;
    positions[currentPlayer] = newPosition;
    scores[currentPlayer] = scores[currentPlayer] + newPosition + 1;
    currentPlayer = currentPlayer == 1 ? 0 : 1;
  }

  var minScore = Math.min(...scores);
  console.log({ numberOfRolls, minScore });
  var result = numberOfRolls * minScore;
  console.log({ result });
}

function rollDiracDie(times) {
  const baseRoll = [1, 2, 3];
  var finalRoll = [...baseRoll];
  for (var t = 1; t < times; t = t + 1) {
    finalRoll = baseRoll
      .map((r) => {
        return finalRoll.map((fr) => fr + r);
      })
      .flat()
      .sort();
  }
  return finalRoll;
}

function formatDiracRoll(roll) {
  var result = {};
  roll.forEach((r) => {
    var count = result[r] || 0;
    result[r] = count + 1;
  });
  return result;
}

function advancePlayerPosition(oldPosition, newRolls) {
  var newPositions = [];
  Object.keys(newRolls).forEach((key) => {
    var position = ((oldPosition.position - 1 + parseInt(key)) % 10) + 1;
    var score = oldPosition.score + position;
    var universes = oldPosition.universes * newRolls[key];
    newPositions.push({
      position,
      score,
      universes,
    });
  });
  return newPositions;
}

function advancePlayerPositions(oldPositions, newRolls) {
  var newPositions = oldPositions
    .map((position) => advancePlayerPosition(position, newRolls))
    .flat();

  var pos = {};
  var setP = new Set();
  newPositions.forEach((p) => {
    var numberOfUniverses = p.universes;
    delete p.universes;
    var key = JSON.stringify(p);
    var oldNumber = pos[key] || 0;
    pos[key] = oldNumber + numberOfUniverses;
    setP.add(key);
  });
  newPositions = Array.from(setP).map((p) => {
    return {
      ...JSON.parse(p),
      universes: pos[p],
    };
  });
  return newPositions;
}

function solvePart2(data) {
  console.log("Solving Part 2");
  var positions = parseData(data);
  var scores = [
    [
      {
        position: positions[0],
        score: 0,
        universes: 1,
      },
    ],
    [
      {
        position: positions[1],
        score: 0,
        universes: 1,
      },
    ],
  ];
  var currentPlayer = 0;

  while (maxScore < 21) {
    var roll = rollDiracDie(3);
    var currentPositions = scores[currentPlayer];
    var newPositions = advancePlayerPositions(currentPositions, roll);
    scores[currentPlayer] = newPositions;
    currentPlayer = currentPlayer == 1 ? 0 : 1;
    console.log({ maxScore });
  }

  var minScore = Math.min(...scores);
  console.log({ numberOfRolls, minScore });
  var result = numberOfRolls * minScore;
  console.log({ result });
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
  rollDiracDie,
  formatDiracRoll,
  advancePlayerPosition,
  advancePlayerPositions,
};
