export class Converter {
    constructor(scaleFactor) {
        this.scaleFactor = scaleFactor;
    }

    getScaleFactor() {
        return this.scaleFactor;
    }

    convertDegreesToRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
}
