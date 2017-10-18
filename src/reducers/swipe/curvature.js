import {
    distance
} from './swipeTouches'
const CURVATURE_THRESHOLD = 120/180*Math.PI;
const CURVATURE_SIZE = 5;

export function curvatureAngle(xs, ys, middle, curvatureSize) {
    // Calculate the angle formed between middle, and one point in either direction
    let si = Math.max(0, middle - curvatureSize);
    let sx = xs[si];
    let sy = ys[si];

    let ei = Math.min(xs.length - 1, middle + curvatureSize);
    let ex = xs[ei];
    let ey = ys[ei];

    if (sx === ex && sy === ey) {
        return true;
    }

    let mx = xs[middle];
    let my = ys[middle];

    let m1 = Math.sqrt((sx - mx) * (sx - mx) + (sy - my) * (sy - my));
    let m2 = Math.sqrt((ex - mx) * (ex - mx) + (ey - my) * (ey - my));

    let dot = (sx - mx) * (ex - mx) + (sy - my) * (ey - my);
    let angle = Math.abs(Math.acos(dot / m1 / m2));
    return angle;
}

export function curvature(xs, ys, middle, curvatureSize) {
    return curvatureAngle(xs,ys,middle,curvatureSize) <= CURVATURE_THRESHOLD;
}

export function cornersFromTouches(touches) {
  let {
      xs,
      ys
  } = toXsAndYs(touches);
  ({xs, ys}  = from1dTo2d(getPathCorners(xs, ys, CURVATURE_SIZE)));
  let points = xs.map((e, i) => ({x:e, y: ys[i]}));
  return points;
}

export function getPathCorners(xs, ys, curvatureSize) {
    let maxima = [];
    if (xs.length > 0) {
        maxima.push(xs[0]);
        maxima.push(ys[0]);
    }

    for (let i = 0; i < xs.length; i++) {
        if (curvature(xs, ys, i, curvatureSize)) {
            maxima.push(xs[i]);
            maxima.push(ys[i]);
        }
    }

    if (xs.length > 1) {
        maxima.push(xs[xs.length - 1]);
        maxima.push(ys[ys.length - 1]);
    }

    let arr = [];
    for (let i = 0; i < maxima.length; i++) {
        arr[i] = maxima[i];
    }
    return arr;
}

export function toXsAndYs(list) {
    let xs = list.map(e => e.x);
    let ys = list.map(e => e.y);
    return {
        xs,
        ys
    };
}

export function from1dTo2d(list) {
  return {
    xs: list.filter((e,i) => i%2 === 0),
    ys: list.filter((e,i) => i%2 === 1)
  }
}

export function generatePath(word, layout) {
    let keyMap = layout.reduce((acc, val) => {
        acc[val.key.toLowerCase()] = val.center;
        return acc;
    }, {});
    let path = word.toLowerCase().split("").map(c => keyMap[c] || {
        x: 0,
        y: 0
    });
    let {
        xs,
        ys
    } = toXsAndYs(path);
    return getPathCorners(xs, ys, 1);
}


export function findClosestLetter(point, layout) {
    let distances = layout.map((key) => ({
        key: key.key,
        distance: distance(point, key.center)
    }));
    distances.sort((a, b) => a.distance - b.distance);
    return distances[0].key;
}

export function getCandidates(touches, words, layout) {
    let {
        xs,
        ys
    } = toXsAndYs(touches);
    let corners = getPathCorners(xs, ys, CURVATURE_SIZE);

    let startChar = findClosestLetter({
        x: corners[0],
        y: corners[1]
    }, layout);

    let mWords = words.filter(e => e.word[0].toLowerCase() === startChar.toLowerCase())
      .map(e => e.word);
      console.log(mWords.length)
    let weights = mWords.map((e, i) => ({
      weight:getWordDistance(corners, generatePath(mWords[i], layout)),
      word:mWords[i]}));
    weights.sort((a,b) => a.weight - b.weight);

    return weights;
}

function dist(x1, y1, x2, y2) {
  return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
}

function getWordDistance(user, word) {
        if (word.length > user.length) return Number.MAX_VALUE;

        let distTotal = 0;
        let currentWordIndex = 0;

        for (let i=0; i<user.length/2; i++) {
            let ux = user[i*2];
            let uy = user[i*2 + 1];
            let d = dist(ux,uy, word[currentWordIndex*2],
                    word[currentWordIndex*2+1]);
            let d2 = dist(ux,uy, word[currentWordIndex*2 + 2],
                    word[currentWordIndex*2+3]);

            if (currentWordIndex+1 < word.length/2 && i>0 &&
                    d2 < d) {
                d = d2;
                currentWordIndex++;
            }

            distTotal += d;
        }

        while (currentWordIndex+1 < word.length/2) {
            currentWordIndex++;
            distTotal += 10*dist(user[user.length-2],user[user.length-1],
                    word[currentWordIndex*2], word[currentWordIndex*2+1]);
        }

        return distTotal;
    }
