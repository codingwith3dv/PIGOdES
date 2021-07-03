import * as quat from '../../3d/quat.js';
import * as vec3 from '../../3d/vec3.js';
import * as mat4 from '../../3d/mat4.js';
import * as util from '../../utils/utils.js';

let rotateQuat = function(q, v) {
  let temp = quat.fromValues(v[0],v[1],v[2],0);
  quat.multiply(temp, q, temp);
  quat.multiply(temp, temp, quat.conjugate(quat.create(), q));
  return temp;
}

let getXAndY = (target, ev) => {
  let rect = target.getBoundingClientRect();
  return [
    ev.touches[0].clientX - rect.left,
    ev.touches[0].clientY - rect.top,
    0
  ];
}

function Camera(
  /** @type { HTMLCanvasElement } */
  canvas
) {
  let cameraPosition        = vec3.fromValues(-500, 0, 0);
  let cameraPositionDelta   = vec3.fromValues(0, 0, 0);
  let cameraLookAt          = vec3.create();
  let cameraDirection       = vec3.create();

  let cameraUp              = vec3.fromValues(0, 1, 0);
  let mousePosition         = vec3.create();
  
  let cameraPitch           = 0;
  let cameraHeading         = 0;
  
  let isMoving              = false;

  let view                  = mat4.create();
  
  this.update = () => {
    cameraDirection = util.normalize(util.sub(cameraLookAt, cameraPosition));
    
    let axis = util.cross(cameraDirection, cameraUp);
    let pitchQuat = quat.setAxisAngle(quat.create(), axis, cameraPitch);
    let headingQuat = quat.setAxisAngle(quat.create(), cameraUp, cameraHeading);
    
    let temp = quat.add(quat.create(),pitchQuat, headingQuat);
    quat.normalize(temp, temp);
    
    cameraDirection = rotateQuat(temp, cameraDirection);
    vec3.add(cameraPosition, cameraPosition, cameraPositionDelta);
    vec3.add(cameraLookAt, cameraPosition, cameraDirection);
    
    cameraHeading *= 0.5;
    cameraPitch *= 0.5;
    
    vec3.scale(cameraPositionDelta, cameraPositionDelta, 0.8);
    
    mat4.lookAt(
      view,
      cameraPosition,
      cameraLookAt,
      cameraUp
    );
  }
  
  let max = 3;
  this.changePitch = (deg) => {
    let degrees = Math.max(-max, Math.min(max, deg));
    cameraPitch += degrees;
    
    if(cameraPitch >  360) cameraPitch -= 360;
    if(cameraPitch < -360) cameraPitch += 360;
  }
  
  this.changeHeading = (deg) => {
    let degrees = Math.max(-max, Math.min(max, deg));
    
    if(
      cameraPitch > 90 &&
      cameraPitch < 270 ||
      (cameraPitch < -90 && cameraPitch > -270)
    ) {
      cameraHeading -= degrees;
    } else {
      cameraHeading += degrees;
    }
    
    if (cameraHeading >  360) cameraHeading -= 360;
    if (cameraHeading < -360) cameraHeading += 360;
  }
  
  let touchMove = (ev) => {
    let x_y_z = getXAndY(canvas, ev);
    let mouseDelta = util.sub(mousePosition, x_y_z);

    if(isMoving) {
      this.changeHeading(0.008 * mouseDelta[0]);
      this.changePitch(0.008 * mouseDelta[1]);
    }
    mousePosition = x_y_z;
  }
  let touchEnd = () => {
    if(isMoving) {
      isMoving = false;
      canvas.removeEventListener('touchmove', touchMove);
      canvas.removeEventListener('touchend', touchEnd);
      canvas.removeEventListener('touchcancel', touchEnd);
    }
  }
  let touchStart = (ev) => {
    mousePosition = getXAndY(canvas, ev);
    isMoving = true;
    canvas.addEventListener('touchmove', touchMove);
    canvas.addEventListener('touchend', touchEnd);
    canvas.addEventListener('touchcancel', touchEnd);
  }
  canvas.addEventListener('touchstart', touchStart);
  
  this.getVM = () => {
    return view;
  }
}

export {
  Camera as
  default
};