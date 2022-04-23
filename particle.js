class Particle { // The particle class
  
    constructor(pos, vel, acc) {
      // All of these should be vectors
      this.pos = pos; // Position
      this.vel = vel; // Velocity
      this.acc = acc; // Acceleration
      // Array of previous position vectors
      this.trail = [this.pos.copy()];
    }
    
    show() { // To draw the particle on the screen
      // Loop through trail positions and draw lines
      for (let i = 0; i < this.trail.length - 1; i++) {
        let ax = this.trail[i].x;
        let ay = this.trail[i].y;
        let bx = this.trail[i+1].x;
        let by = this.trail[i+1].y;
        line(ax, ay, bx, by);
      }
      // Draw particle as a circle
      circle(this.pos.x, this.pos.y, 10);
    }
    
    update() { // Apply accelerations and velocities
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      // Add the new position to the list of trails
      this.trail.push(this.pos.copy());
    }
    
    drawForce(_v, force) { // Draw E and M forces
      if (force == ELECTRIC) {
        stroke(229, 158, 27, 255); // E color
      } else if (force == MAGNETIC) {
        stroke(27, 111, 229, 255); // M color
      }
      
      let v = _v.copy();
      // Scale up the vector so that it can be seen
      v.mult(250);
      let b = v.copy();
      b.add(this.pos);
      line(this.pos.x, this.pos.y, b.x, b.y);
      stroke(0); // Reset stroke color
    }
    
  }