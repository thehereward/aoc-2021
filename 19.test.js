const { EOL } = require("os");

const {
  split,
  parseData,
  subtract,
  equivalent,
  identical,
  equalMagnitude,
  getVectorMagnitude,
} = require("./19");

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

  test.each([
    [[2, 2, 2], [2, 2, 2], true],
    [[2, 2, 2], [1, 1, 1], false],
    [[3, -1, 0], [-3, 1, 0], false],
    [[3, -1, 0], [1, -3, 0], false],
    [[3, -1, 0], [3, 0, 1], false],
  ])("identical(%o, %o)", (a, b, expected) => {
    const result = identical(a, b);
    expect(result).toStrictEqual(expected);
  });

  test.each([
    [[2, 2, 2], [2, 2, 2], true],
    [[2, 2, 2], [1, 1, 1], false],
    [[3, -1, 0], [-3, 1, 0], true],
    [[3, -1, 0], [1, -3, 0], false],
    [[3, -1, 0], [3, 0, 1], false],
  ])("equalMagnitude(%o, %o)", (a, b, expected) => {
    const result = equalMagnitude(a, b);
    expect(result).toStrictEqual(expected);
  });

  test.each([
    [[1, 2, 3], [1, 2, 3], true],
    [[1, 2, 3], [1, 3, 2], true],
    [[1, 2, 3], [2, 1, 3], true],
    [[1, 2, 3], [2, 3, 1], true],
    [[1, 2, 3], [3, 1, 2], true],
    [[1, 2, 3], [3, 2, 1], true],
  ])("equivalent(%o, %o)", (a, b, expected) => {
    const result = equivalent(a, b);
    expect(result).toStrictEqual(expected);
  });
});

// xyz
// xzy
// yxz
// yzx
// zxy
// zyx

describe("parse data", () => {
  test.each([
    ["404,-588,-901", [404, -588, -901]],
    ["7,-33,-71", [7, -33, -71]],
  ])("split(%s)", (a, expected) => {
    const result = split(a);
    expect(result).toStrictEqual(expected);
  });

  test.each([
    [
      `--- scanner 0 ---
0,2
4,1
3,3
   
--- scanner 1 ---
-1,-1
-5,0
-2,1
`,
      [
        [
          [0, 2],
          [4, 1],
          [3, 3],
        ],
        [
          [-1, -1],
          [-5, 0],
          [-2, 1],
        ],
      ],
    ],
  ])("parses basic example", (input, expected) => {
    input = input.split(EOL);
    var result = parseData(input);
    expect(result).toStrictEqual(expected);
  });
});

/*
 x  y  z
-x -y -z
 x  y -z
-x -y  z
 x -y  z
-x  y -z
 x -y -z
-x  y  z

 x  z  y
-x -z -y
 x  z -y
-x -z  y
 x -z  y
-x  z -y
 x -z -y
-x  z  y

 y  x  z
-y -x -z
 y  x -z
-y -x  z
 y -x  z
-y  x -z
 y -x -z
-y  x  z

 y  z  x
-y -z -x
 y  z -x
-y -z  x
 y -z  x
-y  z -x
 y -z -x
-y  z  x

 z  x  y
-z -x -y
 z  x -y
-z -x  y
 z -x  y
-z  x -y
 z -x -y
-z  x  y

 z  y  x
-z -y -x
 z  y -x
-z -y  x
 z -y  x
-z  y -x
 z -y -x
-z  y  x

*/

const testDataTwoScanners = `
--- scanner 0 ---
404,-588,-901
528,-643,409
-838,591,734
390,-675,-793
-537,-823,-458
-485,-357,347
-345,-311,381
-661,-816,-575
-876,649,763
-618,-824,-621
553,345,-567
474,580,667
-447,-329,318
-584,868,-557
544,-627,-890
564,392,-477
455,729,728
-892,524,684
-689,845,-530
423,-701,434
7,-33,-71
630,319,-379
443,580,662
-789,900,-551
459,-707,401

--- scanner 1 ---
686,422,578
605,423,415
515,917,-361
-336,658,858
95,138,22
-476,619,847
-340,-569,-846
567,-361,727
-460,603,-452
669,-402,600
729,430,532
-500,-761,534
-322,571,750
-466,-666,-811
-429,-592,574
-355,545,-477
703,-491,-529
-328,-685,520
413,935,-424
-391,539,-444
586,-435,557
-364,-763,-893
807,-499,-711
755,-354,-619
553,889,-390`;
