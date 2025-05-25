
class Camera {
    
    constructor(canvas) {
      this.canvas = canvas;
  
      this.fov = 60;
      this.eye = new Vector3([0, 0, 3]);
      this.at = new Vector3([0, 0, -1]);
      this.up = new Vector3([0, 1, 0]);
  
      // movement parameters
      this.speed = 0.2;
      this.panAngle = 5; // degrees per pan
  
      this.viewMatrix = new Matrix4();
      this.projectionMatrix = new Matrix4();
  
      // initialize matrices
      this.viewMatrix.setLookAt(
        this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
        this.at.elements[0], this.at.elements[1], this.at.elements[2],
        this.up.elements[0], this.up.elements[1], this.up.elements[2]
      );
      this.projectionMatrix.setPerspective(
        this.fov,
        this.canvas.width / this.canvas.height,
        0.1,
        1000
      );
    }
  
    moveForward() {
      let f = new Vector3();
      f.set(this.at);
      f.sub(this.eye);
      f.normalize();
      f.mul(this.speed);
  
      this.eye.add(f);
      this.at.add(f);
  
      this.viewMatrix.setLookAt(
        this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
        this.at.elements[0], this.at.elements[1], this.at.elements[2],
        this.up.elements[0], this.up.elements[1], this.up.elements[2]
      );
    }
  
    moveBackwards() {
      let b = new Vector3();
      b.set(this.eye);
      b.sub(this.at);
      b.normalize();
      b.mul(this.speed);
  
      this.eye.add(b);
      this.at.add(b);
  
      this.viewMatrix.setLookAt(
        this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
        this.at.elements[0], this.at.elements[1], this.at.elements[2],
        this.up.elements[0], this.up.elements[1], this.up.elements[2]
      );
    }
  
    moveLeft() {
      // f = at - eye
      let f = new Vector3();
      f.set(this.at);
      f.sub(this.eye);
  
      // s = up x f
      let s = Vector3.cross(this.up, f);
      s.normalize();
      s.mul(this.speed);
  
      this.eye.add(s);
      this.at.add(s);
  
      this.viewMatrix.setLookAt(
        this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
        this.at.elements[0], this.at.elements[1], this.at.elements[2],
        this.up.elements[0], this.up.elements[1], this.up.elements[2]
      );
    }
  
    moveRight() {
      let f = new Vector3();
      f.set(this.at);
      f.sub(this.eye);
  
      let s = Vector3.cross(f, this.up);
      s.normalize();
      s.mul(this.speed);
  
      this.eye.add(s);
      this.at.add(s);
  
      this.viewMatrix.setLookAt(
        this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
        this.at.elements[0], this.at.elements[1], this.at.elements[2],
        this.up.elements[0], this.up.elements[1], this.up.elements[2]
      );
    }
  
    panLeft() {
      this._pan(this.panAngle);
    }
  
    panRight() {
      this._pan(-this.panAngle);
    }
  
    _pan(angleDegrees) {
      // f = at - eye
      let f = new Vector3();
      f.set(this.at);
      f.sub(this.eye);
  
      // rotation matrix
      let rotMat = new Matrix4();
      rotMat.setRotate(angleDegrees, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
  
      // f_prime = rotMat * f
      let f_prime = rotMat.multiplyVector3(f);
  
      // at = eye + f_prime
      this.at.set(this.eye);
      this.at.add(f_prime);
  
      this.viewMatrix.setLookAt(
        this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
        this.at.elements[0], this.at.elements[1], this.at.elements[2],
        this.up.elements[0], this.up.elements[1], this.up.elements[2]
      );
    }

    rotateHorizontally(angleDegrees) {
      // Calculate f = at - eye
      let f = new Vector3();
      f.set(this.at);
      f.sub(this.eye);
    
      // Rotate f around the up vector
      let rotMat = new Matrix4();
      rotMat.setRotate(angleDegrees, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    
      let f_prime = rotMat.multiplyVector3(f);
    
      // Update at = eye + rotated forward vector
      this.at.set(this.eye);
      this.at.add(f_prime);
    
      this.viewMatrix.setLookAt(
        this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
        this.at.elements[0], this.at.elements[1], this.at.elements[2],
        this.up.elements[0], this.up.elements[1], this.up.elements[2]
      );
    }
    rotateVertically(angleDegrees) {
      // f = at - eye
      let f = new Vector3();
      f.set(this.at);
      f.sub(this.eye);
    
      // right = f x up
      let right = Vector3.cross(f, this.up);
      right.normalize();
    
      // rotation matrix around right axis
      let rotMat = new Matrix4();
      rotMat.setRotate(angleDegrees, right.elements[0], right.elements[1], right.elements[2]);
    
      let f_prime = rotMat.multiplyVector3(f);
    
      // Recalculate up vector to avoid gimbal lock
      let newUp = Vector3.cross(right, f_prime);
      newUp.normalize();
    
      this.at.set(this.eye);
      this.at.add(f_prime);
      this.up = newUp;
    
      this.viewMatrix.setLookAt(
        this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
        this.at.elements[0], this.at.elements[1], this.at.elements[2],
        this.up.elements[0], this.up.elements[1], this.up.elements[2]
      );
    }
    
    
  }
  
  window.Camera = Camera;
  