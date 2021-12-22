const { EOL } = require("os");

const {
  parseLine,
  shouldApplyRulePart1,
  applyRule,
  solvePart1,
  getOverlap,
  testOverlap,
  getRelevantRules,
  parseData,
  getRuleSize,
  splitCubes,
} = require("./22");

describe("parse line", () => {
  test.each([
    [
      "on x=-20..26,y=-36..17,z=-47..7",
      { action: "on", x: [-20, 26], y: [-36, 17], z: [-47, 7] },
    ],
    [
      "off x=-54112..-39298,y=-85059..-49293,z=-27449..7877",
      {
        action: "off",
        x: [-54112, -39298],
        y: [-85059, -49293],
        z: [-27449, 7877],
      },
    ],
  ])("parse line (%s)", (a, expected) => {
    const result = parseLine(a);
    expect(result).toStrictEqual(expected);
  });
});

describe("should apply rule", () => {
  test.each([
    [
      "when in range",
      { action: "on", x: [-20, 26], y: [-36, 17], z: [-47, 7] },
      true,
    ],
    [
      "when well out of range",
      {
        action: "off",
        x: [-54112, -39298],
        y: [-85059, -49293],
        z: [-27449, 7877],
      },
      false,
    ],
    [
      "when x is just out",
      {
        action: "on",
        x: [51, 52],
        y: [-4, +4],
        z: [-3, 3],
      },
      false,
    ],
    [
      "when y is just out",
      {
        action: "on",
        x: [-4, +4],
        y: [51, 52],
        z: [-3, 3],
      },
      false,
    ],
    [
      "when z is just out",
      {
        action: "on",
        x: [-3, 3],
        y: [-4, +4],
        z: [51, 52],
      },
      false,
    ],
  ])("should apply rule (%s)", (a, b, expected) => {
    const result = shouldApplyRulePart1(b);
    expect(result).toStrictEqual(expected);
  });
});

describe("apply rule to state", () => {
  test.each([
    [
      {},
      {
        action: "on",
        x: [10, 10],
        y: [10, 10],
        z: [10, 10],
      },
      { "10|10|10": true },
    ],
    [
      { "10|10|10": true },
      {
        action: "off",
        x: [10, 10],
        y: [10, 10],
        z: [10, 10],
      },
      {},
    ],
  ])("apply rule", (a, b, expected) => {
    const result = applyRule(a, b);
    expect(result).toStrictEqual(expected);
  });

  test.each([
    [
      {
        action: "on",
        x: [10, 12],
        y: [10, 12],
        z: [10, 12],
      },
      27,
    ],
  ])("apply rule", (a, expected) => {
    var result = applyRule({}, a);
    var result = Object.keys(result).length;
    expect(result).toStrictEqual(expected);
  });
});

describe("apply multiple rules", () => {
  function exampleToData(example) {
    return example.split(EOL).filter((line) => line.length != 0);
  }

  test("apply example", () => {
    const data = `
on x=10..12,y=10..12,z=10..12
on x=11..13,y=11..13,z=11..13
off x=9..11,y=9..11,z=9..11
on x=10..10,y=10..10,z=10..10
`;
    const expected = 39;

    const result = solvePart1(exampleToData(data));
    expect(result).toStrictEqual(expected);
  });

  test.skip.each([
    [
      `
on x=10..12,y=10..12,z=10..12
on x=11..13,y=11..13,z=11..13
`,
      [
        { action: "on", x: [10, 12], y: [10, 12], z: [10, 12] },
        { action: "off", x: [11, 12], y: [11, 12], z: [11, 12] },
        { action: "on", x: [11, 13], y: [11, 13], z: [11, 13] },
      ],
    ],
    [
      `
on x=10..12,y=10..12,z=10..12
on x=11..13,y=11..13,z=11..13
off x=9..11,y=9..11,z=9..11
`,
      [
        { action: "on", x: [10, 12], y: [10, 12], z: [10, 12] },
        { action: "off", x: [11, 12], y: [11, 12], z: [11, 12] },
        { action: "on", x: [11, 13], y: [11, 13], z: [11, 13] },
        { action: "off", x: [10, 11], y: [10, 11], z: [10, 11] },
      ],
    ],
    [
      `
on x=10..12,y=10..12,z=10..12
on x=11..13,y=11..13,z=11..13
off x=9..11,y=9..11,z=9..11
on x=10..10,y=10..10,z=10..10
`,
      [
        { action: "on", x: [10, 12], y: [10, 12], z: [10, 12] },
        { action: "off", x: [11, 12], y: [11, 12], z: [11, 12] },
        { action: "on", x: [11, 13], y: [11, 13], z: [11, 13] },
        { action: "off", x: [10, 11], y: [10, 11], z: [10, 11] },
        { action: "off", x: [11, 11], y: [11, 11], z: [11, 11] },
        { action: "off", x: [10, 10], y: [10, 10], z: [10, 10] },
        { action: "on", x: [10, 10], y: [10, 10], z: [10, 10] },
        { action: "on", x: [10, 10], y: [10, 10], z: [10, 10] },
      ],
    ],
  ])("get relevant rules ", (example, expected) => {
    var data = exampleToData(example);
    var rules = parseData(data);
    const result = getRelevantRules(rules);
    // console.log(result);
    expect(result).toStrictEqual(expected);
  });
});

describe("split cubes", () => {
  test.only.each([
    [
      { x: [0, 0], y: [0, 0], z: [0, 0] },
      { x: [0, 0], y: [0, 0], z: [0, 0] },
      1,
    ],
    [
      { x: [0, 1], y: [0, 0], z: [0, 0] },
      { x: [0, 0], y: [0, 0], z: [0, 0] },
      2,
    ],
    [
      { x: [-1, 0], y: [0, 0], z: [0, 0] },
      { x: [0, 0], y: [0, 0], z: [0, 0] },
      2,
    ],
    [
      { x: [-1, 1], y: [0, 0], z: [0, 0] },
      { x: [0, 0], y: [0, 0], z: [0, 0] },
      3,
    ],
    [
      { x: [0, 0], y: [0, 1], z: [0, 0] },
      { x: [0, 0], y: [0, 0], z: [0, 0] },
      2,
    ],
    [
      { x: [0, 0], y: [-1, 0], z: [0, 0] },
      { x: [0, 0], y: [0, 0], z: [0, 0] },
      2,
    ],
    [
      { x: [0, 0], y: [-1, 1], z: [0, 0] },
      { x: [0, 0], y: [0, 0], z: [0, 0] },
      3,
    ],
    [
      { x: [-1, 1], y: [-1, 1], z: [0, 0] },
      { x: [0, 0], y: [0, 0], z: [0, 0] },
      9,
    ],
    [
      { x: [-1, 1], y: [0, 0], z: [-1, 1] },
      { x: [0, 0], y: [0, 0], z: [0, 0] },
      9,
    ],
    // Bring this back!
    // [
    //   { x: [-1, 0], y: [-1, 0], z: [-1, 0] },
    //   { x: [0, 1], y: [0, 1], z: [0, 1] },
    //   15,
    // ],
  ])("splits cubes", (a, b, expected) => {
    var result = splitCubes(a, b);
    expect(result.length).toStrictEqual(expected);
  });
});

describe("gets overlap of ranges", () => {
  test.each([
    [
      {
        action: "on",
        x: [10, 12],
        y: [10, 12],
        z: [10, 12],
      },
      {
        action: "on",
        x: [10, 12],
        y: [10, 12],
        z: [10, 12],
      },
      true,
    ],
    [
      {
        action: "on",
        x: [10, 12],
        y: [10, 12],
        z: [10, 12],
      },
      {
        action: "on",
        x: [12, 14],
        y: [12, 14],
        z: [12, 14],
      },
      true,
    ],
    [
      {
        action: "on",
        x: [10, 12],
        y: [10, 12],
        z: [10, 12],
      },
      {
        action: "on",
        x: [13, 14],
        y: [13, 14],
        z: [13, 14],
      },
      false,
    ],
  ])("overlap (%o, %o)", (a, b, expected) => {
    const result = testOverlap(a, b);
    expect(result).toStrictEqual(expected);
  });

  test.each([
    [
      {
        action: "on",
        x: [10, 12],
        y: [10, 12],
        z: [10, 12],
      },
      {
        action: "on",
        x: [10, 12],
        y: [10, 12],
        z: [10, 12],
      },
      {
        action: "off",
        x: [10, 12],
        y: [10, 12],
        z: [10, 12],
      },
    ],
    [
      {
        action: "off",
        x: [10, 12],
        y: [10, 12],
        z: [10, 12],
      },
      {
        action: "on",
        x: [10, 12],
        y: [10, 12],
        z: [10, 12],
      },
      {
        action: "on",
        x: [10, 12],
        y: [10, 12],
        z: [10, 12],
      },
    ],
    [
      {
        action: "on",
        x: [10, 12],
        y: [10, 12],
        z: [10, 12],
      },
      {
        action: "off",
        x: [12, 14],
        y: [12, 14],
        z: [12, 14],
      },
      {
        action: "off",
        x: [12, 12],
        y: [12, 12],
        z: [12, 12],
      },
    ],
  ])("overlap (%o, %o)", (a, b, expected) => {
    const result = getOverlap(a, b);
    expect(result).toStrictEqual(expected);
  });
});

describe("get rule size", () => {
  test.each([
    [
      {
        action: "off",
        x: [12, 12],
        y: [12, 12],
        z: [12, 12],
      },
      1,
    ],
    [
      {
        action: "off",
        x: [-2, 2],
        y: [0, 1],
        z: [-10, -8],
      },
      30,
    ],
  ])("get size for (%o)", (a, expected) => {
    const size = getRuleSize(a);
    expect(size).toStrictEqual(expected);
  });
});
