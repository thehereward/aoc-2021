function parseData(data) {
  var newData = data[0].split(",");
  newData = newData.map((d) => parseInt(d));
  return newData.reduce((a, c) => {
    a[c] = a[c] ? a[c] + 1 : 1;
    return a;
  }, Array(9).fill(0));
}

function advanceFishPopulationOneDay(fish) {
  var numberNewFish = fish[0];
  fish[0] = fish[1];
  fish[1] = fish[2];
  fish[2] = fish[3];
  fish[3] = fish[4];
  fish[4] = fish[5];
  fish[5] = fish[6];
  fish[6] = fish[7] + numberNewFish;
  fish[7] = fish[8];
  fish[8] = numberNewFish;
  return fish;
}

function sumFishPopulation(fish) {
  return fish.reduce((a, c) => a + c);
}

function advanceXDays(fish, x) {
  for (var i = 0; i < x; i = i + 1) {
    fish = advanceFishPopulationOneDay(fish);
  }
  return fish;
}

function solvePart1(data) {
  console.log("Solving Part 1");
  var fish = parseData(data);
  fish = advanceXDays(fish, 80);
  console.log(`Count: ${sumFishPopulation(fish)}`);
}

function solvePart2(data) {
  console.log("Solving Part 2");
  var fish = parseData(data);
  fish = advanceXDays(fish, 256);
  console.log(`Count: ${sumFishPopulation(fish)}`);
}

function solve(data, partTwo) {
  if (!partTwo) {
    return solvePart1(data);
  } else {
    return solvePart2(data);
  }
}

module.exports = solve;
