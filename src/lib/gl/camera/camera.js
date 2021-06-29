import * as vec3 from '../../3d/vec3.js';
import * as mat4 from '../../3d/mat4.js';
import * as util from '../../utils/utils.js';

class Camera {
  position = vec3.fromValues(-1000, 0, 0);
  target = vec3.fromValues(0, 0, 0);
  up = vec3.fromValues(0, 1, 0);
  matrix = mat4.create();
  trackingMouse = false;
  lastX = 0;
  lastY = 0;

  constructor() {}

  getVM() {
    mat4.lookAt(
      this.matrix,
      this.position,
      this.target,
      this.up
    );
    mat4.rotateZ(
      this.matrix,
      this.matrix,
      util.radians(23)
    );
    return this.matrix;
  }

  mouseUp(ev) {
    this.trackingMouse = false;
  }
  mouseDown(ev) {
    this.trackingMouse = true;
  }
  mouseMove(ev) {
    let rect = ev.currentTarget.getBoundingClientRect();
    let x = ev.clientX - rect.top;
    let y = ev.clientY - rect.left;
    console.log(deltaX);
  }
}

export {
  Camera as default
};
