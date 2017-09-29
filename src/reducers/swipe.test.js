import {swipe,
  pressKey,
  calculateWordProbability,
  generateSuggestions,
  normalize} from './swipe';
import {swipe_move} from '../actions/index';

it('handles empty list', () => {
  let val = pressKey([],swipe_move("A",1));
  expect(val).toEqual([{key:"A",start:1,end:1}]);
});

xit('handles default list', () => {
  let val = pressKey(undefined,swipe_move("A",1));
  expect(val).toEqual([{key:"A",start:1,end:1}]);
});

it('handles same letter', () => {
  let val = pressKey([{key:"A",start:1,end:1}],swipe_move("A",2));
  expect(val).toEqual([{key:"A",start:1,end:2}]);
});

it('handles different letter', () => {
  let val = pressKey([{key:"A",start:1,end:1}],swipe_move("B",2));
  expect(val).toEqual([{key:"A",start:1,end:1}, {key:"B",start:2,end:2}]);
});


it('handles multiple letters', () => {
  let init = [{key:"A",start:1,end:1}, {key:"B",start:2,end:2}];
  let val = pressKey(init,swipe_move("C",3));
  let end = [{key:"A",start:1,end:1}, {key:"B",start:2,end:2}, {key:"C",start:3,end:3}]
  expect(val).toEqual(end);
});

it('handles multiple letters with the same new letter', () => {
  let init = [{key:"A",start:1,end:1}, {key:"B",start:2,end:2}];
  let val = pressKey(init,swipe_move("B",3));
  let end = [{key:"A",start:1,end:1}, {key:"B",start:2,end:3}]
  expect(val).toEqual(end);
});



// swipe

it('handles default list', () => {
  let val = swipe(undefined,swipe_move("A",1));
  expect(val.keys).toEqual([{key:"A",start:1,end:1}]);
  expect(val.suggestions).toBeTruthy();
});


// calculateWordProbability

it('works', () => {
  let keys = [{key:"a",start:1,end:1}, {key:"b",start:2,end:2}];
  let val = calculateWordProbability(['a','b'],keys);
  expect(val).toBeGreaterThan(0);
});

it('handles missing word letters', () => {
  let keys = [{key:"a",start:1,end:1}, {key:"b",start:2,end:2}];
  let val = calculateWordProbability(['a','c','b'],keys);
  let val2 = calculateWordProbability(['a', 'b'],keys);
  expect(val).toBeLessThan(val2);
});

it('handles missing keys', () => {
  let keys = [{key:"a",start:1,end:1}, {key:"c",start:2,end:2}, {key:"b",start:2,end:2}];
  let val = calculateWordProbability(['a','b'],keys);
  let val2 = calculateWordProbability(['a','c','b'],keys);
  expect(val).toBeLessThan(val2);
});

it('recognizes for', () => {
  let val = calculateWordProbability("import".split(""),genKeys("fo"));;
  let val2 = calculateWordProbability("for".split(""),genKeys("fo"));
  expect(val).toBeLessThan(val2);
});

xit('handles real data', () => {
  let keys = [{key:"a",start:1,end:1}, {key:"c",start:2,end:2}, {key:"b",start:2,end:2}];
  let val = calculateWordProbability(['a','b'],keys);
  expect(val).toEqual(0);
});

// descending sort
it('handles real data', () => {
  expect([1,2,3].sort((a,b) => b-a)).toEqual([3,2,1]);
});

// normalize
it('handles real data', () => {
  expect(normalize([1,1])).toEqual([0.5,0.5]);
});

it('handles negative numbers data', () => {
  expect(normalize([-2,1])).toEqual([0,1]);
});

function genKeys(str) {
  return str.split("").map(e=>{return {key:e,start:2,end:2}})
}


// generateSuggestions
it('gives good suggestions for for', () => {
  let val = generateSuggestions(genKeys("fo"));
  expect(val[0].word).toBe("for");
});

it('gives good suggestions for import', () => {
  let val = generateSuggestions(genKeys("imp"));
  expect(val[0].word).toBe("import");
});

it('gives good suggestions for import 2', () => {
  let val = generateSuggestions(genKeys("ikmp"));
  expect(val[0].word).toBe("import");
});
