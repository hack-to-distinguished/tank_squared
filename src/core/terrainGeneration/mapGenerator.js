import { LCG } from "./LCG";
import { Graphics } from "pixi.js";

export class MapGenerator {
    constructor(app) {
        this.app = app;
        this.terrain = [];
        this.LCG = new LCG(12345);
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
                let interpolationPosition  = ((x % wavelength) / wavelength);
                let interpolatedValue = this.interpolatePoints(pointA, pointB, interpolationPosition) * amplitude;
                verticalDisplacementValues.push(interpolatedValue);
            }
            x++; // go to the next x position
        }

        return verticalDisplacementValues;
    }

    generatePerlinNoiseOctaves(amplitude, wavelength, numberOfOctaves, reductionFactor, canvasWidth) {
        var perlinOctaveLayers = [];
        for (let i = 0; i < numberOfOctaves; i++) {
            // generate multiple perlin noise octave layers 
            perlinOctaveLayers.push(this.generatePerlinNoiseLayer(amplitude, wavelength, canvasWidth));
            amplitude = amplitude / reductionFactor;
            wavelength /= reductionFactor;
        }

        return perlinOctaveLayers;
    }

    combinePerlin(perlinOctaveLayers) {
        let combinedPerlin = [];
        for (let i = 0; i < perlinOctaveLayers[0].length; i++) {
            let totalCombinedValue = 0;
            for (let j = 0; j < perlinOctaveLayers.length; j ++) {
                totalCombinedValue += perlinOctaveLayers[j][i];
            }
            combinedPerlin.push(totalCombinedValue);
        }
        return combinedPerlin;
    }

    // smooth interpolation function
    interpolatePoints(pointA, pointB, interpolationPos) {
        var scaledInterpolationPos  = interpolationPos * Math.PI;
        var interpolationFactor = (1 - Math.cos(scaledInterpolationPos )) * 0.5;
        return (pointA * (1 - interpolationFactor)) + (pointB * interpolationFactor);
    }

    scalePerlinNoiseValuesToPixi(perlinNoise, canvasHeight, amplitude) {
        let scaledPixiValues = [];
        const yMin = Math.min(...perlinNoise);
        const yMax = Math.max(...perlinNoise);
        for (let i = 0; i < perlinNoise.length; i++) {
            let normalisedYValue = (perlinNoise[i] - yMin) / (yMax - yMin);
            let scaledYValue = ((normalisedYValue * canvasHeight) /(100 / Math.sqrt(amplitude))) + (canvasHeight / 2);
            scaledPixiValues.push(scaledYValue);
        }
        return scaledPixiValues;
    }

    // need to find a better algorithm to implement either MPD or Perlin Noise for 1D terrain generation
    generateBitMapTerrain(app) {
        const amplitude = 128;
        const perlinNoise = this.combinePerlin(this.generatePerlinNoiseOctaves(amplitude, 128, 2, 2, this.app.canvas.width));
        const scaledValues = this.scalePerlinNoiseValuesToPixi(perlinNoise, this.app.canvas.height, amplitude);

        let graphic = new Graphics();
        graphic.moveTo(0, scaledValues[0]);
        for (let x = 1; x < scaledValues.length; x++) {
            graphic.lineTo(x, scaledValues[x]);
        }

        graphic.stroke({ width: 2, color: 0xffffff });

        app.stage.addChild(graphic);
    }

    drawMap() {
        // let startX = 50;
        // let startY = 50;
        // for (let x = 0; x < this.terrain[0].length; x++) {
        //         for (let y = 0; y < this.terrain.length; y++) {
        //             if (this.terrain[y][x] == 1) {
        //                 console.log("Dean");
        //                 const cellWidth = 2;
        //                 const cellHeight = 2;
        //                 let terrainCell = new TerrainCell(this.app, (startX + (x * cellWidth)), (startY + (y * cellHeight)), cellWidth, cellHeight);
        //                 terrainCell.drawCell();
        //             }
        //         }
        //     } 
    }

    getRandomInteger(min, max) {
        return Math.floor(Math.random() * (max-min)) + min;
    }
}
