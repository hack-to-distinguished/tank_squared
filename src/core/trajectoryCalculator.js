
export class trajectoryCalculator {
  constructor(app, angle, initialVelocity) {
    this.app = app;
    this.angle = angle;
    this.initialVelocity = initialVelocity;
    this.gravity = 9.8;
    this.angleRadians = angle * (Math.PI / 180);
    this.timeOfFlight = (2 * this.initialVelocity * Math.sin(this.angleRadians)) / this.gravity;
    this.maxHeight = Math.pow(this.initialVelocity * Math.sin(this.angleRadians), 2) / (2 * this.gravity);
    this.range = (Math.pow(this.initialVelocity, 2) * Math.sin(2 * this.angleRadians)) / this.gravity;
  }
  drawTrajectory() {
    // will need to use bezier curves and methods provided by pixijs in order to draw the trajectory of the bullet during transit
  }
}
