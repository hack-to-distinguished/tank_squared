import { Sprite, Graphics, Container, EventEmitter } from "pixi.js";
import { Vec2, Circle, RevoluteJoint, Polygon } from "planck";

const MAX_HOLD_DURATION_MS = 3000;

export class TankPlayer extends EventEmitter {
  constructor(playerX, playerY, app, playerTexture, scale, world, shellTexture, controlScheme) {
    super();

    // INFO: World
    this.app = app;
    this.world = world;
    this.scale = scale;
    this.collisionWorldHandler = false;
    this.bodyToDestroy = null;

    // INFO: Player
    this.name = `Player_${Math.random().toString(16).slice(2, 8)}`;
    this.hp = 100;
    this.hpContainer = null;
    this.hpRedBarGraphic = null;
    this.hpGreenBarGraphic = null;

    // INFO: Power Bar
    this.powerBarContainer = null;
    this.powerBarBackground= null;
    this.powerBarFill = null;
    this.isCharging = false;
    this.chargeStartTime = null;
    this.currentPower = 0;

    // INFO: Tank body
    this.playerX = playerX;
    this.playerY = playerY;
    this.playerTexture = playerTexture;
    this.playerBody = null;
    this.moveDist = 30;
    this.playerSpeed = 27.5;

    this.springFront = null;
    this.springMiddleFront = null;
    this.springBack = null;
    this.springMiddleBack = null;
    this.wheels = null;

    // INFO: Keyboard control
    this.controlScheme = controlScheme;
    this.keyPressStartTime = {};
    this.keys = {};

    // INFO: Cannon related
    this.physicalShell = null;
    this.shellTexture = shellTexture;
    this.shellSprite = null;
    this.playerCannon = null;
    this.cannonJoint = null;
    this.maxFirePower = 30;
    this.minFirePower = 5;
    this.shotOutOfBounds = false;
    this.isFiring = false;
  }

  async initialisePlayerSprite() {

    //INFO: Player physical body
    this.playerBody = this.world.createBody({
      type: "dynamic",
      position: Vec2(this.playerX / this.scale, this.playerY / this.scale),
      gravityScale: 2, fixedRotation: false,
    })

    const mainBodyVertices = [
      Vec2(-1.8, -0.8), Vec2(1.5, -0.8), Vec2(2.0, -0.3),
      Vec2(1.2, 0.5), Vec2(-1.5, 0.5), Vec2(-2.0, -0.3)
    ];

    this.playerBody.createFixture({
      shape: Polygon(mainBodyVertices),
      density: 1,
      friction: 0.5,
      restitution: 0.01
    })
    const tankHeadVertices = [
      Vec2(-1, 0.5), Vec2(0.8, 0.5), Vec2(0.4, 1.5), Vec2(-0.5, 1.5)
    ];

    this.playerBody.createFixture({
      shape: Polygon(tankHeadVertices),
      density: 0.1,
      friction: 0.1,
      restitution: 0.01
    })

    const [playerBodyX, playerBodyY] = [this.playerBody.getPosition().x, this.playerBody.getPosition().y];
    const wheelFD = { density: 50, friction: 50 };

    const wheelPositions = [
      { x: playerBodyX - 1.4, y: playerBodyY - 1.2 },
      { x: playerBodyX - 0.7, y: playerBodyY - 1.2 },
      { x: playerBodyX + 0.3, y: playerBodyY - 1.2 },
      { x: playerBodyX + 1.0, y: playerBodyY - 1.2 },
    ];

    const wheels = wheelPositions.map(pos => {
      const wheel = this.world.createBody({ type: "dynamic", position: Vec2(pos.x, pos.y) });
      wheel.createFixture(new Circle(0.2), wheelFD);
      return wheel;
    });

    this.wheels = wheels;

    class WheelSpring {
      constructor(world, playerBody, wheel) {
        this.spring = world.createJoint(
          new RevoluteJoint({
            motorSpeed: 0, maxMotorTorque: 50, enableMotor: true,
            frequencyHz: 0.2, dampingRatio: 1, restitution: 0.005, collideConnected: false
          }, playerBody, wheel, wheel.getPosition())
        );
      }
      setMotorSpeed(speed) {
        this.spring.setMotorSpeed(speed);
      }
      getMotorSpeed() {
        return this.spring.getMotorSpeed();
      }
    }


    this.springBack = new WheelSpring(this.world, this.playerBody, wheels[0]);
    this.springMiddleBack = new WheelSpring(this.world, this.playerBody, wheels[1]);
    this.springMiddleFront = new WheelSpring(this.world, this.playerBody, wheels[2]);
    this.springFront = new WheelSpring(this.world, this.playerBody, wheels[3]);
    this.wheelSprings = [this.springBack, this.springMiddleBack, this.springMiddleFront, this.springFront];

    // INFO: Player Sprite
    const playerSprite = Sprite.from(this.playerTexture);
    playerSprite.anchor.set(0.5, 0.5);
    const [spriteWidth, spriteHeight] = [100, 70];
    playerSprite.scale.set(spriteWidth / this.playerTexture.width, spriteHeight / this.playerTexture.height);
    playerSprite.x = this.playerX;
    playerSprite.y = this.playerY;
    this.playerSprite = playerSprite;
    this.app.stage.addChild(this.playerSprite);


    // INFO: Cannon Body
    this.playerCannon = this.world.createBody({
      type: "dynamic",
      position: Vec2(playerBodyX + 0.1, playerBodyY + 1.8),
      fixedRotation: true
    });
    this.playerCannon.createFixture({
      shape: planck.Box(0.1, 0.8), density: 0.05, friction: 0.5
    });

    this.cannonJoint = this.world.createJoint(
      new RevoluteJoint({
        collideConnected: true
      },
        this.playerBody, this.playerCannon,
        Vec2(playerBodyX + 0.1, playerBodyY + 1.2)
      )
    );

    const cannonWidth = 0.2 * this.scale;
    const cannonLength = 1.6 * this.scale;
    const playerCannonSprite = new Graphics()
      .rect(-cannonWidth / 2, 0, cannonWidth, cannonLength)
      .fill(0x3f553c);

    playerCannonSprite.pivot.set(0, 0);
    this.playerCannonSprite = playerCannonSprite;
    this.app.stage.addChild(playerCannonSprite);

    this.initialisePowerBar();
  }

  initialisePowerBar() {
    this.powerBarContainer = new Container();
    this.powerBarBackground = new Graphics()
        .rect(0, 0, 100, 10)
        .fill(0x333333);
    this.powerBarFill = new Graphics()
        .rect(0, 0, 0, 10)
        .fill(0xFF0000);
    this.powerBarContainer.addChild(this.powerBarBackground, this.powerBarFill);
    this.powerBarContainer.visible = false;
    this.app.stage.addChild(this.powerBarContainer);
  }

  updatePowerBarPosition() {
    if (this.powerBarContainer) {
        this.powerBarContainer.x = this.playerSprite.x - 50;
        this.powerBarContainer.y = this.playerSprite.y - 80;
    }
  }
  updatePowerBar(powerRatio) {
    if (this.powerBarFill) {
        this.powerBarFill.clear();
        const width = 100 * powerRatio;
        this.powerBarFill
            .rect(0, 0, width, 10)
            .fill(this.getPowerBarColour(powerRatio));
    }
  }

  getPowerBarColour(powerRatio) {
    if (powerRatio < 0.5) {
      const r = Math.floor(255 * (powerRatio * 2)); // 0 to 255
      const g = 255;
      return (r << 16) | (g << 8);
      // return 0x00FF00;
    }
    else if (powerRatio < 0.8) {
      const r = 255;
      const g = Math.floor(255 * (1 - (powerRatio - 0.5) * 3)); // 255 to 0
      return (r << 16) | (g << 8);
      // return 0xFFFF00;
    }
    else {
      const r = 255;
      const g = 0;
      return (r << 16) | (g << 8);
      // return 0xFF0000;
    }
  }

  updateCharging() {
    if (this.isCharging && this.keyPressStartTime[this.controlScheme.fire]) {
        const pressDuration = Date.now() - this.keyPressStartTime[this.controlScheme.fire];
        const holdRatio = Math.min(1, pressDuration / MAX_HOLD_DURATION_MS);
        this.currentPower = holdRatio;
        this.updatePowerBar(holdRatio);
    }
  }

  showPowerBar() {
    if (this.powerBarContainer) {
        this.powerBarContainer.visible = true;
        this.updatePowerBar(0);
    }
  }

  hidePowerBar() {
    if (this.powerBarContainer) {
        this.powerBarContainer.visible = false;
    }
  }



  updatePlayer() {
    // INFO: Update the player sprite
    const bodyPosition = this.playerBody.getPosition();
    this.playerSprite.x = bodyPosition.x * this.scale;
    this.playerSprite.y = this.app.renderer.height - (bodyPosition.y * this.scale);
    this.playerSprite.rotation = -this.playerBody.getAngle();


    // INFO: Update cannon graphics
    const cannonPosition = this.playerCannon.getPosition();
    const cannonAngle = -this.playerCannon.getAngle();

    this.playerCannonSprite.clear();

    this.playerCannonSprite
      .beginFill(0x3f553c)
      .drawRect(
        -0.1 * this.scale, -0.8 * this.scale, 0.2 * this.scale, 38
      )
      .endFill();

    this.playerCannonSprite.x = cannonPosition.x * this.scale;
    this.playerCannonSprite.y = this.app.renderer.height - (cannonPosition.y * this.scale);
    this.playerCannonSprite.rotation = cannonAngle;

    this.updatePowerBarPosition();
  }


  updateCannon() {
    let angleChange = 0.02;
    const currentAngle = this.playerCannon.getAngle();

    if (this.keys[this.controlScheme.up]) {
      this.playerCannon.setAngle(currentAngle + angleChange);
    } else if (this.keys[this.controlScheme.down]) {
      this.playerCannon.setAngle(currentAngle - angleChange);
    }
    // FIX: Poor implementation of the angle - it should base it on the tank body.
    const [minAngle, maxAngle] = [-Math.PI / 1.6, Math.PI / 1.6];
    this.playerCannon.setAngle(Math.max(minAngle, Math.min(maxAngle, this.playerCannon.getAngle())));
  }

  getPlayerMotorSpeed() {
    return this.springFront.getMotorSpeed();
  }

  resetPlayerMotorSpeed() {
    this.wheelSprings.forEach(spring => spring.setMotorSpeed(0));
  }

  setPlayerMotorSpeed(speed) {
    this.wheelSprings.forEach(spring => spring.setMotorSpeed(speed));
  }


  movePlayer() {
    if (this.moveDist > 0 && !this.isFiring) {
      if (this.keys[this.controlScheme.right]) {
        this.setPlayerMotorSpeed(-this.playerSpeed);
        this.playerSprite.scale.x = Math.abs(this.playerSprite.scale.x);
      } else if (this.keys[this.controlScheme.left]) {
        this.setPlayerMotorSpeed(this.playerSpeed);
        this.playerSprite.scale.x = -Math.abs(this.playerSprite.scale.x);
      } else {
        this.resetPlayerMotorSpeed();
      }
    } else {
      this.resetPlayerMotorSpeed();
    }
    this.updateCannon();
  }

  resetMoveDist() {
    this.moveDist = 30;
  }

  async initialiseShellSprite() {
    const shellSprite = Sprite.from(this.shellTexture);
    shellSprite.anchor.set(0.5, 0.5);
    const [spriteWidth, spriteHeight] = [10, 10];
    shellSprite.scale.set(spriteWidth / this.shellTexture.width, spriteHeight / this.shellTexture.height);
    shellSprite.visible = false;
    this.shellSprite = shellSprite;
    this.app.stage.addChild(this.shellSprite);
  }

  openFire(power) {
    if (this.isFiring || this.physicalShell) return;

    this.isFiring = true;

    const cannonAngle = -this.playerCannon.getAngle();
    const cannonPosition = this.playerCannon.getPosition();

    const cannonLengthPhysics = 1.6;
    const muzzleOffsetX = (cannonLengthPhysics) * Math.cos(cannonAngle + Math.PI / 2);
    const muzzleOffsetY = (cannonLengthPhysics) * Math.sin(cannonAngle + Math.PI / 2);

    const spawnX = cannonPosition.x + cannonLengthPhysics * Math.sin(cannonAngle);
    const spawnY = cannonPosition.y + cannonLengthPhysics * Math.cos(cannonAngle);

    const velX = power * Math.sin(cannonAngle);
    const velY = power * Math.cos(cannonAngle);


    this.physicalShell = this.world.createBody({
      type: "dynamic", position: Vec2(spawnX, spawnY),
      gravityScale: 1.5, bullet: true,
      linearVelocity: Vec2(velX, velY)
    });

    const shellFD = { friction: 0.3, density: 100, restitution: 0.1 };
    this.physicalShell.createFixture(new Circle(0.2), shellFD);

    this.shellSprite.x = spawnX * this.scale;
    this.shellSprite.y = this.app.renderer.height - (spawnY * this.scale);
    this.shellSprite.visible = true;

    this.emit('fired', { player: this, power: power });
  }


  updateShell(mapGenerator) {

    // check if the shell has gone out of bounds
    if (this.physicalShell) {
      const bodyPos = this.physicalShell.getPosition();

      this.shellSprite.x = bodyPos.x * this.scale;
      this.shellSprite.y = this.app.renderer.height - (bodyPos.y * this.scale);

      // check if out of bounds
      if (this.shellSprite.x >= this.app.renderer.width || this.shellSprite.x <= 0 || this.shellSprite.y >= this.app.renderer.height) {
        // console.log("Player has shot out of bounds!");
        this.shotOutOfBounds = true;
        this.resetAndDestroyShell();
        return;
      } else {
        this.shotOutOfBounds = false;
      }
    }

    // check shell collisions for ground and player...
    if (this.physicalShell) {
      for (let contactList = this.physicalShell.getContactList(); contactList; contactList = contactList.next) {
        let contact = contactList.contact;
        let contactType = contact.m_evaluateFcn.name;
        if (contactType == "ChainCircleContact") {
          this.destroyTerrain(mapGenerator);
          this.resetAndDestroyShell();
        }
      }
    }
  }

  isBodyAWheel(body) {
    if (body == this.wheels[0] || body == this.wheels[1] || body == this.wheels[2] || body == this.wheels[3]) {
      // console.log("body is a wheel!");
      return true;
    }
    // console.log("body is not a wheel!");
    return false;
  }

  setupCollisionHandler() {
    if (!this.collisionWorldHandler) {
      this.collisionWorldHandler = true;
      this.world.on('begin-contact', (contact) => {
        const fixtureA = contact.getFixtureA();
        const fixtureB = contact.getFixtureB();

        const bodyA = fixtureA.getBody();
        const bodyB = fixtureB.getBody();

        const shapeA = fixtureA.getShape().getType();
        const shapeB = fixtureB.getShape().getType();

        if (bodyA == this.playerBody && (shapeA == "circle" || shapeB == "circle") ||
          bodyB == this.playerBody && (shapeA == "circle" || shapeB == "circle")) {
          if (this.physicalShell) {
            this.bodyToDestroy = this.physicalShell;
            this.emit("self-hit", { player: this });
          }
        } else if ((shapeA == "polygon" && bodyA != this.playerCannon && shapeB == "circle" && !this.isBodyAWheel(bodyB)) ||
          (shapeA == "circle" && !this.isBodyAWheel(bodyA) && shapeB == "polygon" && bodyB != this.playerCannon)) {
          if (this.physicalShell) {
            this.bodyToDestroy = this.physicalShell;
            this.emit("hit", { player: this });
          }
        }
      });
    }
  }

  // this is required because for some reason i cant use destroy body inside the contact event listener
  destroyShellOutsideContactEvent() {
    if (this.bodyToDestroy) {
      this.world.destroyBody(this.bodyToDestroy);
      this.shellSprite.visible = false;
      this.physicalShell = null;
      this.isFiring = false;
      this.emit("shellSequenceComplete");
      this.bodyToDestroy = null;
    }
  }

  resetAndDestroyShell() {
    if (this.physicalShell) {
      if (this.shellSprite) {
        this.shellSprite.visible = false;
      }
      this.world.destroyBody(this.physicalShell);
      this.physicalShell = null;
      this.isFiring = false;
      this.emit("shellSequenceComplete");
    }
  }

  async initialisePlayerHealthBar() {
    const redGraphics = new Graphics();
    const greenGraphics = new Graphics();

    this.hpContainer = new Container();

    const path = [0, 0, this.hp, 0, this.hp, 10, 0, 10];
    greenGraphics.poly(path);
    redGraphics.rect(-52, -60, 100, 10);
    redGraphics.fill(0xde3249);
    greenGraphics.fill(0x2ee651);

    this.hpRedBarGraphic = redGraphics;
    this.hpRedBarGraphic.zIndex = 999;
    this.hpGreenBarGraphic = greenGraphics;
    this.hpGreenBarGraphic.zIndex = 1000;

    this.hpContainer.addChild(this.hpRedBarGraphic, this.hpGreenBarGraphic);
    this.hpContainer.zIndex = 1000;


    this.app.stage.addChild(this.hpContainer);
  }

  hideHPBar() {
    TweenMax.to(this.hpContainer, 2, { alpha: 0 });
  }

  revealHPBar() {
    this.hpContainer.alpha = 1;
  }

  updatePosPlayerHealthBar() {
    this.hpRedBarGraphic.x = this.playerSprite.x;
    this.hpRedBarGraphic.y = this.playerSprite.y + 110;
    this.hpGreenBarGraphic.x = this.playerSprite.x - 52;
    this.hpGreenBarGraphic.y = this.playerSprite.y + 50;
  }

  updatePlayerHealthBar() {

    if (this.hp > 0) {
      this.hp -= 10;
    }

    this.hpContainer.removeChild(this.hpGreenBarGraphic);
    this.hpGreenBarGraphic = new Graphics();

    const path = [0, 0, this.hp, 0, this.hp, 10, 0, 10];
    this.hpGreenBarGraphic.poly(path);
    this.hpGreenBarGraphic.fill(0x2ee651);
    this.hpGreenBarGraphic.x = this.playerSprite.x - 52;
    this.hpGreenBarGraphic.y = this.playerSprite.y + 50;
    this.hpGreenBarGraphic.zIndex = 1000;
    this.hpContainer.addChild(this.hpGreenBarGraphic);
  }

  destroyTerrain(mapGenerator) {
    // set up the original metadata of map
    let originalTerrainPoints = mapGenerator.getTerrainPointsFromMap();
    let originalTerrainBody = mapGenerator.getTerrainBodyFromMap();
    let originalTerrainFixture = originalTerrainBody.getFixtureList();

    let newTerrainPoints = [];
    const pixiBlastRadius = 40;

    let leftX, leftY, rightX, rightY;
    // get points left, and right from the centre of circle (pixijs system), will be used as boundaries
    for (let i = 0; i < originalTerrainPoints.length; i++) {
      if (i < this.shellSprite.x - pixiBlastRadius) {
        leftX = i;
        leftY = originalTerrainPoints[i];
      }

      if (i > (this.shellSprite.x + pixiBlastRadius)) {
        rightX = i;
        rightY = originalTerrainPoints[i];
        i = originalTerrainPoints.length;
      }
    }

    // create the new points to accomadate the crater that was formed
    let circleY = 0;
    for (let i = 0; i < originalTerrainPoints.length; i++) {
      if (i >= leftX && i <= rightX) {
        circleY = this.shellSprite.y + Math.sqrt((pixiBlastRadius * pixiBlastRadius) - ((i - this.shellSprite.x) * (i - this.shellSprite.x)));
        if (circleY >= originalTerrainPoints[i]) {
          newTerrainPoints.push(circleY);
        } else { // catch any points that are less than the value of originalTerrainPoints[i] 
          newTerrainPoints.push(originalTerrainPoints[i]);
        }
      } else {
        newTerrainPoints.push(originalTerrainPoints[i]);
      }
    }

    originalTerrainBody.destroyFixture(originalTerrainFixture);
    this.world.destroyBody(originalTerrainBody);
    mapGenerator.destroyTerrainGraphicFromMap();
    mapGenerator.drawTerrain(newTerrainPoints, this.world, this.scale, this.app);
  }


  setupKeyboardControls() {// avoids mem leaks+allows tracking ev listeners
    this.boundKeysDown = this.keysDown.bind(this);
    this.boundKeysUp = this.keysUp.bind(this);
    window.addEventListener("keydown", this.boundKeysDown);
    window.addEventListener("keyup", this.boundKeysUp);
  }

  removeKeyboardControls() {
    if (this.boundKeysDown) {
      window.removeEventListener("keydown", this.boundKeysDown);
      window.removeEventListener("keyup", this.boundKeysUp);
      this.boundKeysDown = null;
      this.boundKeysUp = null;
      this.keys = {};
      this.keyPressStartTime = {};
    }
  }

  destroy() { // Can be used to rm player controls and other things
    this.removeKeyboardControls();

    if (this.chargingAnimation) {
      this.app.ticker.remove(this.chargingAnimation);
      this.chargingAnimation = null;
    }

    if (this.powerBarContainer) {
        this.app.stage.removeChild(this.powerBarContainer);
        this.powerBarContainer.destroy();
    }
  }

  keysDown(e) {
    if (!this.boundKeysDown) return;

    const keyCode = e.keyCode.toString();
    this.keys[keyCode] = true;

    if (keyCode === this.controlScheme.fire && !this.keyPressStartTime[keyCode] &&
      !this.isFiring) {
      // console.log(`${this.name} Spacebar pressed down`);
      this.keyPressStartTime[keyCode] = Date.now();
      this.isCharging = true;
      this.chargeStartTime = Date.now();
      this.showPowerBar();
    }
  }


  keysUp(e) {
    if (!this.boundKeysDown) return;

    const keyCode = e.keyCode.toString();
    this.keys[keyCode] = false;

    if (keyCode === this.controlScheme.fire && this.keyPressStartTime[keyCode]) {
      const pressDuration = Date.now() - this.keyPressStartTime[keyCode];

      const holdRatio = Math.min(1, pressDuration / MAX_HOLD_DURATION_MS);
      let firePower = this.minFirePower + holdRatio * (this.maxFirePower - this.minFirePower);

      if (!this.physicalShell) {
        this.openFire(firePower);
      }

      this.isCharging = false;
      this.hidePowerBar();
      delete this.keyPressStartTime[keyCode];
    }
  }

};
