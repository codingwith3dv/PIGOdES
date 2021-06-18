import IndexBuffer from './lib/gl/buffers/indexBuffer.js';
import VertexBuffer from './lib/gl/buffers/vertexBuffer.js';
import {
  VertexArray,
  VertexBufferLayout
}from './lib/gl/vertex-array/vertexArray.js';
import Shader from './lib/gl/shader/shader.js'
import Renderer from './lib/gl/renderer/renderer.js'

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
    // left column
    0, 0, 0,
    30, 0, 0,
    0, 150, 0,
    0, 150, 0,
    30, 0, 0,
    30, 150, 0,
    
    // top rung
    30, 0, 0,
    100, 0, 0,
    30, 30, 0,
    30, 30, 0,
    100, 0, 0,
    100, 30, 0,
    
    // middle rung
    30, 60, 0,
    67, 60, 0,
    30, 90, 0,
    30, 90, 0,
    67, 60, 0,
    67, 90, 0
  ]
  let indices = [
    0, 1, 2, 3, 4, 5,
    6, 7, 8, 9, 10, 11,
    12, 13, 14, 15, 16, 17
  ];
  
  let va = new VertexArray(gl);
  let vb = new VertexBuffer(gl, new Float32Array(positions));
  let vbl = new VertexBufferLayout(gl);
  vbl.pushBack(3);
  va.addBuffer(gl, vb, vbl);
  
  let ib = new IndexBuffer(gl, new Uint16Array(indices), 6);
  
  let vSource =
    `#version 300 es
    in vec4 a_pos;
    uniform mat4 u_matrix;
    void main() {
      gl_Position = u_matrix * a_pos;
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
  shader.connectShader();
  
  shader.setUniform4f(
    gl,
    'u_Color',
    0.2,
    0.6,
    0.8,
    1.0
  );
  
  va.disconnectVertexArray();
  shader.disconnectShader();
  vb.disconnectVertexBuffer();
  ib.disconnectIndexBuffer();
  
  let renderer = new Renderer();
  let r = 0.2;
  let increment = 0.01;
  
  const render = () => {
    renderer.clear(gl);
    shader.connectShader();
    shader.setUniform4f(
      gl,
      'u_Color',
      r,
      0.6,
      0.8,
      1.0
    );
    
    r += increment;
    if (r > 1.0 || r < 0.0) {
      increment = -increment;
    }
    
    renderer.draw(
      gl,
      va,
      ib,
      shader
    );
    
    window.requestAnimationFrame(render);
  };
  
  render();
}

mainLoop();