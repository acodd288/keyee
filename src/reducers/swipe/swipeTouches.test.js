import {
  simulatePath,
  reduceEmpiricalPath,
  nextBestMatch,
  gadDistance,
  distance,
  interpolatePath,
  interpolateLine,
  calculateWordProbability,
  generateSuggestionsFromTouches
} from './swipeTouches';
import fs from 'fs'

describe('simulatePath', () => {
  it('works', () => {
    let layout = [{key:'A', center:{x:1, y:1}}, {key:'B', center:{x:2, y:2}}]
    let val = simulatePath('ab',layout);
    expect(val).toEqual([{x:1,y:1},{x:2, y:2}]);
  });
});

describe('calculateWordProbability', () => {
  it('works', () => {
    let layout = [{key:'A', center:{x:10, y:10}}, {key:'B', center:{x:20, y:20}}]
    let path = [{x:10, y:10},{x:20, y:20}];
    let val = calculateWordProbability('ab',path,layout);
    expect(val).toEqual(-0);
  });
});

describe('generateSuggestionsFromTouches', () => {
  let text = fs.readFileSync('/home/acodd/w/keyboard-app/src/reducers/swipe/testdata/import.state.json');
  let swipe = JSON.parse(text);
  it('recognizes ', () => {
    let val = calculateWordProbability('import',swipe.touches,swipe.keyboardLayout.keys);
    let val2 = calculateWordProbability('if',swipe.touches,swipe.keyboardLayout.keys);
    expect(val).toBeGreaterThan(val2);
  });
  xit('recognizes ', () => {
    let val = generateSuggestionsFromTouches(swipe.touches,swipe.keyboardLayout.keys,swipe.wordPriors);
    expect(val[0].word).toEqual('import');
    expect(val[0].probability).toBeGreaterThan(0.8);
  });
});

describe('reduceEmpiricalPath', () => {
  it('works', () => {
    let path = [{x:1, y:1},{x:2, y:2},{x:10, y:100}];
    let val = reduceEmpiricalPath(path,5);
    expect(val).toEqual([{x:1,y:1},{x:10, y:100}]);
  });
});

describe('nextBestMatch', () => {
  it('works', () => {
    let path = [{x:1, y:1},{x:2, y:2},{x:10, y:100}];
    let val = nextBestMatch({x:5,y:5}, path, 0);
    expect(val.index).toEqual(1);
  });
  it('non-zero index', () => {
    let path = [{x:1, y:1},{x:2, y:2},{x:10, y:100}];
    let val = nextBestMatch({x:5,y:5}, path, 2);
    expect(val.index).toEqual(2);
  });
  it('non-zero index', () => {
    let e = [{x:1, y:1},{x:4, y:4},{x:10, y:100}];
    let s = [{x:0, y:0},{x:6, y:6},{x:85, y:90}];
    let val = nextBestMatch(e[1], s, 0);
    expect(val.index).toEqual(1);
  });
  it('non-zero index', () => {
    let e = [{x:1, y:1},{x:4, y:4},{x:10, y:100}];
    let s = [{x:0, y:0},{x:6, y:6},{x:85, y:90}];
    let val = nextBestMatch(e[2], s, 1);
    expect(val.index).toEqual(2);
  });
});

describe('gadDistance', () => {
  it('works', () => {
    let e = [{x:1, y:1},{x:4, y:4},{x:10, y:100}];
    let s = [{x:0, y:0},{x:6, y:6},{x:85, y:90}];
    let val = gadDistance(e, s);
    let expected = Math.pow(distance(e[0],s[0]),2)
      + Math.pow(distance(e[1],s[1]),2)
      + Math.pow(distance(e[2],s[2]),2);
    expect(val).toEqual(Math.sqrt(expected)/3);
  });
});

describe('interpolatePath', () => {
  it('works', () => {
    let s = [{x:0, y:0},{x:10, y:10},{x:20, y:20}];
    let val = interpolatePath(s, 10);
    let expected = [{x:0, y:0},{x:5, y:5},{x:10, y:10},{x:15, y:15},{x:20, y:20}];
    expect(val).toEqual(expected);
  });
});

describe('interpolateLine', () => {
  it('works', () => {
    let s = [{x:0, y:0},{x:10, y:10},{x:20, y:20}];
    let val = interpolateLine(s[0], s[1], 10);
    let expected = [{x:0, y:0},{x:5, y:5}];
    expect(val).toEqual(expected);
  });
});
