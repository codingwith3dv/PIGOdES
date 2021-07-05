import Shader from './lib/gl/shader/shader.js';
import Renderer from './lib/gl/renderer/renderer.js';
import * as mat4 from './lib/3d/mat4.js';
import * as vec3 from './lib/3d/vec3.js';
import Sphere, { SphereSource } from './lib/elements/sphere/sphere.js';
import Orbit, { OrbitSource } from './lib/elements/orbit/orbit.js';
import { data } from './data-loader.js';
import * as util from './lib/utils/utils.js';
import Camera from './lib/gl/camera/camera.js';

const canvas = document.getElementById('canvas');
const accordion_list = document.getElementById('accordion-list');

/** @type {WebGL2RenderingContext} */
const gl = canvas.getContext('webgl2')
 ?? canvas.getContext('experimental-webgl2');
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

const cam = new Camera(canvas);

function mainLoop() {
  data.forEach((value) => {
    if(!value.isSun) {
      value.distance += 109;
      value.radius *= 1;

      // creating the info of the planets
      let child = document.createElement('div');
      let summary = document.createElement('button');
      summary.innerHTML = value.name;
      summary.classList.add('full-info-button');
      child.appendChild(summary);
      let full_info = `name: ${value.name}
      radius: ${parseInt(value.radius * (12756 / 8))}
      distance from sun: ${parseInt(value.distance - 109)}
      orbital inclination: ${value.axisTilt}
      `;
      let full_info_elem = document.createElement('div');
      full_info_elem.innerText = full_info;
      full_info_elem.classList.add('full-info');
      child.appendChild(full_info_elem);
      accordion_list.appendChild(child);
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
  let then = 0;

  let sphereShader = new Shader(
    gl,
    SphereSource.vertexSource,
    SphereSource.fragmentSource
  );
  let orbitShader = new Shader(
    gl,
    OrbitSource.vertexSource,
    OrbitSource.fragmentSource
  );

  sphereShader.disconnectShader();
  orbitShader.disconnectShader();

  let proj = mat4.create();

  const render = (now) => {
    Renderer.clear(gl);
    now *= 0.001;

    mat4.perspective(
      proj,
      util.PI / 4,
      gl.canvas.width / gl.canvas.height,
      1, 80000
    );
    cam.update();
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

    let modelSphere = mat4.create();
    let modelOrbit = mat4.create();

    data.forEach((value) => {
      if(!value.sphere) return;
      mat4.identity(modelSphere);
      mat4.identity(modelOrbit);

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

      mat4.rotateZ(
        modelOrbit,
        modelOrbit,
        util.radians(value.axisTilt)
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
  }

  window.requestAnimationFrame(render);
}

mainLoop();
