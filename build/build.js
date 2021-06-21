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
}

class Renderer {
  static clear(gl) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }
  static draw(gl, va, ib, shader) {
    shader.connectShader();
    va.connectVertexArray();
    ib.connectIndexBuffer();
    
    gl.drawElements(
      gl.TRIANGLES,
      ib.getCount(),
      gl.UNSIGNED_SHORT,
      null
    );
  }
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

class Cube {
  static source = {
    vertexSource: `#version 300 es
      layout(location = 0) in vec3 a_position;
      layout(location = 1) in float a_op;
      uniform mat4 u_proj;
      uniform mat4 u_view;
      out vec4 v_color;
      
      void main(void) {
        gl_Position = u_proj * u_view * vec4(a_position, 1.0);
        v_color = vec4(0.2, 0.6, 0.8, a_op);
      }
      `,
    fragmentSource: `#version 300 es
    precision highp float;
      in vec4 v_color;
      out vec4 color;
      void main(void) {
        color = v_color;
      }
      `
  };
  vao = null;
  ibo = null;
  constructor(gl, l) {
    this.init(gl, l);
  }

  init(gl, l) {
    let op1 = 0.1;
    let op2 = 0.2;
    let op3 = 0.3;
    let op4 = 0.4;
    let op5 = 0.5;
    let op6 = 0.6;
    let vertex = [
      // front
      -l, -l, -l, op1,
       l, -l, -l, op1,
       l,  l, -l, op1,
      -l,  l, -l, op1,

      // back
      -l, -l,  l, op2,
      -l,  l,  l, op2,
       l,  l,  l, op2,
       l, -l,  l, op2,
       
      // left
      -l, -l,  l, op3,
      -l, -l, -l, op3,
      -l,  l, -l, op3,
      -l,  l,  l, op3,
       
      // right
       l, -l, -l, op4,
       l, -l,  l, op4,
       l,  l,  l, op4,
       l,  l, -l, op4,
       
      // top
      -l,  l, -l, op5,
       l,  l, -l, op5,
       l,  l,  l, op5,
      -l,  l,  l, op5,
      
      // bottom
       l, -l,  l, op6,
      -l, -l,  l, op6,
      -l, -l, -l, op6,
       l, -l, -l, op6
    ];
    let indices = [
       0,  1,  2,  2,  3,  0,
       4,  5,  6,  6,  7,  4,
       8,  9, 10, 10, 11,  8,
      12, 13, 14, 14, 15, 12,
      16, 17, 18, 18, 19, 16,
      20, 21, 22, 22, 23, 20
    ];
    
    this.vao = new VertexArray(gl);
    let vb = new VertexBuffer(
      gl,
      new Float32Array(vertex)
    );
    let vbl = new VertexBufferLayout(gl);
    vbl.pushBack(3, gl.FLOAT, false);
    vbl.pushBack(1, gl.FLOAT, false);
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
    Renderer.draw(gl, this.vao, this.ibo, shader);
  }
}

const canvas = document.getElementById('canvas');
const gl = canvas.getContext('webgl2');

function mainLoop() {
  
  let proj = create$1();
  perspective(proj, Math.PI / 2, 1, 1 / 256, 256);
  translate(proj, proj, [0, 0, -5]);
  
  let view = create$1();
  lookAt(view, fromValues(0, 0, 0), fromValues(0, 0, 0), fromValues(0, 0, 1));
  
  let cube = new Cube(gl, 2.0);
  
  let shader = new Shader(
    gl,
    Cube.source.vertexSource,
    Cube.source.fragmentSource
  );
  
  shader.disconnectShader();
  let angle = 0.5;
  let inc = 0.001;
  
  const render = () => {
    Renderer.clear(gl);
    gl.viewport(0, 0, 600, 600);
    
    shader.connectShader();
    shader.setUniformMatrix4fv(
      gl,
      'u_proj',
      proj
    );
    shader.setUniformMatrix4fv(
      gl,
      'u_view',
      view
    );
    
    angle += inc;
    if(angle > 360 || angle < 0) inc = -inc;
    angle -= inc;
    rotateX(proj, proj, angle * Math.PI / 180);
    rotateY(proj, proj, angle * 0.7 * Math.PI / 180);
    rotateZ(proj, proj, angle * 0.4 * Math.PI / 180);
    cube.render(gl, shader);
    
    window.requestAnimationFrame(render);
  };
  
  render();
}

mainLoop();
