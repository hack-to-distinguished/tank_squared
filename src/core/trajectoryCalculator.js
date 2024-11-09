import { Application, Graphics } from "pixi.js";

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
    this.bezier = null;
  }

  drawTrajectory() {
    // will need to use bezier curves and methods provided by pixijs in order to draw the trajectory of the bullet during transit
    // https://en.wikipedia.org/wiki/B%C3%A9zier_curve
    // https://pixijs.com/8.x/examples/graphics/advanced
    // create test bezier curve 
  }

  createBezier() {
    this.bezier = new Graphics();
    this.bezier.bezierCurveTo(100, 200, 200, 240, 100, 100, 100);
    this.bezier.stroke({
      width: 5,
      stroke: 0xaa0000
    });

    this.bezier.position.x = 200;
    this.bezier.position.y = 200;
    console.log("Bezier curve created!");

  }

  getBezierCurve() {
    if (this.bezier) {
      return this.bezier;
    } else {
      console.log("Bezier Curve not initialised!");
    }
  }
}
