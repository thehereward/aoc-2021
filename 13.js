function stringToPair(d) {
  return d.split(",").map((char) => parseInt(char));
}

function parseData(data) {
  var dots = [];
  var folds = [];
  data = data.forEach((d) => {
    if (d.includes(",")) {
      dots.push(d.split(",").map((char) => parseInt(char)));
      return;
    }

    if (d.includes("fold along ")) {
      var salient = d.replace("fold along ", "").split("=");
      folds.push({ axis: salient[0], value: parseInt(salient[1]) });
    }
  });
  return {
    dots,
    folds,
  };
}

function applyFold(dots, fold) {
  // console.log({ fold });
  dots = dots.map((dot) => {
    // console.log({ dot });
    if (fold.axis == "y") {
      if (dot[1] > fold.value) {
        var newValue = fold.value - (dot[1] - fold.value);
        return [dot[0], newValue];
      } else {
        return dot;
      }
    } else {
      if (dot[0] > fold.value) {
        var newValue = fold.value - (dot[0] - fold.value);
        return [newValue, dot[1]];
      } else {
        return dot;
      }
    }
  });

  dots = Array.from(new Set(dots.map((d) => `${d[0]},${d[1]}`))).map((d) =>
    stringToPair(d)
  );

  return dots;
}

function solvePart1(data) {
  console.log("Solving Part 1");
  var data = parseData(data);
  var dots = data.dots;
  console.log(dots.length);
  // console.log({ dots });
  var folds = data.folds;
  // console.log({ folds });
  var fold = folds.shift();
  // console.log({ fold });
  dots = applyFold(dots, fold);
  // fold = folds.shift();
  // dots = applyFold(dots, fold);
  console.log(dots.length);
}

function solvePart2(data) {
  console.log("Solving Part 2");
  var data = parseData(data);
  var dots = data.dots;
  var folds = data.folds;
  var fold = folds.shift();

  do {
    dots = applyFold(dots, fold);
    fold = folds.shift();
  } while (!!fold);
  print(dots);
}

function print(dots) {
  var maxY = dots.reduce((a, c) => {
    return a >= c[1] ? a : c[1];
  }, 0);

  var maxX = dots.reduce((a, c) => {
    return a >= c[0] ? a : c[0];
  }, 0);

  const xArray = new Array(maxX + 1).fill(".");

  var grid = new Array(maxY + 1);
  for (var i = 0; i < grid.length; i = i + 1) {
    grid[i] = [...xArray];
  }

  dots.forEach((dot) => {
    var x = dot[0];
    var y = dot[1];
    grid[y][x] = "#";
  });

  var result = [];
  for (var i = 0; i < grid.length; i = i + 1) {
    result.push(grid[i].join(""));
  }
  console.log({ result });
}

function solve(data, partTwo) {
  if (!partTwo) {
    return solvePart1(data);
    // 755 is wrong and for someone else
  } else {
    return solvePart2(data);
  }
}

module.exports = solve;
