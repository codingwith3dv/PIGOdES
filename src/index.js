import IndexBuffer from './lib/gl/buffers/indexBuffer.js';
import VertexBuffer from './lib/gl/buffers/vertexBuffer.js';
import {
  VertexArray,
  VertexBufferLayout
} from './lib/gl/vertex-array/vertexArray.js';
import Shader from './lib/gl/shader/shader.js';
import Renderer from './lib/gl/renderer/renderer.js';
import m4 from './lib/3d/m4.js'

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
    -50, -50, 0,
     50, -50, 0,
     50,  50, 0,
    -50,  50, 0
  ]
  let indices = [
    0, 1, 2, 2, 3, 0
  ];

  function radToDeg(r) {
    return r * 180 / Math.PI;
  }
  
  function degToRad(d) {
    return d * Math.PI / 180;
  }
  
  var translation = [0, 0, 0];
  var rotation = [degToRad(40), degToRad(25), degToRad(325)];
  var scale = [1, 1, 1];
  var fudgeFactor = 1;

  var matrix = m4.makeZToWMatrix(fudgeFactor);
  matrix = m4.multiply(matrix, m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 400));
  matrix = m4.translate(matrix, translation[0], translation[1], translation[2]);
  matrix = m4.xRotate(matrix, rotation[0]);
  matrix = m4.yRotate(matrix, rotation[1]);
  matrix = m4.zRotate(matrix, rotation[2]);
  matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);


  let va = new VertexArray(gl);
  let vb = new VertexBuffer(gl, new Float32Array(positions));
  let vbl = new VertexBufferLayout(gl);
  vbl.pushBack(3, gl.FLOAT, false);
  va.addBuffer(gl, vb, vbl);

  let ib = new IndexBuffer(gl, new Uint16Array(indices), 6);

  let vSource =
    `#version 300 es
    in vec3 a_pos;
    uniform mat4 u_matrix;
    out vec4 v_color;
    
    void main() {
      vec4 position = vec4(a_pos, 1.0) * u_matrix;
      float zToDivideBy = 1.0 + position.z * 1.0;
    
      gl_Position = vec4(position.xyz, zToDivideBy);
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
  shader.connectShader();
  shader.setUniformMatrix4fv(
    gl,
    'u_matrix',
    matrix
  );


  va.disconnectVertexArray();
  shader.disconnectShader();
  vb.disconnectVertexBuffer();
  ib.disconnectIndexBuffer();

  let renderer = new Renderer();
  let angle = 0;
  
  const render = () => {
    renderer.clear(gl);
    gl.viewport(0, 0, 600, 600);
    shader.connectShader();
    shader.setUniformMatrix4fv(
      gl,
      'u_matrix',
      matrix
    );
    
    angle += 0.01;
    rotation[2] = degToRad(angle);
    if(angle > 360) {
      angle = 0;
      rotation[2] = 0;
    }
    matrix = m4.zRotate(matrix, rotation[2]);

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