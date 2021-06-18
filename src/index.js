import IndexBuffer from './lib/buffers/indexBuffer.js';
import VertexBuffer from './lib/buffers/vertexBuffer.js';
import {
  VertexArray,
  VertexBufferLayout
}from './lib/vertex-array/vertexArray.js';
import Shader from './lib/shader/shader.js'
import Renderer from './lib/renderer/renderer.js'

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