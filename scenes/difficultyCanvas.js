var difficulty = function (p) {
  let canvasSizeOriginal = { width: 640, height: 480 };
  let canvasWidth = canvasSizeOriginal.width;
  let canvasHeight = canvasSizeOriginal.height;

  let canvasRatio = canvasWidth / canvasHeight;
  let scaleRatio = 1;

  let difficultyCanvas;
  let isCurrentScene = false;

  let logoImg;
  let startTextImg;

  let numCanvasesLoaded = 0;
  let allCanvasesLoaded = false;

  let menuAnimationTimer = 0.0;

  let menuItems = [];
  let selectedMenuItemIndex = 1;

  let rebootMenuItems = [];

  let padSelectTimer = null;

  let difficultyTimer;

  let difficultyCardSpritesheet;
  let difficultyCardImgs = [];

  let rebootRainbowCardImg;

  p.preload = function () {
    difficultyCardSpritesheet = p.loadImage(
      "assets/difficulty-card-spritesheet.png",
    );
  };

  p.setup = function () {
    // put setup code here
    p.pixelDensity(3);
    calculateCanvasDimensions(p);

    difficultyCanvas = p.createCanvas(canvasWidth, canvasHeight).elt;
    difficultyCanvas.classList.add("gameCanvas");
    difficultyCanvas.id = "difficultyCanvas";

    p.noSmooth();

    p.noStroke();

    //Initialize song assets
    for (var i = 0; i < 9; i++) {
      let thisImg = difficultyCardSpritesheet.get(0, 240 * i, 170, 240);
      difficultyCardImgs.push(thisImg);
    }

    difficultyCardImgs[7].loadPixels();

    menuItems = [
      new menuItem("Easy", 45, 140, selectDifficulty, 0),
      new menuItem("Medium", 235, 140, selectDifficulty, 2),
      new menuItem("Hard", 425, 140, selectDifficulty, 4),
    ];

    difficultyTimer = new timer(30, selectCurrentOption);

    window.dispatchEvent(canvasLoadedEvent);

    setupNavigation(difficultyCanvas);
  };

  p.draw = function () {
    p.clear();

    // Start drawing things if all canvases have loaded
    if (allCanvasesLoaded) {
      let instructionsToDraw;
      if (!gameIsReboot) {
        instructionsToDraw = "ENTER TO SELECT";
        drawMenu();
        //Draw top bar
        drawImageToScale(uiTopBarImgs.difficulty, 0, 0);
        drawImageToScale(gameModeImgs[gameMode], 10, 8);
        difficultyTimer.display();
      } else {
        drawText("I CAN BUILD THE", "neuropol", 1, null, 40);
        instructionsToDraw = "TO DO HARD THINGS";
        updateRebootRainbow();
        //Draw shadow
        drawImageToScale(difficultyCardImgs[6], 235, 140);
        let y_offset = Math.sin(globalClock.seconds * 2.5) * 5;
        drawImageToScale(rebootRainbowCardImg, 235 - 10, 140 - 10 + y_offset);
        drawImageToScale(difficultyCardImgs[8], 235 - 10, 140 - 10 + y_offset);
      }

      if (Math.floor(globalClock.seconds) % 2 == 0) {
        drawText(instructionsToDraw, "greenHelper", 1, null, 430);
      }
    }
  };

  function animateMenuIn() {
    let menuItemToAnimate = 0;
    let menuItemStaggerTimer = setInterval(function () {
      menuItems[menuItemToAnimate].startAnimation();
      menuItemToAnimate++;
      if (menuItems[menuItemToAnimate] == null) {
        clearInterval(menuItemStaggerTimer);
      }
    }, 150);
  }

  function setupNavigation(thisCanvas) {
    p.noLoop();
    thisCanvas.addEventListener("showScene", (e) => {
      p.loop();

      setTimeout(function () {
        thisCanvas.style.visibility = "visible";
        thisCanvas.style.opacity = 1;
        animateMenuIn();
        isCurrentScene = true;

        if (!gameIsReboot) {
          menu_track_player.start();
          difficultyTimer.start();
        }
      }, sceneTransitionTime);
    });
    thisCanvas.addEventListener("hideScene", (e) => {
      p.noLoop();
      isCurrentScene = false;
      thisCanvas.style.opacity = 0;
      setTimeout(function () {
        difficultyTimer.reset();
        thisCanvas.style.visibility = "hidden";
      }, sceneTransitionTime);
    });
  }

  ////////////////////////////////////////////
  // -------------- SCENES --------------- //
  //////////////////////////////////////////

  //Listen if all canvases in the game have been loaded
  window.addEventListener("canvasLoaded", function () {
    numCanvasesLoaded++;
    if (numCanvasesLoaded == totalCanvases) {
      allCanvasesLoaded = true;
    }
  });

  function updateRebootRainbow() {
    let rgb_gradient = calculateRgbValues();

    rebootRainbowCardImg = convertRebootCardToRainbow(rgb_gradient);
  }

  function convertRebootCardToRainbow(rgb_gradient) {
    // Let's try this again except convert the whole spritesheet to rainbow...
    let newImgObj = p.createImage(170, 240);
    newImgObj.loadPixels();

    // console.log(rgb_gradient);

    let pixels = difficultyCardImgs[7].pixels;

    for (let y = 0; y < newImgObj.height; y++) {
      for (let x = 0; x < newImgObj.width; x++) {
        // Gets the index of the red value for this pixel
        let redIndex = (x + y * newImgObj.width) * 4;
        let greenIndex = redIndex + 1;
        let blueIndex = redIndex + 2;
        let alphaIndex = redIndex + 3;

        //text outline
        let isRed =
          pixels[redIndex] == 255 &&
          pixels[greenIndex] == 0 &&
          pixels[blueIndex] == 0 &&
          pixels[alphaIndex] == 255;

        // Text inner
        let isBlue =
          pixels[redIndex] == 0 &&
          pixels[greenIndex] == 0 &&
          pixels[blueIndex] == 255 &&
          pixels[alphaIndex] == 255;
        // figure
        let isYellow =
          pixels[redIndex] == 255 &&
          pixels[greenIndex] == 255 &&
          pixels[blueIndex] == 0 &&
          pixels[alphaIndex] == 255;
        // Background
        let isGreen =
          pixels[redIndex] == 0 &&
          pixels[greenIndex] == 255 &&
          pixels[blueIndex] == 0 &&
          pixels[alphaIndex] == 255;
        // hearts
        let isMagenta =
          pixels[redIndex] == 255 &&
          pixels[greenIndex] == 0 &&
          pixels[blueIndex] == 255 &&
          pixels[alphaIndex] == 255;
        pixels[alphaIndex] == 0;

        // Make sure the non colored pixels ones are the same value
        if (!(isRed || isGreen || isBlue || isYellow || isMagenta)) {
          newImgObj.pixels[redIndex] = pixels[redIndex]; // Red value
          newImgObj.pixels[greenIndex] = pixels[greenIndex]; // Green value
          newImgObj.pixels[blueIndex] = pixels[blueIndex]; // Blue value
          newImgObj.pixels[alphaIndex] = pixels[alphaIndex]; // Alpha value
        }
        // Change Red pixels to rainbow effect + darker
        if (isRed) {
          newImgObj.pixels[redIndex] = rgb_gradient[y % 64][0] * 0.45 * 255; // Red value
          newImgObj.pixels[greenIndex] = rgb_gradient[y % 64][1] * 0.5 * 255; // Green value
          newImgObj.pixels[blueIndex] = rgb_gradient[y % 64][2] * 0.5 * 255; // Blue value
          newImgObj.pixels[alphaIndex] = 255; // Alpha value
          // newImgObj.pixels[redIndex] = 0; // Red value
          // newImgObj.pixels[greenIndex] = 0; // Green value
          // newImgObj.pixels[blueIndex] = 255; // Blue value
          // newImgObj.pixels[alphaIndex] = 255; // Alpha value
        }
        if (isBlue) {
          newImgObj.pixels[redIndex] = rgb_gradient[y % 23][0] * 2 * 255; // Red value
          newImgObj.pixels[greenIndex] = rgb_gradient[y % 23][1] * 2 * 255; // Green value
          newImgObj.pixels[blueIndex] = rgb_gradient[y % 23][2] * 2 * 255; // Blue value
          newImgObj.pixels[alphaIndex] = 255; // Alpha value
        }

        if (isYellow) {
          newImgObj.pixels[redIndex] = rgb_gradient[y % 64][0] * 4 * 255; // Red value
          newImgObj.pixels[greenIndex] = rgb_gradient[y % 64][1] * 4 * 255; // Green value
          newImgObj.pixels[blueIndex] = rgb_gradient[y % 64][2] * 4 * 255; // Blue value
          newImgObj.pixels[alphaIndex] = 255; // Alpha value
        }

        if (isMagenta) {
          newImgObj.pixels[redIndex] = rgb_gradient[y % 64][0] * 1.5 * 255; // Red value
          newImgObj.pixels[greenIndex] = rgb_gradient[y % 64][1] * 1.5 * 255; // Green value
          newImgObj.pixels[blueIndex] = rgb_gradient[y % 64][2] * 1.5 * 255; // Blue value
          newImgObj.pixels[alphaIndex] = 255; // Alpha value
        }

        // Make it a radial vibe...
        // Calculate the distance from center...
        // use that to map to a value from 0 to 64....
        let distance = Math.sqrt(
          (x - newImgObj.width / 2) ** 2 + (y - 143) ** 2,
        );
        let indexForGreen = Math.floor(p.map(distance, 0, 150, 0, 63));
        if (isGreen) {
          newImgObj.pixels[redIndex] = rgb_gradient[indexForGreen][0] * 1 * 255; // Red value
          newImgObj.pixels[greenIndex] =
            rgb_gradient[indexForGreen][1] * 1 * 255; // Green value
          newImgObj.pixels[blueIndex] =
            rgb_gradient[indexForGreen][2] * 1 * 255; // Blue value
          newImgObj.pixels[alphaIndex] = 255; // Alpha value
        }
      }
    }
    // console.log("updating pixels");
    newImgObj.updatePixels();
    return newImgObj;
  }

  function selectDifficulty(option) {
    if (option == "Easy") {
      storyModeDifficulty = "Easy";
    }
    if (option == "Medium") {
      storyModeDifficulty = "Medium";
    }
    if (option == "Hard") {
      storyModeDifficulty = "Hard";
    }
    // //Progress to song selector
    let songSelectorCanvas = document.querySelector("#songSelectorCanvas");
    songSelectorCanvas.dispatchEvent(showSceneEvent);
    // document.querySelector("#backgroundCanvas").dispatchEvent(showSceneEvent);
    //Hide this canvas
    difficultyCanvas.dispatchEvent(hideSceneEvent);
    sound_fx.select.start();

    //Test service mode

    // let serviceModeCanvas = document.querySelector("#serviceModeCanvas");
    // serviceModeCanvas.dispatchEvent(showSceneEvent);
    // document.querySelector("#backgroundCanvas").dispatchEvent(hideSceneEvent);
    // //Hide this canvas
    // difficultyCanvas.dispatchEvent(hideSceneEvent);
  }

  function startPadHold() {
    if (padSelectTimer == null) {
      padSelectTimer = setTimeout(function () {
        selectCurrentOption();

        padSelectTimer = null;
        clearTimeout(padSelectTimer);
      }, padSelectHoldTime);
    }
  }

  function releasePadHold() {
    if (padSelectTimer) {
      padSelectTimer = null;
      clearTimeout(padSelectTimer);
    }
  }

  function selectCurrentOption() {
    menuItems[selectedMenuItemIndex].select();
  }

  function handleInput(keyCode) {
    //Handle case for menu navigation
    if (isCurrentScene) {
      if (!gameIsReboot) {
        if (keyCode == "ArrowRight" || keyCode == "KeyD") {
          if (selectedMenuItemIndex < menuItems.length - 1) {
            selectedMenuItemIndex++;
            sound_fx.menuChange.start();
          }
        }
        if (keyCode == "ArrowLeft" || keyCode == "KeyA") {
          if (selectedMenuItemIndex > 0) {
            selectedMenuItemIndex--;
            sound_fx.menuChange.start();
          }
        }
      }

      //Select menu item
      if (keyCode == "Enter") {
        selectCurrentOption();
      }
    }
  }

  function padOrKeyrelease(direction) {
    // hitArrowObjs[direction].release();
    // assessHit(direction, "lift");
  }

  function directionToKeycode(direction) {
    let keyCode;
    switch (direction) {
      case "down":
        keyCode = "ArrowDown";
        break;
      case "up":
        keyCode = "ArrowUp";
        break;
      case "left":
        keyCode = "ArrowLeft";
        break;
      case "right":
        keyCode = "ArrowRight";
        break;
    }
    return keyCode;
  }
  window.addEventListener("padPress", function (e) {
    if (isCurrentScene) {
      let direction = e.detail.direction;
      if (direction == "topRight") {
        startPadHold();
      } else {
        handleInput(directionToKeycode(direction));
      }
    }
  });

  window.addEventListener("padRelease", function (e) {
    if (isCurrentScene) {
      let direction = e.detail.direction;
      if (direction == "topRight") {
        releasePadHold();
      }
    }
  });

  window.addEventListener("keydown", function (e) {
    e.preventDefault();
    if (isCurrentScene) {
      //Ignore repeated keydown
      if (e.repeat) {
        return;
      }

      // Add logic for enabling audio context
      if (e.code == "Space") {
      }

      handleInput(e.code);
    }
  });

  class timer {
    constructor(amount, callback) {
      this.amount = amount;
      this.timeLeft = amount;
      this.timerInterval;
      this.callback = callback;
    }
    start() {
      let _this = this;
      this.timerInterval = setInterval(function () {
        _this.timeLeft -= 1;
        if (_this.timeLeft >= 0 && _this.timeLeft < 10) {
          sound_fx.timer.start();
        }
        if (_this.timeLeft == 0) {
          // Timer run out
          clearInterval(_this.timerInterval);
          setTimeout(function () {
            _this.callback();
          }, 1000);
          setTimeout(function () {
            console.log("resetting difficulty timer");
            _this.reset();
          }, 3000);
        }
      }, 1000);
    }
    display() {
      drawText(this.timeLeft.toString(), "mainYellow", 1, 550, 25);
    }
    reset() {
      clearInterval(this.timerInterval);
      this.timeLeft = this.amount;
    }
  }

  //Create a class for menu items
  // Create each one has an animation timer to calculate the offset
  class menuItem {
    constructor(menuText, xPos, yPos, action, imgId) {
      this.menuText = menuText;
      this.offset = 640 * scaleRatio;
      this.animationTimer = 0.0;
      this.yPos = yPos;
      this.xPos = xPos;
      this.action = action;
      this.imgId = imgId;
    }
    startAnimation() {
      // Create timer for animation menu overlay and text
      let _this = this;
      let menuFadeInterval = setInterval(function () {
        _this.animationTimer += 0.2;
        if (_this.animationTimer >= 1.0) {
          clearInterval(menuFadeInterval);
          _this.animationTimer = 1.0;
        }
      }, 30);
    }
    display(displaySelected) {
      // console.log("drawing menu item");

      p.push();
      p.translate(this.offset - this.offset * this.animationTimer, 0);

      if (displaySelected) {
        //Draw shadow
        drawImageToScale(difficultyCardImgs[6], this.xPos, this.yPos);

        let y_offset = Math.sin(globalClock.seconds * 2.5) * 5;
        drawImageToScale(
          difficultyCardImgs[this.imgId],
          this.xPos - 10,
          this.yPos - 10 + y_offset,
        );
      } else {
        drawImageToScale(
          difficultyCardImgs[this.imgId + 1],
          this.xPos,
          this.yPos,
        );
      }

      p.pop();
    }
    select() {
      this.action(this.menuText);
    }
  }

  function drawMenu() {
    // let menuOpacity = 0.4;
    // // console.log(menuOpacity);

    // let overlayColor = `rgba(0,0,0,${menuOpacity})`;
    // p.fill(p.color(overlayColor));
    // p.rect(0, 0, p.width, p.height);

    menuItems.forEach(function (menuItem, index) {
      if (index == selectedMenuItemIndex) {
        menuItem.display(true);
      } else {
        menuItem.display(false);
      }
    });
    // p.rect(0, 0, p.width, p.height);
    //Display selected menu item at full brightness
    // menuItems[selectedMenuItemIndex].display();
  }

  // Draw text centered on the screen or at a certain position if specified
  function drawText(textToDraw, fontName, scaleFactor, start_xPos, start_yPos) {
    if (scaleFactor == null) {
      scaleFactor = 1;
    }
    //Automatically center if position not specified
    let charsToDraw = textToDraw.split("");
    //Calculate width based on width of each char
    // let wordWidth = charsToDraw.length * fonts[fontName].size.width;
    let wordWidth = 0;
    let wordHeight = 0;
    let char_xPositions = [];
    charsToDraw.forEach(function (char) {
      char_xPositions.push(wordWidth);
      wordWidth += fonts[fontName].charsToImgs[char].size.width;
      wordHeight = fonts[fontName].charsToImgs[char].size.height;
    });

    if (start_xPos == null) {
      start_xPos = (canvasSizeOriginal.width - wordWidth * scaleFactor) / 2;
    } else {
      let dx = ((scaleFactor - 1) * wordWidth) / 2;
      start_xPos -= dx;
    }
    if (start_yPos == null) {
      start_yPos = (canvasSizeOriginal.height - wordHeight * scaleFactor) / 2;
    } else {
      let dy = ((scaleFactor - 1) * wordHeight) / 2;
      start_yPos -= dy;
    }
    charsToDraw.forEach(function (char, index) {
      let xPos = start_xPos + char_xPositions[index] * scaleFactor;
      drawImageToScale(
        fonts[fontName].charsToImgs[char],
        xPos,
        start_yPos,
        scaleFactor,
      );
    });
  }

  p.windowResized = function () {
    calculateCanvasDimensions();
    p.resizeCanvas(canvasWidth, canvasHeight);
    // resizeBackgroundCanvas();
  };

  // function resizeBackgroundCanvas() {
  //   // console.log(backgroundCanvas);
  //   let thisCanvas = document.querySelector("#titleCanvas");
  //   thisCanvas.style.transform = `translate(-50%, -50%) scale(${scaleRatio})`;
  // }

  // Animates a sprite given the images as frames, based on a certain interval, with optional callback
  function intervalAnimation(sprite, frames, interval, callback) {
    currentlyAnimating = true;
    let original = sprite.buttonDefault;
    frames.forEach(function (img, index) {
      setTimeout(function () {
        timedAnimationIndex = (index + 1) % frames.length;
        sprite.buttonDefault = img;
      }, interval * index);
    });
    // Another for the last frame
    setTimeout(function () {
      currentlyAnimating = false;
      sprite.buttonDefault = original;
      if (callback) {
        callback();
      }
    }, interval * frames.length);
  }

  function drawImageToScale(img, x, y) {
    p.image(
      img,
      x * scaleRatio,
      y * scaleRatio,
      img.width * scaleRatio,
      img.height * scaleRatio,
    );
  }

  function calculateCanvasDimensions() {
    if (p.windowWidth / p.windowHeight > canvasRatio) {
      canvasWidth = p.windowHeight * canvasRatio;
      canvasHeight = p.windowHeight;
    } else {
      canvasWidth = p.windowWidth;
      canvasHeight = p.windowWidth / canvasRatio;
    }
    scaleRatio = canvasWidth / 640;
  }
};

new p5(difficulty, "difficulty-canvas-container");
