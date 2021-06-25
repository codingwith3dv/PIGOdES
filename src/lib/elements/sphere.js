import {
  VertexArray,
  VertexBufferLayout
} from '../gl/vertex-array/vertexArray.js';
import VertexBuffer from '../gl/buffers/VertexBuffer.js';
import IndexBuffer from '../gl/buffers/indexBuffer.js';
import Renderer from '../gl/renderer/renderer.js'

class Sphere {
  vao = null;
  ibo = null;
  radius = 0;
  name = '';
  stackCount = 100;
  sectorCount = 100;
  constructor(gl, _radius, _name) {
    this.radius = _radius ;
    this.name   = _name;
    this.init(gl);
  }
  init(gl) {
    let cos = Math.cos;
    let sin = Math.sin;
    let PI = Math.PI;
    
    let vertices = [];
    let xy;
    let z;
    let x;
    let y;
    let stackAngle;
    let sectorAngle;
    let sectorStep = 2 * PI / this.sectorCount;
    let stackStep = PI / this.stackCount;
    
    // vertices
    for (let i = 0; i <= this.stackCount; ++i) {
      stackAngle = PI / 2 - i * stackStep;
      xy = this.radius * cos(stackAngle);
      z = this.radius * sin(stackAngle);
    
      for (let j = 0; j <= this.sectorCount; ++j) {
        sectorAngle = j * sectorStep;
    
        x = xy * cos(sectorAngle);
        y = xy * sin(sectorAngle);
        vertices.push(x);
        vertices.push(y);
        vertices.push(z);
        vertices.push(0.2);
        vertices.push(0.6);
        vertices.push(0.8);
        vertices.push(this.name === 'EARTH'?1.0:0.2);
      }
    }
    
    // indices
    let indices = [];
    let k1;
    let k2;
    for (let i = 0; i < this.stackCount; ++i) {
      k1 = i * (this.sectorCount + 1);
      k2 = k1 + this.sectorCount + 1;
    
      for (let j = 0; j < this.sectorCount; ++j, ++k1, ++k2) {
        if (i != 0) {
          indices.push(k1);
          indices.push(k2);
          indices.push(k1 + 1);
        }
    
        if (i != (this.stackCount - 1)) {
          indices.push(k1 + 1);
          indices.push(k2);
          indices.push(k2 + 1);
        }
      }
    }
    
    this.vao = new VertexArray(gl);
    let vb = new VertexBuffer(
      gl,
      new Float32Array(vertices)
    );
    let vbl = new VertexBufferLayout(gl);
    vbl.pushBack(3, gl.FLOAT, false);
    vbl.pushBack(4, gl.FLOAT, false);
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
  render(gl, shader) {
    Renderer.draw(gl, this.vao, this.ibo, shader);
  }
}

export default Sphere
export {
  source
} from './sphere.shader.js'