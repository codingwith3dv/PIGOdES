export default function IndexBuffer(
  gl,
  data,
  count
) {
  let id;
  let _count = count;

  id = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, id);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    data,
    gl.STATIC_DRAW
  );

  this.connectIndexBuffer = () => {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, id);
  };
  this.disconnectIndexBuffer = () => {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  };
  this.getCount = () => {
    return _count;
  };
}