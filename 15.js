function parseData(data) {
  return data.map((d) => d.split("").map((char) => parseInt(char)));
}

function setRisk(riskMap, data, risk, j, i) {
  const existingRisk = riskMap[j][i];
  const newRisk = risk + data[j][i];
  if (existingRisk == undefined) {
    riskMap[j][i] = newRisk;
  } else if (newRisk < existingRisk) {
    riskMap[j][i] = newRisk;
  }
}

function solvePart1(data) {
  console.log("Solving Part 1");
  data = parseData(data);

  var height = data.length;
  var width = data[0].length;
  console.log({ width, height });

  var riskMap = new Array(height);
  for (var i = 0; i < width; i = i + 1) {
    riskMap[i] = new Array(width).fill();
  }

  riskMap[0][0] = 0;

  for (var j = 0; j < height; j = j + 1) {
    for (var i = 0; i < width; i = i + 1) {
      const risk = riskMap[j][i];
      if (i > 0) {
        setRisk(riskMap, data, risk, j, i - 1);
      }
      if (i < width - 1) {
        setRisk(riskMap, data, risk, j, i + 1);
      }
      if (j > 0) {
        setRisk(riskMap, data, risk, j - 1, i);
      }
      if (j < height - 1) {
        setRisk(riskMap, data, risk, j + 1, i);
      }
    }
  }

  for (var j = 0; j < height; j = j + 1) {
    for (var i = 0; i < width; i = i + 1) {
      const risk = riskMap[j][i];
      if (i > 0) {
        setRisk(riskMap, data, risk, j, i - 1);
      }
      if (i < width - 1) {
        setRisk(riskMap, data, risk, j, i + 1);
      }
      if (j > 0) {
        setRisk(riskMap, data, risk, j - 1, i);
      }
      if (j < height - 1) {
        setRisk(riskMap, data, risk, j + 1, i);
      }
    }
  }

  for (var j = 0; j < height; j = j + 1) {
    for (var i = 0; i < width; i = i + 1) {
      const risk = riskMap[j][i];
      if (i > 0) {
        setRisk(riskMap, data, risk, j, i - 1);
      }
      if (i < width - 1) {
        setRisk(riskMap, data, risk, j, i + 1);
      }
      if (j > 0) {
        setRisk(riskMap, data, risk, j - 1, i);
      }
      if (j < height - 1) {
        setRisk(riskMap, data, risk, j + 1, i);
      }
    }
  }

  for (var j = 0; j < height; j = j + 1) {
    for (var i = 0; i < width; i = i + 1) {
      const risk = riskMap[j][i];
      if (i > 0) {
        setRisk(riskMap, data, risk, j, i - 1);
      }
      if (i < width - 1) {
        setRisk(riskMap, data, risk, j, i + 1);
      }
      if (j > 0) {
        setRisk(riskMap, data, risk, j - 1, i);
      }
      if (j < height - 1) {
        setRisk(riskMap, data, risk, j + 1, i);
      }
    }
  }

  const finalRisk = riskMap[height - 1][width - 1];
  console.log({ finalRisk });
}

function expandData(data) {
  var height = data.length * 5;
  var width = data[0].length * 5;
  var newData = new Array(height);
  for (var i = 0; i < width; i = i + 1) {
    newData[i] = new Array(width).fill();
  }

  for (var j = 0; j < data.length; j = j + 1) {
    for (var i = 0; i < data[0].length; i = i + 1) {
      for (var jx = 0; jx < 5; jx = jx + 1) {
        for (var ix = 0; ix < 5; ix = ix + 1) {
          var existingValue = data[j][i] + ix + jx;
          existingValue = existingValue > 9 ? existingValue - 9 : existingValue;
          newData[j + jx * data.length][i + ix * data[0].length] =
            existingValue;
        }
      }
    }
  }
  return newData;
}

function solvePart2(data) {
  console.log("Solving Part 2");
  data = parseData(data);
  data = expandData(data);
  // console.log(data[data.length - 1].join(""));
  // process.exit();
  var height = data.length;
  var width = data[0].length;
  console.log({ width, height });

  var riskMap = new Array(height);
  for (var i = 0; i < width; i = i + 1) {
    riskMap[i] = new Array(width).fill();
  }

  riskMap[0][0] = 0;

  for (var j = 0; j < height; j = j + 1) {
    for (var i = 0; i < width; i = i + 1) {
      const risk = riskMap[j][i];
      if (i > 0) {
        setRisk(riskMap, data, risk, j, i - 1);
      }
      if (i < width - 1) {
        setRisk(riskMap, data, risk, j, i + 1);
      }
      if (j > 0) {
        setRisk(riskMap, data, risk, j - 1, i);
      }
      if (j < height - 1) {
        setRisk(riskMap, data, risk, j + 1, i);
      }
    }
  }

  for (var j = 0; j < height; j = j + 1) {
    for (var i = 0; i < width; i = i + 1) {
      const risk = riskMap[j][i];
      if (i > 0) {
        setRisk(riskMap, data, risk, j, i - 1);
      }
      if (i < width - 1) {
        setRisk(riskMap, data, risk, j, i + 1);
      }
      if (j > 0) {
        setRisk(riskMap, data, risk, j - 1, i);
      }
      if (j < height - 1) {
        setRisk(riskMap, data, risk, j + 1, i);
      }
    }
  }

  for (var j = 0; j < height; j = j + 1) {
    for (var i = 0; i < width; i = i + 1) {
      const risk = riskMap[j][i];
      if (i > 0) {
        setRisk(riskMap, data, risk, j, i - 1);
      }
      if (i < width - 1) {
        setRisk(riskMap, data, risk, j, i + 1);
      }
      if (j > 0) {
        setRisk(riskMap, data, risk, j - 1, i);
      }
      if (j < height - 1) {
        setRisk(riskMap, data, risk, j + 1, i);
      }
    }
  }

  for (var j = 0; j < height; j = j + 1) {
    for (var i = 0; i < width; i = i + 1) {
      const risk = riskMap[j][i];
      if (i > 0) {
        setRisk(riskMap, data, risk, j, i - 1);
      }
      if (i < width - 1) {
        setRisk(riskMap, data, risk, j, i + 1);
      }
      if (j > 0) {
        setRisk(riskMap, data, risk, j - 1, i);
      }
      if (j < height - 1) {
        setRisk(riskMap, data, risk, j + 1, i);
      }
    }
  }

  for (var j = 0; j < height; j = j + 1) {
    for (var i = 0; i < width; i = i + 1) {
      const risk = riskMap[j][i];
      if (i > 0) {
        setRisk(riskMap, data, risk, j, i - 1);
      }
      if (i < width - 1) {
        setRisk(riskMap, data, risk, j, i + 1);
      }
      if (j > 0) {
        setRisk(riskMap, data, risk, j - 1, i);
      }
      if (j < height - 1) {
        setRisk(riskMap, data, risk, j + 1, i);
      }
    }
  }

  for (var j = 0; j < height; j = j + 1) {
    for (var i = 0; i < width; i = i + 1) {
      const risk = riskMap[j][i];
      if (i > 0) {
        setRisk(riskMap, data, risk, j, i - 1);
      }
      if (i < width - 1) {
        setRisk(riskMap, data, risk, j, i + 1);
      }
      if (j > 0) {
        setRisk(riskMap, data, risk, j - 1, i);
      }
      if (j < height - 1) {
        setRisk(riskMap, data, risk, j + 1, i);
      }
    }
  }

  for (var j = 0; j < height; j = j + 1) {
    for (var i = 0; i < width; i = i + 1) {
      const risk = riskMap[j][i];
      if (i > 0) {
        setRisk(riskMap, data, risk, j, i - 1);
      }
      if (i < width - 1) {
        setRisk(riskMap, data, risk, j, i + 1);
      }
      if (j > 0) {
        setRisk(riskMap, data, risk, j - 1, i);
      }
      if (j < height - 1) {
        setRisk(riskMap, data, risk, j + 1, i);
      }
    }
  }

  for (var j = 0; j < height; j = j + 1) {
    for (var i = 0; i < width; i = i + 1) {
      const risk = riskMap[j][i];
      if (i > 0) {
        setRisk(riskMap, data, risk, j, i - 1);
      }
      if (i < width - 1) {
        setRisk(riskMap, data, risk, j, i + 1);
      }
      if (j > 0) {
        setRisk(riskMap, data, risk, j - 1, i);
      }
      if (j < height - 1) {
        setRisk(riskMap, data, risk, j + 1, i);
      }
    }
  }

  for (var j = 0; j < height; j = j + 1) {
    for (var i = 0; i < width; i = i + 1) {
      const risk = riskMap[j][i];
      if (i > 0) {
        setRisk(riskMap, data, risk, j, i - 1);
      }
      if (i < width - 1) {
        setRisk(riskMap, data, risk, j, i + 1);
      }
      if (j > 0) {
        setRisk(riskMap, data, risk, j - 1, i);
      }
      if (j < height - 1) {
        setRisk(riskMap, data, risk, j + 1, i);
      }
    }
  }

  for (var j = 0; j < height; j = j + 1) {
    for (var i = 0; i < width; i = i + 1) {
      const risk = riskMap[j][i];
      if (i > 0) {
        setRisk(riskMap, data, risk, j, i - 1);
      }
      if (i < width - 1) {
        setRisk(riskMap, data, risk, j, i + 1);
      }
      if (j > 0) {
        setRisk(riskMap, data, risk, j - 1, i);
      }
      if (j < height - 1) {
        setRisk(riskMap, data, risk, j + 1, i);
      }
    }
  }

  for (var j = 0; j < height; j = j + 1) {
    for (var i = 0; i < width; i = i + 1) {
      const risk = riskMap[j][i];
      if (i > 0) {
        setRisk(riskMap, data, risk, j, i - 1);
      }
      if (i < width - 1) {
        setRisk(riskMap, data, risk, j, i + 1);
      }
      if (j > 0) {
        setRisk(riskMap, data, risk, j - 1, i);
      }
      if (j < height - 1) {
        setRisk(riskMap, data, risk, j + 1, i);
      }
    }
  }

  for (var j = 0; j < height; j = j + 1) {
    for (var i = 0; i < width; i = i + 1) {
      const risk = riskMap[j][i];
      if (i > 0) {
        setRisk(riskMap, data, risk, j, i - 1);
      }
      if (i < width - 1) {
        setRisk(riskMap, data, risk, j, i + 1);
      }
      if (j > 0) {
        setRisk(riskMap, data, risk, j - 1, i);
      }
      if (j < height - 1) {
        setRisk(riskMap, data, risk, j + 1, i);
      }
    }
  }

  for (var j = 0; j < height; j = j + 1) {
    for (var i = 0; i < width; i = i + 1) {
      const risk = riskMap[j][i];
      if (i > 0) {
        setRisk(riskMap, data, risk, j, i - 1);
      }
      if (i < width - 1) {
        setRisk(riskMap, data, risk, j, i + 1);
      }
      if (j > 0) {
        setRisk(riskMap, data, risk, j - 1, i);
      }
      if (j < height - 1) {
        setRisk(riskMap, data, risk, j + 1, i);
      }
    }
  }

  for (var j = 0; j < height; j = j + 1) {
    for (var i = 0; i < width; i = i + 1) {
      const risk = riskMap[j][i];
      if (i > 0) {
        setRisk(riskMap, data, risk, j, i - 1);
      }
      if (i < width - 1) {
        setRisk(riskMap, data, risk, j, i + 1);
      }
      if (j > 0) {
        setRisk(riskMap, data, risk, j - 1, i);
      }
      if (j < height - 1) {
        setRisk(riskMap, data, risk, j + 1, i);
      }
    }
  }

  for (var j = 0; j < height; j = j + 1) {
    for (var i = 0; i < width; i = i + 1) {
      const risk = riskMap[j][i];
      if (i > 0) {
        setRisk(riskMap, data, risk, j, i - 1);
      }
      if (i < width - 1) {
        setRisk(riskMap, data, risk, j, i + 1);
      }
      if (j > 0) {
        setRisk(riskMap, data, risk, j - 1, i);
      }
      if (j < height - 1) {
        setRisk(riskMap, data, risk, j + 1, i);
      }
    }
  }

  const finalRisk = riskMap[height - 1][width - 1];
  console.log({ finalRisk });
}

function solve(data, partTwo) {
  if (!partTwo) {
    return solvePart1(data);
    // 531 is incorrect
  } else {
    return solvePart2(data);
    // 2888 is too high
  }
}

module.exports = solve;
