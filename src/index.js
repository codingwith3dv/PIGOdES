import IndexBuffer from './lib/gl/buffers/indexBuffer.js';
import VertexBuffer from './lib/gl/buffers/vertexBuffer.js';
import {
  VertexArray,
  VertexBufferLayout
} from './lib/gl/vertex-array/vertexArray.js';
import Shader from './lib/gl/shader/shader.js';
import Renderer from './lib/gl/renderer/renderer.js';
import * as mat4 from './lib/3d/mat4.js';
import * as vec3 from './lib/3d/vec3.js';

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
    -1.0, -1.0, -1.0,
    -1.0, -1.0, 1.0,
    -1.0, 1.0, 1.0,
    1.0, 1.0, -1.0,
    -1.0, -1.0, -1.0,
    -1.0, 1.0, -1.0,

    1.0, -1.0, 1.0,
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, 1.0, -1.0,
    1.0, -1.0, -1.0,
    -1.0, -1.0, -1.0,

    -1.0, -1.0, -1.0,
    -1.0, 1.0, 1.0,
    -1.0, 1.0, -1.0,
    1.0, -1.0, 1.0,
    -1.0, -1.0, 1.0,
    -1.0, -1.0, -1.0,

    -1.0, 1.0, 1.0,
    -1.0, -1.0, 1.0,
    1.0, -1.0, 1.0,
    1.0, 1.0, 1.0,
    1.0, -1.0, -1.0,
    1.0, 1.0, -1.0,

    1.0, -1.0, -1.0,
    1.0, 1.0, 1.0,
    1.0, -1.0, 1.0,
    1.0, 1.0, 1.0,
    1.0, 1.0, -1.0,
    -1.0, 1.0, -1.0,

    1.0, 1.0, 1.0,
    -1.0, 1.0, -1.0,
    -1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    -1.0, 1.0, 1.0,
    1.0, -1.0, 1.0
  ]
  let indices = [
  ];
  for (var i = 0; i < 36; i++) {
    indices.push(i)
  }

  function radToDeg(r) {
    return r * 180 / Math.PI;
  }

  function degToRad(d) {
    return d * Math.PI / 180;
  }

  let proj = mat4.create();
  mat4.perspective(proj, Math.PI / 2, 1, 1 / 256, 256);
  mat4.translate(proj, proj, [0, 0, -5]);

  let view = mat4.create();
  mat4.lookAt(view, vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 1));
  
  let va = new VertexArray(gl);
  let vb = new VertexBuffer(gl, new Float32Array(positions));
  let vbl = new VertexBufferLayout(gl);
  vbl.pushBack(3, gl.FLOAT, false);
  va.addBuffer(gl, vb, vbl);

  let ib = new IndexBuffer(gl, new Uint16Array(indices), indices.length);

  let vSource =
    `#version 300 es
    in vec3 a_pos;
    uniform mat4 u_matrix;
    uniform mat4 u_view;
    out vec4 v_color;
    
    void main() {
      gl_Position = u_matrix * u_view * vec4(a_pos, 1.0);
      v_color = vec4(0.2, 0.6, 0.8, 1.0);
    }
    `;

  let fSource =
    `#version 300 es
    precision highp float;
    uniform vec4 u_Color;
    in vec4 v_color;
    out vec4 color;
    void main() {
      color = v_color;
    }
    `;

  let shader = new Shader(
    gl,
    vSource,
    fSource
  );
  
  va.disconnectVertexArray();
  shader.disconnectShader();
  vb.disconnectVertexBuffer();
  ib.disconnectIndexBuffer();

  let renderer = new Renderer();
  let angle = 0.5;
  let inc = 0.01;
  
  const render = () => {
    renderer.clear(gl);
    gl.viewport(0, 0, 600, 600);
    
    shader.connectShader();
    shader.setUniformMatrix4fv(
      gl,
      'u_matrix',
      proj
    );
    shader.setUniformMatrix4fv(
      gl,
      'u_view',
      view
    );
    
    angle += inc;
    if(angle > 360 || angle < 0) inc = -inc;
    angle -= inc;
    mat4.rotateY(view, view, degToRad(angle));
    
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