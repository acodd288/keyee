import {
  curvature,
  curvatureAngle,
  getPathCorners,
  generatePath,
  toXsAndYs,
  from1dTo2d,
  getCandidates,
  findClosestLetter} from './curvature'
import fs from 'fs'

let text = fs.readFileSync(__dirname + '/testdata/import.state.json');
const swipe = JSON.parse(text);
const layout = swipe.keyboardLayout.keys;
let {xs, ys} = toXsAndYs(swipe.touches);

describe('curvature', () => {
  xit('works', () => {
    let val = xs.map((e,i)=>curvature(xs, ys, i, 5));
    expect(val).toEqual([]);
  });
});

describe('generatePath', () => {
});

function cornersToLetters(corners, layout) {
  let {xs, ys} = from1dTo2d(corners);
  return xs.map((x,i) => findClosestLetter({x, y:ys[i]}, layout));
}

describe('getPathCorners', () => {
  it('works', () => {
    console.log(layout.map)
    let path = generatePath('import', layout);
    let {xs, ys} = from1dTo2d(path);
    let corners = getPathCorners(xs, ys, 5);
    let letters = cornersToLetters(corners, layout);
    expect(letters.join("")).toEqual('IMPRT');
  });
  it('recognizes import', () => {
    let corners = getPathCorners(xs, ys, 5);
    let letters = cornersToLetters(corners, layout);
    letters = letters.filter((e,i) => e !== letters[i-1]);
    expect(letters.join("")).toEqual('IMPRT');
  });
  fit('recognizes import', () => {
    // let text = fs.readFileSync(__dirname + '/testdata/swipeTracks1.txt', 'utf8');
    let text = fs.readFileSync('/home/acodd/swipeTracks.txt', 'utf8');
    let lines = text.split("\n");
    let swipe = JSON.parse(lines[lines.length - 2]);
    let layout = swipe.keyboardLayout.keys;
    let {xs, ys} = toXsAndYs(swipe.touches);
    // console.log(layout);
    let cornersDetails = xs.map((e,i) => ({
      i,
      x:xs[i],
      y:ys[i],
      corner:curvature(xs, ys, i, 5),
      cornerAngle:curvatureAngle(xs, ys, i, 5),
      letter:findClosestLetter({x:xs[i], y:ys[i]}, layout)}));
    // console.log(cornersDetails);
    console.log(swipe.wordPriors)
    console.log(getCandidates(swipe.touches, swipe.wordPriors, layout));

    let corners = getPathCorners(xs, ys, 5);
    let letters = cornersToLetters(corners, layout);
    letters = letters.filter((e,i) => e !== letters[i-1]);
    console.log(letters.join(""));

    // let guesses = lines.map((e,i) => {
    //   try {
    //     let swipe = JSON.parse(e);
    //     let layout = swipe.keyboardLayout.keys;
    //     let {xs, ys} = toXsAndYs(swipe.touches);
    //     let corners = getPathCorners(xs, ys, 5);
    //     let letters = cornersToLetters(corners, layout);
    //     letters = letters.filter((e,i) => e !== letters[i-1]);
    //     return letters.join("");
    //   }
    //   catch (e) {return e}
    // });
    // console.log(guesses);
  });
});
