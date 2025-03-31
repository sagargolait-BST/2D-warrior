class Player {
  constructor(game) {
    this.game = game;
    this.collisionX = this.game.width * 0.5;
    this.collisionY = this.game.height * 0.5;
    this.collisionRadius = 30;
    this.speedX = 0;
    this.speedY = 0;
    this.dx = 0;
    this.dy = 0;
    this.speedModifier = 5;
    this.spriteWidth = 255;
    this.spriteHeight = 255;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.spriteX;
    this.spriteY;
    this.frameX = 0;
    this.frameY = 5;
    this.image = game.assets.bull;
    this.usingKeyboard = false;
  }

  restart() {
    this.collisionX = this.game.width * 0.5;
    this.collisionY = this.game.height * 0.5;
    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.5 - 100;
  }

  draw(context) {
    context.drawImage(
      this.image,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.spriteX,
      this.spriteY,
      this.width,
      this.height,
    );
    if (this.game.debug) {
      context.beginPath();
      context.arc(
        this.collisionX,
        this.collisionY,
        this.collisionRadius,
        0,
        Math.PI * 2,
      );
      context.save();
      context.globalAlpha = 0.5;
      context.fill();
      context.restore();
      context.stroke();
      context.beginPath();
      context.moveTo(this.collisionX, this.collisionY);
      context.lineTo(this.game.mouse.x, this.game.mouse.y);
      context.stroke();
    }
  }
  update() {
    // Handle keyboard movement
    if (this.game.keys.w || this.game.keys.a || this.game.keys.s || this.game.keys.d) {
      this.usingKeyboard = true;
      
      // Reset speeds
      this.speedX = 0;
      this.speedY = 0;
      
      // Set speeds based on key presses
      if (this.game.keys.w) this.speedY = -1;
      if (this.game.keys.s) this.speedY = 1;
      if (this.game.keys.a) this.speedX = -1;
      if (this.game.keys.d) this.speedX = 1;
      
      // Normalize diagonal movement
      if ((this.speedX !== 0) && (this.speedY !== 0)) {
        this.speedX *= 0.7071; // 1/sqrt(2)
        this.speedY *= 0.7071; // 1/sqrt(2)
      }
      
      // Set direction for sprite animation
      if (this.speedX === 0 && this.speedY < 0) this.frameY = 0;      // Up
      else if (this.speedX > 0 && this.speedY < 0) this.frameY = 1;   // Up-Right
      else if (this.speedX > 0 && this.speedY === 0) this.frameY = 2; // Right
      else if (this.speedX > 0 && this.speedY > 0) this.frameY = 3;   // Down-Right
      else if (this.speedX === 0 && this.speedY > 0) this.frameY = 4; // Down
      else if (this.speedX < 0 && this.speedY > 0) this.frameY = 5;   // Down-Left
      else if (this.speedX < 0 && this.speedY === 0) this.frameY = 6; // Left
      else if (this.speedX < 0 && this.speedY < 0) this.frameY = 7;   // Up-Left
    } 
    // Handle mouse movement if not using keyboard or if mouse is pressed
    else if (this.game.mouse.pressed || !this.usingKeyboard) {
      this.usingKeyboard = false;
      this.dx = this.game.mouse.x - this.collisionX;
      this.dy = this.game.mouse.y - this.collisionY;
      
      //sprite animation based on mouse direction
      const angle = Math.atan2(this.dy, this.dx);
      if (angle < -2.74 || angle > 2.74) this.frameY = 6;
      else if (angle < -1.96) this.frameY = 7;
      else if (angle < -1.17) this.frameY = 0;
      else if (angle < -0.39) this.frameY = 1;
      else if (angle < 0.39) this.frameY = 2;
      else if (angle < 1.17) this.frameY = 3;
      else if (angle < 1.96) this.frameY = 4;
      else if (angle < 2.74) this.frameY = 5;

      const distance = Math.hypot(this.dy, this.dx);
      if (distance > this.speedModifier) {
        this.speedX = this.dx / distance || 0;
        this.speedY = this.dy / distance || 0;
      } else {
        this.speedX = 0;
        this.speedY = 0;
      }
    } else {
      this.speedX = 0;
      this.speedY = 0;
    }
    this.collisionX += this.speedX * this.speedModifier;
    this.collisionY += this.speedY * this.speedModifier;
    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.5 - 100;
    // horizontal boundaries
    if (this.collisionX < this.collisionRadius) {
      this.collisionX = this.collisionRadius;
    } else if (this.collisionX > this.game.width - this.collisionRadius) {
      this.collisionX = this.game.width - this.collisionRadius;
    }

    //vertical boundaries
    if (this.collisionY < this.game.topMargin + this.collisionRadius)
      this.collisionY = this.game.topMargin + this.collisionRadius;
    else if (this.collisionY > this.game.height - this.collisionRadius)
      this.collisionY = this.game.height - this.collisionRadius;

    // collisions with obstacles
    this.game.obstacles.forEach((obstacle) => {
      // [(distance < sumOfRadii), distance, sumOfRadii, dx, dy]
      let [collision, distance, sumOfRadii, dx, dy] =
        this.game.checkCollision(this, obstacle);
      if (collision) {
        const unit_x = dx / distance;
        const unit_y = dy / distance;
        this.collisionX = obstacle.collisionX + (sumOfRadii + 1) * unit_x;
        this.collisionY = obstacle.collisionY + (sumOfRadii + 1) * unit_y;
      }
    });
  }
}

class Obstacle {
  constructor(game) {
    this.game = game;
    this.collisionX = Math.random() * this.game.width;
    this.collisionY = Math.random() * this.game.height;
    this.collisionRadius = 40;
    this.image = game.assets.obstacles;
    this.spriteWidth = 250;
    this.spriteHeight = 250;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.5 - 70;
    this.frameX = Math.floor(Math.random() * 4);
    this.frameY = Math.floor(Math.random() * 3);
  }

  draw(context) {
    context.drawImage(
      this.image,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.spriteX,
      this.spriteY,
      this.width,
      this.height,
    );
    if (this.game.debug) {
      context.beginPath();
      context.arc(
        this.collisionX,
        this.collisionY,
        this.collisionRadius,
        0,
        Math.PI * 2,
      );
      context.save();
      context.globalAlpha = 0.5;
      context.fill();
      context.restore();
      context.stroke();
    }
  }
  update() { }
}

class Egg {
  constructor(game) {
    this.game = game;
    this.collisionRadius = 40;
    this.margin = this.collisionRadius * 2;
    this.collisionX =
      this.margin + Math.random() * (this.game.width - this.margin * 2);
    this.collisionY =
      this.game.topMargin +
      Math.random() * (this.game.height - this.game.topMargin - this.margin);
    this.image = game.assets.egg;
    this.spriteWidth = 110;
    this.spriteHeight = 135;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.spriteX;
    this.spriteY;
    this.hatchTimer = 0;
    this.hatchInterval = 10000; // 10 seconds for hatching
    this.markedForDeletion = false;
    this.creationTime = Date.now(); // Store when the egg was created
  }

  draw(context) {
    context.drawImage(this.image, this.spriteX, this.spriteY);
    if (this.game.debug) {
      context.beginPath();
      context.arc(
        this.collisionX,
        this.collisionY,
        this.collisionRadius,
        0,
        Math.PI * 2,
      );
      context.save();
      context.globalAlpha = 0.5;
      context.fill();
      context.restore();
      context.stroke();
      const displayTimer = ((this.hatchInterval - this.hatchTimer) * 0.001).toFixed(0);
      context.fillText(
        displayTimer,
        this.collisionX,
        this.collisionY - this.collisionRadius * 2.5,
      );
    }
  }
  update(deltaTime) {
    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.5 - 30;
    let collisionObject = [
      this.game.player,
      ...this.game.obstacles,
      ...this.game.enemies,
      ...this.game.hatchlings
    ];
    collisionObject.forEach((object) => {
      let [collision, distance, sumOfRadii, dx, dy] =
        this.game.checkCollision(this, object);
      if (collision) {
        const unit_x = dx / distance;
        const unit_y = dy / distance;
        this.collisionX = object.collisionX + (sumOfRadii + 1) * unit_x;
        this.collisionY = object.collisionY + (sumOfRadii + 1) * unit_y;
      }
    });

    //hatching
    if (this.hatchTimer >= this.hatchInterval || this.collisionY < this.game.topMargin + 100) {
      this.game.hatchlings.push(
        new Larva(this.game, this.collisionX, this.collisionY),
      );
      this.markedForDeletion = true;
      this.game.removeGameObjects();
    } else {
      this.hatchTimer += deltaTime;
    }
  }
}

class Enemy {
  constructor(game) {
    this.game = game;
    this.collisionRadius = 30;
    this.speedX = Math.random() * 3 * 0.5 * this.game.enemySpeedModifier;
    this.image = game.assets.toads;
    this.spriteWidth = 140;
    this.spriteHeight = 260;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.collisionX =
      this.game.width + this.width + Math.random() * this.game.width * 0.5;
    this.collisionY =
      this.game.topMargin +
      Math.random() * (this.game.height - this.game.topMargin);
    this.spriteY;
    this.spriteX;
    this.frameX = 0;
    this.frameY = Math.floor(Math.random() * 4);
  }
  draw(context) {
    context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.spriteX, this.spriteY, this.width, this.height);
    if (this.game.debug) {
      context.beginPath();
      context.arc(
        this.collisionX,
        this.collisionY,
        this.collisionRadius,
        0,
        Math.PI * 2,
      );
      context.save();
      context.globalAlpha = 0.5;
      context.fill();
      context.restore();
      context.stroke();
    }
  }
  update() {
    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.5 + 40;
    this.collisionX -= this.speedX;
    if (this.spriteX + this.width < 0 && !this.game.gameOver) {
      this.collisionX =
        this.game.width + this.width + Math.random() + this.game.width * 0.5;
      this.collisionY =
        this.game.topMargin +
        Math.random() * (this.game.height - this.game.topMargin);
      this.frameY = Math.floor(Math.random() * 4);
    }
    let collisionObject = [this.game.player, ...this.game.obstacles];
    collisionObject.forEach((object) => {
      let [collision, distance, sumOfRadii, dx, dy] =
        this.game.checkCollision(this, object);
      if (collision) {
        const unit_x = dx / distance;
        const unit_y = dy / distance;
        this.collisionX = object.collisionX + (sumOfRadii + 1) * unit_x;
        this.collisionY = object.collisionY + (sumOfRadii + 1) * unit_y;
      }
    });
  }
}

class Larva {
  constructor(game, x, y) {
    this.game = game;
    this.collisionX = x;
    this.collisionY = y;
    this.collisionRadius = 30;
    this.image = game.assets.larva;
    this.spriteWidth = 150;
    this.spriteHeight = 150;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.spriteX;
    this.spriteY;
    this.speedY = 1 + Math.random();
    this.frameX = 0;
    this.frameY = Math.floor(Math.random() * 2);
  }
  draw(context) {
    context.drawImage(
      this.image,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.spriteX,
      this.spriteY,
      this.width,
      this.height,
    );
    if (this.game.debug) {
      context.beginPath();
      context.arc(
        this.collisionX,
        this.collisionY,
        this.collisionRadius,
        0,
        Math.PI * 2,
      );
      context.save();
      context.globalAlpha = 0.5;
      context.fill();
      context.restore();
      context.stroke();
    }
  }
  update() {
    this.collisionY -= this.speedY;
    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.5 - 40;
    ///move to safety
    if (this.collisionY < this.game.topMargin) {
      this.markedForDeletion = true;
      this.game.removeGameObjects();
      if(!this.game.gameOver && !this.game.levelComplete) this.game.score++;
      for (let i = 0; i < 5; i++) {
        this.game.particles.push(new Firefly(this.game, this.collisionX, this.collisionY, 'yellow'));
      }
    }
    // collision with objects
    let collisionObject = [this.game.player, ...this.game.obstacles];
    collisionObject.forEach((object) => {
      let [collision, distance, sumOfRadii, dx, dy] =
        this.game.checkCollision(this, object);
      if (collision) {
        const unit_x = dx / distance;
        const unit_y = dy / distance;
        this.collisionX = object.collisionX + (sumOfRadii + 1) * unit_x;
        this.collisionY = object.collisionY + (sumOfRadii + 1) * unit_y;
      }
    });
    // collision with enemies
    this.game.enemies.forEach((enemy) => {
      if (this.game.checkCollision(this, enemy)[0] && !this.game.gameOver && !this.game.levelComplete) {
        this.markedForDeletion = true;
        this.game.removeGameObjects();
        this.game.lostHatchlings++;
        for (let i = 0; i < 5; i++) {
          this.game.particles.push(new Spark(this.game, this.collisionX, this.collisionY, 'blue'));
        }
      }
    });
  }
}

class Particle {
  constructor(game, x, y, color) {
    this.game = game;
    this.collisionX = x;
    this.collisionY = y;
    this.color = color;
    this.radius = Math.floor(Math.random() * 10 + 5);
    this.speedX = Math.random() * 6 - 3;
    this.speedY = Math.random() * 6 - 3;
    this.angle = 0;
    this.va = Math.random() * 0.1 + 0.01;
    this.markedForDeletion = false;
  }
  draw(context) {
    context.save();
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(this.collisionX, this.collisionY, this.radius, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.restore();
  }

}

class Firefly extends Particle {
  update() {
    this.angle += this.va;
    this.collisionX += Math.cos(this.angle) * this.speedX;
    this.collisionY -= this.speedY;
    if (this.collisionX < 0 - this.radius) {
      this.markedForDeletion = true;
      this.game.removeGameObjects()
    }
  }
}

class Spark extends Particle {
  update() {
    this.angle += this.va + 0.5;
    this.collisionX -= Math.sin(this.angle) * this.speedX;
    this.collisionY -= Math.cos(this.angle) * this.speedY;
    if (this.radius > 0.1) {
      this.radius -= 0.05;
    }
    if (this.radius < 0.2) {
      this.markedForDeletion = true;
      this.game.removeGameObjects()
    }
  }
}

class Game {
  constructor(canvas, assets) {
    if (!canvas || !assets) {
      throw new Error('Canvas and assets are required to initialize the game');
    }

    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.topMargin = 260;
    this.debug = false;
    this.fps = 70;
    this.timer = 0;
    this.interval = 1000 / this.fps;
    this.animationId = null;
    this.lastTime = 0;
    this.assets = assets;
    this.player = new Player(this);
    this.obstacles = [];
    this.eggs = [];
    this.enemies = [];
    this.particles = [];
    this.gameObjects = [];
    this.mouse = {
      x: this.width * 0.5,
      y: this.height * 0.5,
      radius: 200,
      pressed: false,
    };
    this.keys = {
      w: false,
      a: false,
      s: false,
      d: false,
      r: false,
      n: false
    };
    this.score = 0;
    this.lostHatchlings = 0;
    this.gameOver = false;
    this.levelComplete = false;
    this.level = 1;
    this.enemySpeedModifier = 1.0;
    this.eggTimer = 0;
    this.eggInterval = 1000 + Math.random() * 2000; // Random interval between 1-3 seconds
    this.maxEggs = 5;
    this.winningScore = 20;
    this.numberOfObstacles = 10;
    this.hatchlings = [];
    this.lastEggSpawnTime = 0;
    this.gameStartTime = Date.now();
    this.init();

    // Add keyboard event listeners
    window.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'w') this.keys.w = true;
      if (e.key.toLowerCase() === 'a') this.keys.a = true;
      if (e.key.toLowerCase() === 's') this.keys.s = true;
      if (e.key.toLowerCase() === 'd') this.keys.d = true;
      if (e.key.toLowerCase() === 'r') this.keys.r = true;
      if (e.key.toLowerCase() === 'n') this.keys.n = true;
    });

    window.addEventListener('keyup', (e) => {
      if (e.key.toLowerCase() === 'w') this.keys.w = false;
      if (e.key.toLowerCase() === 'a') this.keys.a = false;
      if (e.key.toLowerCase() === 's') this.keys.s = false;
      if (e.key.toLowerCase() === 'd') this.keys.d = false;
      if (e.key.toLowerCase() === 'r') this.keys.r = false;
      if (e.key.toLowerCase() === 'n') this.keys.n = false;
    });
  }

  render(context, deltaTime) {
    if (this.timer > this.interval) {
      context.clearRect(0, 0, this.width, this.height);
      
      // Draw background first
      context.drawImage(this.assets.background, 0, 0, this.width, this.height);
      
      this.gameObjects = [
        this.player,
        ...this.eggs,
        ...this.obstacles,
        ...this.enemies,
        ...this.hatchlings,
        ...this.particles,
      ];
      this.gameObjects.sort((a, b) => {
        return a.collisionY - b.collisionY;
      });
      this.gameObjects.forEach((object) => {
        object.draw(context);
        object.update(this.interval);
      });

      this.timer = 0;
    }

    this.timer += deltaTime;
    console.log(this.keys)

    // Handle R and N key presses
    if (this.keys.r) {
      this.restart();
      this.keys.r = false; // Reset key state to prevent multiple restarts
    }
    
    if (this.keys.n) {
      if (this.levelComplete && this.level < 5) {
        this.nextLevel();
        this.keys.n = false; // Reset key state to prevent multiple level advances
      }
    }

    // Spawn eggs with random interval
    const currentTime = Date.now();
    if (currentTime - this.lastEggSpawnTime >= this.eggInterval && 
        this.eggs.length < this.maxEggs && 
        !this.gameOver && 
        !this.levelComplete) {
      this.addEgg();
      this.lastEggSpawnTime = currentTime;
      // Set new random interval for next spawn
      this.eggInterval = 1000 + Math.random() * 2000;
    }

    // Draw overlay
    context.drawImage(this.assets.overlay, 0, 0, this.width, this.height);

    context.save();
    context.textAlign = 'left'
    context.fillStyle = "white";
    context.fillText("Score: " + this.score, 25, 50);
    context.fillText("Lost: " + this.lostHatchlings, 25, 100);
    context.restore();

    // Display level information
    context.save();
    context.textAlign = 'right';
    context.fillStyle = "white";
    context.fillText("Level: " + this.level, this.width - 25, 50);
    context.restore();

    if (this.score >= this.winningScore) {
      if (this.lostHatchlings <= 5) {
        // Level complete
        this.levelComplete = true;
        context.save();
        context.fillStyle = "rgba(0, 0, 0, 0.5)";
        context.fillRect(0, 0, this.width, this.height);
        context.save();
        context.fillStyle = "white";
        context.textAlign = 'center';
        context.shadowOffsetX = 4;
        context.shadowOffsetY = 4;
        context.shadowBlur = 10;
        context.shadowColor = "#000";
        
        if (this.level < 5) { // Maximum 5 levels
          context.font = "130px Bangers";
          context.fillText("Level " + this.level + " Complete!", this.width * 0.5, this.height * 0.5 - 20);
          context.font = "40px Bangers";
          context.fillText(`The Bull ate ${this.lostHatchlings} hatchlings`, this.width * 0.5, this.height * 0.5 + 30);
          context.fillText("Press N for Next Level", this.width * 0.5, this.height * 0.5 + 80);
        } else {
          // Game complete after level 5
          this.gameOver = true;
          context.font = "130px Bangers";
          context.fillText("You Won!", this.width * 0.5, this.height * 0.5 - 20);
          context.font = "40px Bangers";
          context.fillText(`You completed all levels!`, this.width * 0.5, this.height * 0.5 + 30);
          context.fillText("Press R to Play Again", this.width * 0.5, this.height * 0.5 + 80);
        }
        context.restore();
      } else {
        // Player lost the level
        this.gameOver = true;
        context.save();
        context.fillStyle = "rgba(0, 0, 0, 0.5)";
        context.fillRect(0, 0, this.width, this.height);
        context.save();
        context.fillStyle = "white";
        context.textAlign = 'center';
        context.shadowOffsetX = 4;
        context.shadowOffsetY = 4;
        context.shadowBlur = 10;
        context.shadowColor = "#000";
        context.font = "130px Bangers";
        context.fillText("You Lost!", this.width * 0.5, this.height * 0.5 - 20);
        context.font = "40px Bangers";
        context.fillText(`The Bull ate ${this.lostHatchlings} hatchlings`, this.width * 0.5, this.height * 0.5 + 30);
        context.fillText("Press R to Play Again", this.width * 0.5, this.height * 0.5 + 80);
        context.restore();
      }
    }
  }
  checkCollision(a, b) {
    const dx = a.collisionX - b.collisionX;
    const dy = a.collisionY - b.collisionY;
    const distance = Math.hypot(dy, dx);
    const sumOfRadii = a.collisionRadius + b.collisionRadius;
    return [distance < sumOfRadii, distance, sumOfRadii, dx, dy];
  }
  addEgg() {
    // Only add an egg if we haven't reached the maximum
    if (this.eggs.length < this.maxEggs) {
      this.eggs.push(new Egg(this));
    }
  }
  addEnemy() {
    this.enemies.push(new Enemy(this));
  }
  removeGameObjects() {
    this.eggs = this.eggs.filter((egg) => !egg.markedForDeletion);
    this.hatchlings = this.hatchlings.filter((obj) => !obj.markedForDeletion);
    this.particles = this.particles.filter((obj) => !obj.markedForDeletion);
  }
  restart() {
    console.log("this is restart")
    this.player.restart();
    this.obstacles = [];
    this.eggs = [];
    this.enemies = [];
    this.hatchlings = [];
    this.particles = [];
    this.mouse = {
      x: this.width * 0.5,
      y: this.height * 0.5,
      pressed: false,
    }
    // Reset key states
    this.keys = {
      w: false,
      a: false,
      s: false,
      d: false,
      r: false,
      n: false
    };
    this.lostHatchlings = 0;
    this.score = 0;
    this.gameOver = false;
    this.levelComplete = false;
    this.level = 1;
    this.enemySpeedModifier = 1.0;
    this.gameStartTime = Date.now(); // Reset game start time
    this.eggTimer = 0;
    this.lastEggSpawnTime = 0;
    this.init();
  }
  
  nextLevel() {
    this.level++;
    this.enemySpeedModifier += 0.5; // Increase enemy speed for each level
    this.maxEggs = Math.min(5 + this.level, 8); // Increase max eggs with level, cap at 8
    this.eggInterval = 1000 + Math.random() * 2000; // Random interval between 1-3 seconds
    this.player.restart();
    this.obstacles = [];
    this.eggs = [];
    this.enemies = [];
    this.hatchlings = [];
    this.particles = [];
    this.mouse = {
      x: this.width * 0.5,
      y: this.height * 0.5,
      pressed: false,
    }
    // Reset key states
    this.keys = {
      w: false,
      a: false,
      s: false,
      d: false,
      r: false,
      n: false
    };
    this.lostHatchlings = 0;
    this.score = 0;
    this.gameOver = false;
    this.levelComplete = false;
    this.gameStartTime = Date.now(); // Reset game start time
    this.eggTimer = 0;
    this.lastEggSpawnTime = 0;
    this.init();
  }
  init() {
    // Add enemies
    for (let i = 0; i < 5; i++) {
      this.addEnemy();
    }

    // Add obstacles
    let attempts = 0;
    while (this.obstacles.length < this.numberOfObstacles && attempts < 500) {
      let testObstacle = new Obstacle(this);
      let overlap = false;
      this.obstacles.forEach((obstacle) => {
        const dx = testObstacle.collisionX - obstacle.collisionX;
        const dy = testObstacle.collisionY - obstacle.collisionY;
        const distanceBuffer = 150;
        const distance = Math.hypot(dy, dx);
        const sumOfRadii =
          testObstacle.collisionRadius +
          obstacle.collisionRadius +
          distanceBuffer;
        if (distance < sumOfRadii) {
          overlap = true;
        }
      });
      const margin = testObstacle.collisionRadius * 2;
      if (
        !overlap &&
        testObstacle.spriteX > 0 &&
        testObstacle.spriteX < this.width - testObstacle.width &&
        testObstacle.collisionY > this.topMargin + margin &&
        testObstacle.collisionY < this.height - margin
      ) {
        this.obstacles.push(testObstacle);
      }
      attempts++;
    }
  }
}

// Expose Game class to window object
window.Game = Game;
