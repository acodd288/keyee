import {angle, findInflections} from './inflection'
import {reduceEmpiricalPath} from './swipeTouches'
import fs from 'fs'

describe('angle', () => {
  it('works', () => {
    let points = [{x:0,y:0},{x:0,y:1},{x:1,y:1}];
    let val = angle(...points);
    expect(val).toEqual(90);
  });
});

describe('findInflections', () => {
  it('works', () => {
    let points = [{x:0,y:0},{x:0,y:1},{x:0,y:0}];
    let val = findInflections(points);
    expect(val).toEqual([{x:0,y:0},{x:0,y:1},{x:0,y:0}]);
  });
  it('empty input', () => {
    let points = [];
    let val = findInflections(points);
    expect(val).toEqual([]);
  });
  // it('real data', () => {
  //   let text = fs.readFileSync(__dirname + '/testdata/import.state.json');
  //   let swipe = JSON.parse(text);
  //   let val = findInflections(reduceEmpiricalPath(swipe.touches));
  //   expect(reduceEmpiricalPath(swipe.touches,5)).toEqual([]);
  // });
});
