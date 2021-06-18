export function CompileShader(
  gl,
  type,
  source
) {
  let id = gl.createShader(type);
  gl.shaderSource(id, source);
  gl.compileShader(id);
  var success = gl.getShaderParameter(id, gl.COMPILE_STATUS);
  if (!success) {
    // Something went wrong during compilation; get the error
    throw "could not compile shader:" + gl.getShaderInfoLog(id);
  }
  return id;
}

export function CreateShader(
  gl,
  vertexSource,
  fragmentSource
) {
  let program = gl.createProgram();
  let vertexShader = CompileShader(
    gl,
    gl.VERTEX_SHADER,
    vertexSource
  );
  let fragmentShader = CompileShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentSource
  );

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  gl.detachShader(program, vertexShader);
  gl.detachShader(program, fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    var info = gl.getProgramInfoLog(program);
    throw new Error('Could not compile WebGL program. \n\n' + info);
  }
  
  gl.useProgram(program);
  return program;
}

export function CreateBuffer(
  gl,
  array,
  bufferType,
  usage
) {
  let buffer = gl.createBuffer();
  gl.bindBuffer(bufferType, buffer);
  gl.bufferData(
    bufferType,
    array,
    usage);
  return buffer;
}