import {
  CreateBuffer,
  CreateShader
} from '../lib/glUtils.js'

const canvas = document.getElementById('canvas');
const gl = canvas.getContext('webgl') ??
  canvas.getContext('experimental-webgl');

const c = (
  val = 0
) => {
  return val / 255;
}

function mainLoop() {
  let positions = [
    -0.5, -0.5,
    0.0, 0.5,
    0.5, -0.5
  ]

  let vertexBufferID = CreateBuffer(
    gl,
    new Float32Array(positions),
    gl.ARRAY_BUFFER,
    gl.STATIC_DRAW
  );
    
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(
    0,
    2,
    gl.FLOAT,
    false,
    8,
    0
  );

  let vSource =
    `
    attribute vec2 a_pos;
    void main() {
      gl_Position = vec4(a_pos, 0.0, 1.0);
    }
    `;

  let fSource =
    `
    void main() {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
    `;
    
  let PID = CreateShader(
    gl,
    vSource,
    fSource
  );
  gl.useProgram(PID);
  
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

mainLoop()