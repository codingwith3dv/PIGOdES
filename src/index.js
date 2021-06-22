import Shader from './lib/gl/shader/shader.js';
import Renderer from './lib/gl/renderer/renderer.js';
import * as mat4 from './lib/3d/mat4.js';
import * as vec3 from './lib/3d/vec3.js';
import Cube, { source } from './lib/elements/cube.js';
import { data } from './data-loader.js';

const canvas = document.getElementById('canvas');
const gl = canvas.getContext('webgl2')
// ?? canvas.getContext('experimental-webgl2');

function mainLoop() {
  let view = mat4.create();
  mat4.lookAt(view, vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0));

  data.forEach((value, key) => {
    data.get(key).sphere = new Cube(gl, value.radius);
  });

  let cos = Math.cos
  let sin = Math.sin
  let radians = (d) => d * Math.PI / 180
  let angleRot = 0

  let shader = new Shader(
    gl,
    source.vertexSource,
    source.fragmentSource
  );

  shader.disconnectShader();
  let angle = 0.5;
  let inc = 0.001;
  let proj = mat4.create();
  const render = () => {
    Renderer.clear(gl);
    angleRot = angleRot + 0.1

    mat4.perspective(proj, Math.PI / 2, gl.canvas.width / gl.canvas.height, 1, 2000);
    mat4.lookAt(view, vec3.fromValues(0, 0, -20), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0));

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
    
    let modelSphere = mat4.create();
    
    data.forEach((value, key) => {
      mat4.translate(
        modelSphere,
        modelSphere,
        vec3.fromValues(
          value.distance * cos(radians(value.axisTilt)) * sin(angleRot),
          value.distance * sin(radians(value.axisTilt)) * sin(angleRot),
          value.distance * cos(angleRot)
        )
      );
      mat4.rotate(
        modelSphere,
        modelSphere,
        radians(value.axisTilt),
        [1, 0, 0]
      );
      shader.setUniformMatrix4fv(
        gl,
        'u_model',
        modelSphere
      );
      value.sphere.render(gl, shader);
    });
    
    window.requestAnimationFrame(render);
  }

  render();
}

mainLoop();