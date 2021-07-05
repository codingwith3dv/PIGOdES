function Shader(
  gl,
  vSource,
  fSource
) {
  let id = 0;
  let uniformLocationCache = new Map();
  let getLocation = (shader, name) => {
    if (uniformLocationCache.has(name)) {
      return uniformLocationCache.get(name);
    }
    let u_loc = gl.getUniformLocation(
      shader,
      name
    );
    uniformLocationCache.set(name, u_loc);
    return u_loc;
  };
  
  let CompileShader = function(
    gl,
    type,
    source
  ) {
    let id = gl.createShader(type);
    gl.shaderSource(id, source);
    gl.compileShader(id);
    var success = gl.getShaderParameter(id, gl.COMPILE_STATUS);
    if (!success) {
      // Something went wrong during compilation; get the error
      throw "could not compile shader:" + gl.getShaderInfoLog(id);
    }
    return id;
  }
  let CreateShader = function(
    gl,
    vertexSource,
    fragmentSource
  ) {
    let program = gl.createProgram();
    let vertexShader = CompileShader(
      gl,
      gl.VERTEX_SHADER,
      vertexSource
    );
    let fragmentShader = CompileShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentSource
    );

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    gl.detachShader(program, vertexShader);
    gl.detachShader(program, fragmentShader);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      var info = gl.getProgramInfoLog(program);
      throw new Error('Could not compile WebGL program. \n\n' + info);
    }
    return program;
  }
  
  id = CreateShader(
    gl,
    vSource,
    fSource
  );

  this.connectShader = () => {
    gl.useProgram(id);
  };
  this.disconnectShader = () => {
    gl.useProgram(null);
  };
  this.setUniform4f = (
    gl,
    name,
    v0,
    v1,
    v2,
    v3
  ) => {
    gl.uniform4f(
      getLocation(id, name),
      v0,
      v1,
      v2,
      v3
    );
  };
  
  this.setUniformMatrix4fv = (
    gl,
    name,
    matrix
  ) => {
    gl.uniformMatrix4fv(
      getLocation(id, name),
      false,
      matrix
    );
  }
  
  this.setUniform1i = (
    gl,
    name,
    img
  ) => {
    gl.uniform1i(
      getLocation(id, name),
      img
    );
  }
  
  this.setUniformVec3 = (
    /** @type {WebGL2RenderingContext} */
    gl,
    name,
    val
  ) => {
    gl.uniform3f(
      getLocation(id, name),
      val[0],
      val[1],
      val[2]
    );
  }
  
  this.setBool = (
    /** @type {WebGL2RenderingContext} */
    gl,
    name,
    val
  ) => {
    gl.uniform1i(
      getLocation(id, name),
      val ? 1 : 0
    );
  }
}

export {
  Shader as default
};