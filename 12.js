const { options } = require("yargs");

function parseData(data) {
  data = data.map((d) => d.split("-"));
  var options = {};
  data.map((d) => {
    var from = d[0];
    var to = d[1];

    if (!options[from]) {
      options[from] = [];
    }
    options[from].push(to);

    if (!options[to]) {
      options[to] = [];
    }
    options[to].push(from);
  });
  return options;
}

function isSmallCave(d) {
  var chars = d.split("");
  // console.log({ chars });
  return chars.reduce(
    (a, c) => a || "abcdefghijklmnopqrstuvwxyz".includes(c),
    false
  );
}

function isBigCave(d) {
  return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(d);
}

function removeUnreachableCaves(options) {
  Object.keys(options).forEach((key) => {
    var value = options[key];

    // console.log({ key });
    // console.log({ value });
    if (isSmallCave(key)) {
      if (value.length == 1) {
        if (isSmallCave(value[0])) {
          delete options[key];
        }
      }
    }
  });
  return options;
}

var count = 0;
function exploreRoutes(caveLinks, routes) {
  // count = count + 1;
  // if (count > 5) {
  //   process.exit();
  // }
  // console.log({ routes });
  var routesGrew = false;
  var newRoutes = [];
  routes.forEach((route) => {
    var last = route[route.length - 1];
    if (last == "end") {
      newRoutes.push(route);
      return;
    }
    var options = caveLinks[last];
    if (last == "dc") {
      console.log({ options });
    }
    options.forEach((option) => {
      if (option == "start") {
        return;
      }
      if (option == "end") {
        routesGrew = true;
        newRoutes.push([...route, option]);
        return;
      }
      if (isSmallCave(option) && route.includes(option)) {
        // console.log(`Is Small: ${option}`);
        return;
      } else {
        routesGrew = true;
        newRoutes.push([...route, option]);
      }
    });
  });
  routes = newRoutes;
  if (routesGrew) {
    return exploreRoutes(caveLinks, routes);
  } else {
    return routes;
  }
}

function exploreRoutes2(caveLinks, routes) {
  var routesGrew = false;
  var newRoutes = [];
  routes.forEach((routeObject) => {
    var route = routeObject.route;
    var last = route[route.length - 1];
    if (last == "end") {
      newRoutes.push({ route, hasRevisited: routeObject.hasRevisited });
      return;
    }
    var options = caveLinks[last];
    options.forEach((option) => {
      if (option == "start") {
        return;
      }
      if (option == "end") {
        routesGrew = true;
        newRoutes.push({
          route: [...route, option],
          hasRevisited: routeObject.hasRevisited,
        });
        return;
      }
      if (isSmallCave(option) && route.includes(option)) {
        if (routeObject.hasRevisited) {
          return;
        } else {
          routesGrew = true;
          newRoutes.push({
            route: [...route, option],
            hasRevisited: true,
          });
        }
      } else {
        routesGrew = true;
        newRoutes.push({
          route: [...route, option],
          hasRevisited: routeObject.hasRevisited,
        });
      }
    });
  });
  routes = newRoutes;
  if (routesGrew) {
    return exploreRoutes2(caveLinks, routes);
  } else {
    return routes;
  }
}

function solvePart1(data) {
  console.log("Solving Part 1");
  var caveLinks = parseData(data);
  var routes = [["start"]];
  routes = exploreRoutes(caveLinks, routes);
  console.log(routes.length);
}

function solvePart2(data) {
  console.log("Solving Part 2");
  var caveLinks = parseData(data);
  var routes = [
    {
      hasRevisited: false,
      route: ["start"],
    },
  ];
  routes = exploreRoutes2(caveLinks, routes);
  console.log(routes.length);
}

function solve(data, partTwo) {
  if (!partTwo) {
    return solvePart1(data);
  } else {
    return solvePart2(data);
  }
}

module.exports = solve;
