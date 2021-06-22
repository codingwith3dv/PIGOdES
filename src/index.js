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
  data.forEach((value) => {
    value.sphere = new Cube(gl, value.radius);
  });

  let cos = Math.cos;
  let sin = Math.sin;
  let radians = (d) => d * Math.PI / 180;
  let angleRot = 0;
  let angleRotSelf = 0;
  let then = 0;

  let shader = new Shader(
    gl,
    source.vertexSource,
    source.fragmentSource
  );

  shader.disconnectShader();
  
  let proj = mat4.create();
  let view = mat4.create();
  
  const render = (now) => {
    Renderer.clear(gl);
    now *= 0.01;

    mat4.perspective(proj, Math.PI / 2, gl.canvas.width / gl.canvas.height, 1, 2000);
    mat4.lookAt(view, [0, 0, 0], [0, 0, 0], [0, 0, 1]);
    
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
    
    data.forEach((value) => {
      angleRot = (2 * Math.PI * now / value.orbPeriod);
      value.axisTilt = 0
      // angleRotSelf = (2 * Math.PI * now * value.rotPeriod);
      mat4.translate(
        modelSphere,
        modelSphere,
        vec3.fromValues(
          value.distance * cos(radians(value.axisTilt)) * sin(angleRot),
          value.distance * sin(radians(value.axisTilt)) * sin(angleRot),
          value.distance  * cos(angleRot),
        )
      );
      
      mat4.rotateX(
        modelSphere,
        modelSphere,
        radians(value.axisTilt)
      );
      mat4.rotateY(
        modelSphere,
        modelSphere,
        angleRotSelf
      );
      mat4.rotateX(modelSphere, modelSphere, radians(90));
      
      shader.setUniformMatrix4fv(
        gl,
        'u_model',
        modelSphere
      );
      value.sphere.render(gl, shader);
    });
    
    window.requestAnimationFrame(render);
  }

  window.requestAnimationFrame(render);
}

mainLoop();