const { EOL } = require("os");

const {
  rollDiracDie,
  formatDiracRoll,
  advancePlayerPosition,
  advancePlayerPositions,
} = require("./21");

describe("advance player", () => {
  test.each([
    [
      {
        position: 1,
        score: 5,
        universes: 1,
      },
      { 1: 1, 2: 2, 3: 1 },
      [
        {
          position: 2,
          score: 7,
          universes: 1,
        },
        {
          position: 3,
          score: 8,
          universes: 2,
        },
        {
          position: 4,
          score: 9,
          universes: 1,
        },
      ],
    ],
  ])("advances player", (a, b, expected) => {
    const result = advancePlayerPosition(a, b);
    expect(result).toStrictEqual(expected);
  });

  test.each([
    [
      [
        {
          position: 1,
          score: 5,
          universes: 1,
        },
        {
          position: 3,
          score: 5,
          universes: 1,
        }, // 4 9 | 5 10 | 6 11
      ],
      { 1: 1, 2: 1, 3: 1 },
      [
        {
          position: 2,
          score: 7,
          universes: 1,
        },
        {
          position: 3,
          score: 8,
          universes: 1,
        },
        {
          position: 4,
          score: 9,
          universes: 2,
        },
        {
          position: 5,
          score: 10,
          universes: 1,
        },
        {
          position: 6,
          score: 11,
          universes: 1,
        },
      ],
    ],
  ])("advances player", (a, b, expected) => {
    const result = advancePlayerPositions(a, b);
    expect(result).toStrictEqual(expected);
  });
});

describe("dirac die", () => {
  test.each([
    [1, [1, 2, 3]],
    [2, [2, 3, 3, 4, 4, 4, 5, 5, 6]],
    [
      3,
      [
        3, 4, 4, 4, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 8,
        8, 8, 9,
      ],
    ],
  ])("roll dirac die (%d)", (a, expected) => {
    const result = rollDiracDie(a);
    expect(result).toStrictEqual(expected);
  });

  test.each([
    [[1, 2, 3], { 1: 1, 2: 1, 3: 1 }],
    [[2, 3, 3, 4, 4, 4, 5, 5, 6], { 2: 1, 3: 2, 4: 3, 5: 2, 6: 1 }],
    [
      [
        3, 4, 4, 4, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 8,
        8, 8, 9,
      ],
      {
        3: 1,
        4: 3,
        5: 6,
        6: 7,
        7: 6,
        8: 3,
        9: 1,
      },
    ],
  ])("format dirac roll (%o)", (a, expected) => {
    const result = formatDiracRoll(a);
    expect(result).toStrictEqual(expected);
  });
});
