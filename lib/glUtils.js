export function createVertexShader(
  gl,
  vertexSource
) {
  let vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexSource);
  gl.compileShader(vertexShader);
  return vertexShader;
}

export function createFragmentShader(
  gl,
  fragmentSource
) {
  let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentSource);
  gl.compileShader(fragmentShader);
  return fragmentShader;
}

export function createGLProgramWithShader(
  gl,
  vertexShader,
  fragmentShader
) {
  let shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  gl.useProgram(shaderProgram);
}

export function createGLProgramWithSource(
  gl,
  vertexSource,
  fragmentSource
) {
  createGLProgramWithShader(
    gl,
    createVertexShader(vertexSource),
    createFragmentShader(fragmentSource)
  );
}

export function createBuffer(
  gl,
  array,
  bufferType,
  usage
) {
  let buffer = gl.createBuffer();
  gl.bindBuffer(bufferType, buffer);
  gl.bufferData(
    bufferType,
    new Float32Array(array),
    usage);
}

export function bindBuffers(
  gl,
  vertexBuffer,
  vertexBufferType,
  indexBuffer,
  indexBufferType
) {
  gl.bindBuffer(vertexBufferType, vertexBuffer);
  gl.bindBuffer(indexBufferType, indexBuffer);
}