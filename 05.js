function parseData(data) {
  const numbersDrawn = data.shift();

  var boards = [];
  var boardIndex = -1;
  data.forEach((row) => {
    if (row.length == 0) {
      boards.push([]);
      boardIndex = boardIndex + 1;
    } else {
      const regex = /\s+/;
      boards[boardIndex].push(row.trim().split(regex));
    }
  });

  boards = boards.map((board) => {
    return {
      rows: board,
      cols: transpose(board),
    };
  });

  return { numbersDrawn, boards };
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
