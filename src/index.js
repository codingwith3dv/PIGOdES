import Shader from './lib/gl/shader/shader.js';
import Renderer from './lib/gl/renderer/renderer.js';
import * as mat4 from './lib/3d/mat4.js';
import * as vec3 from './lib/3d/vec3.js';
import Sphere, { SphereSource } from './lib/elements/sphere/sphere.js';
import { data } from './data-loader.js';
import * as util from './lib/utils/utils.js';

const canvas = document.getElementById('canvas');
const gl = canvas.getContext('webgl2')
 ?? canvas.getContext('experimental-webgl2');
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

function mainLoop() {
  data.forEach((value) => {
    if(!value.isSun) {
      value.distance += 109;
    } else {
      value.radius = 109;
    }
    value.sphere = new Sphere(
      gl,
      value.radius,
      value.name,
      value.texturePath
    );
  });

  let angleRot = 0;
  let angleRotSelf = 0;
  let then = 0;

  let shader = new Shader(
    gl,
    SphereSource.vertexSource,
    SphereSource.fragmentSource
  );

  shader.disconnectShader();
  
  let proj = mat4.create();
  let view = mat4.create();
  
  const render = (now) => {
    Renderer.clear(gl);
    now *= 0.01;

    mat4.perspective(
      proj,
      util.PI / 4,
      gl.canvas.width / gl.canvas.height,
      1, 2000
    );
    mat4.lookAt(
      view,
      [-1200, 0, 0],
      [0, 0, 0],
      [0, 1, 0]
    );
    mat4.rotateZ(
      view,
      view,
      util.radians(90)
    );
    
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
      
      if(!value.isSun) {
        angleRot = (2 * util.PI * now / value.orbPeriod);
        angleRotSelf = (2 * util.PI * now * value.rotPeriod);
      } else {
        angleRot = 0;
        angleRotSelf = (2 * util.PI * now * value.rotPeriod);
      }
      mat4.translate(
        modelSphere,
        modelSphere,
        vec3.fromValues(
          value.distance *
            util.cos(util.radians(value.axisTilt)) *
            util.sin(angleRot),
          value.distance *
            util.sin(util.radians(value.axisTilt)) *
            util.sin(angleRot),
          value.distance * util.cos(angleRot),
        )
      );
      
      mat4.rotateX(
        modelSphere,
        modelSphere,
        util.radians(value.axisTilt)
      );
      mat4.rotateY(
        modelSphere,
        modelSphere,
        angleRotSelf
      );
      mat4.rotateX(modelSphere, modelSphere, util.radians(90));
      
      shader.setUniformMatrix4fv(
        gl,
        'u_model',
        modelSphere
      );
      shader.setUniform1i(
        gl,
        'u_image',
        0
      );
      value.sphere.render(gl, shader);
    });
    
    window.requestAnimationFrame(render);
  }

  window.requestAnimationFrame(render);
}

mainLoop();