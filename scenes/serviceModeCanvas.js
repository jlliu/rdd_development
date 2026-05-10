var serviceMode = function (p) {
  let canvasSizeOriginal = { width: 640, height: 480 };
  let canvasWidth = canvasSizeOriginal.width;
  let canvasHeight = canvasSizeOriginal.height;

  let canvasRatio = canvasWidth / canvasHeight;
  let scaleRatio = 1;

  let serviceModeCanvas;
  let isCurrentScene = false;

  let logoImg;
  let startTextImg;

  let numCanvasesLoaded = 0;
  let allCanvasesLoaded = false;

  let menuAnimationTimer = 0.0;

  // let mainMenuItems = [];

  // let mainMenu;

  // let currentMenu;

  // let showSettings = false;

  // let visibleScene = null;

  // let settingsDialogueScenes = [];

  // let exitDialogueScenes = [];

  // let currentDialogueSceneIndex = 0;

  // let dialogueSceneType;

  let currentTestSceneNum = 6;

  let testScenes = [];
  let imageTestDialogues = [];
  let fontSpritesheetTest;

  // Idea:
  // We order scenes by number, e.g. scene 0 = Loading/Hello, Scene 1 = Color test, Scene 2 = Sound test...
  // Scenes can have multiple states to them triggered by user input or animation

  // What is the best way to do this?
  // I have a typing animation object... that you can set to animate...
  // We have a Scene class. Which contains a list of typing animation objects in order.... and also includes instructions tied to each part
  // Scene contains parts which contain typing animations and instructions. If the instructions don't make sene then I can figure it out.
  // The instructions take in certain inputs... or we have an event for when the action is successful
  // Then we drive the scene forward and animate anything new... but also we are DRAWING one scene at a time... plus anything unique
  // Each scene gets a custom function as well...

  p.preload = function () {};

  p.setup = function () {
    // put setup code here
    p.pixelDensity(3);
    calculateCanvasDimensions(p);

    serviceModeCanvas = p.createCanvas(canvasWidth, canvasHeight).elt;
    serviceModeCanvas.classList.add("gameCanvas");
    serviceModeCanvas.id = "serviceModeCanvas";

    p.noSmooth();

    p.noStroke();

    // mainMenuItems = [
    //   new menuItem("INPUT CHECK", showInputCheck),
    //   new menuItem("SOUND CHECK", showSoundCheck),
    //   new menuItem("SCREEN CHECK", showScreenCheck),
    //   new menuItem("COLOR CHECK", showColorCheck),
    //   new menuItem("GAME SETTINGS", showGameSettings),
    //   new menuItem("EXIT", showColorCheck),
    // ];

    // mainMenu = new menuGroup(mainMenuItems, 200, 140, "SERVICE MENU");

    // settingsDialogueScenes = setupDialogueScenes(settingsDialogue, "settings");
    // exitDialogueScenes = setupDialogueScenes(exitDialogue, "exit");

    // currentMenu = mainMenu;

    // visibleScene = mainMenu;

    setupScenes();

    window.dispatchEvent(canvasLoadedEvent);

    setupNavigation(serviceModeCanvas);

    // testScenes[currentScene].animatePart();
  };

  function setupScenes() {
    // Set up test Scenes for each object
    testScenesData.forEach(function (sceneData) {
      testScenes.push(new testScene(sceneData));
    });

    testScenes[1].addCustomDraw(colorTest);
    testScenes[2].addCustomDraw(soundTest);
    testScenes[3].addCustomDraw(screenTest);
    testScenes[4].addCustomDraw(inputTest);
    testScenes[5].addCustomDraw(imageTest);
    testScenes[6].addCustomDraw(fontAnimation);

    // Create custom functions for scenes

    // setup image test dialogue..
    imageTestDialogue.forEach(function (dialogueText) {
      imageTestDialogues.push(new typedText(dialogueText));
    });

    fontSpritesheetTest = new fontSpritesheetAnimation();
  }

  p.draw = function () {
    // p.clear();
    p.fill("black");
    p.rect(0, 0, p.width, p.height);

    // Start drawing things if all canvases have loaded
    if (allCanvasesLoaded) {
      testScenes[currentTestSceneNum].display();
    }
  };

  // Custom code for test scenes, depends on time... (ms)

  function colorTest(t, partNum) {
    //Draw red rects
    let count = Math.floor(t / 50);
    //Iterate through total Rects for each...
    let totalRects = 40;
    let rectWidth = 40;
    let rectHeight = 75;
    for (var i = 0; i < totalRects; i++) {
      let row = Math.floor(i / 10);
      let xPos = Math.floor(i % 10);
      let c;
      if (row == 0) {
        c = p.color(255, 0, 0);
      } else if (row == 1) {
        c = p.color(0, 255, 0);
      } else if (row == 2) {
        c = p.color(0, 0, 255);
      } else if (row == 3) {
        c = p.color(255, 255, 255);
      }
      c.setAlpha((xPos / 10) * 255);
      p.fill(c);
      p.noStroke();
      if (count >= i) {
        p.rect(
          (100 + xPos * rectWidth) * scaleRatio,
          (80 + row * rectHeight + 8 * row) * scaleRatio,
          rectWidth * scaleRatio,
          rectHeight * scaleRatio,
        );
      }
    }
  }

  let fx_list = [
    { name: "egg-crack.mp3", soundObj: sound_fx.eggCrack },
    { name: "door-shut.mp3", soundObj: sound_fx.doorShut },
    { name: "house_stab.wav", soundObj: sound_fx.menuChange },
    { name: "error.mp3", soundObj: sound_fx.error },
    { name: "select.wav", soundObj: sound_fx.select },
    { name: "attack1.mp3", soundObj: sound_fx.attack.left },
    { name: "attack2.mp3", soundObj: sound_fx.attack.down },
    { name: "attack3.mp3", soundObj: sound_fx.attack.up },
    { name: "attack4.mp3", soundObj: sound_fx.attack.right },
    // {
    //   name: "energy_blast.mp3",
    //   soundObj: sound_fx.energyBlast,
    //   isPlaying: false,
    // },
    { name: "shimmer.mp3", soundObj: sound_fx.shimmer, isPlaying: false },
  ];

  let soundTestNum = 0;
  let currentSoundTestCount = -1;

  function soundTest(t, partNum) {
    //Needs to draw the sound text stuff
    // Needs to detect when to play the sound..
    let count = Math.floor(t / 1500) % fx_list.length;
    let thisSound = fx_list[count];
    drawText(thisSound.name, "greenHelper", 1, null, 230);

    if (
      thisSound.soundObj.state == "stopped" &&
      count != currentSoundTestCount
    ) {
      thisSound.soundObj.loop = false;
      thisSound.isPlaying = true;
      thisSound.soundObj.start();
      thisSound.soundObj.onstop = function () {};
    } else if (thisSound.soundObj.state == "started") {
      currentSoundTestCount = count;
      thisSound.isPlaying = false;
    }
  }

  let screenTestDisplacement = {
    x: 0,
    y: 0,
  };

  function screenTest(t, partNum) {
    let lineWidth = 5;
    let numOfLines = (canvasWidth + canvasHeight) / lineWidth;

    //Draw underlying gradient
    for (var i = 0; i < numOfLines; i++) {
      p.strokeWeight(lineWidth);
      let gradient_value = Math.sin((t / 8 + i) / 60) * 180;
      let color = p.color(0, 255 - gradient_value, 255 - gradient_value);
      p.stroke(color);
      //Draw a diagonal line
      let displacement = i * lineWidth;
      p.line(0, displacement, 0 + displacement, 0);
    }
    //Draw square of grids
    let squareSize = 32;
    let marginSize = 1;

    // Draw inner squares

    //Draw outer squares
    for (var i = 0; i < 20; i++) {
      for (var j = 0; j < 15; j++) {
        // let transparentColor = p.color(0, 0, 0);
        // transparentColor.setAlpha(0);

        // if (!(i >= 6 && i <= 13 && j >= 4 && j <= 9)) {
        // p.stroke(transparentColor);
        p.fill("black");
        p.noStroke();
        // console.log(i * squareSize * scaleRatio + marginSize);
        p.rect(
          i * squareSize * scaleRatio + marginSize + screenTestDisplacement.x,
          j * squareSize * scaleRatio + marginSize + screenTestDisplacement.y,
          squareSize * scaleRatio - marginSize * 2,
          squareSize * scaleRatio - marginSize * 2,
        );
        // }
      }
    }

    // Draw cross lines
    p.stroke("red");
    p.strokeWeight(2);
    //Horizontal
    p.line(
      0,
      7 * squareSize * scaleRatio,
      640 * scaleRatio,
      7 * squareSize * scaleRatio,
    );
    //Vertical
    p.line(
      10 * squareSize * scaleRatio,
      0,
      10 * squareSize * scaleRatio,
      480 * scaleRatio,
    );
    //Box
    p.noFill();
    p.rect(
      6 * squareSize * scaleRatio + screenTestDisplacement.x,
      4 * squareSize * scaleRatio + screenTestDisplacement.y,
      8 * squareSize * scaleRatio,
      6 * squareSize * scaleRatio,
    );

    p.fill("black");
    p.noStroke();

    // Draw backgrounds for text
    p.rect(
      5 * squareSize * scaleRatio + screenTestDisplacement.x,
      20 * scaleRatio,
      10 * squareSize * scaleRatio + screenTestDisplacement.x,
      40 * scaleRatio,
    );

    p.rect(
      5 * squareSize * scaleRatio + screenTestDisplacement.x,
      420 * scaleRatio,
      10 * squareSize * scaleRatio + screenTestDisplacement.x,
      40 * scaleRatio,
    );
    // drawImageToScale(hitGlowImg, 30, 40);
  }

  //Initialize input data
  let inputData = [];
  for (var i = 0; i < 10; i++) {
    inputData.push({ left: false, down: false, up: false, right: false });
  }
  let currentArrowStates = {
    left: false,
    down: false,
    up: false,
    right: false,
  };

  let completedInputTests = {
    left: false,
    down: false,
    up: false,
    right: false,
  };

  function inputTest(t, partNum) {
    //Draw hit arrows
    let arrowWidth = 64;
    let margin = 10;
    let hitPos = { x: 177, y: 220 };
    let arrow_xPos = {
      left: hitPos.x,
      down: hitPos.x + arrowWidth + margin,
      up: hitPos.x + arrowWidth * 2 + margin * 2,
      right: hitPos.x + arrowWidth * 3 + margin * 3,
    };

    // drawImageToScale(hitArrowImgs.left, arrow_xPos.left, hitPos.y);
    // drawImageToScale(hitArrowImgs.down, arrow_xPos.down, hitPos.y);
    // drawImageToScale(hitArrowImgs.up, arrow_xPos.up, hitPos.y);
    // drawImageToScale(hitArrowImgs.right, arrow_xPos.right, hitPos.y);

    // Draw scrolling inputs in the back
    // console.log(currentArrowStates.left);

    currentArrowStates = {
      left: p.keyIsDown(37),
      down: p.keyIsDown(40),
      up: p.keyIsDown(38),
      right: p.keyIsDown(39),
    };
    inputData.shift();
    inputData.push(currentArrowStates);

    // Render as zeros and ones on screen

    for (var i = 0; i < inputData.length; i++) {
      // Draw left arrow
      p.tint(255, 75);
      let leftText = inputData[i].left ? "1" : "0";
      drawText(leftText, "mainYellow", 1, arrow_xPos.left + 12, 0 + i * 48);
      let downText = inputData[i].down ? "1" : "0";
      drawText(downText, "mainYellow", 1, arrow_xPos.down + 12, 0 + i * 48);
      let upText = inputData[i].up ? "1" : "0";
      drawText(upText, "mainYellow", 1, arrow_xPos.up + 12, 0 + i * 48);
      let rightText = inputData[i].right ? "1" : "0";
      drawText(rightText, "mainYellow", 1, arrow_xPos.right + 12, 0 + i * 48);
      p.tint(255, 255);
    }

    if (completedInputTests.left) {
      drawText("OK", "greenHelper", 1, arrow_xPos.left + 12, hitPos.y);
    }
    if (completedInputTests.down) {
      drawText("OK", "greenHelper", 1, arrow_xPos.down + 12, hitPos.y);
    }
    if (completedInputTests.up) {
      drawText("OK", "greenHelper", 1, arrow_xPos.up + 12, hitPos.y);
    }
    if (completedInputTests.right) {
      drawText("OK", "greenHelper", 1, arrow_xPos.right + 12, hitPos.y);
    }

    // Also trigger the action...
  }

  // Refactor image test so..
  // we track a counter of Left/Right hits
  // Each

  // let imageTestCounter = 0;
  let lastArrowHit = null;
  function imageTest(t, partNum) {
    // Draw flashing song banners
    let currentTestScene = testScenes[currentTestSceneNum];
    if (partNum < 16) {
      // currentTestScene.instructionsDelay = 400;
      // currentTestScene.instructionsFlashCount = 3;
      currentTestScene.instructionsDelay = 0;
      currentTestScene.instructionsFlashCount = 0;

      let bannerId = partNum % (songBannersImgs.length - 1);
      // let bannerId = Math.floor(t / 700) % (songBannersImgs.length - 1);
      drawImageToScale(songBannersImgs[bannerId], 120, 160);

      let dialogueId = Math.floor(partNum / 4);
      let dialogueToDisplay = imageTestDialogues[dialogueId];
      dialogueToDisplay.display();
      if (!dialogueToDisplay.startedAnimation) {
        dialogueToDisplay.animate();
      }
    } else if (partNum < 32) {
      // currentTestScene.instructionsDelay = 300;
      // currentTestScene.instructionsFlashCount = 2;
      currentTestScene.instructionsDelay = 0;
      currentTestScene.instructionsFlashCount = 0;

      let gateId = (partNum - 16) % gateImgsForTest.length;
      drawImageToScale(gateImgsForTest[gateId], 160, 0);

      let dialogueId = Math.floor(partNum / 4);
      let dialogueToDisplay = imageTestDialogues[dialogueId];
      dialogueToDisplay.display();
      if (!dialogueToDisplay.startedAnimation) {
        dialogueToDisplay.animate();
      }
    } else if (partNum < 48) {
      // currentTestScene.instructionsDelay = 100;
      // currentTestScene.instructionsFlashCount = 1;
      currentTestScene.instructionsDelay = 0;
      currentTestScene.instructionsFlashCount = 0;

      // let gateId = (partNum - 16) % gateImgsForTest.length;
      let resultImages = [winImg, failImg];
      let resultId = partNum % resultImages.length;
      drawImageToScale(resultImages[resultId], 120, 160);

      let dialogueId = Math.floor(partNum / 8) + 4;
      let dialogueToDisplay = imageTestDialogues[dialogueId];
      dialogueToDisplay.display();
      if (!dialogueToDisplay.startedAnimation) {
        dialogueToDisplay.animate();
      }
    } else if (partNum < 64) {
      currentTestScene.instructionsDelay = 0;
      currentTestScene.instructionsFlashCount = 0;

      // let gateId = (partNum - 16) % gateImgsForTest.length;
      let cdId = partNum % (songCdsImgs.length - 1);
      //   drawImageToScale(songCdsImgs[cdId], 200, 160);
      drawImageToScale(songCdsImgs[cdId], 180, 160);

      let dialogueId = Math.floor(partNum / 2) - 14;
      let dialogueToDisplay = imageTestDialogues[dialogueId];
      dialogueToDisplay.display();
      if (!dialogueToDisplay.startedAnimation) {
        dialogueToDisplay.animate();
      }
    }
    // else if (partNum < 8) {
    //   currentTestScene.instructionsDelay = 500;
    //   currentTestScene.instructionsFlashCount = 4;
    //   let gateId = Math.floor(t / 500) % gateImgsForTest.length;
    //   drawImageToScale(gateImgsForTest[gateId], 160, 0);
    // } else if (partNum < 10) {
    //   currentTestScene.instructionsDelay = 200;
    //   currentTestScene.instructionsFlashCount = 3;
    //   let resultImages = [winImg, failImg];
    //   let resultId = Math.floor(t / 300) % resultImages.length;
    //   drawImageToScale(resultImages[resultId], 120, 160);
    // } else {
    //   currentTestScene.instructionsDelay = 10;
    //   currentTestScene.instructionsFlashCount = 2;
    //   let cdId = Math.floor(t / 200) % (songCdsImgs.length - 1);
    //   drawImageToScale(songCdsImgs[cdId], 200, 160);
    // }
  }

  function fontAnimation(t, partNum) {
    let currentTestScene = testScenes[currentTestSceneNum];
    currentTestScene.instructionsDelay = 0;
    currentTestScene.instructionsFlashCount = 0;
    fontSpritesheetTest.display();
  }

  function setupNavigation(thisCanvas) {
    p.noLoop();
    thisCanvas.addEventListener("showScene", (e) => {
      p.loop();

      setTimeout(function () {
        thisCanvas.style.visibility = "visible";
        thisCanvas.style.opacity = 1;
        isCurrentScene = true;
        // Animate in main menu
        // mainMenu.animateMenu();

        testScenes[currentTestSceneNum].animatePart();
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

  // function showInputCheck() {
  //   //Add scene here
  // }
  // function showSoundCheck() {
  //   //Add scene here
  // }
  // function showScreenCheck() {
  //   //Add scene here
  // }
  // function showColorCheck() {
  //   //Add scene here
  // }

  function showScene(sceneNum) {
    // Intro scene
    if (sceneNum == 0) {
    }
    // Color test
    else if (sceneNum == 1) {
    }
  }

  function handleInput(keyCode) {
    //Handle case for menu navigation
    if (isCurrentScene) {
      let currentTestScene = testScenes[currentTestSceneNum];
      // for now assume enter progresses the current instructions

      if (keyCode == "Enter") {
        // need to get current part
        console.log(currentTestScene);
        currentTestScene.triggerSelect();
      }

      if (currentTestSceneNum == 4) {
        let instructionsShowing =
          currentTestScene.parts[currentTestScene.currentPartNum].instructions
            .showing;
        if (
          keyCode == "ArrowLeft" &&
          currentTestScene.currentPartNum == 0 &&
          instructionsShowing
        ) {
          completedInputTests.left = true;
          currentTestScene.triggerSelect();
        }
        if (
          keyCode == "ArrowDown" &&
          currentTestScene.currentPartNum == 1 &&
          instructionsShowing
        ) {
          completedInputTests.down = true;
          currentTestScene.triggerSelect();
        }
        if (
          keyCode == "ArrowUp" &&
          currentTestScene.currentPartNum == 2 &&
          instructionsShowing
        ) {
          completedInputTests.up = true;
          currentTestScene.triggerSelect();
        }
        if (
          keyCode == "ArrowRight" &&
          currentTestScene.currentPartNum == 3 &&
          instructionsShowing
        ) {
          completedInputTests.right = true;
          currentTestScene.triggerSelect();
        }
      }
      // Create a counter for LEFT / RIGHT hits.
      if (currentTestSceneNum == 5 || currentTestSceneNum == 6) {
        let instructionsObj =
          currentTestScene.parts[currentTestScene.currentPartNum].instructions;
        let instructionsShowing = instructionsObj.showing;
        if (keyCode == "ArrowLeft") {
          if (
            lastArrowHit == "ArrowRight" ||
            (lastArrowHit == null && instructionsObj.text == "TAP LEFT")
          ) {
            if (currentTestScene.triggerSelect()) {
              lastArrowHit = "ArrowLeft";
              // Add code for font animation
              if (currentTestSceneNum == 6) {
                fontSpritesheetTest.animateCue(currentTestScene.currentPartNum);
              }
            }
          }
        }
        if (keyCode == "ArrowRight") {
          if (
            lastArrowHit == "ArrowLeft" &&
            instructionsObj.text == "TAP RIGHT"
          ) {
            if (currentTestScene.triggerSelect()) {
              lastArrowHit = "ArrowRight";
              // Add code for font animation
              if (currentTestSceneNum == 6) {
                fontSpritesheetTest.animateCue(currentTestScene.currentPartNum);
              }
            }
          }
        }
      }
    }
  }

  //   function handleInputForInputTest(keyCode) {
  //   if (keyCode == "ArrowLeft") {
  //     screenTestDisplacement.x -= 1;
  //   }
  //   if (keyCode == "ArrowRight") {
  //     screenTestDisplacement.x += 1;
  //   }
  // }

  function handleInputForScreenTest(keyCode) {
    if (keyCode == "ArrowLeft") {
      screenTestDisplacement.x -= 1;
    }
    if (keyCode == "ArrowRight") {
      screenTestDisplacement.x += 1;
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
    let direction = e.detail.direction;
    handleInput(directionToKeycode(direction));
  });
  window.addEventListener("padRelease", function (e) {
    let direction = e.detail.direction;
    handleInput(directionToKeycode(direction));
  });

  window.addEventListener("keydown", function (e) {
    e.preventDefault();
    //Ignore repeated keydown
    if (e.repeat) {
      return;
    }

    // Add logic for enabling audio context
    if (e.code == "Space") {
    }

    handleInput(e.code);
  });

  class testScene {
    constructor(partsList) {
      this.parts = [];
      let _this = this;
      partsList.forEach(function (part) {
        let partData = {};
        partData.dialogue = new typedText(part.dialogue);
        partData.instructions = new instructions(part.instructions);
        _this.parts.push(partData);
      });

      this.currentPartNum = 0;

      this.customDraw = null;
      this.sceneTime = 0;
      this.sceneInterval = null;
      this.instructionsDelay = 1000;
      this.instructionsFlashCount = 5;
    }
    display() {
      let currentPart = this.parts[this.currentPartNum];

      // Display any custom script stuff here.....
      if (this.customDraw) {
        // console.log(this.sceneTime);
        this.customDraw(this.sceneTime, this.currentPartNum);
      }
      currentPart.dialogue.display();

      if (currentPart.instructions.showing) {
        currentPart.instructions.display();
      }
    }
    animatePart() {
      //Start sceneTime if the beginning
      let _this = this;
      if (this.currentPartNum == 0) {
        this.sceneInterval = setInterval(function () {
          _this.sceneTime += 10;
        }, 10);
      }
      let currentPart = this.parts[this.currentPartNum];
      currentPart.dialogue.animate();
      //Show instructions after a bit
      setTimeout(function () {
        currentPart.instructions.fadeIn();
        // currentPart.instructions.showing = true;
      }, this.instructionsDelay);
    }
    addCustomDraw(drawScript) {
      console.log("adding a custom draw");
      this.customDraw = drawScript;
    }
    triggerSelect() {
      let currentPart = this.parts[this.currentPartNum];
      if (
        !currentPart.instructions.currentlyFlashing &&
        currentPart.instructions.showing
      ) {
        let _this = this;
        let progressScene = function () {
          if (_this.currentPartNum < _this.parts.length - 1) {
            _this.currentPartNum += 1;
            _this.animatePart();
          } else {
            // this.currentPartNum = 0;
            currentTestSceneNum += 1;
            testScenes[currentTestSceneNum].animatePart();
            clearInterval(_this.sceneInterval);
          }
        };
        currentPart.instructions.select(
          progressScene,
          this.instructionsFlashCount,
        );
        return true;
      }
      return false;

      // Move onto next part. if not, move onto next scene
    }
  }

  class typedText {
    constructor(textLines) {
      this.textLines = textLines;

      //Account for height of multiple lines
      if (typeof this.textLines == "string") {
        this.numOfLines_L = 1;
        this.height_L = 29;
      } else {
        this.numOfLines_L = this.textLines.length;
        this.height_L = 29 * this.numOfLines_L;
      }
      this.charsInLineShown = 0;
      this.lineShown = 0;
      this.startedAnimation = false;
    }
    getLeftPosition(text) {
      let charWidth = 18;
      return (640 - text.length * charWidth) / 2;
    }
    display() {
      //Draw left side of text
      // let L_start_xPos = 70;
      let L_start_xPos = 640 / 2;
      //Center it vertically
      let yOffset = 200;
      let L_current_yPos = (480 - this.height_L) / 2 - yOffset;
      //Draw left text, line by line
      for (var i = 0; i < this.numOfLines_L; i++) {
        let textToDraw =
          typeof this.textLines == "string"
            ? this.textLines
            : this.textLines[i];

        //Draw previous lines
        if (this.lineShown > i) {
          drawText(
            textToDraw,
            "whiteTerminal",
            1,
            this.getLeftPosition(textToDraw),
            L_current_yPos,
          );
          //Draw currently typing lines
        } else if (this.lineShown == i) {
          drawText(
            textToDraw.slice(0, this.charsInLineShown),
            "whiteTerminal",
            1,
            this.getLeftPosition(textToDraw),
            L_current_yPos,
          );
        }

        L_current_yPos += 29;
      }

      // this.menuGroup.display(true);
    }

    // Animates the left with a typing, then fades in the menu part
    animate() {
      this.startedAnimation = true;
      //Set up Lines list
      let lines;
      if (typeof this.textLines == "string") {
        lines = [this.textLines];
      } else {
        lines = this.textLines;
      }
      let _this = this;
      let typingAnimationTimer = setInterval(function () {
        _this.charsInLineShown++;
        //Reach the end of line, increment line shown

        if (_this.charsInLineShown == lines[_this.lineShown].length) {
          _this.lineShown++;
          _this.charsInLineShown = 0;
          if (_this.lineShown == lines.length) {
            // END OF TYPING ANIMATION
            clearInterval(typingAnimationTimer);

            // TODO: Animate in menu
            // _this.menuGroup.animateMenu();
          }
        }
      }, 40);
    }
  }

  class instructions {
    constructor(text) {
      this.text = text;
      this.currentlyFlashing = false;
      this.showing = false;
      this.opacity = 0;
    }
    display() {
      p.tint(255, this.opacity * 255);
      drawText(this.text, "whiteTerminal", 1, null, 430);
      p.tint(255, 255);
    }
    fadeIn() {
      this.showing = true;
      let _this = this;
      let opacityInterval = setInterval(function () {
        if (_this.opacity >= 1) {
          clearInterval(opacityInterval);
        } else {
          _this.opacity += 0.03;
        }
      }, 10);
    }
    select(action, flashCount) {
      console.log("animating select");
      let _this = this;
      let count = 0;
      this.currentlyFlashing = true;
      let flashInterval = setInterval(function () {
        _this.opacity = 0;
        setTimeout(function () {
          _this.opacity = 1;
        }, 80);
        _this.opacity = 0;
        if (count == flashCount) {
          action();
          this.currentlyFlashing = false;
          clearInterval(flashInterval);

          // Do specified action

          // _this.action(_this.menuText);
        }
        count++;
      }, 160);
    }
  }

  class fontSpritesheetAnimation {
    constructor() {
      this.originalText = [
        `ABCDEFGHIJKL`,
        `MNOPQRSTUVWX`,
        `YZabcdefghij`,
        `klmnopqrstuv`,
        `wxyz12345678`,
        `90.,?!-_"'()`,
      ];
      this.lines = [];
      let _this = this;
      this.originalText.forEach(function (line) {
        let thisLine = line.split("");
        _this.lines.push(thisLine);
      });
    }

    display() {
      let fontHeight = 70;
      let fontWidth = 48;
      this.lines.forEach(function (line, lineIndex) {
        line.forEach(function (char, charIndex) {
          drawText(
            char,
            "testFont",
            1,
            30 + charIndex * fontWidth,
            15 + lineIndex * fontHeight,
          );
        });
      });
    }

    replaceAt(oldString, index, replacement) {
      return (
        oldString.substring(0, index) +
        replacement +
        oldString.substring(index + replacement.length)
      );
    }

    // Given a line number and a result string... it will animate each letter one by one until the letters end up how they should... by flipping through sequentially...
    animateLineToResult(lineIndex, destinationString) {
      // But first, switch it to basic without animation...
      let prevLine = this.lines[lineIndex];

      //Iterate through every character. set a timeout that increments the letter until it found the match.
      // First, iterate through every column in the string. tell that column to do the swap at a fixed time using a timeout.
      // When it's time, that character will have a char swap interval that increments the character until it is matching the destination character

      for (let i = 0; i < prevLine.length; i++) {
        setTimeout(function () {
          let prevChar = prevLine[i];
          let destinationChar = destinationString[i];
          let characterString = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890.,?!-_"'()[] `;
          let currentIndex = characterString.indexOf(prevChar);
          let charSwapInterval = setInterval(function () {
            currentIndex = (currentIndex + 1) % characterString.length;
            prevLine[i] = characterString[currentIndex];
            if (characterString[currentIndex] == destinationChar) {
              clearInterval(charSwapInterval);
            }
          }, 10);
        }, 10 * i);
      }

      // this.lines[lineIndex] = destinationString;
    }

    animateAllWithInterval(destinationString) {
      let count = 0;
      let wordTiming;
      let _this = this;
      let wordTimingInterval = setInterval(function () {
        _this.animateLineToResult(count, destinationString);
        count++;
        if (count == 6) {
          clearInterval(wordTimingInterval);
        }
      }, 200);
    }
    //Given a cue (partNum), animates the line to do what it wants
    animateCue(cueNum) {
      if (cueNum == 0) {
        this.animateLineToResult(0, `.....I......`);
      } else if (cueNum == 2) {
        this.animateLineToResult(1, `..THOUGHT...`);
      } else if (cueNum == 4) {
        this.animateLineToResult(2, `......I.....`);
      } else if (cueNum == 6) {
        this.animateLineToResult(3, `...NEEDED...`);
      } else if (cueNum == 8) {
        this.animateLineToResult(4, `...TO.......`);
      } else if (cueNum == 10) {
        this.animateLineToResult(4, `...TO..BE...`);
      } else if (cueNum == 12) {
        this.animateLineToResult(5, `...FIXED....`);
      } else if (cueNum == 16) {
        this.animateAllWithInterval(`.....I......`);
      } else if (cueNum == 18) {
        this.animateAllWithInterval(`....JUST....`);
      } else if (cueNum == 20) {
        this.animateAllWithInterval(`...NEEDED...`);
      } else if (cueNum == 22) {
        this.animateAllWithInterval(`......A.....`);
      } else if (cueNum == 24) {
        this.animateAllWithInterval(`..WITNESS...`);
      }
    }
  }

  // A menu group is a set of selectable menu items
  class menuGroup {
    constructor(itemList, xPos, yPos, titleText) {
      this.itemList = itemList;
      this.visible = false;
      this.activeMenuItemIndex = 0;
      this.xPos = xPos;
      this.yPos = yPos;
      this.itemList[0].active = true;
      this.titleText = titleText;
      this.height = 0;
      // 0 linesShown means that the first line is showing
      this.linesShown = 0;
      this.titleTextOpacity = 0;
      this.doneAnimating = false;
      this.currentlyFlashing = false;
    }
    getHeight() {
      let totalHeight = 0;
      let lineHeight = this.itemList[0].height;
      if (this.titleText) {
        totalHeight = lineHeight + 60;
      }
      let _this = this;
      this.itemList.forEach(function (menuItem) {
        totalHeight += menuItem.height + 15;
      });
      //Compensate for last one not having a gap
      totalHeight -= 15;
      return totalHeight;
    }
    display(verticallyCenter) {
      let current_yPos = this.yPos;

      //Push for translate
      if (verticallyCenter) {
        current_yPos = 0;
        p.push();
        p.translate(0, ((480 - this.getHeight()) / 2) * scaleRatio);
      }

      //Draw title
      if (this.titleText) {
        p.tint(255, this.titleTextOpacity * 255);
        drawText(this.titleText, "whiteTerminal", 1, this.xPos, current_yPos);
        p.tint(255, 255);
        current_yPos = current_yPos + 60;
      }

      // Draw all menu items after one another
      let _this = this;

      this.itemList.forEach(function (menuItem) {
        menuItem.display(_this.xPos, current_yPos);

        current_yPos += menuItem.height + 15;
      });

      //Pop for translate
      if (verticallyCenter) {
        p.pop();
      }
    }
    animateMenu() {
      //Animates list of menu items line by line, depending on if there is a title...
      let _this = this;
      let lineShowInterval = setInterval(function () {
        _this.linesShown++;
        let totalLines = _this.titleText
          ? _this.itemList.length + 1
          : _this.itemList.length;
        if (_this.linesShown >= totalLines) {
          clearInterval(lineShowInterval);
        }
        if (_this.titleText && _this.linesShown == 1) {
          //Show title
          let fadeTitleTimeout = setInterval(function () {
            _this.titleTextOpacity += 0.05;
            if (_this.titleTextOpacity >= 1.0) {
              _this.titleTextOpacity = 1.0;

              clearInterval(fadeTitleTimeout);
            }
          }, 24);
        } else {
          let thisMenuItemIndex = _this.titleText
            ? _this.linesShown - 2
            : _this.linesShown - 1;

          let thisMenuItem = _this.itemList[thisMenuItemIndex];
          thisMenuItem.fadeInAnimation();
          if (thisMenuItemIndex == _this.itemList.length - 1) {
            thisMenuItem.fadeInAnimation(true);
          } else {
            thisMenuItem.fadeInAnimation();
          }
        }
      }, 300);
    }
  }

  // menu text is a string, or list or strings
  class menuItem {
    constructor(menuText, action) {
      this.menuText = menuText;
      this.action = action;
      this.active = false;
      this.showCarat = false;

      //Account for height of multiple lines
      if (typeof this.menuText == "string") {
        this.numOfLines = 1;
        this.height = 29;
      } else {
        this.numOfLines = this.menuText.length;
        this.height = 29 * this.numOfLines;
      }
      this.opacity = 0;
    }

    display(xPos, yPos) {
      if (this.active && this.showCarat) {
        let charWidth = fonts["whiteTerminal"].sets[0].size.width;
        drawText(">", "whiteTerminal", 1, xPos - charWidth * 1.5, yPos);
      }
      // Draw the number of lines in this menu item text
      let current_yPos = yPos;
      for (var i = 0; i < this.numOfLines; i++) {
        let textToDraw =
          typeof this.menuText == "string" ? this.menuText : this.menuText[i];
        p.tint(255, this.opacity * 255);
        drawText(textToDraw, "whiteTerminal", 1, xPos, current_yPos);
        p.tint(255, 255);
        current_yPos += 29;
      }
    }
    fadeInAnimation(isLast) {
      let _this = this;
      let fadeInAnimation = setInterval(function () {
        _this.opacity += 0.05;
        if (_this.opacity >= 1.0) {
          _this.opacity = 1.0;
          if (isLast) {
            setTimeout(function () {
              let thisItemList = currentMenu.itemList;
              currentMenu.doneAnimating = true;
              thisItemList.forEach(function (item) {
                item.showCarat = true;
              });
            }, 200);
          }
          clearInterval(fadeInAnimation);
        }
      }, 24);
    }
    select() {
      let _this = this;
      let count = 0;
      currentMenu.currentlyFlashing = true;
      let flashInterval = setInterval(function () {
        _this.opacity = 0;
        setTimeout(function () {
          _this.opacity = 1;
        }, 80);
        _this.opacity = 0;
        if (count == 10) {
          currentMenu.currentlyFlashing = false;
          clearInterval(flashInterval);
          _this.action(_this.menuText);
        }
        count++;
      }, 160);
    }
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

  // Animates a sprite given the images as frames, based on a certain interval, with optional callback

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

new p5(serviceMode, "service-mode-canvas-container");
