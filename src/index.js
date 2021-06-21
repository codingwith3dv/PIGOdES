import Shader from './lib/gl/shader/shader.js';
import Renderer from './lib/gl/renderer/renderer.js';
import * as mat4 from './lib/3d/mat4.js';
import * as vec3 from './lib/3d/vec3.js';
import Cube from './lib/elements/cube.js';

const canvas = document.getElementById('canvas');
const gl = canvas.getContext('webgl2')
// ?? canvas.getContext('experimental-webgl2');

const c = (
  val = 0
) => {
  return val / 255;
}

function mainLoop() {
  
  let proj = mat4.create();
  mat4.perspective(proj, 45 * Math.PI / 2, canvas.clientWidth / canvas.clientHeight, 1 / 256, 256);
  mat4.translate(proj, proj, [0, 0, -5]);
  
  let view = mat4.create();
  mat4.lookAt(view, vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 1));
  
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
    mat4.rotateX(proj, proj, angle * Math.PI / 180);
    mat4.rotateY(proj, proj, angle * 0.7 * Math.PI / 180);
    mat4.rotateZ(proj, proj, angle * 0.4 * Math.PI / 180);
    cube.render(gl, shader);
    
    window.requestAnimationFrame(render);
  }
  
  render();
}

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

mainLoop();