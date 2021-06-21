import Shader from './lib/gl/shader/shader.js';
import Renderer from './lib/gl/renderer/renderer.js';
import * as mat4 from './lib/3d/mat4.js';
import * as vec3 from './lib/3d/vec3.js';
import Cube from './lib/elements/cube.js';
import { data } from './data-loader.js';

const canvas = document.getElementById('canvas');
const gl = canvas.getContext('webgl2')
// ?? canvas.getContext('experimental-webgl2');

const c = (
  val = 0
) => {
  return val / 255;
}

function mainLoop() {
  let view = mat4.create();
  mat4.lookAt(view, vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0));

  let cube = new Cube(gl, 1.0);

  let shader = new Shader(
    gl,
    Cube.source.vertexSource,
    Cube.source.fragmentSource
  );

  shader.disconnectShader();
  let angle = 0.5;
  let inc = 0.001;
  let proj = mat4.create();
  let model = mat4.create();
  mat4.translate(model, model, [0, 0, -5])
  const render = () => {
    Renderer.clear(gl);

    mat4.perspective(proj, Math.PI / 2, gl.canvas.width / gl.canvas.height, 1, 2000);

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
    shader.setUniformMatrix4fv(
      gl,
      'u_model',
      model
    );

    angle += inc;
    if (angle > 360 || angle < 0) inc = -inc;
    angle -= inc;
    mat4.rotateY(model, model, angle * Math.PI / 180);

    cube.render(gl, shader);

    window.requestAnimationFrame(render);
  }

  render();
}

mainLoop();