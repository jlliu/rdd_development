var mainScene = function (p) {
  let mainSongCanvas;
  let isCurrentScene = false;

  let thisSongPlayer;

  let thisSongData;

  let updateArrowsInterval;

  let canvasSizeOriginal = { width: 640, height: 480 };
  let canvasWidth = canvasSizeOriginal.width;
  let canvasHeight = canvasSizeOriginal.height;

  let canvasRatio = canvasWidth / canvasHeight;
  let scaleRatio = 1;

  let numCanvasesLoaded = 0;
  let allCanvasesLoaded = false;

  let songId = 0;

  let hitArrowImgs;
  let arrowWidth = 64;
  let hitPos = { x: 16, y: 56 };
  let arrow_xPos = {
    left: hitPos.x,
    down: hitPos.x + arrowWidth,
    up: hitPos.x + arrowWidth * 2,
    right: hitPos.x + arrowWidth * 3,
  };

  let arrowImgs;
  let arrowImgsOriginal;

  let holdMiddleImg;
  let holdEndImgs;
  let comboTextImg;
  let healthBarFrameImg;
  let greenGradientImg;
  let rainbowGradientImg;
  let hitGlowImg;
  let scoreBackgroundImg;

  let eggBombImg;

  //relevantNotes stores an array of note objects
  let relevantNotes = [];
  // let hitMargin = 100;

  let measureData;
  let songBpm;
  let currentBpmStartBeat = 0;
  let currentBpmChangeTime = 0;
  let songDelay;
  let secondsPerBeat;
  let stops;
  let hasBpmChanges = false;
  let bpmChanges = [];
  let hasStops = false;

  let hitArrowObjs = {};
  let feedbackObj;
  let comboObj;
  let scoreData;
  let healthBar;

  // current batch num is the measure of the current batch
  let batchSize = 2;
  let currentBatchStartMeasure = 0;
  let currentMeasure = -1;
  let t = 0;
  let currentBeat = 0;
  let pixelsElapsed = 0;
  let pixelsPerBeat = 120;

  let hitMargin = 0.4 * pixelsPerBeat;

  let hitMarginTime = 0.5;

  // let clock = new Tone.Clock((time) => {}, 1);

  // let stopClock = new Tone.Clock((time) => {
  //   // console.log(time);
  // }, 1);

  let secondsSinceStop = 0;

  // let clock = Tone.Transport((time) => {}, 1);

  let startDrawingArrows = false;

  let songVideo;
  let videoLoadedFirstTime = false;

  p.preload = function () {
    //Preload a background here
    //Preload whatever needs to be preloaded
    hitArrowImgs = {
      left: p.loadImage("/assets/hit-arrow-left.png"),
      up: p.loadImage("/assets/hit-arrow-up.png"),
      right: p.loadImage("/assets/hit-arrow-right.png"),
      down: p.loadImage("/assets/hit-arrow-down.png"),
    };
    holdMiddleImg = p.loadImage("/assets/hold-middle.png");
    holdEndImgs = {
      left: p.loadImage("/assets/hold-end-left.png"),
      up: p.loadImage("/assets/hold-end-up.png"),
      right: p.loadImage("/assets/hold-end-right.png"),
      down: p.loadImage("/assets/hold-end-down.png"),
    };
    arrowImgs = {
      left: p.loadImage("/assets/arrow-left.png"),
      up: p.loadImage("/assets/arrow-up.png"),
      right: p.loadImage("/assets/arrow-right.png"),
      down: p.loadImage("/assets/arrow-down.png"),
    };
    arrowImgsOriginal = {
      left: p.loadImage("/assets/arrow-left.png"),
      up: p.loadImage("/assets/arrow-up.png"),
      right: p.loadImage("/assets/arrow-right.png"),
      down: p.loadImage("/assets/arrow-down.png"),
    };

    comboTextImg = p.loadImage("/assets/comboText.png");
    healthBarFrameImg = p.loadImage("/assets/healthBarFrame.png");
    greenGradientImg = p.loadImage("/assets/greenGradient.png");
    rainbowGradientImg = p.loadImage("/assets/rainbowGradient.png");
    hitGlowImg = p.loadImage("/assets/hit-glow.png");
    eggBombImg = p.loadImage("/assets/egg-bomb.png");
    scoreBackgroundImg = p.loadImage("/assets/scoreBackground.png");
  };

  p.setup = function () {
    // put setup code here
    p.pixelDensity(3);
    p.frameRate(60);
    calculateCanvasDimensions(p);
    mainSongCanvas = p.createCanvas(canvasWidth, canvasHeight).elt;
    mainSongCanvas.classList.add("gameCanvas");
    mainSongCanvas.classList.add("mainSongCanvas");
    mainSongCanvas.id = "mainSongCanvas";

    p.noSmooth();

    hitArrowObjs = {
      left: new HitArrow("left", hitPos.x, hitPos.y),
      down: new HitArrow("down", hitPos.x + arrowWidth, hitPos.y),
      up: new HitArrow("up", hitPos.x + arrowWidth * 2, hitPos.y),
      right: new HitArrow("right", hitPos.x + arrowWidth * 3, hitPos.y),
    };

    feedbackObj = new FeedbackText();
    comboObj = new ComboText();

    scoreData = new Score();
    healthBar = new HealthBar();

    holdMiddleImg.loadPixels();
    Object.values(arrowImgsOriginal).forEach(function (imgObj) {
      imgObj.loadPixels();
    });
    Object.values(holdEndImgs).forEach(function (imgObj) {
      imgObj.loadPixels();
    });

    window.dispatchEvent(canvasLoadedEvent);
    setupNavigation(mainSongCanvas);
  };

  p.draw = function () {
    // p.background("pink");
    p.clear();

    Object.values(hitArrowObjs).forEach(function (arrowObj) {
      arrowObj.displayGlow();
    });
    Object.values(hitArrowObjs).forEach(function (arrowObj) {
      arrowObj.display();
    });

    if (startDrawingArrows) {
      drawArrows();
    }

    feedbackObj.display();
    comboObj.display();
    healthBar.display();
    scoreData.displayTotalScore();
  };

  function setupNavigation(thisCanvas) {
    p.noLoop();
    thisCanvas.addEventListener("showScene", (e) => {
      songId = e.detail.songId;
      //Load video

      songVideo = document.querySelector("#songVideo");
      songVideo.src = songList[songId].videoUrl;
      songVideo.load();
      songVideo.loop = true;
      // console.log("show scene");
      songVideo.addEventListener("canplaythrough", setupSongIntro, false);
    });
    thisCanvas.addEventListener("hideScene", (e) => {
      p.noLoop();
      isCurrentScene = false;
      thisCanvas.style.opacity = 0;
      let video = document.querySelector("#songVideo");
      video.style.opacity = 0;
      setTimeout(function () {
        thisCanvas.style.visibility = "hidden";
        video.style.visibility = "hidden";
      }, sceneTransitionTime);
    });
  }

  function setupSongIntro() {
    console.log("setup song intro");
    let thisCanvas = mainSongCanvas;
    // Video is loaded and can be played through

    // if (!videoLoadedFirstTime) {
    console.log("can play through");
    // videoLoadedFirstTime = true;
    p.loop();
    setTimeout(function () {
      thisCanvas.style.visibility = "visible";
      thisCanvas.style.opacity = 1;
      songVideo.style.visibility = "visible";
      songVideo.style.opacity = 1;
      isCurrentScene = true;
    }, sceneTransitionTime);

    // Start song a bit after
    setTimeout(function () {
      startSong(songId);
    }, sceneTransitionTime + 2000);
    // }

    songVideo.removeEventListener("canplaythrough", setupSongIntro);
  }

  // we need a way to calculate the current beat ( and measure ), according to the bpm changes.
  // current beat should be Start beat of the current interval, plus time that has elapsed within that beat

  function updateNotes() {
    //Keep a queue of relevantNotes
    // t = clock.seconds;
    t = Tone.Transport.seconds;
    //Given current time, what is the current measure?
    if (hasBpmChanges) {
      // make this time that has elapsed
      currentBeat =
        currentBpmStartBeat + (t - currentBpmChangeTime) / secondsPerBeat;
    } else {
      currentBeat = t / secondsPerBeat;
    }

    let thisMeasure = Math.floor(currentBeat / 4);
    if (thisMeasure > currentMeasure) {
      console.log("Measure: " + thisMeasure);
      currentMeasure = thisMeasure;

      //Initialize start of song
      if (currentMeasure == 0) {
        let measuresInBatch = measureData.slice(
          currentBatchStartMeasure,
          currentBatchStartMeasure + batchSize,
        );
        measuresInBatch.forEach(function (measure) {
          //If measure has notes, add contents into relevantNotes
          if (measure) {
            measure.forEach(function (note) {
              let newNote = new Note(note);
              relevantNotes.push(newNote);
            });
          }
        });
      }
      //Are we ALMOST at a new batch? Update the batch data!
      else if (currentMeasure % batchSize == batchSize - 1) {
        //Discard old ones BEFORE 1 measure ago....
        let remainingNotes = relevantNotes.filter(function (note) {
          //Keep only if this note is a hold and it's done...
          if (
            note.noteType == "hold" &&
            note.endMeasure >= currentMeasure - 1
          ) {
            return true;
          } else if (
            (note.noteType == "instant" || note.noteType == "mine") &&
            note.measure >= currentMeasure - 1
          ) {
            return true;
          } else {
            return false;
          }
        });
        relevantNotes = remainingNotes;
        //Load in next batch notes
        currentBatchStartMeasure += batchSize;
        let measuresInBatch = measureData.slice(
          currentBatchStartMeasure,
          currentBatchStartMeasure + batchSize,
        );
        measuresInBatch.forEach(function (measure) {
          if (measure) {
            //If measure has notes, add contents into relevantNotes
            measure.forEach(function (note) {
              let newNote = new Note(note);
              relevantNotes.push(newNote);
            });
          }
        });
      }
    }

    //Handle case for song end
    if (thisMeasure > measureData.length) {
      let win = scoreData.ranking != "E";
      handleSongEnd(win);
    }
  }

  function handleSongEnd(win) {
    console.log("song ended!!");
    // clock.stop();
    Tone.Transport.stop();
    thisSongPlayer.stop();
    songVideo.pause();

    //Update score in global data
    songList[songId].scores.push(scoreData.getScoreInfo());

    // Show gate transition (Blank gate)
    let showGateEvent = new CustomEvent("showScene", {
      detail: {
        gateId: 5,
        win: win,
      },
    });
    document.querySelector("#gateCanvas").dispatchEvent(showGateEvent);

    // Hide current scene after gate closed
    setTimeout(function () {
      mainSongCanvas.dispatchEvent(hideSceneEvent);
    }, 2000);

    // Continue to next scene after gate transition
    setTimeout(function () {
      let backgroundCanvas = document.querySelector("#backgroundCanvas");
      backgroundCanvas.dispatchEvent(showSceneEvent);

      if (!songList[songId].cleared && win) {
        // If first time cleared, show revelation scene
        songList[songId].cleared = true;
        let showRevelationSceneEvent = new CustomEvent("showScene", {
          detail: {
            songIndex: songId,
            scoreData: scoreData.getScoreInfo(),
          },
        });
        document
          .getElementById("revelationCanvas")
          .dispatchEvent(showRevelationSceneEvent);

        let showBackgroundShaderEvent = new CustomEvent("showScene", {
          detail: {
            shaderType: "radialGlow",
            songIndex: songId,
          },
        });
        document
          .getElementById("backgroundCanvas")
          .dispatchEvent(showBackgroundShaderEvent);
      } else {
        // Show Score scene directly if failed or if we've cleared before
        let showScoreSceneEvent = new CustomEvent("showScene", {
          detail: {
            scoreData: scoreData.getScoreInfo(),
          },
        });
        document
          .getElementById("scoreCanvas")
          .dispatchEvent(showScoreSceneEvent);
      }

      //Reset at the end
      window.setTimeout(function () {
        console.log("resetting for new song");
        resetForNewSong();
      }, 3000);
    }, 3000);
  }

  function startSong(songId) {
    thisSongPlayer = songList[songId].songPlayer;
    thisSongPlayer.loop = false;

    //Setup info for the song

    if (storyModeDifficulty == "Easy") {
      thisSongData = JSON.parse(songList[songId].songData.easy);
    } else if (storyModeDifficulty == "Hard") {
      thisSongData = JSON.parse(songList[songId].songData.hard);
    } else {
      thisSongData = JSON.parse(songList[songId].songData.medium);
    }
    measureData = thisSongData.measureData;
    if (songList[songId].bpmChanges != null) {
      hasBpmChanges = true;
      bpmChanges = songList[songId].bpmChanges;
      songBpm = songList[songId].bpmChanges[0].bpm;
      currentBpmStartBeat = songList[songId].bpmChanges[0].beat;
    } else {
      songBpm = thisSongData.bpm;
    }

    songDelay = thisSongData.delay;
    scoreData.songId = songId;
    scoreData.totalNotes = thisSongData.totalNotes;
    scoreData.calculateBaseNoteScore();
    secondsPerBeat = 1 / (songBpm / 60);
    setHitMarginTime();
    console.log("hitMarginTime is " + hitMarginTime);
    // hitMargin =  pixelsPerBeat * songBpm(/200);

    //For negative songDelays, start song before notes
    if (songDelay < 0) {
      setTimeout(function () {
        updateArrowsInterval = setInterval(function () {
          updateNotes();
          updateArrowRainbow();
        }, 10);
        startDrawingArrows = true;
        //Start a tone.js clock to keep time
        // clock.start();
        Tone.Transport.start();
      }, -songDelay * 1000);
    } else {
      // For positive songDelays, startNotes before song
      updateArrowsInterval = setInterval(function () {
        updateNotes();
        updateArrowRainbow();
      }, 10);
      startDrawingArrows = true;
      //Start a tone.js clock to keep time
      // clock.start();
      Tone.Transport.start();

      // If song has bpm changes, implement them
      if (hasBpmChanges) {
        bpmChanges.forEach(function (change, index) {
          // let thisSecondsPerBeat = 1 / (change.bpm / 60);

          // We need to rethink how we implement the times...
          // How do we determine the time when the bpm needs to change?
          // We store the END time of the first BPM interval....
          if (index == 0) {
            change.secondsPerBeat = 1 / (change.bpm / 60);
            change.changeTime = change.beat * secondsPerBeat;
            change.beatsInInterval = bpmChanges[index + 1].beat - change.beat;
            change.endTime = change.beatsInInterval * change.secondsPerBeat;
            change.endBeat = change.beat + change.beatsInInterval;
          } else if (index < bpmChanges.length - 1) {
            change.secondsPerBeat = 1 / (change.bpm / 60);
            change.changeTime = bpmChanges[index - 1].endTime;
            change.beatsInInterval = bpmChanges[index + 1].beat - change.beat;
            change.endTime =
              change.changeTime +
              change.beatsInInterval * change.secondsPerBeat;
            change.endBeat = change.beat + change.beatsInInterval;
          } else {
            change.secondsPerBeat = 1 / (change.bpm / 60);
            change.changeTime = bpmChanges[index - 1].endTime;
            change.endBeat = null;
          }
          let newBpm = change.bpm;
          Tone.Transport.scheduleOnce((time) => {
            songBpm = newBpm;
            secondsPerBeat = 1 / (songBpm / 60);
            currentBpmStartBeat = change.beat;
            currentBpmChangeTime = change.changeTime;
            setHitMarginTime();
            // hitMargin = songBpm;
          }, change.changeTime);
        });
      }

      // If song has stops, schedule them
      if (songList[songId].stops != null) {
        hasStops = true;
        stops = songList[songId].stops;
        stops.forEach(function (stop) {
          // let stopTime = stop.beat * secondsPerBeat;
          let stopTime = beatToTime(stop.beat);
          let stopLength = stop.length;
          Tone.Transport.scheduleOnce((time) => {
            Tone.Transport.pause();
            let stopInterval = setInterval(function () {
              secondsSinceStop += 0.01;
            }, 10);

            setTimeout(function () {
              // stopClock.stop();

              passOverNotesOnStop();
            }, hitMarginTime * 1000);

            setTimeout(function () {
              Tone.Transport.start();
              console.log("clearing stop interval");
              clearInterval(stopInterval);
              secondsSinceStop = 0;
            }, stopLength * 1000);
          }, stopTime);
        });
      }

      setTimeout(function () {
        songVideo.play();
        thisSongPlayer.start();
      }, songDelay * 1000);
    }
  }

  function passOverNotesOnStop() {
    //after delay on stop, go through the ones that are note hit and make them pass over, and update it as a miss
    relevantNotes.forEach(function (note) {
      if (
        isPassedHitBoundary(note.currentY) &&
        !note.isHit &&
        !note.hasPassedOver
      ) {
        note.hasPassedOver = true;
        updateMiss("miss", note);
      }
    });
  }
  // calculate the transport time given current beat, factoring in bpm changes
  function beatToTime(inputBeat) {
    if (inputBeat && hasBpmChanges) {
      let totalTime = 0;

      bpmChanges.forEach(function (change, index) {
        // First check, is beat within this interval? Then add partial time. Otherwise at the whole time

        // Case 1: Beat is within this interval... either because it's the last one or not....

        if (
          (inputBeat >= change.beat && inputBeat < change.endBeat) ||
          (inputBeat >= change.beat && change.endBeat == null)
        ) {
          let beatsElapsedInInterval = inputBeat - change.beat;
          let timeElapsedInInterval =
            beatsElapsedInInterval * change.secondsPerBeat;
          totalTime += timeElapsedInInterval;
        } else if (inputBeat < change.beat) {
          // Case 2 : Beat is before  this interval, don't do anything
        } else if (inputBeat > change.beat) {
          //Case 3: Beat is after this interval
          let beatsElapsedInInterval = change.endBeat - change.beat;
          let timeElapsedInInterval =
            beatsElapsedInInterval * change.secondsPerBeat;
          totalTime += timeElapsedInInterval;
        }
      });
      return totalTime;
    } else if (inputBeat && !hasBpmChanges) {
      let time = inputBeat * secondsPerBeat;
      return time;
    } else {
      return null;
    }
  }
  //Create arrows takes the relevant notes array and then creates objects for them

  //Note: how would we evaluate it on time instead of distance?
  //When reading the notes, pre-process to calculate the time on the transport that it should start (and end, for holds....)
  // Or we can just edit it for the stops...

  //Note: How do we asssess when notes are hit or not with stops?
  //We assign a timed delay to when the stop happens. After that timed delay, any notes that are currently at the hit bar while the stop is happening will be set to
  // "passed over"... and !isHit..
  // Until we refactor all the arrow timings to use the transport (idk if this would work well...), we will create a timeout when the stop happens.
  // That timeout will go through and set current arrows to be passed over

  function setHitMarginTime() {
    hitMarginTime = secondsPerBeat / 2;
  }
  function isWithinHitMargin(yPos) {
    return (
      yPos >= hitArrowObjs["left"].yPos - hitMargin &&
      yPos <= hitArrowObjs["left"].yPos + hitMargin
    );
  }

  function isPassedHitMarginTime(note) {
    let currentTime = Tone.Transport.seconds;
    return currentTime >= note.startTime + hitMarginTime;
  }

  function isPassedTime(time) {
    let currentTime = Tone.Transport.seconds;
    return currentTime >= time;
  }

  function isWithinHitMarginTime(note) {
    let currentTime = Tone.Transport.seconds;
    return (
      currentTime >= note.startTime - hitMarginTime &&
      currentTime <= note.startTime + hitMarginTime
    );
  }

  function isPassedHitBoundary(yPos) {
    return yPos <= hitArrowObjs["left"].yPos;
  }

  function drawArrows() {
    relevantNotes.forEach(function (note) {
      let direction = note.direction;
      // let passedOver = false;

      // Get current y position: yPos is where the start of the note is currently on the p5 canvas

      // If bpm changes, pixels elapsed needs to be based on the bpm segments...
      if (hasBpmChanges) {
        pixelsElapsed = 0;
        // basically, ask how many beats have elapsed in the previous bpm intervals?
        // Then we add the current time (minus the time of the last interval change)....
        let lastBpmChangeTime = 0;
        bpmChanges.forEach(function (change, index) {
          //For all intervals that aren't the last interval... AND we're past that time...calculate the beat interval. Then calculate pixels elapsed
          if (index < bpmChanges.length - 1) {
            if (currentBeat > change.endBeat) {
              let pixelsElapsedInInterval =
                change.beatsInInterval * pixelsPerBeat;
              pixelsElapsed += pixelsElapsedInInterval;
              //Calculate this instead of using currentBpmChangeTime, since there's a slight delay
              lastBpmChangeTime = beatToTime(change.endBeat);
            }
          }
        });
        pixelsElapsed +=
          ((t - lastBpmChangeTime) / secondsPerBeat) * pixelsPerBeat;
      } else {
        pixelsElapsed = (t / secondsPerBeat) * pixelsPerBeat;
      }

      let yPos =
        hitArrowObjs["left"].yPos +
        pixelsPerBeat * note.startBeat -
        pixelsElapsed;
      note.currentY = yPos;

      // Should this arrow be considered as a hit candidate?
      if (Tone.Transport.state == "started") {
        if (isWithinHitMarginTime(note)) {
          // console.log("note is hit candidate");
          //Note within our hit window!
          note.isHitCandidate = true;
        } else if (isPassedHitMarginTime(note)) {
          // passedOver = true;

          //The note is passed over for the first time! THIS IS A MISS....
          if (!note.hasPassedOver) {
            note.hasPassedOver = true;
            //If it's first time passing over a NOT hit note, reset combo
            if (!note.isHit && note.noteType != "mine") {
              updateMiss("miss", note);
            }
          }
          note.isHitCandidate = false;
        }
        //Should this arrow, if a hold, be considered completed if we're still holding?
        let end_yPos =
          hitArrowObjs["left"].yPos +
          pixelsPerBeat * note.endBeat -
          pixelsElapsed;
        if (
          isPassedTime(note.endTime) &&
          //end_yPos < hitArrowObjs["left"].yPos &&
          note.isHolding &&
          !note.completedHold
        ) {
          updateHit("ok", note);
        }
      } else if (Tone.Transport.state == "paused") {
        // case: we're at a stop and hitting a note right on the beat
        if (isWithinHitMarginTime(note)) {
          note.isHitCandidate = true;
        }
      }

      note.display(yPos);
    });
  }

  function updateArrowRainbow() {
    convertArrowImgToRainbow(holdMiddleImg);

    arrowImgs.left = convertArrowImgToRainbow(arrowImgsOriginal.left);
    arrowImgs.up = convertArrowImgToRainbow(arrowImgsOriginal.up);
    arrowImgs.down = convertArrowImgToRainbow(arrowImgsOriginal.down);
    arrowImgs.right = convertArrowImgToRainbow(arrowImgsOriginal.right);
    // Object.values(arrowImgsOriginal).forEach(function (arrowImg, index) {
    //   arrowImgs[index] = convertArrowImgToRainbow(arrowImg);
    // });
    Object.values(holdEndImgs).forEach(function (arrowImg) {
      convertArrowImgToRainbow(arrowImg);
    });
  }

  function convertArrowImgToRainbow(imgObj) {
    // Iterates across each pixel in the canvas
    // let arrowImg = arrowImgs["left"];
    let currentHue = (t * 50) % 360;
    let rgb = hsl2rgb(currentHue, 0.97, 0.6);

    let newImgObj = p.createImage(64, 64);
    newImgObj.copy(imgObj, 0, 0, 64, 64, 0, 0, 64, 64);
    newImgObj.loadPixels();

    for (let y = 0; y < newImgObj.height; y++) {
      for (let x = 0; x < newImgObj.width; x++) {
        // Gets the index of the red value for this pixel
        let redIndex = (x + y * newImgObj.width) * 4;
        let greenIndex = redIndex + 1;
        let blueIndex = redIndex + 2;
        let alphaIndex = redIndex + 3;
        // Top of arrow
        let isWhite =
          newImgObj.pixels[redIndex] == 255 &&
          newImgObj.pixels[greenIndex] == 255 &&
          newImgObj.pixels[blueIndex] == 255 &&
          newImgObj.pixels[alphaIndex] == 255;
        // Middle of arrow
        let isBlue =
          newImgObj.pixels[redIndex] == 0 &&
          newImgObj.pixels[greenIndex] == 0 &&
          newImgObj.pixels[blueIndex] == 255 &&
          newImgObj.pixels[alphaIndex] == 255;
        // Bottom of arrow
        let isGreen =
          newImgObj.pixels[redIndex] == 0 &&
          newImgObj.pixels[greenIndex] == 255 &&
          newImgObj.pixels[blueIndex] == 0 &&
          newImgObj.pixels[alphaIndex] == 255;
        let isRed =
          newImgObj.pixels[redIndex] == 255 &&
          newImgObj.pixels[greenIndex] == 0 &&
          newImgObj.pixels[blueIndex] == 0 &&
          newImgObj.pixels[alphaIndex] == 255;
        let isTransparent =
          newImgObj.pixels[redIndex] == 0 &&
          newImgObj.pixels[greenIndex] == 0 &&
          newImgObj.pixels[blueIndex] == 0 &&
          newImgObj.pixels[alphaIndex] == 0;

        // Change Red pixels to rainbow effect
        if (isRed) {
          newImgObj.pixels[redIndex] = rgb[0] * 255; // Red value
          newImgObj.pixels[greenIndex] = rgb[1] * 255; // Green value
          newImgObj.pixels[blueIndex] = rgb[2] * 255; // Blue value
          newImgObj.pixels[alphaIndex] = 255; // Alpha value
        }
        // Change bottom section
        if (isGreen) {
          // Note: fix timing.. it should be that on the beat
          if ((currentBeat * 100) % 100 > 25) {
            newImgObj.pixels[redIndex] = 255; // Red value
            newImgObj.pixels[greenIndex] = 255; // Green value
            newImgObj.pixels[blueIndex] = 255; // Blue value
            newImgObj.pixels[alphaIndex] = 255; // Alpha value
          } else {
            newImgObj.pixels[redIndex] = 150; // Red value
            newImgObj.pixels[greenIndex] = 120; // Green value
            newImgObj.pixels[blueIndex] = 150; // Blue value
            newImgObj.pixels[alphaIndex] = 255; // Alpha value
          }
        }
        if (isBlue) {
          if ((currentBeat * 100) % 100 > 50) {
            newImgObj.pixels[redIndex] = 255; // Red value
            newImgObj.pixels[greenIndex] = 255; // Green value
            newImgObj.pixels[blueIndex] = 255; // Blue value
            newImgObj.pixels[alphaIndex] = 255; // Alpha value
          } else {
            newImgObj.pixels[redIndex] = 150; // Red value
            newImgObj.pixels[greenIndex] = 120; // Green value
            newImgObj.pixels[blueIndex] = 150; // Blue value
            newImgObj.pixels[alphaIndex] = 255; // Alpha value
          }
        }
        if (isWhite) {
          if ((currentBeat * 100) % 100 > 75) {
            newImgObj.pixels[redIndex] = 255; // Red value
            newImgObj.pixels[greenIndex] = 255; // Green value
            newImgObj.pixels[blueIndex] = 255; // Blue value
            newImgObj.pixels[alphaIndex] = 255; // Alpha value
          } else {
            newImgObj.pixels[redIndex] = 150; // Red value
            newImgObj.pixels[greenIndex] = 120; // Green value
            newImgObj.pixels[blueIndex] = 150; // Blue value
            newImgObj.pixels[alphaIndex] = 255; // Alpha value
          }
        }
      }
    }
    // console.log("updating pixels");
    newImgObj.updatePixels();
    return newImgObj;
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
  function updateMiss(score, note) {
    feedbackObj.updateState(score);
    comboObj.resetCombo();
    scoreData.update("miss");
  }
  function updateHit(score, note) {
    //Is this the first time hitting this note?
    if (!note.isHit && note.noteType != "mine") {
      comboObj.incrementCombo();
      note.isHit = true;
      let scoreScale = 1;
      if (score === "ok") {
        feedbackObj.updateState("ok", true);
      } else if (score === "great") {
        feedbackObj.updateState("great", true);
      } else if (score === "perfect") {
        feedbackObj.updateState("perfect", true);
      }
      scoreData.update(score);
    } else if (!note.isHit && note.noteType == "mine") {
      //Successfully hitting mines should set off the bomb;
      note.isHit = true;
      feedbackObj.updateState("mine", true);
      scoreData.mineHit();
      sound_fx.eggCrack.start();
      note.animateEggshellCrack();
    }

    //Add logic for hitting holds in particular
    if (note.noteType == "hold" && !note.isHolding) {
      note.isHolding = true;
      note.completedHold = false;
    } else if (note.noteType == "hold" && note.isHolding) {
      note.isHolding = false;
      note.completedHold = true;
    }
  }

  function assessHitForNoteByTime(direction, hitType, note, isStopped) {
    //Assess notes that are the START of either instant or holds
    let hitTime;
    if (isStopped) {
      hitTime = Tone.Transport.seconds + secondsSinceStop;
    } else {
      hitTime = Tone.Transport.seconds;
    }
    if (
      hitType == "press" &&
      note.isHitCandidate &&
      note.direction == direction &&
      !note.isHit
    ) {
      //TOO Early - failed
      if (
        hitTime > note.startTime - hitMarginTime &&
        hitTime < note.startTime - (hitMarginTime * 3) / 4
      ) {
        updateMiss("early", note);
      }
      // A little early - Ok - PASS
      else if (
        hitTime >= note.startTime - (hitMarginTime * 3) / 4 &&
        hitTime < note.startTime - (hitMarginTime * 2) / 4
      ) {
        updateHit("ok", note);
        hitSuccessful = true;
      }
      // Almost perfect - early
      else if (
        hitTime >= note.startTime - (hitMarginTime * 2) / 4 &&
        hitTime < note.startTime - hitMarginTime / 4
      ) {
        updateHit("great", note);
        hitSuccessful = true;
      }
      // Perfect - PASS
      else if (
        hitTime >= note.startTime - hitMarginTime / 4 &&
        hitTime < note.startTime + hitMarginTime / 4
      ) {
        updateHit("perfect", note);
        hitSuccessful = true;
      }
      // Almost perfect - late - PASS
      else if (
        hitTime >= note.startTime + hitMarginTime / 4 &&
        hitTime < note.startTime + (hitMarginTime * 2) / 4
      ) {
        updateHit("great", note);
        hitSuccessful = true;
      }
      // A little late - OK - PASS
      else if (
        hitTime >= note.startTime + (hitMarginTime * 2) / 4 &&
        hitTime < note.startTime + (hitMarginTime * 3) / 4
      ) {
        updateHit("ok", note);
        hitSuccessful = true;
      }
      // TOO LATE - Failed
      else if (
        hitTime >= note.startTime + (hitMarginTime * 3) / 4 &&
        hitTime < note.startTime + hitMarginTime
      ) {
        updateMiss("late", note);
      }
    }
    //Assess notes that are currently being held. Did we lift before it's over or not?
    // AKA did we lift before the END beat for the held note is here or not....
    else if (
      hitType == "lift" &&
      note.noteType == "hold" &&
      note.isHolding &&
      note.direction == direction
    ) {
      // get the y pos of the end of the note
      // let yPos =
      //   note.currentY + (note.endBeat - note.startBeat) * pixelsPerBeat;
      note.releasedBeat = currentBeat;

      // Lift is at most Margin amount before the end of the end Time
      if (hitTime >= note.endTime - hitMarginTime) {
        updateHit("ok", note);
      }

      // Lift is TOO EARLY - Failed
      else if (hitTime < note.endTime - hitMarginTime) {
        feedbackObj.updateState("early");
        note.isHolding = false;
        note.completedHold = false;
      }
    }
  }

  function assessHit(direction, hitType) {
    let hitSuccessful = false;
    relevantNotes.forEach(function (note) {
      if (Tone.Transport.state == "started") {
        assessHitForNoteByTime(direction, hitType, note);
      } else if (
        Tone.Transport.state == "paused" &&
        isPassedHitBoundary(note.currentY)
      ) {
        assessHitForNoteByTime(direction, hitType, note, true);
      }
    });
    return hitSuccessful;
  }

  function resetForNewSong() {
    // Lets try resetting everything here!
    relevantNotes = [];
    currentBatchStartMeasure = 0;
    currentMeasure = -1;
    currentBeat = 0;
    pixelsElapsed = 0;
    startDrawingArrows = false;
    clearInterval(updateArrowsInterval);
    measureData = null;
    songBpm = null;
    songDelay = null;
    secondsPerBeat = null;
    t = 0;
    stops = null;
    scoreData = new Score();
    healthBar.reset();
    songVideo = null;
    videoLoadedFirstTime = false;
    hasBpmChanges = false;
    bpmChanges = [];
    hasStops = false;
    comboObj = new ComboText();
    Tone.Transport.cancel();
  }

  function padOrKeypress(direction) {
    if (isCurrentScene) {
      let hitSuccessful = false;
      // if (Tone.Transport.state == "started") {
      hitSuccessful = assessHit(direction, "press");
      // }
      hitArrowObjs[direction].press(hitSuccessful);
    }
  }
  function padOrKeyrelease(direction) {
    if (isCurrentScene) {
      hitArrowObjs[direction].release();
      assessHit(direction, "lift");
    }
  }

  //Listen if all canvases in the game have been loaded
  window.addEventListener("canvasLoaded", function () {
    numCanvasesLoaded++;
    if (numCanvasesLoaded == totalCanvases) {
      allCanvasesLoaded = true;
    }
  });

  window.addEventListener("padPress", function (e) {
    let direction = e.detail.direction;
    padOrKeypress(direction);
  });
  window.addEventListener("padRelease", function (e) {
    let direction = e.detail.direction;
    padOrKeyrelease(direction);
  });

  window.addEventListener("keydown", function (e) {
    //Ignore repeated keydown
    if (e.repeat) {
      return;
    }
    if (
      e.code == "ArrowLeft" ||
      e.code == "ArrowRight" ||
      e.code == "ArrowUp" ||
      e.code == "ArrowDown"
    ) {
      if (e.code == "ArrowLeft") {
        padOrKeypress("left");
      }
      if (e.code == "ArrowRight") {
        padOrKeypress("right");
      }
      if (e.code == "ArrowUp") {
        padOrKeypress("up");
      }
      if (e.code == "ArrowDown") {
        padOrKeypress("down");
      }
    }
  });

  window.addEventListener("keyup", function (e) {
    if (
      e.code == "ArrowLeft" ||
      e.code == "ArrowRight" ||
      e.code == "ArrowUp" ||
      e.code == "ArrowDown"
    ) {
      if (e.code == "ArrowLeft") {
        padOrKeyrelease("left");
      }
      if (e.code == "ArrowRight") {
        padOrKeyrelease("right");
      }
      if (e.code == "ArrowUp") {
        padOrKeyrelease("up");
      }
      if (e.code == "ArrowDown") {
        padOrKeyrelease("down");
      }
    }
  });

  // track.addEventListener("timeupdate", updateNotes);

  ////////////////////////////////////////////
  // -------------- SCENES --------------- //
  //////////////////////////////////////////

  // CLASSES

  class Note {
    constructor(noteData) {
      this.id = noteData.id;
      this.direction = noteData.direction;
      this.noteType = noteData.noteType;
      this.measure = noteData.measure;
      this.endBeat = noteData.endBeat;
      this.startBeat = noteData.startBeat;
      this.startTime = beatToTime(this.startBeat);
      this.endTime = beatToTime(this.endBeat);
      this.endMeasure = noteData.endMeasure;
      this.eggshellSceneOpacity = 0;
      this.hasPassedOver = false;
      this.isHit = false;
    }
    animateEggshellCrack() {
      // console.log("aniimateEggshellCrack");
      let i = 0;
      let _this = this;
      let eggshellAnimationInterval = setInterval(function () {
        // console.log("interval step");
        if (i < Object.keys(arrowHitGradientTimings).length) {
          _this.eggshellSceneOpacity = arrowHitGradientTimings[i];
          // console.log(_this.eggshellSceneOpacity);
        } else {
          _this.eggshellSceneOpacity = 0;
          clearInterval(eggshellAnimationInterval);
        }
        i++;
      }, 30);
    }
    display(yPos) {
      // First, determine if we're currently at a stop... if so , unhit notes should not go over the original yPos
      if (
        Tone.Transport.state != "started" &&
        yPos < hitArrowObjs["left"].yPos &&
        // !this.hasPassedOver &&
        isWithinHitMargin(yPos) &&
        !this.isHit
      ) {
        yPos = hitArrowObjs["left"].yPos;
      }

      // Draw instant notes
      if (this.noteType == "instant" && !this.isHit) {
        let opacity = this.hasPassedOver ? 127 : 255;
        //Draw passed over notes greyed out
        p.tint(255, opacity);
        drawImageToScale(
          arrowImgs[this.direction],
          arrow_xPos[this.direction],
          yPos,
        );
        p.tint(255, 255);
      } else if (this.noteType == "hold") {
        // Draw holds
        let rectangleHeight;
        if (this.isHit && this.isHolding && !this.completedHold) {
          // hit first note, is currently holding in the middle of hold
          rectangleHeight = pixelsPerBeat * (this.endBeat - currentBeat);
          // Draw rectangle
          drawImageToScaleWithHeight(
            holdMiddleImg,
            arrow_xPos[this.direction],
            hitArrowObjs["left"].yPos + 40,
            rectangleHeight,
          );
          // Draw arrow at end of rectangle
          drawImageToScale(
            holdEndImgs[this.direction],
            arrow_xPos[this.direction],
            hitArrowObjs["left"].yPos + rectangleHeight,
          );
          // Draw arrow at hit pos
          drawImageToScale(
            arrowImgs[this.direction],
            arrow_xPos[this.direction],
            hitArrowObjs["left"].yPos,
          );
        } else if (this.isHit && !this.isHolding && !this.completedHold) {
          //   case 2: hit first note, lifted up before end
          //   What happens? need to grey out and keep on going

          p.tint(255, 127);
          rectangleHeight = pixelsPerBeat * (this.endBeat - this.releasedBeat);
          let yPosReleased =
            hitArrowObjs["left"].yPos +
            pixelsPerBeat * this.releasedBeat -
            pixelsElapsed;

          // Draw rectangle
          drawImageToScaleWithHeight(
            holdMiddleImg,
            arrow_xPos[this.direction],
            yPosReleased + 40,
            rectangleHeight,
          );
          // Draw arrow at end of rectangle
          drawImageToScale(
            holdEndImgs[this.direction],
            arrow_xPos[this.direction],
            yPosReleased + rectangleHeight,
          );
          // Draw arrow at hit pos
          drawImageToScale(
            arrowImgs[this.direction],
            arrow_xPos[this.direction],
            yPosReleased,
          );
          p.tint(255, 255);
          // If you're still holding down...
        } else if (this.isHit && this.completedHold) {
          // case 3: hit first note, held to completion... show nothing!
        } else if (!this.isHit) {
          // last case: the note is not hit, either passed over or upcoming...
          let opacity = this.hasPassedOver ? 127 : 255;
          p.tint(255, opacity);
          rectangleHeight = pixelsPerBeat * (this.endBeat - this.startBeat);
          drawImageToScaleWithHeight(
            holdMiddleImg,
            arrow_xPos[this.direction],
            yPos + 40,
            rectangleHeight,
          );
          drawImageToScale(
            arrowImgs[this.direction],
            arrow_xPos[this.direction],
            yPos,
          );
          drawImageToScale(
            holdEndImgs[this.direction],
            arrow_xPos[this.direction],
            yPos + rectangleHeight,
          );
          p.tint(255, 255);
        }
      } else if (this.noteType == "mine" && !this.isHit) {
        // Draw mines
        let opacity = this.hasPassedOver ? 127 : 255;
        p.tint(255, opacity);
        drawImageToScale(eggBombImg, arrow_xPos[this.direction], yPos);
        p.tint(255, 255);
      }

      if (this.noteType == "mine" && this.eggshellSceneOpacity > 0) {
        // Draw flash if eggshell opacity is hit
        let c = p.color(255, 255, 255);
        c.setAlpha(this.eggshellSceneOpacity * 255);
        p.fill(c);
        p.rect(0, 0, p.width, p.height);
      }
    }
  }

  class Score {
    constructor(songId) {
      this.miss = 0;
      this.perfect = 0;
      this.ok = 0;
      this.great = 0;
      this.scoreCount = 0;
      this.totalNotes = 0;
      this.baseNoteScore = 0;
      this.ranking;
      this.songId = songId;
    }
    getScoreInfo() {
      return {
        songId: this.songId,
        miss: this.miss,
        ok: this.ok,
        great: this.great,
        perfect: this.perfect,
        scoreCount: this.scoreCount,
        ranking: this.ranking,
      };
    }
    calculateBaseNoteScore() {
      // this.baseNoteScore = Math.floor(
      //   1000000 / ((this.totalNotes * (this.totalNotes + 1)) / 2)
      // );

      this.baseNoteScore = Math.floor(100000 / this.totalNotes);
    }
    calculateRanking() {
      // AAA
      if (this.scoreCount == 10 * this.baseNoteScore * this.totalNotes) {
        this.ranking = "AAA";
      }
      //Fail
      else if (this.scoreCount < 400000) {
        this.ranking = "E";
      } else if (this.scoreCount < 600000) {
        this.ranking = "D";
      } else if (this.scoreCount < 700000) {
        this.ranking = "C";
      } else if (this.scoreCount < 800000) {
        this.ranking = "B";
      } else if (this.scoreCount < 900000) {
        this.ranking = "A";
      } else if (this.scoreCount <= 1000000) {
        this.ranking = "AA";
      }
    }
    mineHit() {
      healthBar.decrement(0.15);
    }
    update(scoreType) {
      if (scoreType == "miss") {
        this.miss++;
        healthBar.decrement();
      } else {
        if (scoreType == "ok") {
          this.ok++;
          // this.scoreCount += 1;
          this.scoreCount += this.baseNoteScore * 3;
          healthBar.increment(1);
        }
        if (scoreType == "great") {
          this.great++;
          // this.scoreCount += 3;
          this.scoreCount += this.baseNoteScore * 7;
          healthBar.increment(3);
        }
        if (scoreType == "perfect") {
          this.perfect++;
          // this.scoreCount += 5;
          this.scoreCount += this.baseNoteScore * 10;
          healthBar.increment(5);
        }
      }

      this.calculateRanking();
    }

    displayTotalScore() {
      //Draw UI
      drawImageToScale(scoreBackgroundImg, 0, 437);
      drawImageToScale(playerTextImgs.player1, 0, 437 - 20);
      drawImageToScale(
        playerTextImgs[storyModeDifficulty],
        playerTextImgs.player1.width,
        437 - 20,
      );
      let scoreDigitLength = this.scoreCount.toString().length;
      let numOfZeros = 7 - scoreDigitLength;
      let zerosString = "";

      let letterWidth = 24;
      for (var i = 0; i < numOfZeros; i++) {
        zerosString += "o";
      }

      // Draw zeros
      p.tint(255, 100);
      drawText(zerosString, "scoreDigits", 1, 8, 441);
      p.tint(255, 255);

      // Draw actual score
      drawText(
        this.scoreCount.toString(),
        "scoreDigits",
        1,
        8 + numOfZeros * letterWidth,
        441,
      );
    }
  }

  class HealthBar {
    constructor() {
      this.amountFilled = 0.5;
      this.xPos = 8;
      this.yPos = 8;
      this.tick = 0;
      this.animate = true;
      this.gradientColor = "green";
    }
    display() {
      let gradientImg;
      if (this.gradientColor == "green") {
        gradientImg = greenGradientImg;
      } else if (this.gradientColor == "rainbow") {
        gradientImg = rainbowGradientImg;
      }
      // first draw underlying bar
      let darkOverlay = p.color("rgba(18, 11, 41, 0.5)");
      p.fill(darkOverlay);
      // p.fill("black");
      let capacity = { width: 261, height: 18 };

      drawRectToScale(16, 16, capacity.width, capacity.height);

      let gradientToDraw = gradientImg.get(
        this.tick % capacity.width,
        0,
        Math.max(1, capacity.width * this.amountFilled),
        capacity.height + 1,
      );
      let dw = this.animate ? Math.sin(this.tick * 0.05) * 3 : 0;
      drawImageToScaleWithWidth(
        gradientToDraw,
        15,
        15,
        Math.min(capacity.width, gradientToDraw.width + dw),
      );

      //Draw frame over
      drawImageToScale(healthBarFrameImg, this.xPos, this.yPos);
      this.tick++;
    }
    increment(scaleFactor) {
      if (this.amountFilled < 1) {
        this.animate = true;
        this.amountFilled += 0.01;
        this.gradientColor = "green";
      } else if (this.amountFilled >= 1) {
        this.animate = false;
        this.gradientColor = "rainbow";
      }
    }
    decrement(amount) {
      if (amount == null) {
        amount = 0.025;
      }
      if (this.amountFilled > 0) {
        this.amountFilled -= amount;
        this.gradientColor = "green";
      }
      // Check for failing state, if bar goes to zero
      if (this.amountFilled <= 0) {
        console.log("FAILED");
        handleSongEnd(false);
      }
    }
    reset() {
      this.amountFilled = 0.5;
      this.xPos = 8;
      this.yPos = 8;
      this.tick = 0;
      this.animate = true;
      this.gradientColor = "green";
    }
  }

  //Add functionality to animate when hit
  class HitArrow {
    constructor(direction, xPos, yPos) {
      this.direction = direction;
      this.imgToDraw = hitArrowImgs[direction];
      this.xPos = xPos;
      this.yPos = yPos;
      this.pressed = false;
      this.glowing = false;
      this.scale = 1;
      this.gradientOpacity = 0;
      this.animationIndex = 0;
      this.animationInterval;
      this.animationTimeout;
    }
    press(successfulHit) {
      this.pressed = true;
      this.scale = 1;
      this.animationIndex = 0;
      this.gradientOpacity = 0;
      let _this = this;
      clearInterval(this.animationInterval);
      clearTimeout(this.animationTimeout);
      this.animationInterval = setInterval(function () {
        _this.animationIndex++;
        let newScale = arrowHitSizeTimings[_this.animationIndex];
        if (newScale == null) {
          newScale = 1;
        }
        _this.scale = newScale;
        if (successfulHit) {
          _this.glowing = true;
          let gradientOpacity = arrowHitGradientTimings[_this.animationIndex];
          if (gradientOpacity == null) {
            gradientOpacity = 0;
            _this.glowing = false;
          }
          _this.gradientOpacity = gradientOpacity;
        }
      }, 10);

      this.animationTimeout = setTimeout(function () {
        _this.glowing = false;
        clearInterval(_this.animationInterval);
      }, 500);
    }
    release() {
      this.pressed = false;
    }
    display() {
      //Draw arrow at scale
      let d = (this.imgToDraw.width * (1 - this.scale)) / 2;
      drawImageToScale(
        this.imgToDraw,
        this.xPos + d,
        this.yPos + d,
        this.scale,
      );
    }
    displayGlow() {
      if (this.glowing) {
        let arrowMargin = 20;
        p.tint(255, this.gradientOpacity * 255);
        drawImageToScale(
          hitGlowImg,
          this.xPos - arrowMargin,
          this.yPos - arrowMargin,
        );
        p.tint(255, 255);
      }
    }
  }

  class ComboText {
    constructor() {
      this.count = 0;
      this.showing = false;
      this.scale = 1;
      this.animationIndex = 0;
      this.animationInterval;
      this.hideTimeout;
    }
    incrementCombo() {
      this.count++;
      if (this.count >= 2) {
        this.showing = true;
        clearTimeout(this.hideTimeout);
        clearInterval(this.animationInterval);
        this.showing = true;
        this.animationIndex = 0;
        this.scale = 1;
        let _this = this;
        this.animationInterval = setInterval(function () {
          _this.animationIndex++;
          let newScale = hitAnimationTimings[_this.animationIndex];
          if (newScale == null) {
            newScale = 1;
          }
          _this.scale = newScale;
        }, 10);

        this.hideTimeout = setTimeout(function () {
          _this.showing = false;
          clearInterval(_this.animationInterval);
        }, 500);
      }
    }
    resetCombo() {
      this.count = 0;
      this.showing = false;
    }
    display() {
      //Calculate offset between number and comboTextImg
      let numberWidth;
      let digitWidth = fonts.pink.charsToImgs["1"].size.width;
      if (this.count < 10) {
        numberWidth = digitWidth;
      } else if (this.count < 100) {
        numberWidth = digitWidth * 2;
      } else if (this.count >= 100) {
        numberWidth = digitWidth * 3;
      }
      let xPos =
        (canvasSizeOriginal.width - (numberWidth + comboTextImg.width + 5)) / 2;
      if (this.showing && this.count >= 2) {
        drawImageToScale(comboTextImg, xPos + numberWidth + 5, 267, this.scale);
        drawText(this.count.toString(), "pink", this.scale, xPos, 240);
      }
    }
  }

  class FeedbackText {
    constructor() {
      this.showing = false;
      this.text = "OK";
      this.state = "ok";
      this.scale = 1;
      this.animationIndex = 0;
      this.animationInterval;
      this.hideTimeout;
    }
    updateState(newState, animate) {
      clearTimeout(this.hideTimeout);
      clearInterval(this.animationInterval);
      this.showing = true;
      this.animationIndex = 0;
      this.scale = 1;
      this.state = newState;
      if (this.state == "ok") {
        this.text = "OK";
      } else if (this.state == "great") {
        this.text = "GREAT";
      } else if (this.state == "perfect") {
        this.text = "PERFECT!";
      } else if (this.state == "early") {
        this.text = "Too early!";
      } else if (this.state == "late") {
        this.text = "Too late!";
      } else if (this.state == "miss") {
        this.text = "Miss";
      } else if (this.state == "mine") {
        this.text = "BAD!";
      }
      let _this = this;
      if (animate) {
        this.animationInterval = setInterval(function () {
          _this.animationIndex++;
          let newScale = hitAnimationTimings[_this.animationIndex];
          if (newScale == null) {
            newScale = 1;
          }
          _this.scale = newScale;
        }, 10);
      }

      this.hideTimeout = setTimeout(function () {
        _this.showing = false;
        clearInterval(_this.animationInterval);
      }, 500);
    }
    display() {
      if (this.showing) {
        drawText(this.text, "mainYellow", this.scale, null, 150);
      }
    }
  }

  //////////////////////////
  // General Helpers      //
  //////////////////////////

  p.windowResized = function () {
    calculateCanvasDimensions();
    p.resizeCanvas(canvasWidth, canvasHeight);
  };

  function drawRectToScale(x, y, width, height) {
    p.rect(
      x * scaleRatio,
      y * scaleRatio,
      width * scaleRatio,
      height * scaleRatio,
    );
  }
  function drawImageToScale(img, x, y, scaleFactor) {
    if (scaleFactor) {
      p.image(
        img,
        x * scaleRatio,
        y * scaleRatio,
        img.width * scaleRatio * scaleFactor,
        img.height * scaleRatio * scaleFactor,
      );
    } else {
      p.image(
        img,
        x * scaleRatio,
        y * scaleRatio,
        img.width * scaleRatio,
        img.height * scaleRatio,
      );
    }
  }

  function drawImageToScaleWithWidth(img, x, y, width) {
    p.image(
      img,
      x * scaleRatio,
      y * scaleRatio,
      width * scaleRatio,
      img.height * scaleRatio,
    );
  }

  function drawImageToScaleWithHeight(img, x, y, height) {
    p.image(
      img,
      x * scaleRatio,
      y * scaleRatio,
      img.width * scaleRatio,
      height * scaleRatio,
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

new p5(mainScene, "main-song-canvas-container");
