import { Sprite } from "pixi.js";
import { Vec2, Circle, RevoluteJoint } from "planck";

export class TankPlayer {
    constructor(playerX, playerY, app, playerTexture, scale, coordConverter, world, shellTexture) {
        this.world = world;
        this.coordConverter = coordConverter;
        this.app = app;
        this.playerX = playerX;
        this.playerY = playerY;
        this.playerSpeed = 35;
        this.keys = {};
        this.bullets = [];
        this.moveDist = 30;
        this.playerTexture = playerTexture;
        this.world = world;
        this.playerBody = null;
        this.scale = scale;
        this.wheelFront = null;
        this.springFront = null;
        this.springBack = null;
        this.physicalShell = null;
        this.shellTexture = shellTexture;
        this.shellSprite = null;
    }

    // INFO: Player Code
    async initialisePlayerSprite() {
        //INFO: Player physical body
        //TODO: 1.Resize the cannon balls and make them shoot from proper point 2.Move bullet code to bullet.js instead of player.js 3.Re-Apply the turn by turn
        this.playerBody = this.world.createBody({
            type: "dynamic",
            position: Vec2(this.playerX / this.scale, this.playerY / this.scale),
            gravityScale: 3
        })
        const [playerWidth, playerHeight] = [100 / this.scale, 70 / this.scale];

        const vertices = [Vec2(-1.7, -1), Vec2(1, -1), Vec2(2, -0.25), Vec2(1, 1), Vec2(-1.7, 1)];
        this.playerBody.createFixture({
            shape: planck.Polygon(vertices),
            density: 0.75,
            friction: 0.1,
            restitution: 0.01
        })

        let [planckX, planckY] = [this.playerBody.getPosition().x, this.playerBody.getPosition().y] // x,y position according to planck
        const wheelFD = { density: 1, friction: 0.9 }

        let wheelBack = this.world.createBody({ type: "dynamic", position: Vec2(planckX - 1.4, planckY - 1.2) })
        wheelBack.createFixture(new Circle(0.2), wheelFD)
        let wheelFront = this.world.createBody({ type: "dynamic", position: Vec2(planckX + 1, planckY - 1.2) })
        wheelFront.createFixture(new Circle(0.2), wheelFD)
        this.wheelFront = wheelFront;

        const restitutionValue = 0.05;
        const maxMotorTorque = 50;
        const initialMotorSpeed = 0.0;
        const frequencyHz = 100;
        const dampingRatio = 1;
        this.springBack = this.world.createJoint(
            new RevoluteJoint({
                motorSpeed: initialMotorSpeed, maxMotorTorque: maxMotorTorque, restitution: restitutionValue,
                enableMotor: true, frequencyHz: frequencyHz, dampingRatio: dampingRatio
            }, this.playerBody, wheelBack, wheelBack.getPosition()));

        this.springFront = this.world.createJoint(
            new RevoluteJoint({
                motorSpeed: initialMotorSpeed, maxMotorTorque: maxMotorTorque, restitution: restitutionValue,
                enableMotor: true, frequencyHz: frequencyHz, dampingRatio: dampingRatio
            }, this.playerBody, wheelFront, wheelFront.getPosition()));


        // INFO: Player Sprite
        const playerSprite = Sprite.from(this.playerTexture);
        playerSprite.anchor.set(0.5, 0.5);

        const [spriteWidth, spriteHeight] = [100, 70];
        playerSprite.scale.set(spriteWidth / this.playerTexture.width, spriteHeight / this.playerTexture.height);
        playerSprite.x = this.playerX;
        playerSprite.y = this.playerY;
        this.playerSprite = playerSprite;

        this.app.stage.addChild(this.playerSprite);
    }

    updatePlayer() {
        const bodyPosition = this.playerBody.getPosition();
        console.log("SB Joint Speed: ", this.springBack.getJointSpeed(), "SF Joint Speed: ", this.springFront.getJointSpeed());

        this.playerSprite.x = bodyPosition.x * this.scale;
        this.playerSprite.y = this.app.renderer.height - (bodyPosition.y * this.scale);
        this.playerSprite.rotation = -this.playerBody.getAngle();
    }


    movePlayer() {
        if (this.moveDist > 0) {
            if (this.keys['68']) {
                this.springFront.setMotorSpeed(-this.playerSpeed);
                this.springFront.enableMotor(true);
                this.springBack.setMotorSpeed(-this.playerSpeed);
                this.springBack.enableMotor(true);

                this.playerSprite.scale.x = Math.abs(this.playerSprite.scale.x);
            } else if (this.keys['65']) {
                this.springFront.setMotorSpeed(+this.playerSpeed);
                this.springFront.enableMotor(true);
                this.springBack.setMotorSpeed(+this.playerSpeed);
                this.springBack.enableMotor(true);

                this.playerSprite.scale.x = -Math.abs(this.playerSprite.scale.x);
            } else if (!this.keys["65"] || !this.keys["68"]) {
                this.springFront.setMotorSpeed(0);
                this.springFront.enableMotor(false);
                this.springBack.setMotorSpeed(0);
                this.springBack.enableMotor(false);
            }
        }
    }

    resetMoveDist() {
        this.moveDist = 30;
    }


    async initialiseShellSprite(velX, velY) {
        const bodyPos = this.playerBody.getPosition();
        this.physicalShell = this.world.createBody({
            type: "dynamic",
            position: Vec2(bodyPos.x, bodyPos.y + 1),
            fixedRotation: true,
            gravityScale: 0.5,
            bullet: true,
            linearVelocity: Vec2(velX, velY * 2),
        });
        const shellFD = { friction: 0.3, density: 1 };

        // INFO: Creating the shell sprite
        const shellSprite = Sprite.from(this.shellTexture);
        shellSprite.anchor.set(0.5, 0.5);

        const [spriteWidth, spriteHeight] = [10, 10];
        shellSprite.scale.set(spriteWidth / this.shellTexture.width, spriteHeight / this.shellTexture.height);
        shellSprite.x = bodyPos.x * this.scale;
        shellSprite.y = this.app.renderer.height - (bodyPos.y * this.scale) + 1;

        this.shellSprite = shellSprite;
        this.app.stage.addChild(this.shellSprite);
        this.shellSprite.visible = false;
    }

    async openFire(velX, velY) {
        const bodyPos = this.playerBody.getPosition();

        this.physicalShell = this.world.createBody({
            type: "dynamic",
            position: Vec2(bodyPos.x, bodyPos.y + 1),
            fixedRotation: true,
            gravityScale: 0.5,
            bullet: true,
            linearVelocity: Vec2(velX, velY * 2),
        });

        const shellFD = { friction: 0.3, density: 1 };
        this.physicalShell.createFixture(new Circle(0.2), shellFD);

        this.shellSprite.x = bodyPos.x * this.scale;
        this.shellSprite.y = this.app.renderer.height - (bodyPos.y * this.scale);
        this.shellSprite.visible = true;
    }


    updateShell() {
        if (this.physicalShell) {
            const bodyPos = this.physicalShell.getPosition();
            this.shellSprite.x = bodyPos.x * this.scale;
            this.shellSprite.y = this.app.renderer.height - (bodyPos.y * this.scale);

            // TODO: replace this with dissapear if collision with something
            //console.log("Check collision", this.physicalShell.getContactList());
            const isOutOfBounds = bodyPos.y < -10 || bodyPos.x < -10;
            if (isOutOfBounds) {
                this.shellSprite.visible = false;
                this.world.destroyBody(this.physicalShell);
                this.physicalShell = null; // Reset the shell
                return 0;
            }
        }
    }


    checkSpaceBarInput() {
        return this.keys['32'] === true;
    }

    // INFO: Keyboard control
    setupKeyboardControls() {
        window.addEventListener("keydown", this.keysDown.bind(this));
        window.addEventListener("keyup", this.keysUp.bind(this));
    }

    keysDown(e) {
        if (e.keyCode == 68) {
            this.keys[e.keyCode] = true;
        } else if (e.keyCode == 65) {
            this.keys[e.keyCode] = true;
        } else if (e.keyCode == 32 && (this.keys["68"] == false || this.keys["65"] == false)) {
            this.keys[e.keyCode] = true;
        }
    }

    keysUp(e) {
        if (e.keyCode == 68) {
            this.keys[e.keyCode] = false;
        } else if (e.keyCode == 65) {
            this.keys[e.keyCode] = false;
        } else if (e.keyCode == 32) {
            this.keys[e.keyCode] = false;
        }
    }
};
