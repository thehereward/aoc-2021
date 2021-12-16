function parseData(data) {
  data = data[0].split("");
  data = data.map((char) => parseInt(char, 16));
  data = data.map((char) => char.toString(2).padStart(4, "0")).join("");
  return data;
}

function parseOperator(data) {
  var lengthType = parseInt(data.slice(0, 1), 2);
  data = data.slice(1);

  var numberOfBits = lengthType == 1 ? 11 : 15;
  var subPacketLength = parseInt(data.slice(0, numberOfBits), 2);
  data = data.slice(numberOfBits);

  var subPackets = [];

  if (lengthType == 1) {
    for (var i = 0; i < subPacketLength; i = i + 1) {
      var result = parsePacket(data);
      subPackets.push(result.packet);
      data = result.data;
    }
  } else {
    var subData = data.slice(0, subPacketLength);
    data = data.slice(subPacketLength);

    do {
      var result = parsePacket(subData);
      subPackets.push(result.packet);
      subData = result.data;
    } while (subData.length != 0);
  }

  return { data, subPackets };
}

function parseLiteral(data) {
  var number = [];
  do {
    var bitIndicator = data.slice(0, 1);
    var nextNumber = data.slice(1, 5);
    number.push(nextNumber);
    data = data.slice(5);
  } while (bitIndicator == "1");
  number = parseInt(number.join(""), 2);
  return { number, data };
}

function parsePacket(data) {
  var version = parseInt(data.slice(0, 3), 2);
  data = data.slice(3);
  var typeId = parseInt(data.slice(0, 3), 2);
  data = data.slice(3);

  var type = "";
  if (typeId == 4) {
    var litResult = parseLiteral(data);
    var number = litResult.number;
    data = litResult.data;
    type = "lit";
  } else {
    var opResult = parseOperator(data);
    var subPackets = opResult.subPackets;
    data = opResult.data;
    type = "op";
  }

  var packet = {
    version,
    typeId,
    type,
    number,
    subPackets,
  };

  return { packet, data };
}

function addVersions(packet, sum) {
  if (packet.subPackets == undefined) {
    return packet.version + sum;
  } else {
    var subPacketVersions = packet.subPackets.map((subPacket) => {
      return addVersions(subPacket, 0);
    });
    var sumOfSubPackets = subPacketVersions.reduce((a, c) => a + c);
    return sumOfSubPackets + sum + packet.version;
  }
}

function evaluatePacket(packet) {
  switch (packet.typeId) {
    case 0:
      return packet.subPackets.reduce((a, c) => a + evaluatePacket(c), 0);
    case 1:
      return packet.subPackets.reduce((a, c) => a * evaluatePacket(c), 1);
    case 2:
      return packet.subPackets.reduce((a, c) => {
        var value = evaluatePacket(c);
        return value < a ? value : a;
      }, Number.MAX_SAFE_INTEGER);
    case 3:
      return packet.subPackets.reduce((a, c) => {
        var value = evaluatePacket(c);
        return value > a ? value : a;
      }, 0);
    case 4:
      return packet.number;
      break;
    case 5:
      var packetA = packet.subPackets[0];
      var packetB = packet.subPackets[1];
      return evaluatePacket(packetA) > evaluatePacket(packetB) ? 1 : 0;
      break;
    case 6:
      var packetA = packet.subPackets[0];
      var packetB = packet.subPackets[1];
      return evaluatePacket(packetA) < evaluatePacket(packetB) ? 1 : 0;
      break;
    case 7:
      var packetA = packet.subPackets[0];
      var packetB = packet.subPackets[1];
      return evaluatePacket(packetA) == evaluatePacket(packetB) ? 1 : 0;
      break;
  }
}

function solvePart1(data) {
  console.log("Solving Part 1");
  data = parseData(data);
  var topPacket = parsePacket(data);
  var versionSum = addVersions(topPacket.packet, 0);
  console.log({ versionSum });
}

function solvePart2(data) {
  console.log("Solving Part 2");
  data = parseData(data);
  var topPacket = parsePacket(data);
  var packetValue = evaluatePacket(topPacket.packet);
  console.log({ versionSum: packetValue });
}

function solve(data, partTwo) {
  if (!partTwo) {
    return solvePart1(data);
  } else {
    return solvePart2(data);
  }
}

module.exports = solve;
