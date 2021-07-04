export default class Renderer {
  static clear(gl) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    Renderer.resizeToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  }
  static draw(gl, va, ib, shader, type) {
    shader.connectShader();
    va.connectVertexArray();
    ib.connectIndexBuffer();

    gl.drawElements(
      type,
      ib.getCount(),
      gl.UNSIGNED_SHORT,
      null
    );
  }
  static drawArrays(gl, vao, type, count) {
    vao.connectVertexArray();
    gl.drawArrays(
      type,
      0,
      count
    );
  }

  static resizeToDisplaySize = (canvas) => {
    const dpr = window.devicePixelRatio;
    const {
      width,
      height
    } = canvas.getBoundingClientRect();
    const dw = Math.floor(width * dpr);
    const dh = Math.floor(height * dpr);

    if (
      canvas.width !== dw ||
      canvas.height !== dh
    ) {
      canvas.width = dw;
      canvas.height = dh;
    }
  };

}