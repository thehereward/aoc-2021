const { EOL } = require("os");

const { split, parseData, subtract, getVectorMagnitude } = require("./19");

describe("vectors", () => {
  test.each([
    [[5, 6, 7], 110],
    [[3, 2, 1], 14],
    [[2, 4, 6], 56],
    [[1, 1, 1], 3],
  ])("getVectorMagnitude(%o)", (a, expected) => {
    const result = getVectorMagnitude(a);
    expect(result).toStrictEqual(expected);
  });

  test.each([
    [
      [5, 6, 7],
      [3, 2, 1],
      [2, 4, 6],
    ],
  ])("subtraction(%o, %o)", (a, b, expected) => {
    const result = subtract(a, b);
    expect(result).toStrictEqual(expected);
  });
});

describe("parse data", () => {
  test.each([
    ["404,-588,-901", [404, -588, -901]],
    ["7,-33,-71", [7, -33, -71]],
  ])("split(%s)", (a, expected) => {
    const result = split(a);
    expect(result).toStrictEqual(expected);
  });
});
