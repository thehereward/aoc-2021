const { EOL } = require("os");
const {
  parseData,
  parseInstruction,
  initialiseMachine,
  runProgram,
  getNextInput,
} = require("./24");

describe("getNextInput", () => {
  test.each([
    [99999999999999, 99999999999998],
    [99999999999991, 99999999999989],
    [99999999911111, 99999999899999],
    [99999999911121, 99999999911119],
    [99999991111111, 99999989999999],
    [99999911111111, 99999899999999],
    [91111111111111, 89999999999999],
  ])("getNextInput(%d)", (input, expected) => {
    const result = getNextInput(input);
    expect(result).toStrictEqual(expected);
  });
});

describe("test program2", () => {
  const prog1 = `inp w
mul x 0`.split(EOL);
  test.each([
    ["31", { w: 3, x: 0, y: 0, z: 0 }],
    ["13", { w: 1, x: 0, y: 0, z: 0 }],
  ])("runs for %o", (input, expected) => {
    const result = runProgram(prog1, input);
    expect(result).toStrictEqual(expected);
  });
});

describe("test program1", () => {
  const prog1 = `inp z
inp x
mul z 3
eql z x`.split(EOL);
  test.each([
    ["31", { w: 0, x: 1, y: 0, z: 0 }],
    ["13", { w: 0, x: 3, y: 0, z: 1 }],
  ])("runs for %o", (input, expected) => {
    const result = runProgram(prog1, input);
    expect(result).toStrictEqual(expected);
  });
});

describe("parseData", () => {
  test.each([
    [
      `inp x
mul x -1`,
      [
        { cmd: "inp", var1: "x", var2: "" },
        { cmd: "mul", var1: "x", var2: -1 },
      ],
    ],
  ])("parseData(%s)", (input, expected) => {
    input = input.split(EOL);
    const result = parseData(input);
    expect(result).toStrictEqual(expected);
  });

  test.each([
    ["inp a", { cmd: "inp", var1: "a", var2: "" }],
    ["add a b", { cmd: "add", var1: "a", var2: "b" }],
    ["add a -1", { cmd: "add", var1: "a", var2: -1 }],
    ["add a 14", { cmd: "add", var1: "a", var2: 14 }],
    ["mul a 14", { cmd: "mul", var1: "a", var2: 14 }],
    ["div a 14", { cmd: "div", var1: "a", var2: 14 }],
    ["mod a 14", { cmd: "mod", var1: "a", var2: 14 }],
    ["eql a 14", { cmd: "eql", var1: "a", var2: 14 }],
  ])("parseInstruction(%s)", (input, expected) => {
    const result = parseInstruction(input);
    expect(result).toStrictEqual(expected);
  });
});

describe("apply instruction", () => {
  test.each([
    [{ cmd: "inp", var1: "a" }, "1", { a: 1 }],
    [{ cmd: "inp", var1: "a" }, "2", { a: 2 }],
    [{ cmd: "inp", var1: "a" }, "32", { a: 3 }],
  ])("apply input instruction (%s)", (instruction, input, expected) => {
    var applyInstruction = initialiseMachine(input);
    const state = { a: 6 };
    const result = applyInstruction(state, instruction);
    expect(result).toStrictEqual(expected);
  });

  test.each([
    [
      [
        { cmd: "inp", var1: "a" },
        { cmd: "inp", var1: "b" },
      ],
      "32",
      { a: 3, b: 2 },
    ],
  ])("apply input instructions (%s)", (instructions, input, expected) => {
    var applyInstruction = initialiseMachine(input);
    var state = { a: 6 };
    instructions.forEach((instruction) => {
      state = applyInstruction(state, instruction);
    });
    expect(state).toStrictEqual(expected);
  });

  test.each([
    [{ cmd: "add", var1: "a", var2: 12 }, { a: 18 }],
    [{ cmd: "mul", var1: "a", var2: 12 }, { a: 72 }],
    [{ cmd: "div", var1: "a", var2: 3 }, { a: 2 }],
    [{ cmd: "div", var1: "a", var2: 5 }, { a: 1 }],
    [{ cmd: "mod", var1: "a", var2: 4 }, { a: 2 }],
    [{ cmd: "eql", var1: "a", var2: 12 }, { a: 0 }],
    [{ cmd: "eql", var1: "a", var2: 6 }, { a: 1 }],
  ])("apply instruction with numeric operand(%s)", (input, expected) => {
    const state = { a: 6 };
    var applyInstruction = initialiseMachine();
    const result = applyInstruction(state, input);
    expect(result).toStrictEqual(expected);
  });

  test.each([
    [
      { cmd: "add", var1: "a", var2: "b" },
      { a: 6, b: 12 },
      { a: 18, b: 12 },
    ],
    [
      { cmd: "mul", var1: "a", var2: "b" },
      { a: 6, b: 12 },
      { a: 72, b: 12 },
    ],
    [
      { cmd: "div", var1: "a", var2: "b" },
      { a: 6, b: 3 },
      { a: 2, b: 3 },
    ],
    [
      { cmd: "div", var1: "a", var2: "b" },
      { a: 6, b: 5 },
      { a: 1, b: 5 },
    ],
    [
      { cmd: "mod", var1: "a", var2: "b" },
      { a: 6, b: 4 },
      { a: 2, b: 4 },
    ],
    [
      { cmd: "eql", var1: "a", var2: "b" },
      { a: 6, b: 12 },
      { a: 0, b: 12 },
    ],
    [
      { cmd: "eql", var1: "a", var2: "b" },
      { a: 6, b: 6 },
      { a: 1, b: 6 },
    ],
  ])("apply instruction with numeric operand(%s)", (input, state, expected) => {
    var applyInstruction = initialiseMachine();
    const result = applyInstruction(state, input);
    expect(result).toStrictEqual(expected);
  });
});
