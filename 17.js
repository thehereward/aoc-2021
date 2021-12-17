function parseData(data) {
  data = data[0];
  const xRe = /x=(-?\d+)\.\.(-?\d+)/;
  const xMatch = data.match(xRe);

  const yRe = /y=(-?\d+)\.\.(-?\d+)/;
  const yMatch = data.match(yRe);

  return {
    x1: parseInt(xMatch[1]),
    x2: parseInt(xMatch[2]),
    y1: parseInt(yMatch[1]),
    y2: parseInt(yMatch[2]),
  };
}

function isInTargetY(data, position) {
  return position.y <= data.y2 && position.y >= data.y1;
}

function isInTargetX(data, position) {
  return position.x <= data.x2 && position.x >= data.x1;
}

function isInTarget(data, position) {
  return isInTargetX(data, position) && isInTargetY(data, position);
}

function hasOverShotY(data, position) {
  return position.y < data.y1;
}

function hasOverShotX(data, position) {
  return position.x > data.x2;
}

function testHasOverShot(data, position) {
  return hasOverShotX(data, position) || hasOverShotY(data, position);
}

function updateState(state) {
  var position = state.position;
  var velocity = state.velocity;

  position.y = position.y + velocity.y;
  position.x = position.x + velocity.x;

  velocity.y = velocity.y - 1;
  if (velocity.x > 0) {
    velocity.x = velocity.x - 1;
  } else if (velocity.x < 0) {
    velocity.x = velocity.x + 1;
  }

  return {
    position,
    velocity,
  };
}

function testVelocity(data, initialXVelocity, initialYVelocity) {
  var state = {
    position: {
      x: 0,
      y: 0,
    },
    velocity: {
      x: initialXVelocity,
      y: initialYVelocity,
    },
  };

  var hasOverShot = false;
  var wasInTarget = false;
  while (!hasOverShot && !wasInTarget) {
    // console.log({ state });
    state = updateState(state);
    wasInTarget = wasInTarget || isInTarget(data, state.position);
    hasOverShot = testHasOverShot(data, state.position);
  }

  return { wasInTarget };
}

function testYVelocity(data, initialYVelocity) {
  var state = {
    position: {
      x: 0,
      y: 0,
    },
    velocity: {
      x: 0,
      y: initialYVelocity,
    },
  };

  var maxHeight = 0;
  var hasOverShot = false;
  var wasInTarget = false;
  while (!hasOverShot && !wasInTarget) {
    // console.log({ state });
    state = updateState(state);
    maxHeight = state.position.y > maxHeight ? state.position.y : maxHeight;
    wasInTarget = wasInTarget || isInTargetY(data, state.position);
    hasOverShot = hasOverShotY(data, state.position);
  }

  return { maxHeight, wasInTarget };
}

function solvePart1(data) {
  console.log("Solving Part 1");
  data = parseData(data);
  console.log({ data });

  var maxHeights = [];
  for (var i = 0; i < Math.abs(data.y1); i = i + 1) {
    var { maxHeight } = testYVelocity(data, i);
    maxHeights[i] = maxHeight;
  }

  console.log({ velocity: i - 1 });
  console.log(maxHeights[i - 1]);
}

function solvePart2(data) {
  console.log("Solving Part 2");
  data = parseData(data);
  console.log({ data });

  const wasInY = [];
  for (var yVel = data.y1; yVel < Math.abs(data.y1); yVel = yVel + 1) {
    var { wasInTarget } = testYVelocity(data, yVel);
    if (wasInTarget) {
      wasInY.push(yVel);
    }
  }

  const wasInBoth = [];
  wasInY.forEach((y) => {
    for (var xVel = 0; xVel <= Math.abs(data.x2); xVel = xVel + 1) {
      var { wasInTarget } = testVelocity(data, xVel, y);
      if (wasInTarget) {
        wasInBoth.push({ x: xVel, y });
      }
    }
  });

  wasInBoth.sort((a, b) => a.x - b.x);
  console.log({ wasInY });
  console.log({ wasInBoth });
  console.log(wasInBoth.length);
}

function solve(data, partTwo) {
  if (!partTwo) {
    return solvePart1(data);
    // 253 is too low
  } else {
    return solvePart2(data);
  }
}

module.exports = solve;
