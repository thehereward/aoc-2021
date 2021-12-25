const { EOL } = require("os");
const { parseData, oneStep } = require("./25");

describe("it moves", () => {
  test("very simple example", () => {
    const input = `...>>>>>...`;
    const expected = `...>>>>.>..`;
    var data = input.split(EOL);
    data = parseData(data);
    data = oneStep(data);
    var expectedData = parseData(expected.split(EOL));
    expect(data).toStrictEqual(expectedData);
  });

  test("second very simple example", () => {
    const input = `...>>>>.>..`;
    const expected = `...>>>.>.>.`;
    var data = input.split(EOL);
    data = parseData(data);
    data = oneStep(data);
    var expectedData = parseData(expected.split(EOL));
    expect(data).toStrictEqual(expectedData);
  });

  test("third very simple example", () => {
    const input = `...>>>>.>.>`;
    const expected = `>..>>>.>.>.`;
    var data = input.split(EOL);
    data = parseData(data);
    data = oneStep(data);
    var expectedData = parseData(expected.split(EOL));
    expect(data).toStrictEqual(expectedData);
  });

  test("fourth very simple example", () => {
    const input = `...>>>>.>.>
v..........`;
    const expected = `>..>>>.>.>.
v..........`;
    var data = input.split(EOL);
    data = parseData(data);
    data = oneStep(data);
    var expectedData = parseData(expected.split(EOL));
    expect(data).toStrictEqual(expectedData);
  });

  test("fifth very simple example", () => {
    const input = `...>>>>.>..
v..........`;
    const expected = `v..>>>.>.>.
...........`;
    var data = input.split(EOL);
    data = parseData(data);
    data = oneStep(data);
    var expectedData = parseData(expected.split(EOL));
    expect(data).toStrictEqual(expectedData);
  });

  test("simple example", () => {
    const input = `..........
.>v....v..
.......>..
..........`;
    const expected = `..........
.>........
..v....v>.
..........`;
    var data = input.split(EOL);
    data = parseData(data);
    data = oneStep(data);
    var expectedData = parseData(expected.split(EOL));
    expect(data).toStrictEqual(expectedData);
  });
});
