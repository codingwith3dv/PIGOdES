import VertexBufferLayout from './vertexBufferLayout.js'

function VertexArray(gl) {
  let id = gl.createVertexArray();
  
  this.connectVertexArray = () => {
    gl.bindVertexArray(id);
  };
  this.disconnectVertexArray = () => {
    gl.bindVertexArray(0);
  };
  
  this.addBuffer = (
    gl,
    vb,
    vbl
  ) => {
    this.connectVertexArray();
    vb.connectVertexBuffer();
    let elems = vbl.getElements();
    let offset = 0;
    for(let i in elems) {
      gl.enableVertexAttribArray(i);
      gl.vertexAttribPointer(
        i,
        elems[i].count,
        elems[i].type,
        elems[i].normalised,
        vbl.getStride(),
        offset
      );
      offset = offset + elems[i].count * 4;
    }
  };
}
export {
  VertexBufferLayout,
  VertexArray
}