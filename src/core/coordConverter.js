export class coordConverter {
    constructor(scaleFactor) {
        this.scaleFactor = scaleFactor;
    }

    getScaleFactor() {
        return this.scaleFactor;
    }

    convertPlanckYToPixiY(app, planckY) {
        return (app.renderer.height - (planckY * this.scaleFactor));
    }
    
    convertPlanckXtoPixiX(planckX) {
        return (planckX * this.scaleFactor);
    }

    convertPixiXtoPlanckX(pixiX) {
        return pixiX / this.scaleFactor;
    }

    convertPixiYToPlanckY(app, pixiY) {
        return (app.renderer.height - pixiY) / this.scaleFactor;
    }

    convertDegreesToRadians(degrees) {
        return degrees * (Math.PI / 180); 
    }
}
