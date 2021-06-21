import {
  VertexArray,
  VertexBufferLayout
} from '../gl/vertex-array/vertexArray.js';
import VertexBuffer from '../gl/buffers/VertexBuffer.js';
import IndexBuffer from '../gl/buffers/indexBuffer.js';
import Renderer from '../gl/renderer/renderer.js'

class Cube {
  static source = {
    vertexShader: `#version 300 es
      layout(location = 0) in vec3 position;
      uniform mat4 u_proj;
      uniform mat4 u_view;
      out vec4 v_color;
      
      void main(void) {
        gl_Position = u_proj * u_view * vec4(position, 1.0);
        v_color = vec4(0.2, 0.6, 0.8, 1.0);
      }
      `,
    fragmentShader: `#version 300 es
      in vec4 v_color;
      out vec4 color;
      void main(void) {
        color = v_color;
      }
      `
  };
  vao = null;
  ibo = null;
  constructor(gl, l) {
    this.init(gl, l);
  }

  init(gl, l) {
    let positions = [
      // front
      -l, -l, -l,
       l, -l, -l,
       l,  l, -l,
      -l,  l, -l,

      // back
      -l, -l, l,
      -l,  l, l,
       l,  l, l,
       l, -l, l,
    ];
    let indices = [
      0, 1, 2, 2, 3, 0,
      4, 5, 6, 6, 7, 4
    ];
    this.vao = new VertexArray(gl);
    let vb = new VertexBuffer(
      gl,
      new Float32Array(positions)
    );
    let vbl = new VertexBufferLayout(gl);
    vbl.pushBack(3, gl.FLOAT, false);
    this.vao.addBuffer(gl, vb, vbl);

    this.ibo = new IndexBuffer(
      gl,
      new Uint16Array(indices),
      indices.length
    );

    this.vao.disconnectVertexArray();
    vb.disconnectVertexBuffer();
    this.ibo.disconnectIndexBuffer();
  }
  
  render(gl) {
    Renderer.draw(gl, this.vao, this.ibo, null);
  }
};