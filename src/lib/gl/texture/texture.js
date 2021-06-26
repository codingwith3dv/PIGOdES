function Texture(
  gl,
  path
) {
  let id = 0;
  let filePath = path;
  
  id = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, id);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([0, 0, 255, 255])
  );
  
  let img = new Image();
  img.src = filePath;
  img.addEventListener('load', () => {
    gl.bindTexture(gl.TEXTURE_2D, id);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA8,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      img
    );
    gl.generateMipmap(gl.TEXTURE_2D);
  });
  
  this.connectTexture = (gl, slot = 0) => {
    gl.activeTexture(gl.TEXTURE0 + slot);
    gl.bindTexture(gl.TEXTURE_2D, id);
  }
  
  this.disconnectTexture = (gl) => {
    gl.bindTexture(gl.TEXTURE_2D, null);
  }
}

export {
  Texture as default
};