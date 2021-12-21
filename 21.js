function parseData(data) {
  // Test
  // return [4 - 1, 8 - 1];

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

var totalWins = [0, 0];

function solvePart2(data) {
  console.log("Solving Part 2");
  var positions = parseData(data);
  var gameStates = {};

  var gameState = [0, positions[0], 0, positions[1], 0];
  var gameKey = JSON.stringify(gameState);
  gameStates[gameKey] = {
    state: gameState,
    count: 1,
  };

  var keys = Object.keys(gameStates);
  while (keys.length > 0) {
    keys.forEach((key) => {
      var state = gameStates[key];
      var currentPlayer = state.state[0];
      var currentPlayerIndex = currentPlayer * 2 + 1;
      var currentPosition = state.state[currentPlayerIndex + 0];
      var currentScore = state.state[currentPlayerIndex + 1];
      var currentCount = state.count;

      var rolls = rollDiracDie(3);

      var newStates = rolls.map((roll) => {
        var newPosition = (roll + currentPosition) % 10;
        var newState = [...state.state];
        newState[0] = currentPlayer == 0 ? 1 : 0;
        newState[currentPlayerIndex + 0] = newPosition;
        newState[currentPlayerIndex + 1] = currentScore + newPosition + 1;
        return newState;
      });

      var winningStates = newStates.filter(
        (state) => state[currentPlayerIndex + 1] >= 21
      );

      totalWins[currentPlayer] =
        totalWins[currentPlayer] + winningStates.length * currentCount;

      newStates = newStates.filter(
        (state) => state[currentPlayerIndex + 1] < 21
      );

      var reducedNewStates = newStates.reduce((a, c) => {
        var k = JSON.stringify(c);
        a[k] = !a[k]
          ? { state: c, count: 1 }
          : { ...a[k], count: a[k].count + 1 };
        return a;
      }, {});

      var newStateKeys = Object.keys(reducedNewStates);
      newStateKeys.forEach((key) => {
        var existingState = gameStates[key] || { count: 0 };
        var newState = {
          ...reducedNewStates[key],
          count:
            existingState.count + reducedNewStates[key].count * currentCount,
        };
        gameStates[key] = newState;
      });
      delete gameStates[key];
    });
    keys = Object.keys(gameStates);
  }
  console.log({ totalWins });
  console.log(Math.max(...totalWins));
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
