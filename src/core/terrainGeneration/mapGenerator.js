import { TerrainCell } from "./terrainCell";
import { LCG } from "./LCG";

export class MapGenerator {
    constructor(app) {
        this.app = app;
        this.terrain = [];
        this.LCG = new LCG(234235252);
        
    }

    generatePerlinNoiseLayer(amplitude, wavelength, canvasWidth) {
        // amplitude tells us how high the peaks should be
        // wavelength tells us how far adjacent troughs should be to one another
        // this will be used to dictate the size of a single Perlin segment betweeen points A and points B
        // frequency tells us how often the entire wave should repeat
        let x = 0;
        let frequency = 1 / wavelength;
        let pseudoRandomNumberGenerator = this.LCG;
        let pointA = pseudoRandomNumberGenerator.next();
        let pointB = pseudoRandomNumberGenerator.next();
        let verticalDisplacementValues = [];

        while (x < canvasWidth) {
            // check base case, if current x position is a multiple of wavelength, if it is
            // then we know we are at the end of a segment, and should begin the next one.
            if (x % wavelength == 0) {
                // move to next segment of perlin noise generation
                pointA = pointB;
                pointB = pseudoRandomNumberGenerator.next();
                verticalDisplacementValues.push(pointA * amplitude);
            } else {
                let interpolationPosition  = (x % wavelength) / wavelength;
                let interpolatedValue = this.interpolatePoints(pointA, pointB, interpolationPosition);
                verticalDisplacementValues.push(interpolatedValue);
            }
            x++; // go to the next x position
        }

        return verticalDisplacementValues;
    }

    generatePerlinOctaves(amplitude, wavelength, numberOfOctaves, reductionFactor, canvasWidth) {
        var perlinOctaveLayers = [];
        for (let i = 0; i < numberOfOctaves; i++) {
            // generate multiple perlin noise octave layers 
            perlinOctaveLayers.push(this.generatePerlinNoiseLayer(amplitude, wavelength, canvasWidth));
            amplitude /= reductionFactor;
            wavelength /= reductionFactor;
        }

        return perlinOctaveLayers;
    }

    combinePerlin(perlinOctaveLayers) {
        let combinedPerlin = [];

    }

    // smooth interpolation function
    interpolatePoints(pointA, pointB, interpolationPos) {
        var scaledInterpolationPos  = interpolationPos * Math.PI;
        var interpolationFactor = (1 - Math.cos(scaledInterpolationPos )) * 0.5;
        return pointA * (1 - interpolationFactor) + pointB * interpolationFactor;
    }

    // need to find a better algorithm to implement either MPD or Perlin Noise for 1D terrain generation
    generateBitMapTerrain(width, height, roughness) {
        for (let i = 0; i < height; i++) {
            let row = [];  
            for (let j = 0; j < width; j++) {
                row.push(0);  
            }
            this.terrain.push(row);  
        }

        for (let x = 0; x < width; x++) {
            const heightOfTerrain = this.getRandomInteger(1, roughness + 1);
            for (let y = 0; y < heightOfTerrain; y++) {
                this.terrain[y][x] = 1;
            }
        }
        
        return this.terrain.reverse();
    }

    drawMap() {
        let startX = 50;
        let startY = 50;
        for (let x = 0; x < this.terrain[0].length; x++) {
                for (let y = 0; y < this.terrain.length; y++) {
                    if (this.terrain[y][x] == 1) {
                        console.log("Dean");
                        const cellWidth = 2;
                        const cellHeight = 2;
                        let terrainCell = new TerrainCell(this.app, (startX + (x * cellWidth)), (startY + (y * cellHeight)), cellWidth, cellHeight);
                        terrainCell.drawCell();
                    }
                }
            } 
    }

    getRandomInteger(min, max) {
        return Math.floor(Math.random() * (max-min)) + min;
    }
}
