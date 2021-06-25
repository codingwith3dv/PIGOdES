import Shader from './lib/gl/shader/shader.js';
import Renderer from './lib/gl/renderer/renderer.js';
import * as mat4 from './lib/3d/mat4.js';
import * as vec3 from './lib/3d/vec3.js';
import Sphere, { source } from './lib/elements/sphere.js';
import { data } from './data-loader.js';

const canvas = document.getElementById('canvas');
const gl = canvas.getContext('webgl2')
// ?? canvas.getContext('experimental-webgl2');

function mainLoop() {
  data.forEach((value) => {
    value.sphere = new Sphere(gl, value.radius, value.name);
  });

  let cos = Math.cos;
  let sin = Math.sin;
  let PI = Math.PI;
  let radians = (d) => d * PI / 180;
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
    now *= 0.1;

    mat4.perspective(proj, PI / 2, gl.canvas.width / gl.canvas.height, 1, 2000);
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
      if(!value.sphere) return;
      mat4.identity(modelSphere);
      angleRot = (2 * PI * now / value.orbPeriod);
      angleRotSelf = (2 * PI * now * value.rotPeriod);
      mat4.translate(
        modelSphere,
        modelSphere,
        vec3.fromValues(
          value.distance * cos(radians(value.axisTilt)) * sin(angleRot),
          value.distance * sin(radians(value.axisTilt)) * sin(angleRot),
          value.distance * cos(angleRot),
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