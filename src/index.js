import {
  CreateShader
} from '../lib/glUtils.js'
import IndexBuffer from './buffers/indexBuffer.js'
import VertexBuffer from './buffers/vertexBuffer.js'

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
     0.5, -0.5,
     0.5,  0.5,
    -0.5,  0.5
  ]
  let indices = [
    0, 1, 2,
    2, 3, 0
  ];

  let vb = new VertexBuffer(
    gl,
    new Float32Array(positions)
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
  
  let ib = new IndexBuffer(
    gl,
    new Uint16Array(indices),
    6
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
    precision highp float;
    uniform vec4 u_Color;
    void main() {
      gl_FragColor = u_Color;
    }
    `;
    
  let shader = CreateShader(
    gl,
    vSource,
    fSource
  );
  
  let u_location = gl.getUniformLocation(
    shader,
    'u_Color'
  );
  
  gl.uniform4f(
    u_location,
    1.0,
    0.0,
    0.0,
    1.0
  ); 
  
  const render = () => {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawElements(
      gl.TRIANGLES,
      6,
      gl.UNSIGNED_SHORT,
      null
    );
    
    window.requestAnimationFrame(render);
  };
  
  render();
}

mainLoop();