import {inflectionLetters} from './swipeInflections'
import fs from 'fs'

describe('inflectionLetters', () => {
  let text = fs.readFileSync(__dirname + '/testdata/import.state.json');
  let swipe = JSON.parse(text);
  xit('works', () => {
    let {touches, keyboardLayout} = swipe;
    let val = inflectionLetters(touches, keyboardLayout.keys);
    expect(val).toEqual('IMPRT'.split(""));
  });
});
