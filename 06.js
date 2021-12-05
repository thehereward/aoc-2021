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

function solvePart1(data) {
  console.log("Solving Part 1");
}

function solvePart2(data) {
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
