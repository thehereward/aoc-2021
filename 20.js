function parseData(data) {
  const algorithm = data.shift();
  data.shift();
  var image = data.map((line) => line.split(""));
  return { algorithm, image };
}

function initialise2DArray(width, height, contents) {
  var newArray = new Array(height);
  for (var i = 0; i < width; i = i + 1) {
    newArray[i] = new Array(width).fill(contents);
  }
  return newArray;
}

function getPixelValue(image, i, j, initialCharacter) {
  var row = image[j] || [];
  var value = row[i];
  if (!value) {
    value = initialCharacter;
  }
  return value;
}

function getPixels(image, i, j, initialCharacter) {
  var pixels = [];
  for (var m = j - 1; m <= j + 1; m = m + 1) {
    for (var l = i - 1; l <= i + 1; l = l + 1) {
      pixels.push(getPixelValue(image, l, m, initialCharacter));
    }
  }
  return pixels;
}

function getNewPixel(algorithm, pixels) {
  var pixelString = pixels.map((pixel) => (pixel == "." ? "0" : "1")).join("");
  var index = parseInt(pixelString, 2);
  return algorithm[index];
}

function logImage(image) {
  image.forEach((line) => {
    console.log(line.join(""));
  });
}

function countLitPixels(image) {
  var allPixels = image.flat().filter((pixel) => pixel == "#");
  return allPixels.length;
}

function getOutputImage(image, defaultCharacter) {
  const outputWidth = image[0].length + 2;
  const outputLength = image.length + 2;
  var output = initialise2DArray(outputWidth, outputLength, defaultCharacter);
  return output;
}

function getNewDefaultCharacter(algorithm, defaultCharacter) {
  return getNewPixel(algorithm, new Array(9).fill(defaultCharacter));
}

function enhanceImage(image, algorithm, defaultCharacter) {
  var output = getOutputImage(image, defaultCharacter);

  for (var i = -1; i <= image[0].length; i = i + 1) {
    for (var j = -1; j <= image.length; j = j + 1) {
      var pixels = getPixels(image, i, j, defaultCharacter);
      var newPixel = getNewPixel(algorithm, pixels);
      output[j + 1][i + 1] = newPixel;
    }
  }
  defaultCharacter = getNewDefaultCharacter(algorithm, defaultCharacter);
  return { image: output, defaultCharacter };
}

function runEnhancement(image, algorithm, times) {
  var defaultCharacter = ".";
  for (var i = 0; i < times; i = i + 1) {
    var { image, defaultCharacter } = enhanceImage(
      image,
      algorithm,
      defaultCharacter
    );
  }

  return image;
}

function solvePart1(data) {
  console.log("Solving Part 1");
  var { algorithm, image } = parseData(data);

  const output = runEnhancement(image, algorithm, 2);

  const count = countLitPixels(output);
  console.log({ count });
}

function solvePart2(data) {
  console.log("Solving Part 2");
  var { algorithm, image } = parseData(data);

  const output = runEnhancement(image, algorithm, 50);

  const count = countLitPixels(output);
  console.log({ count });
}

function solve(data, partTwo) {
  if (!partTwo) {
    return solvePart1(data);
    // 5405 is too high
  } else {
    return solvePart2(data);
    // 19949 is too high
  }
}

module.exports = {
  solve,
};
