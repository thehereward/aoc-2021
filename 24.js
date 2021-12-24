function runProgram(program, input) {
  var instructions = parseData(program);
  return runProgramInner(instructions, input);
}

function runProgramInner(instructions, input) {
  var state = { w: 0, x: 0, y: 0, z: 0 };
  return runProgramInnerWithState(instructions, input, state);
}

function runProgramInnerWithState(instructions, input, state) {
  var applyInstruction = initialiseMachine(input);
  instructions.forEach((instruction) => {
    state = applyInstruction(state, instruction);
  });
  return state;
}

function parseData(data) {
  return data.map((line) => parseInstruction(line));
}

function parseInstruction(instruction) {
  const re = /^(inp|add|mul|div|mod|eql) ([a-z]?) ?([a-z]?|\-?\d*)$/;
  const match = instruction.match(re);
  if (!match) {
    console.log(instruction);
    process.exit();
  }
  var var2 = match[3];
  var2 = isNaN(parseInt(var2)) ? var2 : parseInt(var2);

  return {
    cmd: match[1],
    var1: match[2],
    var2,
  };
}

function initialiseMachine(input = "") {
  input = input.split("").map((i) => parseInt(i, 10));

  function getInput() {
    var nextInput = input.shift();
    if (!nextInput) {
      throw new Exception("End of input reached");
    }
    return nextInput;
  }

  function applyInstruction(state, instruction) {
    var var1 = instruction.var1;
    var var2 = instruction.var2;
    if (typeof var2 == "string") {
      var2 = state[var2];
    }
    switch (instruction.cmd) {
      case "inp":
        state[var1] = getInput();
        break;
      case "add":
        state[var1] = state[var1] + var2;
        break;
      case "mul":
        state[var1] = state[var1] * var2;
        break;
      case "div":
        state[var1] = Math.floor(state[var1] / var2);
        break;
      case "mod":
        state[var1] = state[var1] % var2;
        break;
      case "eql":
        state[var1] = state[var1] == var2 ? 1 : 0;
        break;
    }

    return state;
  }
  return applyInstruction;
}

function getNextInput(previousInput) {
  var nextInput = --previousInput;
  var indexOf0 = nextInput.toString().indexOf("0");
  if (indexOf0 == -1) {
    return nextInput;
  }

  while (indexOf0 != -1) {
    var numberOfZeros = 13 - indexOf0;
    var number = 10 ** numberOfZeros;
    nextInput = nextInput - number;
    indexOf0 = nextInput.toString().indexOf("0");
  }

  return nextInput;
}

function isValid(state) {
  return state["z"] == 1;
}

function solvePart1(data) {
  console.log("Solving Part 1");
  var instructions = parseData(data);

  // var s = runProgramInner(instructions, "74929995999389");
  // console.log(s);
  // process.exit();

  // Linked
  // 0 and 9
  // 1 and 8
  // 2 and 5
  // 3 and 4
  // 6 and 7
  // 10 and 11
  // 12 and 13
  var t1111111 = "74929995999389";
  var rawInput = "14929995939389";
  rawInput = "11929995639389";
  rawInput = "11129195639389";
  rawInput = "11118195639389";
  rawInput = "11118151639389";
  rawInput = "11118151637189";
  rawInput = "11118151637112";
  // rawInput = "00000000000000";
  var indexA = 0;
  // var indexB = 3;
  // var inputIndexes = [[0, 9], 1, 2, 3, 6, 10, 12];

  const inputs2 = ["9", "8", "7", "6", "5", "4", "3", "2", "1"];

  // inputIndexes.forEach((indexA) => {
  var validInputs = [];
  for (var indexB = indexA + 1; indexB < rawInput.length; ++indexB) {
    inputs2.forEach((i) => {
      inputs2.forEach((i2) => {
        var _input =
          rawInput.slice(0, indexA) +
          i +
          rawInput.slice(indexA + 1, indexB) +
          i2 +
          rawInput.slice(indexB + 1);
        var state = runProgramInner(instructions, _input);
        // console.log({ i, i2, _input });
        if (state.z == 0) {
          // console.log({
          //   a: indexA,
          //   b: indexB,
          //   i: parseInt(_input),
          //   z: state.z,
          // });
          validInputs.push(_input);
        }
      });
    });
  }
  var min = Math.min(...validInputs);
  // rawInput = min;
  // });
  console.log(min);
  process.exit();

  var groupedInstructions = [];
  instructions.forEach((instruction) => {
    if (instruction.cmd == "inp") {
      groupedInstructions.push([]);
    }
    groupedInstructions[groupedInstructions.length - 1].push(instruction);
  });

  // groupedInstructions.forEach((i) => console.log(JSON.stringify(i)));
  // process.exit();

  var states = [{ w: 0, x: 0, y: 0, z: 0, inputs: [""] }];
  const inputs = ["9", "8", "7", "6", "5", "4", "3", "2", "1"];
  groupedInstructions.slice(0, 2).forEach((instructions) => {
    console.log(states.length);
    states = states
      .map((state) => {
        return inputs.map((input) => {
          var _state = Object.assign({}, state);
          // console.log({ _state });
          _state.inputs = _state.inputs.map((i) => i + input);
          var newState = runProgramInnerWithState(instructions, input, _state);
          return newState;
          // console.log({ input, newState });
        });
      })
      .flat();
  });
  console.log({ states });

  // console.log(states.length);

  process.exit();
  var input = 99999999999999;
  do {
    console.log(input);
    var state = runProgramInner(instructions, input.toString());
    var inputIsValid = isValid(state);
    input = getNextInput(input);
  } while (!inputIsValid);
  console.log({ state });
}

function solvePart2(data) {
  console.log("Solving Part 2");
  data = parseData(data);
  console.log({ data });
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
  parseInstruction,
  initialiseMachine,
  parseData,
  runProgram,
  getNextInput,
};
