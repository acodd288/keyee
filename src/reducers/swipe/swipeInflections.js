import {findInflections} from './inflection'
import {distance, reduceEmpiricalPath} from './swipeTouches'

export function findClosestLetter(point, layout) {
  let distances = layout.map((key) => ({
    key: key.key,
    distance:distance(point, key.center)
  }));
  distances.sort((a,b) => a.distance - b.distance);
  return distances[0].key;
}

export function inflectionLetters(points, layout) {
  // points = reduceEmpiricalPath(points, 10);
  let inflections = findInflections(points);
  let letters = inflections.map(e => findClosestLetter(e, layout));
  return letters;
}
