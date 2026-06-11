var experimentalScene = function (p) {
  let experimentalCanvas;
  let isCurrentScene = false;

  let thisSongPlayer;

  let thisSongData;

  // let updateArrowsInterval;
  let updateNotesInterval;

  let canvasSizeOriginal = { width: 640, height: 480 };
  let canvasWidth = canvasSizeOriginal.width;
  let canvasHeight = canvasSizeOriginal.height;

  let canvasRatio = canvasWidth / canvasHeight;
  let scaleRatio = 1;

  let numCanvasesLoaded = 0;
  let allCanvasesLoaded = false;

  let songId = 0;

  let arrowWidth = 64;
  let hitPos = { x: 192, y: 208 };
  let hitPosFinal = { x: 192, y: 56 };
  let arrow_xPos = {
    left: hitPos.x,
    down: hitPos.x + arrowWidth,
    up: hitPos.x + arrowWidth * 2,
    right: hitPos.x + arrowWidth * 3,
  };

  let hitArrowSpritesheet;
  let arrowSpritesheet;
  let rainbowArrowSpritesheet;

  // save only one image obj and clear it
  // let newImgObj;

  // let arrowImgs;
  // let arrowImgsOriginal;

  let scoreBackgroundImg;

  let eggBombImg;

  let fawningAnimation;

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

  let secondsSinceStop = 0;

  let startDrawingArrows = false;

  let songVideo;
  let videoLoadedFirstTime = false;

  let endSongIfFailed = false;

  //Experimental scene variables

  let reverseClock = new Tone.Clock((time) => {}, 1);

  let waitForHit = true;
  let timerPaused = false;
  let t_holdLeftStart;
  let t_holdRightStart;
  let t_holdsFinished;
  let t_released;
  let attemptedHoldsOnce = false;
  let leftHoldNote;
  let rightHoldNote;

  let cueCount = 0;

  let animationIntervals = 50;

  let narrativeTextObjs = [];
  let whiteBackground = true;
  let part1HoldsDone = false;
  let part2Started = false;
  let endingStarted = false;
  let assetsSetup = false;

  p.preload = function () {
    //Preload a background here
    //Preload whatever needs to be preloaded
    hitArrowSpritesheet = p.loadImage("assets/hitArrowSpritesheet.png");
    arrowSpritesheet = p.loadImage("assets/arrowSpritesheet.png");

    comboTextImg = p.loadImage("assets/comboText.png");
    healthBarFrameImg = p.loadImage("assets/healthBarFrame.png");
    greenGradientImg = p.loadImage("assets/greenGradient.png");
    rainbowGradientImg = p.loadImage("assets/rainbowGradient.png");
    hitGlowImg = p.loadImage("assets/hit-glow.png");
    eggBombImg = p.loadImage("assets/egg-bomb.png");
    scoreBackgroundImg = p.loadImage("assets/scoreBackground.png");

    attackSpritesheet = p.loadImage("assets/attackSpritesheet.png");
  };

  p.setup = function () {
    // put setup code here
    p.frameRate(frameRate);
    p.pixelDensity(3);
    calculateCanvasDimensions(p);
    experimentalCanvas = p.createCanvas(canvasWidth, canvasHeight).elt;
    experimentalCanvas.classList.add("gameCanvas");
    experimentalCanvas.classList.add("experimentalCanvas");
    experimentalCanvas.id = "experimentalCanvas";

    p.noSmooth();

    // Setup arrow images from spritesheet
    hitArrowImgs = {
      left: hitArrowSpritesheet.get(0, 0, arrowWidth, arrowWidth),
      down: hitArrowSpritesheet.get(0, arrowWidth, arrowWidth, arrowWidth),
      up: hitArrowSpritesheet.get(0, arrowWidth * 2, arrowWidth, arrowWidth),
      right: hitArrowSpritesheet.get(0, arrowWidth * 3, arrowWidth, arrowWidth),
    };

    arrowImgsOriginal = {
      left: arrowSpritesheet.get(0, 0, arrowWidth, arrowWidth),
      down: arrowSpritesheet.get(0, arrowWidth * 1, arrowWidth, arrowWidth),
      up: arrowSpritesheet.get(0, arrowWidth * 2, arrowWidth, arrowWidth),
      right: arrowSpritesheet.get(0, arrowWidth * 3, arrowWidth, arrowWidth),
    };
    // numbers are where they are in the spritesheet
    arrowImgs = {
      left: 0,
      down: 1,
      up: 2,
      right: 3,
    };

    holdEndImgsOriginal = {
      left: arrowSpritesheet.get(0, arrowWidth * 4, arrowWidth, arrowWidth),
      down: arrowSpritesheet.get(0, arrowWidth * 5, arrowWidth, arrowWidth),
      up: arrowSpritesheet.get(0, arrowWidth * 6, arrowWidth, arrowWidth),
      right: arrowSpritesheet.get(0, arrowWidth * 7, arrowWidth, arrowWidth),
    };

    holdEndImgs = {
      left: { hitTrue: 4, hitFalse: 5 },
      down: { hitTrue: 6, hitFalse: 7 },
      up: { hitTrue: 8, hitFalse: 9 },
      right: { hitTrue: 10, hitFalse: 11 },
    };

    holdMiddleImgOriginal = arrowSpritesheet.get(
      0,
      arrowWidth * 8,
      arrowWidth,
      arrowWidth,
    );
    // holdMiddleImg = {};
    holdMiddleImg = {
      hitTrue: 12,
      hitFalse: 13,
    };

    hitArrowObjs = {
      left: new HitArrow("left", hitPos.x, hitPos.y),
      down: new HitArrow("down", hitPos.x + arrowWidth, hitPos.y),
      up: new HitArrow("up", hitPos.x + arrowWidth * 2, hitPos.y),
      right: new HitArrow("right", hitPos.x + arrowWidth * 3, hitPos.y),
    };

    attackImages = {
      left: {
        day: attackSpritesheet.get(0, 0, 320, 240),
        night: attackSpritesheet.get(0, 240, 320, 240),
      },
      down: {
        day: attackSpritesheet.get(0, 240 * 2, 320, 240),
        night: attackSpritesheet.get(0, 240 * 3, 320, 240),
      },
      up: {
        day: attackSpritesheet.get(0, 240 * 4, 320, 240),
        night: attackSpritesheet.get(0, 240 * 5, 320, 240),
      },
      right: {
        day: attackSpritesheet.get(0, 240 * 6, 320, 240),
        night: attackSpritesheet.get(0, 240 * 7, 320, 240),
      },
    };

    feedbackObj = new FeedbackText();
    comboObj = new ComboText();

    scoreData = new Score();
    healthBar = new HealthBar();
    fawningAnimation = new FawningAnimation();

    holdMiddleImgOriginal.loadPixels();
    Object.values(arrowImgsOriginal).forEach(function (imgObj) {
      imgObj.loadPixels();
    });
    Object.values(holdEndImgsOriginal).forEach(function (imgObj) {
      imgObj.loadPixels();
    });

    arrowSpritesheet.loadPixels();

    window.dispatchEvent(canvasLoadedEvent);
    setupNavigation(experimentalCanvas);
  };

  p.draw = function () {
    // p.background("pink");
    p.clear();
    if (whiteBackground) {
      p.background("white");
    } else {
      p.clear();
    }

    Object.values(hitArrowObjs).forEach(function (arrowObj) {
      arrowObj.displayGlow();
    });
    Object.values(hitArrowObjs).forEach(function (arrowObj) {
      arrowObj.display();
    });

    if (startDrawingArrows) {
      drawArrows();
    }

    // feedbackObj.display();
    // comboObj.display();
    // healthBar.display();
    // scoreData.displayTotalScore();
    //draw narrative text
    narrativeTextObjs.forEach(function (textObj) {
      if (textObj.showing) {
        textObj.display();
      }
    });
  };

  function setupNavigation(thisCanvas) {
    p.noLoop();
    thisCanvas.addEventListener("showScene", (e) => {
      p.loop();
      setTimeout(function () {
        thisCanvas.style.visibility = "visible";
        thisCanvas.style.opacity = 1;
        isCurrentScene = true;
        startSong();
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

  function pauseTimer() {
    timerPaused = true;
    Tone.Transport.pause();
  }

  function unpauseTimer() {
    timerPaused = false;
    Tone.Transport.start();
  }

  function startReverseTimer() {
    reverseClock.start();
    t_released = t;
  }

  // we have repressed after originally reversing
  function resetReverseTimer() {
    reverseClock.stop();
  }

  function resetHoldNote(noteObj) {
    noteObj.isHolding = false;
    noteObj.isHit = false;
    noteObj.completedHold = false;
    noteObj.hasPassedOver = false;
  }

  // we need a way to calculate the current beat ( and measure ), according to the bpm changes.
  // current beat should be Start beat of the current interval, plus time that has elapsed within that beat

  function updateNotes() {
    // console.log("part2Started: " + part2Started);
    // Experimental logic
    // Part 1 Timing
    if (!part2Started) {
      if (reverseClock.seconds > 0) {
        t = t_released - reverseClock.seconds;
        Tone.Transport.seconds = t;

        if (t < t_holdRightStart) {
          resetHoldNote(rightHoldNote);
        }
        if (t < t_holdLeftStart) {
          resetHoldNote(leftHoldNote);
          t = t_holdLeftStart;
          // We always want to get back to this start position if released early...
          resetReverseTimer();
          // Tone.Transport.stop();
          //Set it to t before holding
          Tone.Transport.seconds = t_holdLeftStart;
          // unpauseTimer();
          attemptedHoldsOnce = true;
        }
      } else if (attemptedHoldsOnce) {
        t = Tone.Transport.seconds;

        // t = Tone.Transport.seconds + t_holdLeftStart;
      } else {
        t = Tone.Transport.seconds;
      }
    } else {
      //Part 2 timing
      t = Tone.Transport.seconds;

      //Loop ending after 2:08, .. to 2:17
      if (t > 129) {
        part2_bg_player.loopStart = 129.5;
        part2_bg_player.loopEnd = 137;
        part2_bg_player.loop = true;
      }
      // If final RELEASE ME is missed, then transition to end automatically
      if (t > 150) {
        console.log("transition to end after missing final RELEASE ME");
        transitionToEnd();
      }
    }

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
        // console.log("updating batch data");
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
              if (newNote.id == 44) {
                leftHoldNote = newNote;
              }
              if (newNote.id == 45) {
                rightHoldNote = newNote;
              }
            });
          }
        });
      }
    }

    // //Handle case for song end
    // if (thisMeasure > measureData.length) {
    //   let win = scoreData.ranking != "E";
    //   // Comment for install
    //   handleSongEnd(win);
    //   // handleSongEnd(true);
    // }
  }

  function handleSongEnd(win) {
    console.log("song ended!!");
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
            shaderType: "revelationGlow",
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
    // thisSongPlayer = part1_bg_player;
    // thisSongPlayer.loop = true;

    //Setup info for the song: Part 1
    let thisSongData = JSON.parse(part1);
    measureData = thisSongData.measureData;
    songBpm = thisSongData.bpm;
    // songBpm = 400;

    songDelay = thisSongData.delay;
    // scoreData.songId = songId;
    // scoreData.totalNotes = thisSongData.totalNotes;
    // scoreData.calculateBaseNoteScore();
    secondsPerBeat = 1 / (songBpm / 60);
    t_holdLeftStart = secondsPerBeat * 4 * 26;
    t_holdRightStart = secondsPerBeat * 4 * 27;
    t_holdsFinished = secondsPerBeat * 4 * 34;
    setHitMarginTime();

    //For negative songDelays, start song before notes
    // For positive songDelays, startNotes before song
    updateNotesInterval = setInterval(function () {
      updateNotes();
      updateArrowRainbow();
    }, 30);

    startDrawingArrows = true;
    //Start a tone.js clock to keep time
    // clock.start();
    Tone.Transport.start();
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

  //Q: Let's say there are two consecutive arrows of the same time within the hit margin.
  // How do we evaluate only the first note????
  function setHitMarginTime() {
    // Set hit margin time to half a beat...
    // hitMarginTime = secondsPerBeat / 2;
    // for testing... note that holds will be weird!
    hitMarginTime = secondsPerBeat * 0.75;
    console.log("Hit Margin Time is: " + hitMarginTime);
  }
  function isWithinHitMargin(yPos) {
    return (
      yPos >= hitArrowObjs["left"].yPos - hitMargin &&
      yPos <= hitArrowObjs["left"].yPos + hitMargin
    );
  }

  function isPassedHitMarginTime(note) {
    let currentTime = t;
    return currentTime >= note.startTime + hitMarginTime;
  }

  function isPassedTime(time) {
    let currentTime = t;
    return currentTime >= time;
  }

  function isWithinHitMarginTime(note) {
    let currentTime = t;
    return (
      currentTime >= note.startTime - hitMarginTime &&
      currentTime <= note.startTime + hitMarginTime
    );
  }

  function isPastHitTime(note) {
    let currentTime = t;
    return currentTime >= note.startTime;
  }

  function isPassedHitBoundary(yPos) {
    return yPos <= hitArrowObjs["left"].yPos;
  }

  function drawArrows() {
    let timerHasPaused = false;
    relevantNotes.forEach(function (note) {
      let direction = note.direction;
      // let passedOver = false;

      // Get current y position: yPos is where the start of the note is currently on the p5 canvas

      // If bpm changes, pixels elapsed needs to be based on the bpm segments...

      pixelsElapsed = (t / secondsPerBeat) * pixelsPerBeat;

      let yPos =
        hitArrowObjs["left"].yPos +
        pixelsPerBeat * note.startBeat -
        pixelsElapsed;
      note.currentY = yPos;

      // Should this arrow be considered as a hit candidate?
      if (Tone.Transport.state == "started") {
        //Pause arrows for part 1 arrows and holds
        if (isPastHitTime(note) && !part2Started && !note.isHit) {
          // Tone.Transport.seconds = note.startTime;
          // console.log(Tone.Transport.seconds);
          // if (Transport.Timer.state == "started") {
          if (!timerHasPaused) {
            Tone.Transport.state = note.startTime;
            pauseTimer();
            timerHasPaused = true;
          }

          // Transport.Timer.state = note.startTime;
          // }
        }

        // console.log("Evaluating note: " + note.id);
        // console.log("current t: " + t);
        // console.log("current Transport time: " + Tone.Transport.seconds);
        if (isWithinHitMarginTime(note)) {
          // console.log("Note is a hit candidate");
          // console.log("note is hit candidate");
          //Note within our hit window!
          note.isHitCandidate = true;
        } else if (isPassedHitMarginTime(note)) {
          // passedOver = true;
          // console.log("Note is passed over");
          // console.log(note);
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
          hideHoldTexts(note.id + 1);

          //Add logic for resetting for part 2
          if (!part1HoldsDone && cueCount == 46) {
            // Can we set a timer for the beat to start?
            hideHoldTexts();
            resetForPart2();
          }
          //Add logic for switching to end when final arrow passes
          if (cueCount >= 221) {
            console.log("transition to end after final arrow passes");
            transitionToEnd();
          }
        }
      } else if (Tone.Transport.state == "paused") {
        // case: we're at a stop and hitting a note right on the beat
        if (isWithinHitMarginTime(note)) {
          note.isHitCandidate = true;
        }

        // Account for state of pause for part 1 holds....
      }

      note.display(yPos);
    });
  }

  function resetForPart2() {
    console.log("reset for part 2");
    part1HoldsDone = true;
    waitForHit = false;
    part2Started = true;

    part1_bg_player.stop();
    Tone.Transport.stop();

    // Lets try resetting everything here!
    relevantNotes = [];
    currentBatchStartMeasure = 0;
    currentMeasure = -1;
    currentBeat = 0;
    pixelsElapsed = 0;

    let songData = JSON.parse(part2);
    measureData = songData.measureData;
    songBpm = songData.bpm;
    songDelay = songData.delay;
    secondsPerBeat = 1 / (songBpm / 60);
    animationIntervals = 10;
    setHitMarginTime();
    let measuresUntilBeat = 1;
    let delayForBeat = measuresUntilBeat * 4 * secondsPerBeat;
    Tone.Transport.seconds = 0;
    Tone.Transport.start();

    setTimeout(function () {
      part2_bg_player.start();
    }, delayForBeat * 1000);

    // Schedule countdown sound_fx in Time Transport
    for (var i = 0; i < 8; i++) {
      let lastNoteEndTime = beatToTime(316);
      let secondToSchedule = lastNoteEndTime - i;
      Tone.Transport.schedule(function () {
        if (!endingStarted) {
          sound_fx.timer.start();
        }
      }, secondToSchedule);
    }
  }

  function transitionToEnd() {
    if (!endingStarted) {
      endingStarted = true;

      console.log("TRANSITION TO END!!!");
      let backgroundCanvas = document.querySelector("#backgroundCanvas");
      experimentalCanvas.style.opacity = 0;
      backgroundCanvas.style.opacity = 0;

      part2_bg_player.stop();
      window.setTimeout(function () {
        document
          .querySelector("#experimentalCanvas")
          .dispatchEvent(hideSceneEvent);
        backgroundCanvas.dispatchEvent(hideSceneEvent);

        let credits = document.querySelector("#credits");
        credits.style.display = "flex";
        let countdown = 20;
        window.setInterval(function () {
          countdown--;
          let countdownSpan = document.querySelector("#endingCountdown");
          countdownSpan.innerHTML = countdown;
          if (countdown <= 0) {
            countdown = 0;
            location.reload();
          }
        }, 1000);
      }, 3000);
    }
  }

  function updateArrowRainbow() {
    let rgb_gradient = calculateRgbValues();

    rainbowArrowSpritesheet = convertArrowSpritesheetToRainbow(
      arrowSpritesheet,
      rgb_gradient,
    );
  }

  function convertArrowSpritesheetToRainbow(
    imgObj,
    rgb_gradient,
    imgType,
    isHit,
  ) {
    // Let's try this again except convert the whole spritesheet to rainbow...
    let newImgObj = p.createImage(64, 896);
    newImgObj.loadPixels();

    // imgObj.loadPixels();

    for (let y = 0; y < newImgObj.height; y++) {
      for (let x = 0; x < newImgObj.width; x++) {
        // Gets the index of the red value for this pixel
        let redIndex = (x + y * newImgObj.width) * 4;
        let greenIndex = redIndex + 1;
        let blueIndex = redIndex + 2;
        let alphaIndex = redIndex + 3;
        // Top of arrow
        let isWhite =
          arrowSpritesheet.pixels[redIndex] == 255 &&
          arrowSpritesheet.pixels[greenIndex] == 255 &&
          arrowSpritesheet.pixels[blueIndex] == 255 &&
          arrowSpritesheet.pixels[alphaIndex] == 255;
        // Middle of arrow
        let isBlue =
          arrowSpritesheet.pixels[redIndex] == 0 &&
          arrowSpritesheet.pixels[greenIndex] == 0 &&
          arrowSpritesheet.pixels[blueIndex] == 255 &&
          arrowSpritesheet.pixels[alphaIndex] == 255;
        // Bottom of arrow
        let isGreen =
          arrowSpritesheet.pixels[redIndex] == 0 &&
          arrowSpritesheet.pixels[greenIndex] == 255 &&
          arrowSpritesheet.pixels[blueIndex] == 0 &&
          arrowSpritesheet.pixels[alphaIndex] == 255;
        let isRed =
          arrowSpritesheet.pixels[redIndex] == 255 &&
          arrowSpritesheet.pixels[greenIndex] == 0 &&
          arrowSpritesheet.pixels[blueIndex] == 0 &&
          arrowSpritesheet.pixels[alphaIndex] == 255;
        let isTransparent =
          arrowSpritesheet.pixels[redIndex] == 0 &&
          arrowSpritesheet.pixels[greenIndex] == 0 &&
          arrowSpritesheet.pixels[blueIndex] == 0 &&
          arrowSpritesheet.pixels[alphaIndex] == 0;

        let isBlack =
          arrowSpritesheet.pixels[redIndex] == 0 &&
          arrowSpritesheet.pixels[greenIndex] == 0 &&
          arrowSpritesheet.pixels[blueIndex] == 0 &&
          arrowSpritesheet.pixels[alphaIndex] == 255;

        let isHoldEnd = y >= 4 * 64 && y < 12 * 64;
        let isHoldMiddle = y >= 12 * 64;
        // let isHoldMiddle)Hit = y > 12 * 64;
        let isHit = Math.floor(y / 64) % 2 == 0;

        // Make sure the non colored pixels ones are the same value
        if (!(isRed || isGreen || isBlue || isWhite)) {
          newImgObj.pixels[redIndex] = arrowSpritesheet.pixels[redIndex]; // Red value
          newImgObj.pixels[greenIndex] = arrowSpritesheet.pixels[greenIndex]; // Green value
          newImgObj.pixels[blueIndex] = arrowSpritesheet.pixels[blueIndex]; // Blue value
          newImgObj.pixels[alphaIndex] = arrowSpritesheet.pixels[alphaIndex]; // Alpha value
        }
        // Change Red pixels to rainbow effect
        if (isRed) {
          // Use the last calculated color for the end of holds to make more continuous

          if (isHoldEnd) {
            newImgObj.pixels[redIndex] = rgb_gradient[63][0] * 255; // Red value
            newImgObj.pixels[greenIndex] = rgb_gradient[63][1] * 255; // Green value
            newImgObj.pixels[blueIndex] = rgb_gradient[63][2] * 255; // Blue value
            newImgObj.pixels[alphaIndex] = 255; // Alpha value
          } else {
            newImgObj.pixels[redIndex] = rgb_gradient[y % 64][0] * 255; // Red value
            newImgObj.pixels[greenIndex] = rgb_gradient[y % 64][1] * 255; // Green value
            newImgObj.pixels[blueIndex] = rgb_gradient[y % 64][2] * 255; // Blue value
            newImgObj.pixels[alphaIndex] = 255; // Alpha value
          }
        }

        if (isHoldMiddle || isHoldEnd) {
          if (isWhite) {
            if (isHit) {
              newImgObj.pixels[redIndex] = 255; // Red value
              newImgObj.pixels[greenIndex] = 255; // Green value
              newImgObj.pixels[blueIndex] = 255; // Blue value
              newImgObj.pixels[alphaIndex] = 255; // Alpha value
            } else if (!isHit) {
              newImgObj.pixels[redIndex] = 180; // Red value
              newImgObj.pixels[greenIndex] = 180; // Green value
              newImgObj.pixels[blueIndex] = 192; // Blue value
              newImgObj.pixels[alphaIndex] = 255; // Alpha value
            }
          }
        } else {
          // Change bottom section
          if (isGreen) {
            // Note: fix timing.. it should be that on the beat
            if ((currentBeat * 100) % 100 > 25) {
              newImgObj.pixels[redIndex] = 255; // Red value
              newImgObj.pixels[greenIndex] = 255; // Green value
              newImgObj.pixels[blueIndex] = 255; // Blue value
              newImgObj.pixels[alphaIndex] = 255; // Alpha value
            } else {
              newImgObj.pixels[redIndex] = 180; // Red value
              newImgObj.pixels[greenIndex] = 180; // Green value
              newImgObj.pixels[blueIndex] = 192; // Blue value
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
              newImgObj.pixels[redIndex] = 180; // Red value
              newImgObj.pixels[greenIndex] = 180; // Green value
              newImgObj.pixels[blueIndex] = 192; // Blue value
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
              newImgObj.pixels[redIndex] = 180; // Red value
              newImgObj.pixels[greenIndex] = 180; // Green value
              newImgObj.pixels[blueIndex] = 192; // Blue value
              newImgObj.pixels[alphaIndex] = 255; // Alpha value
            }
          }
        }
      }
    }
    // console.log("updating pixels");
    newImgObj.updatePixels();
    return newImgObj;
  }

  function convertArrowImgToRainbow(imgObj, rgb_gradient, imgType, isHit) {
    // Iterates across each pixel in the canvas
    // let arrowImg = arrowImgs["left"];
    // let currentHue = (t * 50) % 360;
    // let rgb = hsl2rgb(currentHue, 0.97, 0.6);
    // if (newImgObj) {
    //   console.log("removing");
    //   console.log(newImgObj);
    //   newImgObj.remove();
    // }
    // newImgObj.clear();
    // newImgObj.copy(imgObj, 0, 0, 64, 64, 0, 0, 64, 64);
    let newImgObj = p.createImage(64, 64);
    newImgObj.loadPixels();

    imgObj.loadPixels();

    for (let y = 0; y < newImgObj.height; y++) {
      for (let x = 0; x < newImgObj.width; x++) {
        // Gets the index of the red value for this pixel
        let redIndex = (x + y * newImgObj.width) * 4;
        let greenIndex = redIndex + 1;
        let blueIndex = redIndex + 2;
        let alphaIndex = redIndex + 3;
        // Top of arrow
        let isWhite =
          imgObj.pixels[redIndex] == 255 &&
          imgObj.pixels[greenIndex] == 255 &&
          imgObj.pixels[blueIndex] == 255 &&
          imgObj.pixels[alphaIndex] == 255;
        // Middle of arrow
        let isBlue =
          imgObj.pixels[redIndex] == 0 &&
          imgObj.pixels[greenIndex] == 0 &&
          imgObj.pixels[blueIndex] == 255 &&
          imgObj.pixels[alphaIndex] == 255;
        // Bottom of arrow
        let isGreen =
          imgObj.pixels[redIndex] == 0 &&
          imgObj.pixels[greenIndex] == 255 &&
          imgObj.pixels[blueIndex] == 0 &&
          imgObj.pixels[alphaIndex] == 255;
        let isRed =
          imgObj.pixels[redIndex] == 255 &&
          imgObj.pixels[greenIndex] == 0 &&
          imgObj.pixels[blueIndex] == 0 &&
          imgObj.pixels[alphaIndex] == 255;
        let isTransparent =
          imgObj.pixels[redIndex] == 0 &&
          imgObj.pixels[greenIndex] == 0 &&
          imgObj.pixels[blueIndex] == 0 &&
          imgObj.pixels[alphaIndex] == 0;

        // Make sure transparent is transparent
        if (isTransparent) {
          newImgObj.pixels[redIndex] = 0; // Red value
          newImgObj.pixels[greenIndex] = 0; // Green value
          newImgObj.pixels[blueIndex] = 0; // Blue value
          newImgObj.pixels[alphaIndex] = 0; // Alpha value
        }
        // Change Red pixels to rainbow effect
        if (isRed) {
          // Use the last calculated color for the end of holds to make more continuous
          if (imgType == "holdEnd") {
            newImgObj.pixels[redIndex] = rgb_gradient[63][0] * 255; // Red value
            newImgObj.pixels[greenIndex] = rgb_gradient[63][1] * 255; // Green value
            newImgObj.pixels[blueIndex] = rgb_gradient[63][2] * 255; // Blue value
            newImgObj.pixels[alphaIndex] = 255; // Alpha value
          } else {
            newImgObj.pixels[redIndex] = rgb_gradient[y][0] * 255; // Red value
            newImgObj.pixels[greenIndex] = rgb_gradient[y][1] * 255; // Green value
            newImgObj.pixels[blueIndex] = rgb_gradient[y][2] * 255; // Blue value
            newImgObj.pixels[alphaIndex] = 255; // Alpha value
          }
        }

        if (imgType == "holdMiddle" || imgType == "holdEnd") {
          if (isWhite) {
            if (isHit) {
              newImgObj.pixels[redIndex] = 255; // Red value
              newImgObj.pixels[greenIndex] = 255; // Green value
              newImgObj.pixels[blueIndex] = 255; // Blue value
              newImgObj.pixels[alphaIndex] = 255; // Alpha value
            } else if (!isHit) {
              newImgObj.pixels[redIndex] = 180; // Red value
              newImgObj.pixels[greenIndex] = 180; // Green value
              newImgObj.pixels[blueIndex] = 192; // Blue value
              newImgObj.pixels[alphaIndex] = 255; // Alpha value
            }
          }
        } else {
          // Change bottom section
          if (isGreen) {
            // Note: fix timing.. it should be that on the beat
            if ((currentBeat * 100) % 100 > 25) {
              newImgObj.pixels[redIndex] = 255; // Red value
              newImgObj.pixels[greenIndex] = 255; // Green value
              newImgObj.pixels[blueIndex] = 255; // Blue value
              newImgObj.pixels[alphaIndex] = 255; // Alpha value
            } else {
              newImgObj.pixels[redIndex] = 180; // Red value
              newImgObj.pixels[greenIndex] = 180; // Green value
              newImgObj.pixels[blueIndex] = 192; // Blue value
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
              newImgObj.pixels[redIndex] = 180; // Red value
              newImgObj.pixels[greenIndex] = 180; // Green value
              newImgObj.pixels[blueIndex] = 192; // Blue value
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
              newImgObj.pixels[redIndex] = 180; // Red value
              newImgObj.pixels[greenIndex] = 180; // Green value
              newImgObj.pixels[blueIndex] = 192; // Blue value
              newImgObj.pixels[alphaIndex] = 255; // Alpha value
            }
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

  function hideHoldTexts(cue) {
    if (cue) {
      narrativeTextObjs.map(function (textObj) {
        if (
          textObj.cue == cue &&
          textObj.showing &&
          textObj.animationType == "hold"
        ) {
          textObj.hideHoldText();
        }
      });
    } else {
      narrativeTextObjs.map(function (textObj) {
        if (textObj.showing && textObj.animationType == "hold") {
          textObj.hideHoldText();
        }
      });
    }
  }

  function updateMiss(score, note) {
    feedbackObj.updateState(score);
    comboObj.resetCombo();
    scoreData.update("miss");
  }
  function updateHit(score, note) {
    //Is this the first time hitting this note?
    if (!note.isHit && note.noteType != "mine") {
      if (Tone.Transport.state == "paused") {
        unpauseTimer();
      }
      // comboObj.incrementCombo();
      note.isHit = true;
      let scoreScale = 1;
      cueCount = parseInt(note.id) + 1;
      triggerNarrative(cueCount);
      // if (score === "ok") {
      //   feedbackObj.updateState("ok", true);
      // } else if (score === "great") {
      //   feedbackObj.updateState("great", true);
      // } else if (score === "perfect") {
      //   feedbackObj.updateState("perfect", true);
      // }
      // scoreData.update(score);
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
    let hitSuccessful = false;
    if (isStopped) {
      hitTime = t + secondsSinceStop;
    } else {
      hitTime = t;
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
        // console.log("too early");
      }
      // A little early - Ok - PASS
      else if (
        hitTime >= note.startTime - (hitMarginTime * 3) / 4 &&
        hitTime < note.startTime - (hitMarginTime * 2) / 4
      ) {
        updateHit("ok", note);
        hitSuccessful = true;
        // console.log("ok");
      }
      // Almost perfect - early
      else if (
        hitTime >= note.startTime - (hitMarginTime * 2) / 4 &&
        hitTime < note.startTime - hitMarginTime / 4
      ) {
        updateHit("great", note);
        hitSuccessful = true;
        // console.log("great");
      }
      // Perfect - PASS
      else if (
        hitTime >= note.startTime - hitMarginTime / 4 &&
        hitTime < note.startTime + hitMarginTime / 4
      ) {
        updateHit("perfect", note);
        hitSuccessful = true;
        // console.log("perfect");
      }
      // Almost perfect - late - PASS
      else if (
        hitTime >= note.startTime + hitMarginTime / 4 &&
        hitTime < note.startTime + (hitMarginTime * 2) / 4
      ) {
        updateHit("great", note);
        hitSuccessful = true;
        // console.log("great");
      }
      // A little late - OK - PASS
      else if (
        hitTime >= note.startTime + (hitMarginTime * 2) / 4 &&
        hitTime < note.startTime + (hitMarginTime * 3) / 4
      ) {
        updateHit("ok", note);
        hitSuccessful = true;
        // console.log("ok");
      }
      // TOO LATE - Failed
      else if (
        hitTime >= note.startTime + (hitMarginTime * 3) / 4 &&
        hitTime < note.startTime + hitMarginTime
      ) {
        updateMiss("late", note);
        // console.log("late");
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

        // Transition to part 2
        if (!part1HoldsDone && cueCount == 46) {
          hideHoldTexts();
          resetForPart2();
        }

        // Transition to ending
        if (cueCount >= 221) {
          transitionToEnd();
        }
      }

      // Lift is TOO EARLY - Failed
      else if (hitTime < note.endTime - hitMarginTime) {
        feedbackObj.updateState("early");

        //Are we lifting early before part 2 - aka the holds?
        if (!part2Started) {
          pauseTimer();

          if (reverseClock.seconds == 0) {
            hideHoldTexts();
            startReverseTimer();
          }
          note.isHolding = true;
          note.completedHold = false;
        } else {
          note.isHolding = false;
          note.completedHold = false;
        }
      }

      if (cueCount >= 221) {
        console.log("transition to end after lift early");
        transitionToEnd();
      }
      // Fade out any narrative texts for holds, for this cue
      hideHoldTexts(note.id + 1);
    }
    // console.log("assess hit: " + hitSuccessful);
    return hitSuccessful;
  }

  // Iterates through the list of relative notes....

  // If you have previously hit a note with the SAME direction, don't assess hit for notes of that direction later
  function assessHit(direction, hitType) {
    let anyNoteHit = false;

    let thisDirectionHit = false;

    relevantNotes.forEach(function (note) {
      if (Tone.Transport.state == "started") {
        if (!thisDirectionHit) {
          if (assessHitForNoteByTime(direction, hitType, note)) {
            thisDirectionHit = true;
            anyNoteHit = true;
          }
        }
      } else if (
        Tone.Transport.state == "paused"
        // && isPassedHitBoundary(note.currentY)
      ) {
        if (!thisDirectionHit) {
          if (assessHitForNoteByTime(direction, hitType, note, true)) {
            anyNoteHit = true;
          }
        }
      }
    });
    return anyNoteHit;
  }

  function resetForNewSong() {
    // Lets try resetting everything here!
    relevantNotes = [];
    currentBatchStartMeasure = 0;
    currentMeasure = -1;
    currentBeat = 0;
    pixelsElapsed = 0;
    startDrawingArrows = false;
    // clearInterval(updateArrowsInterval);
    clearInterval(updateNotesInterval);
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
    e.preventDefault();
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

      // Check if this is a fawning hit...
      this.isFawningHit =
        songId == 1 &&
        [18, 19, 20, 21, 30, 31, 32, 33].indexOf(this.measure) > -1;

      // Check if in second group of measures for night
      this.isFawningNight =
        this.isFawningHit && [30, 31, 32, 33].indexOf(this.measure) > -1;
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
        drawArrowPiece(
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
          drawArrowPiece(
            holdMiddleImg.hitTrue,
            arrow_xPos[this.direction],
            hitArrowObjs["left"].yPos + 32,
            rectangleHeight,
          );
          // Draw arrow at end of rectangle
          drawArrowPiece(
            holdEndImgs[this.direction].hitTrue,
            arrow_xPos[this.direction],
            hitArrowObjs["left"].yPos + rectangleHeight,
          );
          // Draw arrow at hit pos
          drawArrowPiece(
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
          drawArrowPiece(
            holdMiddleImg.hitFalse,
            arrow_xPos[this.direction],
            yPosReleased + 32,
            rectangleHeight,
          );
          // Draw arrow at end of rectangle
          drawArrowPiece(
            holdEndImgs[this.direction].hitFalse,
            arrow_xPos[this.direction],
            yPosReleased + rectangleHeight,
          );
          // Draw arrow at hit pos
          drawArrowPiece(
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
          drawArrowPiece(
            holdMiddleImg.hitFalse,
            arrow_xPos[this.direction],
            yPos + 32,
            rectangleHeight,
          );
          drawArrowPiece(
            arrowImgs[this.direction],
            arrow_xPos[this.direction],
            yPos,
          );
          drawArrowPiece(
            holdEndImgs[this.direction].hitFalse,
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

      // Display effect for eggshell hit
      if (this.noteType == "mine" && this.eggshellSceneOpacity > 0) {
        // Draw flash if eggshell opacity is hit
        let c = p.color(255, 255, 255);
        c.setAlpha(this.eggshellSceneOpacity * 255);
        p.fill(c);
        p.rect(0, 0, p.width, p.height);
      }
    }
  }

  // Create simple animation for fawning that times it out after 1 beat
  class FawningAnimation {
    constructor() {
      this.currentDirection = "left";
      this.animationPlaying = false;
      this.cancelAnimationTimeout = null;
      this.attackImageScale = 1;
      this.isNight = false;
    }
    startAnimation(direction, isNight) {
      this.currentDirection = direction;
      this.isNight = isNight;
      let _this = this;
      _this.animationPlaying = true;
      sound_fx.attack[this.currentDirection].start();
      clearTimeout(_this.cancelAnimationTimeout);
      clearInterval(_this.attackAnimationInterval);

      let i = 1;
      _this.attackAnimationInterval = setInterval(function () {
        if (i < Object.keys(hitAnimationTimings).length) {
          _this.attackImageScale = hitAnimationTimings[i];
        } else {
          _this.attackImageScale = 1;
          clearInterval(_this.attackAnimationInterval);
        }
        i++;
      }, 30);

      _this.cancelAnimationTimeout = setTimeout(
        function () {
          _this.animationPlaying = false;
        },
        1 * secondsPerBeat * 1000,
      );
    }
    display() {
      if (this.animationPlaying) {
        let dx = (640 * this.attackImageScale - 640) / 2;
        let dy = (480 * this.attackImageScale - 480) / 2;
        let imageToDraw = this.isNight
          ? attackImages[this.currentDirection].night
          : attackImages[this.currentDirection].day;

        drawImageToScale(imageToDraw, -dx, -dy, 2 * this.attackImageScale);
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
        // Comment for install

        if (endSongIfFailed) {
          handleSongEnd(false);
        }
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
      }, animationIntervals);

      this.animationTimeout = setTimeout(function () {
        _this.glowing = false;
        clearInterval(_this.animationInterval);
      }, animationIntervals * 10);
    }
    release() {
      this.pressed = false;
    }
    display() {
      let arrowOpacity = !part2Started ? 0 : 1;
      // Move hit arrows if time passes in part 2
      if (!part2Started && t > t_holdRightStart && t < t_holdsFinished) {
        let timeElapsed = t - t_holdRightStart;
        let percentageElapsed =
          timeElapsed / (t_holdsFinished - t_holdRightStart);
        arrowOpacity = percentageElapsed;
        let backgroundTransitionEvent = new CustomEvent(
          "backgroundTransition",
          { detail: percentageElapsed },
        );
        document
          .querySelector("#backgroundCanvas")
          .dispatchEvent(backgroundTransitionEvent);
        console.log("dispatching background transition");
        // document.querySelector("#backgroundCanvas").dispatchEvent()
        whiteBackground = false;
        let yPos = p.map(percentageElapsed, 0, 1, hitPos.y, hitPosFinal.y);
        this.yPos = yPos;
      }
      //Draw arrow at scale
      let d = (this.imgToDraw.width * (1 - this.scale)) / 2;

      p.tint(255, arrowOpacity * 255);
      drawImageToScale(
        this.imgToDraw,
        this.xPos + d,
        this.yPos + d,
        this.scale,
      );
      p.tint(255, 255);
    }
    displayGlow() {
      if (this.glowing) {
        let arrowMargin = 28;
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

  class NarrativeText {
    //Default animation type is bounce
    constructor(cue, text, xPos, yPos, animationType, font) {
      this.cue = cue;
      this.showing = false;
      this.text = text;
      this.scale = 1;
      this.opacity = 1;
      this.animationIndex = 0;
      this.animationInterval;
      this.hideTimeout;
      this.xPos = xPos;
      this.yPos = yPos;
      if (animationType) {
        this.animationType = animationType;
      } else {
        this.animationType = "bounce";
      }
      if (font) {
        this.font = font;
      } else {
        this.font = "mainYellow";
      }
    }

    animate() {
      if (!narrativeTextObjs.includes(this)) {
        narrativeTextObjs.push(this);
      }
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
      }, animationIntervals);

      if (this.animationType == "bounce") {
        let hideAfter = 2000;
        if (part2Started) {
          hideAfter = secondsPerBeat * 1000;
        }
        this.hideTimeout = setTimeout(function () {
          _this.showing = false;
          clearInterval(_this.animationInterval);
        }, hideAfter);
      }
    }
    hideHoldText() {
      clearTimeout(this.hideTimeout);
      clearInterval(this.animationInterval);
      // this.showing = true;
      this.animationIndex = 0;
      let _this = this;

      this.animationInterval = setInterval(function () {
        _this.animationIndex++;
        let newScale = fadeOutTiming[_this.animationIndex];
        let newOpacity = fadeOutTiming[_this.animationIndex];
        if (newScale == null) {
          newScale = 1;
          newOpacity = 0;
        }
        _this.scale = newScale;
        _this.opacity = newOpacity;
      }, animationIntervals);

      this.hideTimeout = setTimeout(function () {
        _this.showing = false;
        clearInterval(_this.animationInterval);
      }, animationIntervals * 8);
    }
    display() {
      if (this.showing) {
        p.tint(255, this.opacity * 255);
        drawText(this.text, this.font, this.scale, this.xPos, this.yPos);
        p.tint(255, 255);
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

  function drawArrowPiece(pieceType, x, y, height) {
    // Draw arrow from spritesheet
    let positionInSpritesheet = pieceType * 64;

    //Account for null height values
    if (height == null) {
      height = 64;
    }
    p.image(
      rainbowArrowSpritesheet,
      x * scaleRatio,
      y * scaleRatio,
      64 * scaleRatio,
      height * scaleRatio,
      0, //sx
      positionInSpritesheet, //sy
      64,
      64,
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

  function sendBackgroundCueEvent(cueCount) {
    let backgroundCueEvent = new CustomEvent("backgroundCue", {
      detail: cueCount,
    });
    document
      .querySelector("#backgroundCanvas")
      .dispatchEvent(backgroundCueEvent);
  }
  function triggerNarrative(cueCount) {
    if (cueCount == 1) {
      let newText = new NarrativeText(cueCount, "I");
      newText.animate();
    }
    if (cueCount == 2) {
      let newText = new NarrativeText(cueCount, "find");
      newText.animate();
    }
    if (cueCount == 3) {
      let newText = new NarrativeText(cueCount, "myself");
      newText.animate();
    }
    if (cueCount == 4) {
      let newText = new NarrativeText(cueCount, "replaying");
      newText.animate();
    }
    if (cueCount == 5) {
      let newText = new NarrativeText(cueCount, "these");
      newText.animate();
    }
    if (cueCount == 6) {
      let newText = new NarrativeText(cueCount, "familiar");
      newText.animate();
    }
    if (cueCount == 7) {
      let newText = new NarrativeText(cueCount, "old");
      newText.animate();
    }
    if (cueCount == 8) {
      let newText = new NarrativeText(cueCount, "stories");
      newText.animate();
    }
    if (cueCount == 9) {
      let newText = new NarrativeText(cueCount, "My", 180);
      newText.animate();
    }
    if (cueCount == 10) {
      let newText = new NarrativeText(cueCount, "mind", 300);
      newText.animate();
    }
    if (cueCount == 11) {
      let newText = new NarrativeText(cueCount, "for", 110, null, null, "pink");
      newText.animate();
    }
    if (cueCount == 12) {
      let newText = new NarrativeText(
        cueCount,
        "gets",
        290,
        null,
        null,
        "pink",
      );
      newText.animate();
    }
    if (cueCount == 13) {
      let newText = new NarrativeText(cueCount, "My", 200);
      newText.animate();
    }
    if (cueCount == 14) {
      let newText = new NarrativeText(cueCount, "body", 300);
      newText.animate();
    }
    if (cueCount == 15) {
      let newText = new NarrativeText(cueCount, "re", 26, null, null, "pink");
      newText.animate();
    }
    if (cueCount == 16) {
      let newText = new NarrativeText(
        cueCount,
        "members",
        146,
        null,
        null,
        "pink",
      );
      newText.animate();
    }
    if (cueCount == 17) {
      let newText = new NarrativeText(cueCount, "I", 44, 75);
      newText.animate();
    }
    if (cueCount == 18) {
      let newText = new NarrativeText(cueCount, "used", 97, 124);
      newText.animate();
    }
    if (cueCount == 19) {
      let newText = new NarrativeText(cueCount, "to", 284, 88);
      newText.animate();
    }
    if (cueCount == 20) {
      let newText = new NarrativeText(cueCount, "be", 321, 153);
      newText.animate();
    }
    if (cueCount == 21) {
      let newText = new NarrativeText(cueCount, "lieve", 401, 153);
      newText.animate();
    }
    if (cueCount == 22) {
      let newText = new NarrativeText(cueCount, "I", 117, 221);
      newText.animate();
    }
    if (cueCount == 23) {
      let newText = new NarrativeText(cueCount, "was", 177, 259);
      newText.animate();
    }

    if (cueCount == 24) {
      let newText = new NarrativeText(cueCount, "emp", 321, 234);
      newText.animate();
    }
    if (cueCount == 25) {
      let newText = new NarrativeText(cueCount, "ty,", 441, 234);
      newText.animate();
    }

    if (cueCount == 26) {
      let newText = new NarrativeText(cueCount, "a", 86, 355);
      newText.animate();
    }

    if (cueCount == 27) {
      let newText = new NarrativeText(cueCount, "blank", 156, 374);
      newText.animate();
    }

    if (cueCount == 28) {
      let newText = new NarrativeText(cueCount, "slate", 380, 339);
      newText.animate();
    }

    if (cueCount == 29) {
      let newText = new NarrativeText(cueCount, "I", 60, 132);
      newText.animate();
    }

    if (cueCount == 30) {
      let newText = new NarrativeText(cueCount, "was", 140, 132);
      newText.animate();
    }

    if (cueCount == 31) {
      let newText = new NarrativeText(cueCount, "looking", 300, 132);
      newText.animate();
    }
    if (cueCount == 32) {
      let newText = new NarrativeText(cueCount, "for", 60, 210);
      newText.animate();
    }
    if (cueCount == 33) {
      let newText = new NarrativeText(cueCount, "a", 220, 210);
      newText.animate();
    }
    if (cueCount == 34) {
      let newText = new NarrativeText(cueCount, "witness", 300, 210);
      newText.animate();
    }
    if (cueCount == 35) {
      let newText = new NarrativeText(cueCount, "all", 140, 289);
      newText.animate();
    }
    if (cueCount == 36) {
      let newText = new NarrativeText(cueCount, "along", 300, 289);
      newText.animate();
    }
    if (cueCount == 37) {
      let newText = new NarrativeText(cueCount, "I");
      newText.animate();
    }
    if (cueCount == 38) {
      let newText = new NarrativeText(cueCount, "have");
      newText.animate();
    }
    if (cueCount == 39) {
      let newText = new NarrativeText(cueCount, "learned");
      newText.animate();
    }
    if (cueCount == 40) {
      let newText = new NarrativeText(cueCount, "to");
      newText.animate();
    }
    if (cueCount == 41) {
      let newText = new NarrativeText(cueCount, "stay");
      newText.animate();
    }
    if (cueCount == 42) {
      let newText = new NarrativeText(cueCount, "in");
      newText.animate();
    }
    if (cueCount == 43) {
      let newText = new NarrativeText(cueCount, "constant");
      newText.animate();
    }
    if (cueCount == 44) {
      let newText = new NarrativeText(cueCount, "motion");
      newText.animate();
    }
    if (cueCount == 45) {
      let text1 = new NarrativeText(cueCount, "but to", 34, 171, "hold");

      let text2 = new NarrativeText(cueCount, "hold", 30, 256, "hold", "pink");

      text1.animate();
      text2.animate();
    }
    if (cueCount == 46) {
      let text1 = new NarrativeText(cueCount, "is to be", 320, 171, "hold");
      let text2 = new NarrativeText(cueCount, "held", 360, 256, "hold", "pink");
      text1.animate();
      text2.animate();
    }

    // PART 2

    if (cueCount == 47) {
      let text1 = new NarrativeText(cueCount, "I");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }

    if (cueCount == 48) {
      let text1 = new NarrativeText(cueCount, "can");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 49) {
      let text1 = new NarrativeText(cueCount, "be-");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 50) {
      let text1 = new NarrativeText(cueCount, "-lieve");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 51) {
      let text1 = new NarrativeText(cueCount, "in");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 52) {
      let text1 = new NarrativeText(cueCount, "the");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 53) {
      let text1 = new NarrativeText(cueCount, "truth");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 54) {
      let text1 = new NarrativeText(cueCount, "of");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 55) {
      let text1 = new NarrativeText(cueCount, "sen-");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 56) {
      let text1 = new NarrativeText(cueCount, "-sations");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    // There are clues in the hunch of my shoulders
    if (cueCount == 57) {
      let text1 = new NarrativeText(cueCount, "There");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 58) {
      let text1 = new NarrativeText(cueCount, "are");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 59) {
      let text1 = new NarrativeText(cueCount, "clues");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 60) {
      let text1 = new NarrativeText(cueCount, "in");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 61) {
      let text1 = new NarrativeText(cueCount, "the");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 62) {
      let text1 = new NarrativeText(cueCount, "hunch");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 63) {
      let text1 = new NarrativeText(cueCount, "of");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 64) {
      let text1 = new NarrativeText(cueCount, "my");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 65) {
      let text1 = new NarrativeText(cueCount, "shoul", 50, 211, "hold", "pink");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 66) {
      let text1 = new NarrativeText(cueCount, "ders", 350, 211, "hold", "pink");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    //There is wisdom in the sinking of my chest
    if (cueCount == 67) {
      let text1 = new NarrativeText(cueCount, "There");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 68) {
      let text1 = new NarrativeText(cueCount, "is");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 69) {
      let text1 = new NarrativeText(cueCount, "wisdom");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 70) {
      let text1 = new NarrativeText(cueCount, "in");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 71) {
      let text1 = new NarrativeText(cueCount, "the");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 72) {
      let text1 = new NarrativeText(cueCount, "sinking");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 73) {
      let text1 = new NarrativeText(cueCount, "of");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 74) {
      let text1 = new NarrativeText(cueCount, "my");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 75) {
      let text1 = new NarrativeText(cueCount, "che", 170, 211, "hold", "pink");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 76) {
      let text1 = new NarrativeText(cueCount, "st", 350, 211, "hold", "pink");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    //There is wisdom in the clench jaws
    if (cueCount == 77) {
      let text1 = new NarrativeText(cueCount, "There");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 78) {
      let text1 = new NarrativeText(cueCount, "are");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 79) {
      let text1 = new NarrativeText(cueCount, "signs");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 80) {
      let text1 = new NarrativeText(cueCount, "in");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 81) {
      let text1 = new NarrativeText(cueCount, "the");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 82) {
      let text1 = new NarrativeText(cueCount, "clench");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 83) {
      let text1 = new NarrativeText(cueCount, "of");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 84) {
      let text1 = new NarrativeText(cueCount, "my");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 85) {
      let text1 = new NarrativeText(cueCount, "ja", 188, 211, "hold", "pink");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 86) {
      let text1 = new NarrativeText(cueCount, "ws", 308, 211, "hold", "pink");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    //There is life in the ache of my heart
    if (cueCount == 87) {
      let text1 = new NarrativeText(cueCount, "There");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 88) {
      let text1 = new NarrativeText(cueCount, "is");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 89) {
      let text1 = new NarrativeText(cueCount, "life");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 90) {
      let text1 = new NarrativeText(cueCount, "in");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 91) {
      let text1 = new NarrativeText(cueCount, "the");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 92) {
      let text1 = new NarrativeText(cueCount, "ache");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 93) {
      let text1 = new NarrativeText(cueCount, "of");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 94) {
      let text1 = new NarrativeText(cueCount, "my");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 95) {
      let text1 = new NarrativeText(cueCount, "hea", 170, 211, "hold", "pink");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 96) {
      let text1 = new NarrativeText(cueCount, "rt", 350, 211, "hold", "pink");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    //What do I want
    if (cueCount == 97) {
      let text1 = new NarrativeText(
        cueCount,
        "What do I want?",
        null,
        null,
        "hold",
      );
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 98) {
      let text1 = new NarrativeText(
        cueCount,
        "In this body",
        null,
        171,
        "hold",
      );
      let text2 = new NarrativeText(cueCount, "of mine?", null, 250, "hold");
      text1.animate();
      text2.animate();
      sendBackgroundCueEvent(cueCount);
    }
    //I want to rupture
    if (cueCount == 99) {
      let text1 = new NarrativeText(cueCount, "I want to", null, 171, "hold");
      let text2 = new NarrativeText(
        cueCount,
        "rupture",
        null,
        250,
        "hold",
        "pink",
      );
      text1.animate();
      text2.animate();
      sendBackgroundCueEvent(cueCount);
    }
    //I want to repair
    if (cueCount == 100) {
      let text1 = new NarrativeText(cueCount, "I want to", null, 171, "hold");
      let text2 = new NarrativeText(
        cueCount,
        "repair",
        null,
        250,
        "hold",
        "pink",
      );
      text1.animate();
      text2.animate();
      sendBackgroundCueEvent(cueCount);
    }
    //I want to hurt
    if (cueCount == 101) {
      let text1 = new NarrativeText(cueCount, "I want to", null, 171, "hold");
      let text2 = new NarrativeText(
        cueCount,
        "hurt",
        null,
        250,
        "hold",
        "pink",
      );
      text1.animate();
      text2.animate();
      sendBackgroundCueEvent(cueCount);
    }
    //I want to heal
    if (cueCount == 102) {
      let text1 = new NarrativeText(cueCount, "I want to", null, 171, "hold");
      let text2 = new NarrativeText(
        cueCount,
        "heal",
        null,
        250,
        "hold",
        "pink",
      );
      text1.animate();
      text2.animate();
      sendBackgroundCueEvent(cueCount);
    }
    //I want to be won
    if (cueCount == 103) {
      let text1 = new NarrativeText(
        cueCount,
        "I want to be",
        null,
        171,
        "hold",
      );
      let text2 = new NarrativeText(cueCount, "won", null, 250, "hold", "pink");
      text1.animate();
      text2.animate();
      sendBackgroundCueEvent(cueCount);
    }
    //I want to be lost
    if (cueCount == 104) {
      let text1 = new NarrativeText(
        cueCount,
        "I want to be",
        null,
        171,
        "hold",
      );
      let text2 = new NarrativeText(
        cueCount,
        "be lost",
        null,
        250,
        "hold",
        "pink",
      );
      text1.animate();
      text2.animate();
      sendBackgroundCueEvent(cueCount);
    }
    //I want to be held
    if (cueCount == 105) {
      let text1 = new NarrativeText(
        cueCount,
        "I want to be",
        null,
        171,
        "hold",
      );
      let text2 = new NarrativeText(
        cueCount,
        "held",
        null,
        250,
        "hold",
        "pink",
      );
      text1.animate();
      text2.animate();
      sendBackgroundCueEvent(cueCount);
    }
    //I want to be released
    if (cueCount == 106) {
      let text1 = new NarrativeText(
        cueCount,
        "I want to be",
        null,
        171,
        "hold",
      );
      let text2 = new NarrativeText(
        cueCount,
        "released",
        null,
        250,
        "hold",
        "pink",
      );
      text1.animate();
      text2.animate();
      sendBackgroundCueEvent(cueCount);
    }
    // I wanted to become an artist
    if (cueCount == 107) {
      let text1 = new NarrativeText(cueCount, "I wanted to", null, 115, "hold");
      let text2 = new NarrativeText(cueCount, "become an", null, 198, "hold");
      let text3 = new NarrativeText(
        cueCount,
        "artist",
        null,
        281,
        "hold",
        "pink",
      );
      text1.animate();
      text2.animate();
      text3.animate();

      sendBackgroundCueEvent(cueCount);
    }
    // I wanted redemption
    if (cueCount == 108) {
      let text1 = new NarrativeText(cueCount, "I wanted", null, 171, "hold");
      let text2 = new NarrativeText(
        cueCount,
        "redemption",
        null,
        250,
        "hold",
        "pink",
      );
      text1.animate();
      text2.animate();

      sendBackgroundCueEvent(cueCount);
    }
    // To make something
    if (cueCount == 109) {
      let text1 = new NarrativeText(cueCount, "To make", null, 171, "hold");
      let text2 = new NarrativeText(
        cueCount,
        "something",
        null,
        250,
        "hold",
        "pink",
      );
      text1.animate();
      text2.animate();

      sendBackgroundCueEvent(cueCount);
    }
    // from nothing
    if (cueCount == 110) {
      let text1 = new NarrativeText(cueCount, "From", null, 171, "hold");
      let text2 = new NarrativeText(
        cueCount,
        "nothing",
        null,
        250,
        "hold",
        "pink",
      );
      text1.animate();
      text2.animate();

      sendBackgroundCueEvent(cueCount);
    }

    // Now I see I've been
    if (cueCount == 111) {
      let text1 = new NarrativeText(cueCount, "Now", 40, 21);
      text1.animate();

      sendBackgroundCueEvent(cueCount);
    }

    if (cueCount == 112) {
      let text1 = new NarrativeText(cueCount, "Now I", 40, 21);
      text1.animate();

      sendBackgroundCueEvent(cueCount);
    }

    if (cueCount == 113) {
      let text1 = new NarrativeText(cueCount, "Now I see", 40, 21);
      text1.animate();

      sendBackgroundCueEvent(cueCount);
    }

    if (cueCount == 114) {
      let text1 = new NarrativeText(cueCount, "Now I see I've", 40, 21);
      text1.animate();

      sendBackgroundCueEvent(cueCount);
    }

    if (cueCount == 115) {
      let text1 = new NarrativeText(cueCount, "Now I see I've", 40, 21);
      text1.animate();
      let text2 = new NarrativeText(cueCount, "been", 160, 97);
      text2.animate();

      sendBackgroundCueEvent(cueCount);
    }

    // The con sis tent and

    if (cueCount == 116) {
      let text1 = new NarrativeText(cueCount, "Now I see I've", 40, 21);
      text1.animate();
      let text2 = new NarrativeText(cueCount, "been the", 160, 97);
      text2.animate();
      sendBackgroundCueEvent(cueCount);
    }

    if (cueCount == 117) {
      let text1 = new NarrativeText(cueCount, "Now I see I've", 40, 21);
      text1.animate();
      let text2 = new NarrativeText(cueCount, "been the", 160, 97);
      text2.animate();
      let text3 = new NarrativeText(cueCount, "con", 40, 173);
      text3.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 118) {
      let text1 = new NarrativeText(cueCount, "Now I see I've", 40, 21);
      text1.animate();
      let text2 = new NarrativeText(cueCount, "been the", 160, 97);
      text2.animate();
      let text3 = new NarrativeText(cueCount, "consis", 40, 173);
      text3.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 119) {
      let text1 = new NarrativeText(cueCount, "Now I see I've", 40, 21);
      text1.animate();
      let text2 = new NarrativeText(cueCount, "been the", 160, 97);
      text2.animate();
      let text3 = new NarrativeText(cueCount, "consistent", 40, 173);
      text3.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 120) {
      let text1 = new NarrativeText(cueCount, "Now I see I've", 40, 21);
      text1.animate();
      let text2 = new NarrativeText(cueCount, "been the", 160, 97);
      text2.animate();
      let text3 = new NarrativeText(cueCount, "consistent and", 40, 173);
      text3.animate();
      sendBackgroundCueEvent(cueCount);
    }
    //re lia ble per son

    if (cueCount == 121) {
      let text1 = new NarrativeText(cueCount, "Now I see I've", 40, 21);
      text1.animate();
      let text2 = new NarrativeText(cueCount, "been the", 160, 97);
      text2.animate();
      let text3 = new NarrativeText(cueCount, "consistent and", 40, 173);
      text3.animate();
      let text4 = new NarrativeText(cueCount, "re", 160, 249);
      text4.animate();
      sendBackgroundCueEvent(cueCount);
    }

    if (cueCount == 122) {
      let text1 = new NarrativeText(cueCount, "Now I see I've", 40, 21);
      text1.animate();
      let text2 = new NarrativeText(cueCount, "been the", 160, 97);
      text2.animate();
      let text3 = new NarrativeText(cueCount, "consistent", 40, 173);
      text3.animate();
      let text4 = new NarrativeText(cueCount, "relia", 160, 249);
      text4.animate();
      sendBackgroundCueEvent(cueCount);
    }

    if (cueCount == 123) {
      let text1 = new NarrativeText(cueCount, "Now I see I've", 40, 21);
      text1.animate();
      let text2 = new NarrativeText(cueCount, "been the", 160, 97);
      text2.animate();
      let text3 = new NarrativeText(cueCount, "consistent and", 40, 173);
      text3.animate();
      let text4 = new NarrativeText(cueCount, "reliable", 160, 249);
      text4.animate();
      sendBackgroundCueEvent(cueCount);
    }

    if (cueCount == 124) {
      let text1 = new NarrativeText(cueCount, "Now I see I've", 40, 21);
      text1.animate();
      let text2 = new NarrativeText(cueCount, "been the", 160, 97);
      text2.animate();
      let text3 = new NarrativeText(cueCount, "consistent and", 40, 173);
      text3.animate();
      let text4 = new NarrativeText(cueCount, "reliable", 160, 249);
      text4.animate();
      let text5 = new NarrativeText(cueCount, "per", 60, 325);
      text5.animate();
      sendBackgroundCueEvent(cueCount);
    }

    if (cueCount == 125) {
      let text1 = new NarrativeText(cueCount, "Now I see I've", 40, 21);
      text1.animate();
      let text2 = new NarrativeText(cueCount, "been the", 160, 97);
      text2.animate();
      let text3 = new NarrativeText(cueCount, "consistent and", 40, 173);
      text3.animate();
      let text4 = new NarrativeText(cueCount, "reliable", 160, 249);
      text4.animate();
      let text5 = new NarrativeText(cueCount, "person", 60, 325);
      text5.animate();
      sendBackgroundCueEvent(cueCount);
    }

    // I've nee ded all along

    if (cueCount == 126) {
      let text1 = new NarrativeText(cueCount, "Now I see I've", 40, 21);
      text1.animate();
      let text2 = new NarrativeText(cueCount, "been the", 160, 97);
      text2.animate();
      let text3 = new NarrativeText(cueCount, "consistent and", 40, 173);
      text3.animate();
      let text4 = new NarrativeText(cueCount, "reliable", 160, 249);
      text4.animate();
      let text5 = new NarrativeText(cueCount, "person I've", 100, 325);
      text5.animate();
      sendBackgroundCueEvent(cueCount);
    }

    if (cueCount == 127) {
      let text1 = new NarrativeText(cueCount, "Now I see I've", 40, 21);
      text1.animate();
      let text2 = new NarrativeText(cueCount, "been the", 160, 97);
      text2.animate();
      let text3 = new NarrativeText(cueCount, "consistent and", 40, 173);
      text3.animate();
      let text4 = new NarrativeText(cueCount, "reliable", 160, 249);
      text4.animate();
      let text5 = new NarrativeText(cueCount, "person I've", 100, 325);
      text5.animate();
      let text6 = new NarrativeText(cueCount, "need", 0, 401);
      text6.animate();
      sendBackgroundCueEvent(cueCount);
    }

    if (cueCount == 128) {
      let text1 = new NarrativeText(cueCount, "Now I see I've", 40, 21);
      text1.animate();
      let text2 = new NarrativeText(cueCount, "been the", 160, 97);
      text2.animate();
      let text3 = new NarrativeText(cueCount, "consistent and", 40, 173);
      text3.animate();
      let text4 = new NarrativeText(cueCount, "reliable", 160, 249);
      text4.animate();
      let text5 = new NarrativeText(cueCount, "person I've", 100, 325);
      text5.animate();
      let text6 = new NarrativeText(cueCount, "needed", 0, 401);
      text6.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 129) {
      let text1 = new NarrativeText(cueCount, "Now I see I've", 40, 21);
      text1.animate();
      let text2 = new NarrativeText(cueCount, "been the", 160, 97);
      text2.animate();
      let text3 = new NarrativeText(cueCount, "consistent and", 40, 173);
      text3.animate();
      let text4 = new NarrativeText(cueCount, "reliable", 160, 249);
      text4.animate();
      let text5 = new NarrativeText(cueCount, "person I've", 100, 325);
      text5.animate();
      let text6 = new NarrativeText(cueCount, "needed all", 0, 401);
      text6.animate();
      sendBackgroundCueEvent(cueCount);
    }

    if (cueCount == 130) {
      let text1 = new NarrativeText(cueCount, "Now I see I've", 40, 21);
      text1.animate();
      let text2 = new NarrativeText(cueCount, "been the", 160, 97);
      text2.animate();
      let text3 = new NarrativeText(cueCount, "consistent and", 40, 173);
      text3.animate();
      let text4 = new NarrativeText(cueCount, "reliable", 160, 249);
      text4.animate();
      let text5 = new NarrativeText(cueCount, "person I've", 100, 325);
      text5.animate();
      let text6 = new NarrativeText(cueCount, "needed all along", 0, 401);
      text6.animate();
      sendBackgroundCueEvent(cueCount);
    }

    // I create
    if (cueCount == 131) {
      let text1 = new NarrativeText(cueCount, "I create to", null, 171, "hold");

      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }

    // to see
    if (cueCount == 132) {
      let text1 = new NarrativeText(cueCount, "see", null, 250, "hold", "pink");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }

    // I create
    if (cueCount == 133) {
      let text1 = new NarrativeText(cueCount, "I create to", null, 171, "hold");

      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }

    //to be seen
    if (cueCount == 134) {
      let text1 = new NarrativeText(
        cueCount,
        "be seen",
        null,
        250,
        "hold",
        "pink",
      );

      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }

    // Can you see me?

    if (cueCount == 135) {
      let text1 = new NarrativeText(cueCount, "Can", 180);
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 136) {
      let text1 = new NarrativeText(cueCount, "Can you", 180);
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 137) {
      let text1 = new NarrativeText(cueCount, "see", 98, null, null, "pink");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 138) {
      let text1 = new NarrativeText(cueCount, "me?", 338, null, null, "pink");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }

    // Can you see you?

    if (cueCount == 139) {
      let text1 = new NarrativeText(cueCount, "Can", 180);
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 140) {
      let text1 = new NarrativeText(cueCount, "Can you", 180);
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 141) {
      let text1 = new NarrativeText(cueCount, "see", 68, null, null, "pink");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 142) {
      let text1 = new NarrativeText(cueCount, "you?", 320, null, null, "pink");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }

    // Can you reach me?

    if (cueCount == 143) {
      let text1 = new NarrativeText(cueCount, "Can", 180);
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 144) {
      let text1 = new NarrativeText(cueCount, "Can you", 180);
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 145) {
      let text1 = new NarrativeText(cueCount, "reach", 38, null, null, "pink");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 146) {
      let text1 = new NarrativeText(cueCount, "me?", 398, null, null, "pink");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }

    // Can you reach you?

    if (cueCount == 147) {
      let text1 = new NarrativeText(cueCount, "Can", 180);
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 148) {
      let text1 = new NarrativeText(cueCount, "Can you", 180);
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 149) {
      let text1 = new NarrativeText(cueCount, "reach", 20, null, null, "pink");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 150) {
      let text1 = new NarrativeText(cueCount, "you?", 380, null, null, "pink");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    // Can you feel me?

    if (cueCount == 151) {
      let text1 = new NarrativeText(cueCount, "Can", 180);
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 152) {
      let text1 = new NarrativeText(cueCount, "Can you", 180);

      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 153) {
      let text1 = new NarrativeText(cueCount, "feel", 68, null, null, "pink");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 154) {
      let text1 = new NarrativeText(cueCount, "me?", 368, null, null, "pink");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }

    // Can you feel you?

    if (cueCount == 155) {
      let text1 = new NarrativeText(cueCount, "Can", 180);
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 156) {
      let text1 = new NarrativeText(cueCount, "Can you", 180);
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 157) {
      let text1 = new NarrativeText(cueCount, "feel", 50, null, null, "pink");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 158) {
      let text1 = new NarrativeText(cueCount, "you?", 350, null, null, "pink");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }

    // Can you know ne?

    if (cueCount == 159) {
      let text1 = new NarrativeText(cueCount, "Can", 180);
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 160) {
      let text1 = new NarrativeText(cueCount, "Can you", 180);
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 161) {
      let text1 = new NarrativeText(cueCount, "know", 56, null, null, "pink");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 162) {
      let text1 = new NarrativeText(cueCount, "me?", 379, null, null, "pink");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }

    // Can you feel you?
    if (cueCount == 163) {
      let text1 = new NarrativeText(cueCount, "Can", 180);
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 164) {
      let text1 = new NarrativeText(cueCount, "Can you", 180);
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 165) {
      let text1 = new NarrativeText(cueCount, "know", 38, null, null, "pink");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 166) {
      let text1 = new NarrativeText(cueCount, "you?", 362, null, null, "pink");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }

    // Will you run?
    if (cueCount == 167) {
      let text1 = new NarrativeText(cueCount, "Will", 180);
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 168) {
      let text1 = new NarrativeText(cueCount, "Will you", 180);
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 169) {
      let text1 = new NarrativeText(cueCount, "run", 200, null, "hold", "pink");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 170) {
      let text1 = new NarrativeText(cueCount, "?", 380, null, "hold", "pink");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    // Will you stay?
    if (cueCount == 171) {
      let text1 = new NarrativeText(cueCount, "Will", 180);
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 172) {
      let text1 = new NarrativeText(cueCount, "Will you", 180);
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 173) {
      let text1 = new NarrativeText(
        cueCount,
        "stay",
        170,
        null,
        "hold",
        "pink",
      );
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 174) {
      let text1 = new NarrativeText(cueCount, "?", 410, null, "hold", "pink");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    // Will you stop?
    if (cueCount == 175) {
      let text1 = new NarrativeText(cueCount, "Will", 180);
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 176) {
      let text1 = new NarrativeText(cueCount, "Will you", 180);
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 177) {
      let text1 = new NarrativeText(
        cueCount,
        "stop",
        170,
        null,
        "hold",
        "pink",
      );
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 178) {
      let text1 = new NarrativeText(cueCount, "?", 410, null, "hold", "pink");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    // Will you play?
    if (cueCount == 179) {
      let text1 = new NarrativeText(cueCount, "Will", 180);
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 180) {
      let text1 = new NarrativeText(cueCount, "Will you", 180);
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 181) {
      let text1 = new NarrativeText(
        cueCount,
        "play",
        170,
        null,
        "hold",
        "pink",
      );
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 182) {
      let text1 = new NarrativeText(cueCount, "?", 410, null, "hold", "pink");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    // Will you fight?
    if (cueCount == 183) {
      let text1 = new NarrativeText(cueCount, "Will", 180);
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 184) {
      let text1 = new NarrativeText(cueCount, "Will you", 180);
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 185) {
      let text1 = new NarrativeText(
        cueCount,
        "fight",
        140,
        null,
        "hold",
        "pink",
      );
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 186) {
      let text1 = new NarrativeText(cueCount, "?", 440, null, "hold", "pink");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }

    // Will you flee?
    if (cueCount == 187) {
      let text1 = new NarrativeText(cueCount, "Will", 180);
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 188) {
      let text1 = new NarrativeText(cueCount, "Will you", 180);
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 189) {
      let text1 = new NarrativeText(
        cueCount,
        "flee",
        170,
        null,
        "hold",
        "pink",
      );
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 190) {
      let text1 = new NarrativeText(cueCount, "?", 410, null, "hold", "pink");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    // Will you fawn?
    if (cueCount == 191) {
      let text1 = new NarrativeText(cueCount, "Will", 180);
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 192) {
      let text1 = new NarrativeText(cueCount, "Will you", 180);
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 193) {
      let text1 = new NarrativeText(
        cueCount,
        "fawn",
        158,
        null,
        "hold",
        "pink",
      );
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 194) {
      let text1 = new NarrativeText(cueCount, "?", 422, null, "hold", "pink");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    // Will you freeze?
    if (cueCount == 195) {
      let text1 = new NarrativeText(cueCount, "Will", 180);
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 196) {
      let text1 = new NarrativeText(cueCount, "Will you", 180);
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 197) {
      let text1 = new NarrativeText(
        cueCount,
        "freeze",
        110,
        null,
        "hold",
        "pink",
      );
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 198) {
      let text1 = new NarrativeText(cueCount, "?", 470, null, "hold", "pink");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }

    // Lose me
    if (cueCount == 199) {
      let text1 = new NarrativeText(cueCount, "Lose", null, 175, null, "pink");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 200) {
      let text1 = new NarrativeText(
        cueCount,
        "Lose",
        null,
        175,
        "hold",
        "pink",
      );
      text1.animate();
      let text2 = new NarrativeText(cueCount, "me", null, 265, "hold");
      text2.animate();
      sendBackgroundCueEvent(cueCount);
    }

    // Win me
    if (cueCount == 201) {
      let text1 = new NarrativeText(cueCount, "Win", null, 175, null, "pink");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 202) {
      let text1 = new NarrativeText(cueCount, "Win", null, 175, "hold", "pink");
      text1.animate();
      let text2 = new NarrativeText(cueCount, "me", null, 265, "hold");
      text2.animate();
      sendBackgroundCueEvent(cueCount);
    }

    // Hurt me
    if (cueCount == 203) {
      let text1 = new NarrativeText(cueCount, "Hurt", null, 175, null, "pink");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 204) {
      let text1 = new NarrativeText(
        cueCount,
        "Hurt",
        null,
        175,
        "hold",
        "pink",
      );
      text1.animate();
      let text2 = new NarrativeText(cueCount, "me", null, 265, "hold");
      text2.animate();
      sendBackgroundCueEvent(cueCount);
    }

    // Heal me
    if (cueCount == 205) {
      let text1 = new NarrativeText(cueCount, "Heal", null, 175, null, "pink");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 206) {
      let text1 = new NarrativeText(
        cueCount,
        "Heal",
        null,
        175,
        "hold",
        "pink",
      );
      text1.animate();
      let text2 = new NarrativeText(cueCount, "me", null, 265, "hold");
      text2.animate();
      sendBackgroundCueEvent(cueCount);
    }

    // Love me
    if (cueCount == 207) {
      let text1 = new NarrativeText(cueCount, "Lo", 200, 175, null, "pink");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 208) {
      let text1 = new NarrativeText(cueCount, "ve", 320, 175, null, "pink");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 209) {
      let text1 = new NarrativeText(cueCount, "Lo", 200, 175, "hold", "pink");
      text1.animate();
      let text2 = new NarrativeText(cueCount, "m", 280, 265, "hold");
      text2.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 210) {
      let text1 = new NarrativeText(cueCount, "ve", 320, 175, "hold", "pink");
      text1.animate();
      let text2 = new NarrativeText(cueCount, "e", 320, 265, "hold");
      text2.animate();
      sendBackgroundCueEvent(cueCount);
    }

    // Fear me
    if (cueCount == 211) {
      let text1 = new NarrativeText(cueCount, "Fe", 200, 175, null, "pink");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 212) {
      let text1 = new NarrativeText(cueCount, "ar", 320, 175, null, "pink");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 213) {
      let text1 = new NarrativeText(cueCount, "Fe", 200, 175, "hold", "pink");
      text1.animate();
      let text2 = new NarrativeText(cueCount, "m", 280, 265, "hold");
      text2.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 214) {
      let text1 = new NarrativeText(cueCount, "ar", 320, 175, "hold", "pink");
      text1.animate();
      let text2 = new NarrativeText(cueCount, "e", 320, 265, "hold");
      text2.animate();
      sendBackgroundCueEvent(cueCount);
    }

    // Hold me
    if (cueCount == 215) {
      let text1 = new NarrativeText(cueCount, "Ho", 200, 175, null, "pink");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 216) {
      let text1 = new NarrativeText(cueCount, "ld", 320, 175, null, "pink");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 217) {
      let text1 = new NarrativeText(cueCount, "Ho", 200, 175, "hold", "pink");
      text1.animate();
      let text2 = new NarrativeText(cueCount, "m", 280, 265, "hold");
      text2.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 218) {
      let text1 = new NarrativeText(cueCount, "ld", 320, 175, "hold", "pink");
      text1.animate();
      let text2 = new NarrativeText(cueCount, "e", 320, 265, "hold");
      text2.animate();
      sendBackgroundCueEvent(cueCount);
    }

    // Release me
    if (cueCount == 219) {
      let text1 = new NarrativeText(cueCount, "Re", 110, 175, null, "pink");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 220) {
      let text1 = new NarrativeText(cueCount, "lease", 230, 175, null, "pink");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 221) {
      let text1 = new NarrativeText(cueCount, "Re", 110, 175, "hold", "pink");
      text1.animate();
      sendBackgroundCueEvent(cueCount);
      let text2 = new NarrativeText(cueCount, "m", 280, 265, "hold");
      text2.animate();
      sendBackgroundCueEvent(cueCount);
    }
    if (cueCount == 222) {
      let text1 = new NarrativeText(
        cueCount,
        "lease",
        230,
        175,
        "hold",
        "pink",
      );
      text1.animate();
      let text2 = new NarrativeText(cueCount, "e", 320, 265, "hold");
      text2.animate();
    }
  }
};

new p5(experimentalScene, "experimental-canvas-container");
