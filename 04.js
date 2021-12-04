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

function transpose(a) {
  return a[0].map((_, c) => a.map((r) => r[c]));
}

function markRows(board, number) {
  return board.map((rows) => {
    return rows.map((col) => {
      return col == number ? "#" : col;
    });
  });
}

function markBoard(board, number) {
  return {
    rows: markRows(board.rows, number),
    cols: markRows(board.cols, number),
  };
}

function checkRows(rows) {
  return rows.some((row) => row.every((r) => r == "#"));
}

function checkBoard(board) {
  return checkRows(board.rows) || checkRows(board.cols);
}

function sumBoard(board) {
  var allRemaining = board.rows.flat();
  var filtered = allRemaining.filter((a) => a != "#").map((b) => parseInt(b));
  var sum = filtered.reduce((a, c) => a + c);
  return sum;
}

function solvePart1(data) {
  data = parseData(data);
  const numbersToDraw = data.numbersDrawn.split(",");
  console.log(`Numbers: ${numbersToDraw}`);
  var boards = data.boards;
  var someoneHasWon = false;
  var winningBoard = null;
  var number = null;

  while (!someoneHasWon) {
    number = numbersToDraw.shift();
    if (!number) {
      console.log("No winner");
      return;
    }
    boards = boards.map((b) => markBoard(b, number));
    boards.forEach((board) => {
      var winner = checkBoard(board);
      if (winner) {
        someoneHasWon = true;
        winningBoard = board;
      }
    });
  }

  const sum = sumBoard(winningBoard);
  console.log(sum);
  console.log(number);

  console.log(`Result: ${sum * number}`);
}

function solve(data, partTwo) {
  if (!partTwo) {
    return solvePart1(data);
  }
  console.log("Solving Part 2");
  data = parseData(data);
  const numbersToDraw = data.numbersDrawn.split(",");
  console.log(`Numbers: ${numbersToDraw}`);

  var boards = data.boards;
  var oneBoardLeft = false;
  var allBoardsHaveWon = false;
  var winningBoard = null;
  var number = null;

  while (!allBoardsHaveWon) {
    number = numbersToDraw.shift();
    if (!number) {
      console.log("No winner");
      return;
    }
    boards = boards.map((b) => markBoard(b, number));

    if (oneBoardLeft) {
      if (checkBoard(boards[0])) {
        winningBoard = boards[0];
        allBoardsHaveWon = true;
      }
    }
    boards = boards.filter((b) => !checkBoard(b));
    if (boards.length == 1) {
      oneBoardLeft = true;
    }
  }

  console.log(winningBoard);

  const sum = sumBoard(winningBoard);
  console.log(sum);
  console.log(number);

  console.log(`Result: ${sum * number}`);
}

module.exports = solve;
