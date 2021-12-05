function parseData(data) {
  const newData = data.map((d) => {
    return d.split(" -> ");
  });

  const pairs = newData.map((d) => {
    return {
      start: d[0]
        .split(",")
        .map((n) => parseInt(n))
        .reduce((a, c) => {
          return { x: a, y: c };
        }),
      end: d[1]
        .split(",")
        .map((n) => parseInt(n))
        .reduce((a, c) => {
          return { x: a, y: c };
        }),
    };
  });
  return pairs;
}

function addVectors(data, excludeDiagonals = true) {
  const vectors = data.map((pair) => {
    var x = pair.end.x - pair.start.x;
    var y = pair.end.y - pair.start.y;

    if (excludeDiagonals & (x != 0) && y != 0) {
      // A diagonal line
      return;
    }

    var mag = Math.max(Math.abs(x), Math.abs(y));

    return {
      ...pair,
      vector: {
        x: x / mag,
        y: y / mag,
      },
    };
  });
  return vectors.filter((x) => !!x);
}

function mapToGrid(data) {
  const grid = {};

  data.forEach((vector) => {
    var point = vector.start;

    while (point.x != vector.end.x || point.y != vector.end.y) {
      grid[`${point.x},${point.y}`] = grid[`${point.x},${point.y}`] + 1 || 1;
      point.x = point.x + vector.vector.x;
      point.y = point.y + vector.vector.y;
    }
    grid[`${point.x},${point.y}`] = grid[`${point.x},${point.y}`] + 1 || 1;
  });
  return grid;
}

function sumGrid(grid) {
  return Object.keys(grid).reduce((a, c) => {
    return grid[c] > 1 ? a + 1 : a;
  }, 0);
}

function solvePart1(data) {
  const linePairs = parseData(data);
  const vectors = addVectors(linePairs);
  const grid = mapToGrid(vectors);
  const sum = sumGrid(grid);

  console.log(sum);
  console.log("Solving Part 1");
}

function solvePart2(data) {
  const linePairs = parseData(data);
  const vectors = addVectors(linePairs, false);
  const grid = mapToGrid(vectors);
  const sum = sumGrid(grid);

  console.log(sum);
  console.log("Solving Part 2");
}

function solve(data, partTwo) {
  if (!partTwo) {
    return solvePart1(data);
  } else {
    return solvePart2(data);
  }
}

module.exports = solve;
