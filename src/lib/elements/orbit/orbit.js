import {
  VertexArray,
  VertexBufferLayout
} from '../../gl/vertex-array/vertexArray.js';
import VertexBuffer from '../../gl/buffers/VertexBuffer.js';
import IndexBuffer from '../../gl/buffers/indexBuffer.js';
import Renderer from '../../gl/renderer/renderer.js';
import * as util from '../../utils/utils.js';
import Texture from '../../gl/texture/texture.js';

class Orbit {
  vao = null;
  radius = null;
  name = '';
  sectorCount = 100;
  vertices = [];
  constructor(gl, _radius, _name) {
    this.radius = _radius;
    this.name = _name;
    this.init(gl);
  }
  
  init(gl) {
    let angle = 0;
    for(let i = 0; i <= this.sectorCount; ++i) {
      angle = 2 * util.PI * i / this.sectorCount;
      this.vertices.push(this.radius * util.sin(angle));
      this.vertices.push(0.0);
      this.vertices.push(this.radius * util.cos(angle));
    }
    
    this.vao = new VertexArray(gl);
    let vb = new VertexBuffer(
      gl,
      new Float32Array(this.vertices)
    );
    let vbl = new VertexBufferLayout(gl);
    vbl.pushBack(3, gl.FLOAT, false);
    this.vao.addBuffer(gl, vb, vbl);
    
    this.vao.disconnectVertexArray();
    vb.disconnectVertexBuffer();
  }
  render(gl, shader) {
    Renderer.drawArrays(gl, this.vao, gl.LINE_LOOP, this.sectorCount);
  }
}

export default Orbit;
export {
  source as OrbitSource
} from './orbit.shader.js';