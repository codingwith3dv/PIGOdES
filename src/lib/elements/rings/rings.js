import {
  VertexArray,
  VertexBufferLayout
} from '../../gl/vertex-array/vertexArray.js';
import VertexBuffer from '../../gl/buffers/VertexBuffer.js';
import IndexBuffer from '../../gl/buffers/indexBuffer.js';
import Renderer from '../../gl/renderer/renderer.js';
import * as util from '../../utils/utils.js';
import Texture from '../../gl/texture/texture.js';

class Rings {
  vao = null;
  sectorCount = 1000;
  constructor(gl) {
    this.init(gl);
  }
  
  init(gl) {
    let vertices = [];
    for(let i = 0; i < this.sectorCount; i++) {
      var theta = Math.random() * 2 * Math.PI;
      
      vertices.push(theta);
      vertices.push((Math.random() - 0.5) * 80);
      vertices.push((Math.random() - 0.5) * 80);
    }
    
    this.vao = new VertexArray(gl);
    let vb = new VertexBuffer(
      gl,
      new Float32Array(vertices)
    );
    let vbl = new VertexBufferLayout(gl);
    vbl.pushBack(1, gl.FLOAT, false);
    vbl.pushBack(1, gl.FLOAT, false);
    vbl.pushBack(1, gl.FLOAT, false);
    this.vao.addBuffer(gl, vb, vbl);
    
    this.vao.disconnectVertexArray();
    vb.disconnectVertexBuffer();
  }
  render(gl, shader) {
    Renderer.drawArrays(gl, this.vao, gl.POINT, this.sectorCount);
  }
}

export default Rings;
export {
  source as RingsSource
} from './rings.shader.js';