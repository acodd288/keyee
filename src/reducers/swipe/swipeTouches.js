export function calculateWordProbability(word, touches, layout) {
  const distanceThreshold = 10;
  let simulatedPath = interpolatePath(simulatePath(word, layout), distanceThreshold);
  let empiricalPath = reduceEmpiricalPath(touches, distanceThreshold);
  return -1 * gadDistance(empiricalPath, simulatedPath);
}

export function distance(p1, p2) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

export function nextBestMatch(coordinate, simulatedPath, index) {
  let bestDistance = distance(simulatedPath[index], coordinate);
  let bestIndex = index;
  for (;index < simulatedPath.length; index ++) {
    let currentDistance = distance(simulatedPath[index], coordinate);
    if (currentDistance <= bestDistance) {
      bestDistance = currentDistance;
      bestIndex = index;
    }
    else {
      break;
    }
  }
  return {distance:bestDistance, index:bestIndex};
}

export function gadDistance(empiricalPath, simulatedPath) {
  let distances = [distance(empiricalPath[0], simulatedPath[0])];
  let j = 0;
  for (let i = 1; i < empiricalPath.length; i ++) {
    let match = nextBestMatch(empiricalPath[i], simulatedPath, j);
    j = match.index;
    distances.push(match.distance);
  }
  // for (let i = j + 1; i < simulatedPath.length; i ++) {
  //   distances.push(distance(empiricalPath[empiricalPath.length - 1], simulatedPath[i]));
  // }
  return Math.sqrt(distances.reduce((acc,val) => (acc+val*val), 0))/distances.length;
}

export function reduceEmpiricalPath(empiricalPath, distanceThreshold) {
  let last = empiricalPath[0];
  let reducedPath = [ last ];
  empiricalPath.forEach((coordinate) => {
    if (distance(last, coordinate) >= distanceThreshold) {
      reducedPath.push(coordinate);
      last = coordinate;
    }
  });
  return reducedPath;
}

export function simulatePath(word, layout) {
  let keyMap = layout.reduce((acc, val) => {
    acc[val.key] = val.center;
    return acc;
  }, {});
  return word.toUpperCase().split("").map(c => keyMap[c] || {x:0, y:0});
}

export function midpoint(p1,p2) {
  return {x:(p1.x + p2.x)/2, y:(p1.y + p2.y)/2};
}

export function interpolateLine(p1, p2, distanceThreshold) {
  if (distance(p1, p2) < distanceThreshold) {
    return [p1];
  }
  else {
    let mid = midpoint(p1,p2);
    return [...interpolateLine(p1, mid, distanceThreshold),
      ...interpolateLine(mid, p2, distanceThreshold)];
  }
}

export function interpolatePath(path, distanceThreshold) {
  let newPath = [];
  for (let i = 0; i < path.length - 1; i ++) {
    newPath.push(...interpolateLine(path[i],path[i+1], distanceThreshold));
  }
  newPath.push(path[path.length-1]);
  return newPath;
}

export function normalize(list) {
  let min = list.reduce((acc, val) => Math.min(acc,val), 0);
  list = list.map(val=>val-min);
  let sum = list.reduce((acc, val) => acc + val, 0);
  return list.map(val => val/sum);
}


export function arrayMultiply(list1, list2) {
  if (list1.length !== list2.length) {
    throw new Error("Lists must be the same length");
  }

  return list1.map((val, i) => val * list2[i]);
}

export function generateSuggestionsFromTouches(touches, layout, wordPriors) {
  let words = wordPriors.map(val => val.word);
  let priors = wordPriors.map(val => val.probability);
  priors = normalize(priors);
  let likelihood = words.map( val =>
    calculateWordProbability(val,touches, layout));
  likelihood = normalize(likelihood);
  let posterior = arrayMultiply(likelihood,priors);
  posterior = normalize(posterior);
  let wordPosterior = words.map((val, i) =>
    ({word:val, probability:posterior[i]}));
  //maximize posterior
  wordPosterior.sort((a,b)=> b.probability - a.probability);
  return wordPosterior.slice(0,3);
}
