export default function VertexBufferLayout(
  gl,
) {
  let elements = new Array();
  let stride = 0;
  
  this.pushBack = (
    count
  ) => {
    elements.push({
      type: gl.FLOAT,
      count,
      normalised: false
    });
    stride += 4 * count;
  };
  this.getElements = () => {
    return elements;
  };
  this.getStride = () => {
    return stride;
  };
}