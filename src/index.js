import IndexBuffer from './buffers/indexBuffer.js';
import VertexBuffer from './buffers/vertexBuffer.js';
import {
  VertexArray,
  VertexBufferLayout
}from './vertex-array/vertexArray.js';
import Shader from './shader/shader.js'

const canvas = document.getElementById('canvas');
const gl = canvas.getContext('webgl2')
  // ?? canvas.getContext('experimental-webgl2');

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
  
  let va = new VertexArray(gl);
  let vb = new VertexBuffer(gl, new Float32Array(positions));
  let vbl = new VertexBufferLayout(gl);
  vbl.pushBack(2);
  va.addBuffer(gl, vb, vbl);
  
  let ib = new IndexBuffer(gl, new Uint16Array(indices), 6);
  
  let vSource =
    `#version 300 es
    in vec2 a_pos;
    void main() {
      gl_Position = vec4(a_pos, 0.0, 1.0);
    }
    `;

  let fSource =
    `#version 300 es
    precision highp float;
    uniform vec4 u_Color;
    out vec4 color;
    void main() {
      color = u_Color;
    }
    `;
    
  let shader = new Shader(
    gl,
    vSource,
    fSource
  );
  
  shader.setUniform4f(
    gl,
    'u_Color',
    0.2,
    0.6,
    0.8,
    1.0
  );
  
  const render = () => {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    va.connectVertexArray();
    ib.connectIndexBuffer();
    
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