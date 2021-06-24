export default function VertexBuffer (
  gl,
  data
) {
  let id;
  
  id = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, id);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    data,
    gl.STATIC_DRAW
  );
  
  this.connectVertexBuffer = () => {
    gl.bindBuffer(gl.ARRAY_BUFFER, id);
  };
  this.disconnectVertexBuffer = () => {
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }
}