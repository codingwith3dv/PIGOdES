const canvas = document.getElementById('canvas');
const gl = canvas.getContext('webgl') ??
  canvas.getContext('experimental-webgl');

const c = (
  val = 0
) => {
  return val / 255;
}

const vsSource = `
    attribute vec4 aVertexPosition;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    }
  `;

const fsSource = `
    void main() {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
  `;

const loadShader = (
  gl,
  type,
  source
) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

const initShader = (
  gl,
  vsSource,
  fsSource
) => {
  const vsShader = loadShader(
    gl,
    gl.VERTEX_SHADER,
    vsSource
  );
  const fsShader = loadShader(
    gl,
    gl.FRAGMENT_SHADER,
    fsSource
  );
  const program = gl.createProgram();
  gl.attachShader(program, vsShader);
  gl.attachShader(program, fsShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }
  return program;
}

const initBuffer = (
  gl,
  positions
) => {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(positions),
    gl.STATIC_DRAW
  );
  
  return {
    position: buffer
  }
}

const render = (
  gl,
  programInfo,
  buffers
) => {
  gl.clearColor(c(20), c(20), c(20), 1);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();
  
  mat4.perspective(projectionMatrix,
    fieldOfView,
    aspect,
    zNear,
    zFar);
  
  const modelViewMatrix = mat4.create();
  mat4.translate(
    modelViewMatrix,
    modelViewMatrix,
    [-0.0, 0.0, -6.0]
  )
  
  {
    const numComponents = 2; // pull out 2 values per iteration
    const type = gl.FLOAT; // the data in the buffer is 32bit floats
    const normalize = false; // don't normalize
    const stride = 0; // how many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    const offset = 0; // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      numComponents,
      type,
      normalize,
      stride,
      offset);
    gl.enableVertexAttribArray(
      programInfo.attribLocations.vertexPosition);
  }
  
  gl.useProgram(programInfo.program);
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix);
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

const mainLoop = () => {
  const shader = initShader(gl, vsSource, fsSource);
  const programInfo = {
    program: shader,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shader, 'aVertexPosition'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shader, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shader, 'uModelViewMatrix'),
    },
  };
  
  let sbuffer = [
      -1.5, -0.5,
      -0.5, -0.5,
      -1.5, 0.5,
      -0.5,  0.5
    ]
  let buffers = initBuffer(gl, sbuffer);
  render(gl, programInfo, buffers);
}

window.onload = mainLoop