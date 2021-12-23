const { parseData } = require("./23");

describe("parseData", () => {
  test("r", () => expect(1).toEqual(1));
});

describe("parseData", () => {
  test.each([
    [
      `
#############
#...........#
###B#C#B#D###
  #A#D#C#A#
  #########`,
      -1,
    ],
  ])("parses data", (a, expected) => {
    var result = parseData(a);
    expect(result).toEqual(expected);
  });
});
