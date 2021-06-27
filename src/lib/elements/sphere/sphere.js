import {
  VertexArray,
  VertexBufferLayout
} from '../../gl/vertex-array/vertexArray.js';
import VertexBuffer from '../../gl/buffers/VertexBuffer.js';
import IndexBuffer from '../../gl/buffers/indexBuffer.js';
import Renderer from '../../gl/renderer/renderer.js';
import * as util from '../../utils/utils.js';
import Texture from '../../gl/texture/texture.js';

class Sphere {
  vao = null;
  ibo = null;
  radius = 0;
  name = '';
  stackCount = 100;
  sectorCount = 100;
  texture = null;
  constructor(gl, _radius, _name, path) {
    this.radius = _radius;
    this.name   = _name;
    this.texture = new Texture(gl, path);
    this.init(gl);
  }
  init(gl) {
    let vertices = [];
    let xy;
    let z;
    let x;
    let y;
    let stackAngle;
    let sectorAngle;
    let sectorStep = 2 * util.PI / this.sectorCount;
    let stackStep = util.PI / this.stackCount;
    
    // vertices
    for (let i = 0; i <= this.stackCount; ++i) {
      stackAngle = util.PI / 2 - i * stackStep;
      xy = this.radius * util.cos(stackAngle);
      z = this.radius * util.sin(stackAngle);
    
      for (let j = 0; j <= this.sectorCount; ++j) {
        sectorAngle = j * sectorStep;
    
        x = xy * util.cos(sectorAngle);
        y = xy * util.sin(sectorAngle);
        vertices.push(x);
        vertices.push(y);
        vertices.push(z);
        
        vertices.push(j / this.sectorCount);
        vertices.push(i / this.stackCount);
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
    vbl.pushBack(2, gl.FLOAT, false);
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
    this.texture.connectTexture(gl, 0);
    Renderer.draw(gl, this.vao, this.ibo, shader);
  }
}

export default Sphere
export {
  source as SphereSource
} from './sphere.shader.js'