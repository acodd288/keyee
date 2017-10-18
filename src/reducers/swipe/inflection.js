function vec(p1, p2) {
  return {
    x:p2.x-p1.x,
    y:p2.y-p1.y
  }
}

export function angle(p1,p2,p3) {
  let v1 = vec(p1, p2);
  let v2 = vec(p2, p3);
  let angle1 = Math.atan2(v1.x,v1.y);
  let angle2 = Math.atan2(v2.x,v2.y);
  return Math.abs(angle1 - angle2) * 180 / Math.PI;
}
export function findInflections(points) {
  if (points.length < 3) {
    return points;
  }
  let inflections = [points[0]];
  for(let i = 1; i < points.length - 1; i ++) {
    if (angle(...points.slice(i-1,i+2)) >= 160) {
      inflections.push(points[i]);
    }
  }
  inflections.push(points[points.length-1]);
  return inflections;
}
