let cos = Math.cos;
let sin = Math.sin;
let PI = Math.PI;
let radians = (d) => d * PI / 180;
let normalize = (a) => {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  let len = x * x + y * y + z * z;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
  }
  return [
    a[0] * len,
    a[1] * len,
    a[2] * len
  ]
}
let sub = (a, b) => {
  return [
    a[0] - b[0],
    a[1] - b[1],
    a[2] - b[2]
  ];
}
let cross = (a, b) => {
  let ax = a[0],
    ay = a[1],
    az = a[2];
  let bx = b[0],
    by = b[1],
    bz = b[2];
  
  return [
    ay * bz - az * by,
    az * bx - ax * bz,
    ax * by - ay * bx
  ];
}

export {
  cos,
  sin,
  PI,
  radians,
  normalize,
  sub,
  cross
};