export default function VertexBufferLayout(
  gl,
) {
  let elements = new Array();
  let stride = 0;
  
  this.pushBack = (
    count,
    type,
    normalised
  ) => {
    elements.push({
      type,
      count,
      normalised
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