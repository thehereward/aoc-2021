const solve01 = require("./01");
const solve02 = require("./02");
const solve03 = require("./03");
const solve04 = require("./04");
const solve05 = require("./05");
const solve06 = require("./06");
const solve07 = require("./07");
const solve08 = require("./08");
const solve09 = require("./09");
const solve10 = require("./10");
const solve11 = require("./11");
const solve12 = require("./12");
const solve13 = require("./13");
const solve14 = require("./14");
const solve15 = require("./15");
const solve16 = require("./16");
// const solve17 = require("./17");
// const solve18 = require("./18");
// const solve19 = require("./19");
// const solve20 = require("./20");
// const solve21 = require("./21");
// const solve22 = require("./22");
// const solve23 = require("./23");
// const solve24 = require("./24");
// const solve25 = require("./25");

function runDay(p, data, runSecondPart, timeRun) {
  const startTime = Date.now();
  switch (p) {
    case "01":
      solve01(data, runSecondPart);
      break;
    case "02":
      solve02(data, runSecondPart);
      break;
    case "03":
      solve03(data, runSecondPart);
      break;
    case "04":
      solve04(data, runSecondPart);
      break;
    case "05":
      solve05(data, runSecondPart);
      break;
    case "06":
      solve06(data, runSecondPart);
      break;
    case "07":
      solve07(data, runSecondPart);
      break;
    case "08":
      solve08(data, runSecondPart);
      break;
    case "09":
      solve09(data, runSecondPart);
      break;
    case "10":
      solve10(data, runSecondPart);
      break;
    case "11":
      solve11(data, runSecondPart);
      break;
    case "12":
      solve12(data, runSecondPart);
      break;
    case "13":
      solve13(data, runSecondPart);
      break;
    case "14":
      solve14(data, runSecondPart);
      break;
    case "15":
      solve15(data, runSecondPart);
      break;
    case "16":
      solve16(data, runSecondPart);
      break;
    // case "17":
    //   solve17(data, runSecondPart);
    //   break;
    // case "18":
    //   solve18(data, runSecondPart);
    //   break;
    // case "19":
    //   solve19(data, runSecondPart);
    //   break;
    // case "20":
    //   solve20(data, runSecondPart);
    //   break;
    // case "21":
    //   solve21(data, runSecondPart);
    //   break;
    // case "22":
    //   solve22(data, runSecondPart);
    //   break;
    // case "23":
    //   solve23(data, runSecondPart);
    //   break;
    // case "24":
    //   solve24(data, runSecondPart);
    //   break;
    // case "25":
    //   solve25(data, runSecondPart);
    //   break;
  }
  const endTime = Date.now();
  if (timeRun) {
    const duration = endTime - startTime;
    // console.log({ duration });
    console.log(`Elapsed time: ${duration.toString()}ms`);
  }
}

module.exports = runDay;
