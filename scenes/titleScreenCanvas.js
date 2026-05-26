const audioCtx = new AudioContext();

// Code for title screen

// const title_player = new Tone.Player(
//   "assets/audio/RDD_p2_drum_loop.mp3",
//   startSong
// ).toDestination();
// title_player.loop = true;
// title_player.volume.value = -5;
// title_player.fadeOut = 4;
console.log(audioCtx.state);

// function startSong() {
//   title_player.stop();
//   title_player.start();
// }
var title = function (p) {
  let canvasSizeOriginal = { width: 640, height: 480 };
  let canvasWidth = canvasSizeOriginal.width;
  let canvasHeight = canvasSizeOriginal.height;

  let canvasRatio = canvasWidth / canvasHeight;
  let scaleRatio = 1;
  let mouse_x;
  let mouse_y;
  let rightButton;
  let leftButton;

  let titleCanvas;
  let isCurrentScene = true;

  let logoImg;

  let logoImg_reboot;

  let numCanvasesLoaded = 0;
  let allCanvasesLoaded = false;

  let menuVisible = false;

  let menuOpacityAmount = 0.0;

  let menuItems = [];
  let selectedMenuItemIndex = 0;

  let padSelectTimer = null;

  let isDemo = false;

  let playerTextSpritesheet;

  let uiTopBarSpritesheet;

  let gameModeSpritesheet;

  let introVideo;
  // let introVideoLimit = 35;
  let introVideoLimit = 0.1;
  let introFinished = false;

  // Setup all fonts in this file
  let fontsToLoad = [
    "mainYellow",
    "neuropol",
    "smallYellow",
    "pink",
    "greenHelper",
    "whitePixel",
    "whiteTerminal",
    "scoreDigits",
    "greenTerminal",
    "testFont",
    "mainIceBlue",
    "mainGreen",
  ];

  p.preload = function () {
    //Preload a background here
    //Preload whatever needs to be preloaded

    // shader = p.loadShader("shaders/basic.vert", "shaders/basic.frag");
    logoImg = p.loadImage("assets/RDD-logo.png");
    logoImg_reboot = p.loadImage("assets/RDD-logo-reboot.png");

    fontsToLoad.forEach(function (fontName) {
      fonts[fontName].sets.forEach(function (fontSet) {
        fontSet.imgObj = p.loadImage(fontSet.src);
      });
    });

    //Load global assets
    playerTextSpritesheet = p.loadImage("assets/playerTextSheet.png");
    uiTopBarSpritesheet = p.loadImage("assets/ui-top-bar-spritesheet.png");
    gameModeSpritesheet = p.loadImage("assets/gameModeSpritesheet.png");
  };

  p.setup = function () {
    // put setup code here
    p.frameRate(frameRate);
    p.pixelDensity(3);
    calculateCanvasDimensions(p);

    titleCanvas = p.createCanvas(canvasWidth, canvasHeight).elt;
    titleCanvas.classList.add("gameCanvas");
    titleCanvas.id = "titleCanvas";

    p.noSmooth();

    p.noStroke();

    fontsToLoad.forEach(function (fontName) {
      setupFont(fontName);
    });

    //Initialize player text assets
    let playerTextImgsArray = [];
    for (var i = 0; i < 6; i++) {
      let croppedImg = playerTextSpritesheet.get(0, 20 * i, 100, 20);
      playerTextImgsArray.push(croppedImg);
    }
    playerTextImgs = {
      player1: playerTextImgsArray[0],
      player2: playerTextImgsArray[1],
      Easy: playerTextImgsArray[2],
      Medium: playerTextImgsArray[3],
      Hard: playerTextImgsArray[4],
      Xtreme: playerTextImgsArray[5],
    };

    let uiBarImgsArray = [];
    for (var i = 0; i < 3; i++) {
      let croppedImg = uiTopBarSpritesheet.get(0, 72 * i, 640, 72);
      uiBarImgsArray.push(croppedImg);
    }

    gameModeImgs = {
      story: gameModeSpritesheet.get(0, 0, 115, 14),
      arcade: gameModeSpritesheet.get(0, 14, 115, 14),
    };

    uiTopBarImgs = {
      difficulty: uiBarImgsArray[0],
      music: uiBarImgsArray[1],
      results: uiBarImgsArray[2],
    };

    menuItems = [
      new menuItem("STORY MODE", null, 70, startStoryMode),
      new menuItem("ARCADE MODE", null, 150, startArcadeMode),
      new menuItem("SETTINGS", null, 230, showSettings),
      new menuItem("CREDITS", null, 310, showCredits),
    ];

    window.dispatchEvent(canvasLoadedEvent);

    setupNavigation(titleCanvas);

    // Handle intro video
    introVideo = document.querySelector("#introVideo");
    introVideo.load();
    introVideo.loop = false;
    // console.log("show scene");
    introVideo.addEventListener("canplaythrough", function () {
      introVideo.play();
    });

    function endIntroSong() {
      if (this.currentTime >= introVideoLimit) {
        document
          .getElementById("backgroundCanvas")
          .dispatchEvent(showSceneEvent);
        introVideo.style.opacity = 0;
        introVideo.removeEventListener("timeupdate", endIntroSong);
        introFinished = true;
        setTimeout(function () {
          introVideo.pause();
        }, 5000);
      }
    }
    introVideo.addEventListener("timeupdate", endIntroSong);
  };

  p.draw = function () {
    p.clear();

    // Start drawing things if all canvases have loaded
    if (allCanvasesLoaded && introFinished) {
      let logoImgToDraw = gameIsReboot ? logoImg_reboot : logoImg;

      drawImageToScale(logoImgToDraw, 94, 176);
      // Draw Title Screen Elements
      if (!menuVisible) {
        let textToDraw = gameIsReboot ? "TO THE BODY" : "ENTER TO SELECT";
        if (Math.floor(globalClock.seconds) % 2 == 0) {
          drawText(textToDraw, "greenHelper", 1, null, 430);
        }
      } else {
        // Draw Menu Screen Elements
        drawMenu();
        let textToDraw = gameIsReboot ? "I CAN BELIEVE" : "ENTER TO SELECT";
        if (Math.floor(globalClock.seconds) % 2 == 0) {
          drawText(textToDraw, "greenHelper", 1, null, 430);
        }
      }
    }
  };

  function setupNavigation(thisCanvas) {
    thisCanvas.addEventListener("showScene", (e) => {
      p.loop();
      isCurrentScene = true;
      setTimeout(function () {
        thisCanvas.style.visibility = "visible";
        thisCanvas.style.opacity = 1;

        if (gameIsReboot) {
          menuVisible = false;
          menuOpacityAmount = 0.0;
          menuItems.forEach(function (menuItem) {
            menuItem.reset();
          });
          menuItems[0].menuText = "NEW";
          menuItems[1].menuText = "MODES";
          menuItems[2].menuText = "ARE";
          menuItems[3].menuText = "POSSIBLE";
        }
      }, sceneTransitionTime);
    });
    thisCanvas.addEventListener("hideScene", (e) => {
      p.noLoop();
      isCurrentScene = false;
      thisCanvas.style.opacity = 0;
      setTimeout(function () {
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

  function showCredits() {
    console.log("show credits");
  }

  function showSettings() {
    console.log("show settings");
  }

  function startArcadeMode() {
    console.log("start Arcade mode");
    gameMode = "arcade";
  }

  function startStoryMode() {
    console.log("start story mode");
    gameMode = "story";

    // Show tutorial
    // document.getElementById("tutorial").dispatchEvent(showSceneEvent);
    // Show difficulty (for testing)
    // let showBackgroundShaderEvent = new CustomEvent("showScene", {
    //   detail: {
    //     songIndex: 2,
    //   },
    // });

    // document.getElementById("gameModeCanvas").dispatchEvent(showSceneEvent);
    document.getElementById("difficultyCanvas").dispatchEvent(showSceneEvent);

    // FOR TESTING SERVICE
    // document.getElementById("serviceModeCanvas").dispatchEvent(showSceneEvent);
    // menu_track_player.stop();

    titleCanvas.dispatchEvent(hideSceneEvent);

    // document.getElementById("revelationCanvas").dispatchEvent(showSceneEvent);
    // let showBackgroundShaderEvent = new CustomEvent("showScene", {
    //   detail: {
    //     shaderType: "radialGlow",
    //     songIndex: 2,
    //   },
    // });

    // document
    //   .getElementById("backgroundCanvas")
    //   .dispatchEvent(showBackgroundShaderEvent);

    // document.getElementById("backgroundCanvas").dispatchEvent(hideSceneEvent);
  }

  function handleInput(keyCode) {
    // let songStarted = title_player.state == "started";

    // if (allCanvasesLoaded && songStarted) {
    if (allCanvasesLoaded && isCurrentScene && introFinished) {
      //Handle case for first key press (Any), which shows menu
      if (!menuVisible && keyCode == "Enter") {
        enterGame();
        sound_fx.select.start();
      } else if (menuVisible) {
        //Handle case for menu navigation
        if (keyCode == "ArrowDown" || keyCode == "KeyS") {
          if (selectedMenuItemIndex < menuItems.length - 1) {
            selectedMenuItemIndex++;
            sound_fx.menuChange.start();
          }
        }
        if (keyCode == "ArrowUp" || keyCode == "KeyW") {
          if (selectedMenuItemIndex > 0) {
            selectedMenuItemIndex--;
            sound_fx.menuChange.start();
          }
        }
        //Select menu item
        if (keyCode == "Enter") {
          selectCurrentOption();
        }
      }
    }
  }
  // Handle select from pad.. if time runs out without releasing then we press "Enter"
  function startPadHold() {
    if (padSelectTimer == null) {
      padSelectTimer = setTimeout(function () {
        if (menuVisible) {
          selectCurrentOption();
        } else {
          enterGame();
        }
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

  function enterGame() {
    //Skip to difficulty if this is the demo mode
    if (isDemo) {
      sound_fx.select.start();
      // menu_track_player.start();
      menu_track_player.volume.value = 0;
      startStoryMode();
    } else {
      //Display menu for the first time
      menuVisible = true;
      //Create stagggered animation for menu items
      let menuItemToAnimate = 0;
      let menuItemStaggerTimer = setInterval(function () {
        menuItems[menuItemToAnimate].startAnimation();
        menuItemToAnimate++;
        if (menuItems[menuItemToAnimate] == null) {
          clearInterval(menuItemStaggerTimer);
        }
      }, 150);

      // Create timer for animation menu overlay and text
      let menuFadeInterval = setInterval(function () {
        menuOpacityAmount += 0.2;
        if (menuOpacityAmount >= 1.0) {
          clearInterval(menuFadeInterval);
          menuOpacityAmount = 1.0;
        }
      }, 30);
    }
  }

  function selectCurrentOption() {
    sound_fx.select.start();
    menuItems[selectedMenuItemIndex].select();
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
        if (audioCtx.state == "suspended") {
          audioCtx.resume();
          // startSong();
          Tone.start();
        }
      }

      // Handle key press after game load
      // let songStarted =
      //   title_player.state == "started" && audioCtx.state == "running";
      // if (songStarted) {
      //   handleInput(e.code);
      // }

      handleInput(e.code);
    }
  });

  //Create a class for menu items
  // Create each one has an animation timer to calculate the offset
  class menuItem {
    constructor(menuText, xPos, yPos, action) {
      this.menuText = menuText;
      this.offset = 640 * scaleRatio;
      this.animationTimer = 0.0;
      this.yPos = yPos;
      this.xPos = yPos;
      this.action = action;
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
    reset() {
      this.animationTimer = 0.0;
    }
    display() {
      p.push();
      p.translate(this.offset - this.offset * this.animationTimer, 0);
      drawText(this.menuText, "neuropol", 1, null, this.yPos);
      p.pop();
    }
    select() {
      this.action();
    }
  }

  function drawMenu() {
    let menuOpacity = menuOpacityAmount * 0.5;

    // console.log(menuOpacity);
    let overlayColor1 = `rgba(0,0,0,${menuOpacity})`;
    p.fill(p.color(overlayColor1));

    p.rect(0, 0, p.width, p.height);

    menuItems.forEach(function (menuItem, index) {
      if (index != selectedMenuItemIndex) {
        menuItem.display();
      }
    });

    p.rect(0, 0, p.width, p.height);

    //Display selected menu item at full brightness
    menuItems[selectedMenuItemIndex].display();
  }

  function setupFont(fontName) {
    let fontSets = fonts[fontName].sets;
    fontSets.forEach(function (fontSet) {
      let size = fontSet.size;
      let imgObj = fontSet.imgObj;
      let columns = imgObj.width / size.width;
      let rows = imgObj.height / size.height;
      fontSet.charSet.forEach(function (character, index) {
        let startingX = (index % columns) * size.width;
        let startingY = Math.floor(index / columns) * size.height;
        let charImg = imgObj.get(startingX, startingY, size.width, size.height);
        fonts[fontName].charsToImgs[character] = charImg;
        fonts[fontName].charsToImgs[character].size = {
          width: size.width,
          height: size.height,
        };
      });
    });
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

new p5(title, "title-canvas-container");
