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
  };
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
  };
  
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
  };
  
  this.setUniform1i = (
    gl,
    name,
    img
  ) => {
    gl.uniform1i(
      getLocation(id, name),
      img
    );
  };
}

class Renderer {
  static clear(gl) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
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

/**
 * Common utilities
 * @module glMatrix
 */

// Configuration Constants
const EPSILON = 0.000001;
let ARRAY_TYPE =
  typeof Float32Array !== "undefined" ? Float32Array : Array;

if (!Math.hypot)
  Math.hypot = function () {
    var y = 0,
      i = arguments.length;
    while (i--) y += arguments[i] * arguments[i];
    return Math.sqrt(y);
  };

/**
 * 4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.
 * @module mat4
 */

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */
function create$1() {
  let out = new ARRAY_TYPE(16);
  if (ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
  }
  out[0] = 1;
  out[5] = 1;
  out[10] = 1;
  out[15] = 1;
  return out;
}

/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */
function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to translate
 * @param {ReadonlyVec3} v vector to translate by
 * @returns {mat4} out
 */
function translate(out, a, v) {
  let x = v[0],
    y = v[1],
    z = v[2];
  let a00, a01, a02, a03;
  let a10, a11, a12, a13;
  let a20, a21, a22, a23;

  if (a === out) {
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
  } else {
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];

    out[0] = a00;
    out[1] = a01;
    out[2] = a02;
    out[3] = a03;
    out[4] = a10;
    out[5] = a11;
    out[6] = a12;
    out[7] = a13;
    out[8] = a20;
    out[9] = a21;
    out[10] = a22;
    out[11] = a23;

    out[12] = a00 * x + a10 * y + a20 * z + a[12];
    out[13] = a01 * x + a11 * y + a21 * z + a[13];
    out[14] = a02 * x + a12 * y + a22 * z + a[14];
    out[15] = a03 * x + a13 * y + a23 * z + a[15];
  }

  return out;
}

/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function rotateX(out, a, rad) {
  let s = Math.sin(rad);
  let c = Math.cos(rad);
  let a10 = a[4];
  let a11 = a[5];
  let a12 = a[6];
  let a13 = a[7];
  let a20 = a[8];
  let a21 = a[9];
  let a22 = a[10];
  let a23 = a[11];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged rows
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }

  // Perform axis-specific matrix multiplication
  out[4] = a10 * c + a20 * s;
  out[5] = a11 * c + a21 * s;
  out[6] = a12 * c + a22 * s;
  out[7] = a13 * c + a23 * s;
  out[8] = a20 * c - a10 * s;
  out[9] = a21 * c - a11 * s;
  out[10] = a22 * c - a12 * s;
  out[11] = a23 * c - a13 * s;
  return out;
}

/**
 * Rotates a matrix by the given angle around the Y axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function rotateY(out, a, rad) {
  let s = Math.sin(rad);
  let c = Math.cos(rad);
  let a00 = a[0];
  let a01 = a[1];
  let a02 = a[2];
  let a03 = a[3];
  let a20 = a[8];
  let a21 = a[9];
  let a22 = a[10];
  let a23 = a[11];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged rows
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }

  // Perform axis-specific matrix multiplication
  out[0] = a00 * c - a20 * s;
  out[1] = a01 * c - a21 * s;
  out[2] = a02 * c - a22 * s;
  out[3] = a03 * c - a23 * s;
  out[8] = a00 * s + a20 * c;
  out[9] = a01 * s + a21 * c;
  out[10] = a02 * s + a22 * c;
  out[11] = a03 * s + a23 * c;
  return out;
}

/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function rotateZ(out, a, rad) {
  let s = Math.sin(rad);
  let c = Math.cos(rad);
  let a00 = a[0];
  let a01 = a[1];
  let a02 = a[2];
  let a03 = a[3];
  let a10 = a[4];
  let a11 = a[5];
  let a12 = a[6];
  let a13 = a[7];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged last row
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }

  // Perform axis-specific matrix multiplication
  out[0] = a00 * c + a10 * s;
  out[1] = a01 * c + a11 * s;
  out[2] = a02 * c + a12 * s;
  out[3] = a03 * c + a13 * s;
  out[4] = a10 * c - a00 * s;
  out[5] = a11 * c - a01 * s;
  out[6] = a12 * c - a02 * s;
  out[7] = a13 * c - a03 * s;
  return out;
}

/**
 * Generates a perspective projection matrix with the given bounds.
 * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
 * which matches WebGL/OpenGL's clip volume.
 * Passing null/undefined/no value for far will generate infinite projection matrix.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum, can be null or Infinity
 * @returns {mat4} out
 */
function perspectiveNO(out, fovy, aspect, near, far) {
  const f = 1.0 / Math.tan(fovy / 2);
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[15] = 0;
  if (far != null && far !== Infinity) {
    const nf = 1 / (near - far);
    out[10] = (far + near) * nf;
    out[14] = 2 * far * near * nf;
  } else {
    out[10] = -1;
    out[14] = -2 * near;
  }
  return out;
}

/**
 * Alias for {@link mat4.perspectiveNO}
 * @function
 */
const perspective = perspectiveNO;

/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis.
 * If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {ReadonlyVec3} eye Position of the viewer
 * @param {ReadonlyVec3} center Point the viewer is looking at
 * @param {ReadonlyVec3} up vec3 pointing up
 * @returns {mat4} out
 */
function lookAt(out, eye, center, up) {
  let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
  let eyex = eye[0];
  let eyey = eye[1];
  let eyez = eye[2];
  let upx = up[0];
  let upy = up[1];
  let upz = up[2];
  let centerx = center[0];
  let centery = center[1];
  let centerz = center[2];

  if (
    Math.abs(eyex - centerx) < EPSILON &&
    Math.abs(eyey - centery) < EPSILON &&
    Math.abs(eyez - centerz) < EPSILON
  ) {
    return identity(out);
  }

  z0 = eyex - centerx;
  z1 = eyey - centery;
  z2 = eyez - centerz;

  len = 1 / Math.hypot(z0, z1, z2);
  z0 *= len;
  z1 *= len;
  z2 *= len;

  x0 = upy * z2 - upz * z1;
  x1 = upz * z0 - upx * z2;
  x2 = upx * z1 - upy * z0;
  len = Math.hypot(x0, x1, x2);
  if (!len) {
    x0 = 0;
    x1 = 0;
    x2 = 0;
  } else {
    len = 1 / len;
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }

  y0 = z1 * x2 - z2 * x1;
  y1 = z2 * x0 - z0 * x2;
  y2 = z0 * x1 - z1 * x0;

  len = Math.hypot(y0, y1, y2);
  if (!len) {
    y0 = 0;
    y1 = 0;
    y2 = 0;
  } else {
    len = 1 / len;
    y0 *= len;
    y1 *= len;
    y2 *= len;
  }

  out[0] = x0;
  out[1] = y0;
  out[2] = z0;
  out[3] = 0;
  out[4] = x1;
  out[5] = y1;
  out[6] = z1;
  out[7] = 0;
  out[8] = x2;
  out[9] = y2;
  out[10] = z2;
  out[11] = 0;
  out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
  out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
  out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
  out[15] = 1;

  return out;
}

/**
 * 3 Dimensional Vector
 * @module vec3
 */

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */
function create() {
  let out = new ARRAY_TYPE(3);
  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }
  return out;
}

/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */
function fromValues(x, y, z) {
  let out = new ARRAY_TYPE(3);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}

/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
((function () {
  let vec = create();

  return function (a, stride, offset, count, fn, arg) {
    let i, l;
    if (!stride) {
      stride = 3;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
    }

    return a;
  };
}))();

function VertexBufferLayout(
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

function VertexArray(gl) {
  let id = gl.createVertexArray();
  
  this.connectVertexArray = () => {
    gl.bindVertexArray(id);
  };
  this.disconnectVertexArray = () => {
    gl.bindVertexArray(null);
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

function VertexBuffer (
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
  };
}

function IndexBuffer(
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

let cos = Math.cos;
let sin = Math.sin;
let PI = Math.PI;
let radians = (d) => d * PI / 180;

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
  };
  
  this.disconnectTexture = (gl) => {
    gl.bindTexture(gl.TEXTURE_2D, null);
  };
}

let source$1 = {
  vertexSource: `#version 300 es
      layout(location = 0) in vec3 a_position;
      layout(location = 1) in vec2 a_texCoords;
      
      uniform mat4 u_model;
      uniform mat4 u_view;
      uniform mat4 u_proj;
      
      out vec2 v_texCoords;
      
      void main(void) {
        gl_Position = u_proj * u_view * u_model * vec4(a_position, 1.0);
        v_texCoords = a_texCoords;
      }
      `,
  fragmentSource: `#version 300 es
    precision highp float;
      in vec2 v_texCoords;
      uniform sampler2D u_image;
      
      out vec4 color;
      void main(void) {
        color = texture(u_image, v_texCoords);
      }
      `
};

class Sphere {
  vao = null;
  ibo = null;
  radius = 0;
  name = '';
  stackCount = 100;
  sectorCount = 100;
  texture = null;
  constructor(gl, _radius, _name, path) {
    this.radius = _radius;
    this.name   = _name;
    this.texture = new Texture(gl, path);
    this.init(gl);
  }
  init(gl) {
    let vertices = [];
    let xy;
    let z;
    let x;
    let y;
    let stackAngle;
    let sectorAngle;
    let sectorStep = 2 * PI / this.sectorCount;
    let stackStep = PI / this.stackCount;
    
    // vertices
    for (let i = 0; i <= this.stackCount; ++i) {
      stackAngle = PI / 2 - i * stackStep;
      xy = this.radius * cos(stackAngle);
      z = this.radius * sin(stackAngle);
    
      for (let j = 0; j <= this.sectorCount; ++j) {
        sectorAngle = j * sectorStep;
    
        x = xy * cos(sectorAngle);
        y = xy * sin(sectorAngle);
        vertices.push(x);
        vertices.push(y);
        vertices.push(z);
        
        vertices.push(j / this.sectorCount);
        vertices.push(i / this.stackCount);
      }
    }
    
    // indices
    let indices = [];
    let k1;
    let k2;
    for (let i = 0; i < this.stackCount; ++i) {
      k1 = i * (this.sectorCount + 1);
      k2 = k1 + this.sectorCount + 1;
    
      for (let j = 0; j < this.sectorCount; ++j, ++k1, ++k2) {
        if (i != 0) {
          indices.push(k1);
          indices.push(k2);
          indices.push(k1 + 1);
        }
    
        if (i != (this.stackCount - 1)) {
          indices.push(k1 + 1);
          indices.push(k2);
          indices.push(k2 + 1);
        }
      }
    }
    
    this.vao = new VertexArray(gl);
    let vb = new VertexBuffer(
      gl,
      new Float32Array(vertices)
    );
    let vbl = new VertexBufferLayout(gl);
    vbl.pushBack(3, gl.FLOAT, false);
    vbl.pushBack(2, gl.FLOAT, false);
    this.vao.addBuffer(gl, vb, vbl);
    
    this.ibo = new IndexBuffer(
      gl,
      new Uint16Array(indices),
      indices.length
    );
    
    this.vao.disconnectVertexArray();
    vb.disconnectVertexBuffer();
    this.ibo.disconnectIndexBuffer();
  }
  render(gl, shader) {
    this.texture.connectTexture(gl, 0);
    Renderer.draw(gl, this.vao, this.ibo, shader, gl.TRIANGLES);
  }
}

let source = {
  vertexSource: `#version 300 es
      layout(location = 0) in vec3 a_position;
      
      uniform mat4 u_model;
      uniform mat4 u_view;
      uniform mat4 u_proj;
      
      void main(void) {
        gl_Position = u_proj * u_view * u_model * vec4(a_position, 1.0);
      }
      `,
  fragmentSource: `#version 300 es
    precision highp float;
      
      out vec4 color;
      void main(void) {
        color = vec4(1.0, 1.0, 1.0, 1.0);
      }
      `
};

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
      angle = 2 * PI * i / this.sectorCount;
      this.vertices.push(this.radius * sin(angle));
      this.vertices.push(0.0);
      this.vertices.push(this.radius * cos(angle));
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
    Renderer.drawArrays(gl, this.vao, gl.LINES, this.sectorCount);
  }
}

const solarData = {
  "data": [
    {
      "name": "SUN",
      "Diameter": 109 * 12756,
      "Rotation Period": "1.125 (hours)",
      "Orbital Period": "0 (days)",
      "Distance from Sun": 0,
      "Obliquity to Orbit": 7.25
    },
    {
      "name": "MERCURY",
      "Mass": "0.33 (10^24kg)",
      "Diameter": (4879),
      "Density": "5427 (kg/m3)",
      "Gravity": "3.7 (m/s2)",
      "Escape Velocity": 4.3,
      "Rotation Period": "1407.6 (hours)",
      "Length of Day": "4222.6 (hours)",
      "Distance from Sun": 57.9,
      "Perihelion": "46.0 (10^6 km)",
      "Aphelion": "69.8 (10^6 km)",
      "Orbital Period": "88.0 (days)",
      "Orbital Velocity": "47.4 (km/s)",
      "Orbital Inclination": "7.0 (degrees)",
      "Orbital Eccentricity": "0.205",
      "Obliquity to Orbit": 0.034,
      "Mean Temperature": "167 (C)",
      "Surface Pressure": "0 (bars)",
      "Number of Moons": "0",
      "Ring System?": "No",
      "Global Magnetic Field?": "Yes"
    },

    {
      "name": "VENUS",
      "Mass": "4.87 (10^24kg)",
      "Diameter": (12104),
      "Density": "5243 (kg/m3)",
      "Gravity": "8.9 (m/s2)",
      "Escape Velocity": 10.4,
      "Rotation Period": "-5832.5 (hours)",
      "Length of Day": "2802.0 (hours)",
      "Distance from Sun": 108.2,
      "Perihelion": "107.5 (10^6 km)",
      "Aphelion": "108.9 (10^6 km)",
      "Orbital Period": "224.7 (days)",
      "Orbital Velocity": "35.0 (km/s)",
      "Orbital Inclination": "3.4 (degrees)",
      "Orbital Eccentricity": "0.007",
      "Obliquity to Orbit": 177.4,
      "Mean Temperature": "464 (C)",
      "Surface Pressure": "92 (bars)",
      "Number of Moons": "0",
      "Ring System?": "No",
      "Global Magnetic Field?": "No"
    },

    {
      "name": "EARTH",
      "Mass": "5.97 (10^24kg)",
      "Diameter": (12756),
      "Density": "5514 (kg/m3)",
      "Gravity": "9.8 (m/s2)",
      "Escape Velocity": 11.2,
      "Rotation Period": "23.9 (hours)",
      "Length of Day": "24.0 (hours)",
      "Distance from Sun": 149.6,
      "Perihelion": "147.1 (10^6 km)",
      "Aphelion": "152.1 (10^6 km)",
      "Orbital Period": "365.2 (days)",
      "Orbital Velocity": "29.8 (km/s)",
      "Orbital Inclination": "0.0 (degrees)",
      "Orbital Eccentricity": "0.017",
      "Obliquity to Orbit": 23.4,
      "Mean Temperature": "15 (C)",
      "Surface Pressure": "1 (bars)",
      "Number of Moons": "1",
      "Ring System?": "No",
      "Global Magnetic Field?": "Yes"
    },

    {
      "name": "MARS",
      "Mass": "0.642 (10^24kg)",
      "Diameter": (6792),
      "Density": "3933 (kg/m3)",
      "Gravity": "3.7 (m/s2)",
      "Escape Velocity": 5.0,
      "Rotation Period": "24.6 (hours)",
      "Length of Day": "24.7 (hours)",
      "Distance from Sun": 227.9,
      "Perihelion": "206.6 (10^6 km)",
      "Aphelion": "249.2 (10^6 km)",
      "Orbital Period": "687.0 (days)",
      "Orbital Velocity": "24.1 (km/s)",
      "Orbital Inclination": "1.9 (degrees)",
      "Orbital Eccentricity": "0.094",
      "Obliquity to Orbit": 25.2,
      "Mean Temperature": "-65 (C)",
      "Surface Pressure": "0.01 (bars)",
      "Number of Moons": "2",
      "Ring System?": "No",
      "Global Magnetic Field?": "No"
    },

    {
      "name": "JUPITER",
      "Mass": "1898 (10^24kg)",
      "Diameter": (142984),
      "Density": "1326 (kg/m3)",
      "Gravity": "23.1 (m/s2)",
      "Escape Velocity": 59.5,
      "Rotation Period": "9.9 (hours)",
      "Length of Day": "9.9 (hours)",
      "Distance from Sun": 778.6,
      "Perihelion": "740.5 (10^6 km)",
      "Aphelion": "816.6 (10^6 km)",
      "Orbital Period": "4331 (days)",
      "Orbital Velocity": "13.1 (km/s)",
      "Orbital Inclination": "1.3 (degrees)",
      "Orbital Eccentricity": "0.049",
      "Obliquity to Orbit": 3.1,
      "Mean Temperature": "-110 (C)",
      "Surface Pressure": "Unknown (bars)",
      "Number of Moons": "79",
      "Ring System?": "Yes",
      "Global Magnetic Field?": "Yes"
    },

    {
      "name": "SATURN",
      "Mass": "568 (10^24kg)",
      "Diameter": (120536),
      "Density": "687 (kg/m3)",
      "Gravity": "9.0 (m/s2)",
      "Escape Velocity": 35.5,
      "Rotation Period": "10.7 (hours)",
      "Length of Day": "10.7 (hours)",
      "Distance from Sun": 1433.5,
      "Perihelion": "1352.6 (10^6 km)",
      "Aphelion": "1514.5 (10^6 km)",
      "Orbital Period": "10747 (days)",
      "Orbital Velocity": "9.7 (km/s)",
      "Orbital Inclination": "2.5 (degrees)",
      "Orbital Eccentricity": "0.057",
      "Obliquity to Orbit": 26.7,
      "Mean Temperature": "-140 (C)",
      "Surface Pressure": "Unknown (bars)",
      "Number of Moons": "82",
      "Ring System?": "Yes",
      "Global Magnetic Field?": "Yes"
    },

    {
      "name": "URANUS",
      "Mass": "86.8 (10^24kg)",
      "Diameter": (51118),
      "Density": "1271 (kg/m3)",
      "Gravity": "8.7 (m/s2)",
      "Escape Velocity": 21.3,
      "Rotation Period": "-17.2 (hours)",
      "Length of Day": "17.2 (hours)",
      "Distance from Sun": 2872.5,
      "Perihelion": "2741.3 (10^6 km)",
      "Aphelion": "3003.6 (10^6 km)",
      "Orbital Period": "30589 (days)",
      "Orbital Velocity": "6.8 (km/s)",
      "Orbital Inclination": "0.8 (degrees)",
      "Orbital Eccentricity": "0.046",
      "Obliquity to Orbit": 97.8,
      "Mean Temperature": "-195 (C)",
      "Surface Pressure": "Unknown (bars)",
      "Number of Moons": "27",
      "Ring System?": "Yes",
      "Global Magnetic Field?": "Yes"
    },

    {
      "name": "NEPTUNE",
      "Mass": "102 (10^24kg)",
      "Diameter": (49528),
      "Density": "1638 (kg/m3)",
      "Gravity": "11.0 (m/s2)",
      "Escape Velocity": 23.5,
      "Rotation Period": "16.1 (hours)",
      "Length of Day": "16.1 (hours)",
      "Distance from Sun": 4495.1,
      "Perihelion": "4444.5 (10^6 km)",
      "Aphelion": "4545.7 (10^6 km)",
      "Orbital Period": "59800 (days)",
      "Orbital Velocity": "5.4 (km/s)",
      "Orbital Inclination": "1.8 (degrees)",
      "Orbital Eccentricity": "0.011",
      "Obliquity to Orbit": 28.3,
      "Mean Temperature": "-200 (C)",
      "Surface Pressure": "Unknown (bars)",
      "Number of Moons": "14",
      "Ring System?": "Yes",
      "Global Magnetic Field?": "Yes"
    },
  ]
};

const data = new Array();

const texPaths = [
  './res/2k_sun.jpg',
  './res/2k_mercury.jpg',
  './res/2k_venus_surface.jpg',
  './res/2k_earth_daymap.jpg',
  './res/2k_mars.jpg',
  './res/2k_jupiter.jpg',
  './res/2k_saturn.jpg',
  './res/2k_uranus.jpg',
  './res/2k_neptune.jpg'
];

{
  for(let i = 0; i < solarData.data.length; i++) {
    let value = solarData.data[i];
    let isSun = false;
    if(value.name === 'SUN') {
      isSun = true;
    }
    data.push(
      {
        'name': value.name,
        'distance': parseFloat(value['Distance from Sun']),
        'radius': (parseFloat(value.Diameter) / 2) / (12756 / 2),
        'axisTilt': parseFloat(value['Obliquity to Orbit']),
        'orbPeriod': parseFloat(value['Orbital Period'].slice(0, -7)),
        'rotPeriod':(parseFloat(value['Rotation Period'].slice(0, -8)) / 24),
        'isSun': isSun,
        'texturePath': texPaths[i],
        'sphere': null, // Actual reference to the sphere
        'orbit': null, // Actual reference to the orbit
      }
    );
  }
}

class Camera {
  position = fromValues(-1000, 0, 0);
  target = fromValues(0, 0, 0);
  up = fromValues(0, 1, 0);
  matrix = create$1();
  
  constructor() {}

  getVM() {
    lookAt(
      this.matrix,
      this.position,
      this.target,
      this.up
    );
    rotateZ(
      this.matrix,
      this.matrix,
      radians(23)
    );
    return this.matrix;
  }
}

let cam = new Camera();

const canvas = document.getElementById('canvas');
const gl = canvas.getContext('webgl2')
 ?? canvas.getContext('experimental-webgl2');
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

function mainLoop() {
  gl.canvas.addEventListener('touchmove', (e) => {
    e.touches[0].clientX;
    e.touches[0].clientY;
    // alert(mouseX);
  });
  
  data.forEach((value) => {
    if(!value.isSun) {
      value.distance += 109;
      value.radius *= 10;
    } else {
      value.radius = 109;
    }
    value.sphere = new Sphere(
      gl,
      value.radius,
      value.name,
      value.texturePath
    );
    value.orbit = new Orbit(
      gl,
      value.distance,
      value.name
    );
  });

  let angleRot = 0;
  let angleRotSelf = 0;

  let sphereShader = new Shader(
    gl,
    source$1.vertexSource,
    source$1.fragmentSource
  );
  let orbitShader = new Shader(
    gl,
    source.vertexSource,
    source.fragmentSource
  );

  sphereShader.disconnectShader();
  orbitShader.disconnectShader();
  
  let proj = create$1();
  
  const render = (now) => {
    Renderer.clear(gl);
    now *= 0.001;

    perspective(
      proj,
      PI / 4,
      gl.canvas.width / gl.canvas.height,
      1, 80000
    );
    let view = cam.getVM();
    
    sphereShader.connectShader();
    sphereShader.setUniformMatrix4fv(
      gl,
      'u_proj',
      proj
    );
    sphereShader.setUniformMatrix4fv(
      gl,
      'u_view',
      view
    );
    
    let modelSphere = create$1();
    let modelOrbit = create$1();
    
    data.forEach((value) => {
      if(!value.sphere) return;
      identity(modelSphere);
      identity(modelOrbit);
      
      if(!value.isSun) {
        angleRot = (2 * PI * now / value.orbPeriod);
        angleRotSelf = (2 * PI * now * value.rotPeriod);
      } else {
        angleRot = 0;
        angleRotSelf = (2 * PI * now * value.rotPeriod);
      }
      translate(
        modelSphere,
        modelSphere,
        fromValues(
          value.distance *
            cos(radians(value.axisTilt)) *
            sin(angleRot),
          value.distance *
            sin(radians(value.axisTilt)) *
            sin(angleRot),
          value.distance * cos(angleRot),
        )
      );
      
      rotateX(
        modelSphere,
        modelSphere,
        radians(value.axisTilt)
      );
      rotateY(
        modelSphere,
        modelSphere,
        angleRotSelf
      );
      rotateX(modelSphere, modelSphere, radians(90));
      
      sphereShader.connectShader();
      sphereShader.setUniformMatrix4fv(
        gl,
        'u_model',
        modelSphere
      );
      sphereShader.setUniform1i(
        gl,
        'u_image',
        0
      );
      value.sphere.render(gl, sphereShader);
      
      rotateZ(
        modelOrbit,
        modelOrbit,
        radians(value.axisTilt)
      );
      
      orbitShader.connectShader();
      orbitShader.setUniformMatrix4fv(
        gl,
        'u_proj',
        proj
      );
      orbitShader.setUniformMatrix4fv(
        gl,
        'u_view',
        view
      );
      orbitShader.setUniformMatrix4fv(
        gl,
        'u_model',
        modelOrbit
      );
      if(!value.isSun && value.orbit)
        value.orbit.render(gl, orbitShader);
    });
    
    window.requestAnimationFrame(render);
  };

  window.requestAnimationFrame(render);
}

mainLoop();
