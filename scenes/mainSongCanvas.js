var mainScene = function (p) {
  let mainSongCanvas;
  let isCurrentScene = false;

  let twoPlayer = true;

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
  let hitPos = [
    { x: 16, y: 56 },
    { x: 368, y: 56 },
  ];

  let getArrow_xPos = function (direction, playerNum) {
    if (direction == "left") {
      return hitPos[playerNum].x;
    }
    if (direction == "down") {
      return hitPos[playerNum].x + arrowWidth;
    }
    if (direction == "up") {
      return hitPos[playerNum].x + arrowWidth * 2;
    }
    if (direction == "right") {
      return hitPos[playerNum].x + arrowWidth * 3;
    }
  };

  let hitArrowSpritesheet;
  let arrowSpritesheet;
  let rainbowArrowSpritesheet;

  // save only one image obj and clear it
  // let newImgObj;

  // let arrowImgs;
  // let arrowImgsOriginal;

  let scoreBackgroundSpritesheetImg;
  let scoreBackgroundImgs = [];

  let eggBombImg;

  let fawningAnimation;

  //relevantNotes stores an array of note objects
  // UPDATE: relevant notes is by p1 or p2
  // let relevantNotes = [];
  let relevantNotesList = [[], []];
  // let hitMargin = 100;

  let measureDataList = [];
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

  let hitArrowObjsList = [];

  let feedbackObjsList = [];

  let comboObjsList = [];

  let scoreDataList = [];
  // let scoreData;

  let healthBarList = [];

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

  //Mark false for install
  let endSongIfFailed = false;

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
    scoreBackgroundSpritesheetImg = p.loadImage(
      "assets/scoreBackgroundSpritesheet.png",
    );

    attackSpritesheet = p.loadImage("assets/attackSpritesheet.png");
  };

  p.setup = function () {
    // put setup code here
    p.frameRate(frameRate);
    p.pixelDensity(3);
    calculateCanvasDimensions(p);
    mainSongCanvas = p.createCanvas(canvasWidth, canvasHeight).elt;
    mainSongCanvas.classList.add("gameCanvas");
    mainSongCanvas.classList.add("mainSongCanvas");
    mainSongCanvas.id = "mainSongCanvas";

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

    hitArrowObjsList.push({
      left: new HitArrow("left", hitPos[0].x, hitPos[0].y),
      down: new HitArrow("down", hitPos[0].x + arrowWidth, hitPos[0].y),
      up: new HitArrow("up", hitPos[0].x + arrowWidth * 2, hitPos[0].y),
      right: new HitArrow("right", hitPos[0].x + arrowWidth * 3, hitPos[0].y),
    });
    if (twoPlayer) {
      hitArrowObjsList.push({
        left: new HitArrow("left", hitPos[1].x, hitPos[1].y),
        down: new HitArrow("down", hitPos[1].x + arrowWidth, hitPos[1].y),
        up: new HitArrow("up", hitPos[1].x + arrowWidth * 2, hitPos[1].y),
        right: new HitArrow("right", hitPos[1].x + arrowWidth * 3, hitPos[1].y),
      });
    }

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

    //Initialize score background imgs
    scoreBackgroundImgs[0] = scoreBackgroundSpritesheetImg.get(0, 0, 188, 44);
    scoreBackgroundImgs[1] = scoreBackgroundSpritesheetImg.get(0, 44, 188, 44);

    feedbackObjsList.push(new FeedbackText(0));
    if (twoPlayer) {
      feedbackObjsList.push(new FeedbackText(1));
    }

    comboObjsList.push(new ComboText(0));
    if (twoPlayer) {
      comboObjsList.push(new ComboText(1));
    }

    scoreDataList.push(new Score(songId, 0, storyModeDifficulty));
    if (twoPlayer) {
      scoreDataList.push(new Score(songId, 1, "Hard"));
    }

    healthBarList.push(new HealthBar(0));
    if (twoPlayer) {
      healthBarList.push(new HealthBar(1));
    }

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
    setupNavigation(mainSongCanvas);
  };

  p.draw = function () {
    // p.background("pink");
    p.clear();

    fawningAnimation.display();

    hitArrowObjsList.forEach(function (hitArrowObjs) {
      Object.values(hitArrowObjs).forEach(function (arrowObj) {
        arrowObj.displayGlow();
      });
    });

    hitArrowObjsList.forEach(function (hitArrowObjs) {
      Object.values(hitArrowObjs).forEach(function (arrowObj) {
        arrowObj.display();
      });
    });

    if (startDrawingArrows) {
      drawArrows(0);
      if (twoPlayer) {
        drawArrows(1);
      }
    }

    feedbackObjsList.forEach(function (feedbackObj) {
      feedbackObj.display();
    });
    comboObjsList.forEach(function (comboObj) {
      comboObj.display();
    });

    healthBarList.forEach(function (healthBar) {
      healthBar.display();
    });

    scoreDataList.forEach(function (scoreData) {
      scoreData.displayTotalScore();
    });
  };

  function setupNavigation(thisCanvas) {
    p.noLoop();
    thisCanvas.addEventListener("showScene", (e) => {
      songId = e.detail.songId;
      //Load video

      songVideo = document.querySelector("#songVideo");
      songVideo.src = songList[songId].videoUrl;
      songVideo.load();
      songVideo.loop = false;
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

      // Test revelatoin
      // handleSongEnd(true);
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
        let measuresInBatch_p1 = measureDataList[0].slice(
          currentBatchStartMeasure,
          currentBatchStartMeasure + batchSize,
        );
        measuresInBatch_p1.forEach(function (measure) {
          //If measure has notes, add contents into relevantNotes
          if (measure) {
            measure.forEach(function (note) {
              let newNote = new Note(note, 0);
              relevantNotesList[0].push(newNote);
            });
          }
        });
        //Do this for p2
        if (twoPlayer) {
          let measuresInBatch_p2 = measureDataList[1].slice(
            currentBatchStartMeasure,
            currentBatchStartMeasure + batchSize,
          );
          measuresInBatch_p2.forEach(function (measure) {
            //If measure has notes, add contents into relevantNotes
            if (measure) {
              measure.forEach(function (note) {
                let newNote = new Note(note, 1);
                relevantNotesList[1].push(newNote);
              });
            }
          });
        }
      }
      //Are we ALMOST at a new batch? Update the batch data!
      else if (currentMeasure % batchSize == batchSize - 1) {
        // console.log("updating batch data");
        //Discard old ones BEFORE 1 measure ago....
        let remainingNotes = relevantNotesList[0].filter(function (note) {
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
        relevantNotesList[0] = remainingNotes;

        if (twoPlayer) {
          let remainingNotes = relevantNotesList[1].filter(function (note) {
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
          relevantNotesList[1] = remainingNotes;
        }
        //Load in next batch notes
        currentBatchStartMeasure += batchSize;
        let measuresInBatch_p1 = measureDataList[0].slice(
          currentBatchStartMeasure,
          currentBatchStartMeasure + batchSize,
        );
        measuresInBatch_p1.forEach(function (measure) {
          if (measure) {
            //If measure has notes, add contents into relevantNotes
            measure.forEach(function (note) {
              let newNote = new Note(note, 0);
              relevantNotesList[0].push(newNote);
            });
          }
        });
        if (twoPlayer) {
          let measuresInBatch_p2 = measureDataList[1].slice(
            currentBatchStartMeasure,
            currentBatchStartMeasure + batchSize,
          );
          measuresInBatch_p2.forEach(function (measure) {
            if (measure) {
              //If measure has notes, add contents into relevantNotes
              measure.forEach(function (note) {
                let newNote = new Note(note, 1);
                relevantNotesList[1].push(newNote);
              });
            }
          });
        }
      }
    }

    //Handle case for song end
    if (thisMeasure > measureDataList[0].length) {
      let win;
      scoreDataList.forEach(function (scoreData) {
        win = scoreData.ranking != "E" ? true : false;
      });
      // Comment for install
      // handleSongEnd(win);
      handleSongEnd(true);
    }
  }

  function getScoreDataToSend() {
    let scoreDataToSend = [];
    scoreDataToSend.push(scoreDataList[0].getScoreInfo());
    if (twoPlayer) {
      scoreDataToSend.push(scoreDataList[0].getScoreInfo());
    }
    return scoreDataToSend;
  }

  function handleSongEnd(win) {
    console.log("song ended!!");
    Tone.Transport.stop();
    thisSongPlayer.stop();
    songVideo.pause();

    //Update score in global data
    let scoreDataToSend = getScoreDataToSend();
    songList[songId].scores.push(scoreDataToSend);

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
        let scoreDataToSend = getScoreDataToSend();
        let showRevelationSceneEvent = new CustomEvent("showScene", {
          detail: {
            songIndex: songId,
            scoreData: scoreDataToSend,
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
        let scoreDataToSend = getScoreDataToSend();
        let showScoreSceneEvent = new CustomEvent("showScene", {
          detail: {
            scoreData: scoreDataToSend,
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
    // measureData = thisSongData.measureData;

    // Player 1:
    measureDataList[0] = thisSongData.measureData;

    // Player 2: Hard for now
    let thisSongData_p2 = JSON.parse(songList[songId].songData.hard);
    measureDataList[1] = thisSongData_p2.measureData;

    if (songList[songId].bpmChanges != null) {
      hasBpmChanges = true;
      bpmChanges = songList[songId].bpmChanges;
      songBpm = songList[songId].bpmChanges[0].bpm;
      currentBpmStartBeat = songList[songId].bpmChanges[0].beat;
    } else {
      songBpm = thisSongData.bpm;
    }

    songDelay = thisSongData.delay;
    scoreDataList[0].songId = songId;
    scoreDataList[0].totalNotes = thisSongData.totalNotes;
    scoreDataList[0].calculateBaseNoteScore();
    if (twoPlayer) {
      scoreDataList[1].songId = songId;
      scoreDataList[1].totalNotes = thisSongData.totalNotes;
      scoreDataList[1].calculateBaseNoteScore();
    }
    secondsPerBeat = 1 / (songBpm / 60);
    setHitMarginTime();

    //For negative songDelays, start song before notes
    if (songDelay < 0) {
      setTimeout(function () {
        updateNotesInterval = setInterval(function () {
          updateNotes();
          updateArrowRainbow();
        }, 30);

        startDrawingArrows = true;
        //Start a tone.js clock to keep time
        Tone.Transport.start();
      }, -songDelay * 1000);
    } else {
      // For positive songDelays, startNotes before song
      updateNotesInterval = setInterval(function () {
        updateNotes();
        updateArrowRainbow();
      }, 30);

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
    relevantNotesList[0].forEach(function (note) {
      if (
        isPassedHitBoundary(note.currentY) &&
        !note.isHit &&
        !note.hasPassedOver
      ) {
        note.hasPassedOver = true;
        updateMiss("miss", note);
      }
    });
    if (twoPlayer) {
      relevantNotesList[1].forEach(function (note) {
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
  }
  function isWithinHitMargin(yPos) {
    let hitArrowObjs = hitArrowObjsList[0];
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
    let hitArrowObjs = hitArrowObjsList[0];
    return yPos <= hitArrowObjs["left"].yPos;
  }

  function drawArrows(playerNum) {
    let hitArrowObjs = hitArrowObjsList[playerNum];
    relevantNotesList[playerNum].forEach(function (note) {
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
  function updateMiss(score, note) {
    let playerNum = note.playerNum;
    feedbackObjsList[playerNum].updateState(score);
    comboObjsList[playerNum].resetCombo();
    scoreDataList[playerNum].update("miss");
  }
  function updateHit(score, note) {
    let playerNum = note.playerNum;
    //Is this the first time hitting this note?
    if (!note.isHit && note.noteType != "mine") {
      comboObjsList[playerNum].incrementCombo();
      note.isHit = true;
      let scoreScale = 1;
      if (score === "ok") {
        feedbackObjsList[playerNum].updateState("ok", true);
      } else if (score === "great") {
        feedbackObjsList[playerNum].updateState("great", true);
      } else if (score === "perfect") {
        feedbackObjsList[playerNum].updateState("perfect", true);
      }
      scoreDataList[playerNum].update(score);

      // Trigger fawning animation
      if (note.isFawningHit) {
        fawningAnimation.startAnimation(note.direction, note.isFawningNight);
      }
    } else if (!note.isHit && note.noteType == "mine") {
      //Successfully hitting mines should set off the bomb;
      note.isHit = true;
      feedbackObjsList[playerNum].updateState("mine", true);
      scoreDataList[playerNum].mineHit();
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
    let hitSuccessful = false;
    let playerNum = note.playerNum;
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
        feedbackObjsList[playerNum].updateState("early");
        note.isHolding = false;
        note.completedHold = false;

        console.log("LIFT IS TOO EARLY");
      }
    }
    // console.log("assess hit: " + hitSuccessful);
    return hitSuccessful;
  }

  // Iterates through the list of relative notes....

  // If you have previously hit a note with the SAME direction, don't assess hit for notes of that direction later
  function assessHit(direction, hitType, playerNum) {
    let anyNoteHit = false;

    let thisDirectionHit = false;

    relevantNotesList[playerNum].forEach(function (note) {
      if (Tone.Transport.state == "started") {
        if (!thisDirectionHit) {
          if (assessHitForNoteByTime(direction, hitType, note)) {
            thisDirectionHit = true;
            anyNoteHit = true;
          }
        }
      } else if (
        Tone.Transport.state == "paused" &&
        isPassedHitBoundary(note.currentY)
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
    relevantNotesList = [[], []];
    currentBatchStartMeasure = 0;
    currentMeasure = -1;
    currentBeat = 0;
    pixelsElapsed = 0;
    startDrawingArrows = false;
    // clearInterval(updateArrowsInterval);
    clearInterval(updateNotesInterval);

    measureDataList.forEach(function (measureData) {
      measureData = null;
    });

    songBpm = null;
    songDelay = null;
    secondsPerBeat = null;
    t = 0;
    stops = null;

    scoreDataList.forEach(function (scoreData) {
      scoreData = new Score();
    });

    healthBarList.forEach(function (healthBar) {
      healthBar.reset();
    });
    songVideo = null;
    videoLoadedFirstTime = false;
    hasBpmChanges = false;
    bpmChanges = [];
    hasStops = false;
    comboObjsList.forEach(function (comboObj) {
      comboObj = new ComboText();
    });
    Tone.Transport.cancel();
  }

  function padOrKeypress(direction, playerNum) {
    if (isCurrentScene) {
      let hitSuccessful = false;
      // if (Tone.Transport.state == "started") {
      hitSuccessful = assessHit(direction, "press", playerNum);
      // }
      hitArrowObjsList[playerNum][direction].press(hitSuccessful);
    }
  }
  function padOrKeyrelease(direction, playerNum) {
    if (isCurrentScene) {
      hitArrowObjsList[playerNum][direction].release();
      assessHit(direction, "lift", playerNum);
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
    //Detect p1 for now
    padOrKeypress(direction, 0);
  });
  window.addEventListener("padRelease", function (e) {
    let direction = e.detail.direction;
    //Detect p1 for now
    padOrKeyrelease(direction, 0);
  });

  window.addEventListener("keydown", function (e) {
    e.preventDefault();

    console.log(e.code);
    //Ignore repeated keydown
    if (e.repeat) {
      return;
    }

    if (twoPlayer) {
      // 1P uses wasd
      if (e.code == "KeyA") {
        padOrKeypress("left", 0);
      }
      if (e.code == "KeyD") {
        padOrKeypress("right", 0);
      }
      if (e.code == "KeyW") {
        padOrKeypress("up", 0);
      }
      if (e.code == "KeyS") {
        padOrKeypress("down", 0);
      }
      // 2P uses arrow keys
      if (e.code == "ArrowLeft") {
        padOrKeypress("left", 1);
      }
      if (e.code == "ArrowRight") {
        padOrKeypress("right", 1);
      }
      if (e.code == "ArrowUp") {
        padOrKeypress("up", 1);
      }
      if (e.code == "ArrowDown") {
        padOrKeypress("down", 1);
      }
    } else {
      // 1P uses arrow keys
      if (e.code == "ArrowLeft") {
        padOrKeypress("left", 0);
      }
      if (e.code == "ArrowRight") {
        padOrKeypress("right", 0);
      }
      if (e.code == "ArrowUp") {
        padOrKeypress("up", 0);
      }
      if (e.code == "ArrowDown") {
        padOrKeypress("down", 0);
      }
    }
  });

  window.addEventListener("keyup", function (e) {
    if (twoPlayer) {
      // 1P uses wasd
      if (e.code == "KeyA") {
        padOrKeyrelease("left", 0);
      }
      if (e.code == "KeyD") {
        padOrKeyrelease("right", 0);
      }
      if (e.code == "KeyW") {
        padOrKeyrelease("up", 0);
      }
      if (e.code == "KeyS") {
        padOrKeyrelease("down", 0);
      }
      // 2P uses arrow keys
      if (e.code == "ArrowLeft") {
        padOrKeyrelease("left", 1);
      }
      if (e.code == "ArrowRight") {
        padOrKeyrelease("right", 1);
      }
      if (e.code == "ArrowUp") {
        padOrKeyrelease("up", 1);
      }
      if (e.code == "ArrowDown") {
        padOrKeyrelease("down", 1);
      }
    } else {
      // 1P uses arrow keys
      if (e.code == "ArrowLeft") {
        padOrKeyrelease("left", 0);
      }
      if (e.code == "ArrowRight") {
        padOrKeyrelease("right", 0);
      }
      if (e.code == "ArrowUp") {
        padOrKeyrelease("up", 0);
      }
      if (e.code == "ArrowDown") {
        padOrKeyrelease("down", 0);
      }
    }
  });

  // window.addEventListener("keydown", function (e) {
  //   e.preventDefault();
  //   //Ignore repeated keydown
  //   if (e.repeat) {
  //     return;
  //   }
  //   if (
  //     e.code == "ArrowLeft" ||
  //     e.code == "ArrowRight" ||
  //     e.code == "ArrowUp" ||
  //     e.code == "ArrowDown"
  //   ) {
  //     if (e.code == "ArrowLeft") {
  //       padOrKeypress("left");
  //     }
  //     if (e.code == "ArrowRight") {
  //       padOrKeypress("right");
  //     }
  //     if (e.code == "ArrowUp") {
  //       padOrKeypress("up");
  //     }
  //     if (e.code == "ArrowDown") {
  //       padOrKeypress("down");
  //     }
  //   }
  // });

  // window.addEventListener("keyup", function (e) {
  //   if (
  //     e.code == "ArrowLeft" ||
  //     e.code == "ArrowRight" ||
  //     e.code == "ArrowUp" ||
  //     e.code == "ArrowDown"
  //   ) {
  //     if (e.code == "ArrowLeft") {
  //       padOrKeyrelease("left");
  //     }
  //     if (e.code == "ArrowRight") {
  //       padOrKeyrelease("right");
  //     }
  //     if (e.code == "ArrowUp") {
  //       padOrKeyrelease("up");
  //     }
  //     if (e.code == "ArrowDown") {
  //       padOrKeyrelease("down");
  //     }
  //   }
  // });

  // track.addEventListener("timeupdate", updateNotes);

  ////////////////////////////////////////////
  // -------------- SCENES --------------- //
  //////////////////////////////////////////

  // CLASSES

  class Note {
    constructor(noteData, playerNum) {
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
      this.playerNum = playerNum;

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
      let hitArrowObjs = hitArrowObjsList[this.playerNum];
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
          getArrow_xPos(this.direction, this.playerNum),
          // arrow_xPos[this.direction],
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
            getArrow_xPos(this.direction, this.playerNum),
            // arrow_xPos[this.direction],
            hitArrowObjs["left"].yPos + 32,
            rectangleHeight,
          );
          // Draw arrow at end of rectangle
          drawArrowPiece(
            holdEndImgs[this.direction].hitTrue,
            getArrow_xPos(this.direction, this.playerNum),
            // arrow_xPos[this.direction],
            hitArrowObjs["left"].yPos + rectangleHeight,
          );
          // Draw arrow at hit pos
          drawArrowPiece(
            arrowImgs[this.direction],
            getArrow_xPos(this.direction, this.playerNum),
            // arrow_xPos[this.direction],
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
            // arrow_xPos[this.direction],
            getArrow_xPos(this.direction, this.playerNum),
            yPosReleased + 32,
            rectangleHeight,
          );
          // Draw arrow at end of rectangle
          drawArrowPiece(
            holdEndImgs[this.direction].hitFalse,
            // arrow_xPos[this.direction],
            getArrow_xPos(this.direction, this.playerNum),
            yPosReleased + rectangleHeight,
          );
          // Draw arrow at hit pos
          drawArrowPiece(
            arrowImgs[this.direction],
            // arrow_xPos[this.direction],
            getArrow_xPos(this.direction, this.playerNum),
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
            // arrow_xPos[this.direction],
            getArrow_xPos(this.direction, this.playerNum),
            yPos + 32,
            rectangleHeight,
          );
          drawArrowPiece(
            arrowImgs[this.direction],
            // arrow_xPos[this.direction],
            getArrow_xPos(this.direction, this.playerNum),
            yPos,
          );
          drawArrowPiece(
            holdEndImgs[this.direction].hitFalse,
            // arrow_xPos[this.direction],
            getArrow_xPos(this.direction, this.playerNum),
            yPos + rectangleHeight,
          );
          p.tint(255, 255);
        }
      } else if (this.noteType == "mine" && !this.isHit) {
        // Draw mines
        let opacity = this.hasPassedOver ? 127 : 255;
        p.tint(255, opacity);
        drawImageToScale(
          eggBombImg,
          //  arrow_xPos[this.direction]
          getArrow_xPos(this.direction, this.playerNum),
          yPos,
        );
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
    constructor(songId, playerNum, difficulty) {
      this.miss = 0;
      this.perfect = 0;
      this.ok = 0;
      this.great = 0;
      this.scoreCount = 0;
      this.totalNotes = 0;
      this.baseNoteScore = 0;
      this.ranking;
      this.songId = songId;
      this.playerNum = playerNum;
      this.difficulty = difficulty;
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
        difficulty: this.difficulty,
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
      healthBarList[this.playerNum].decrement(0.15);
    }
    update(scoreType) {
      if (scoreType == "miss") {
        this.miss++;
        healthBarList[this.playerNum].decrement();
      } else {
        if (scoreType == "ok") {
          this.ok++;
          // this.scoreCount += 1;
          this.scoreCount += this.baseNoteScore * 3;
          healthBarList[this.playerNum].increment(1);
        }
        if (scoreType == "great") {
          this.great++;
          // this.scoreCount += 3;
          this.scoreCount += this.baseNoteScore * 7;
          healthBarList[this.playerNum].increment(3);
        }
        if (scoreType == "perfect") {
          this.perfect++;
          // this.scoreCount += 5;
          this.scoreCount += this.baseNoteScore * 10;
          healthBarList[this.playerNum].increment(5);
        }
      }

      this.calculateRanking();
    }

    displayTotalScore() {
      //Draw UI
      let scoreBackgroundImg_posX;
      let playerTextImgToDraw;
      let playerTextImg_posX;

      //Player 1
      if (this.playerNum == 0) {
        scoreBackgroundImg_posX = 0;
        playerTextImgToDraw = playerTextImgs.player1;
        playerTextImg_posX = 0;
        // Player 2
      } else if (this.playerNum == 1) {
        scoreBackgroundImg_posX = 640 - 188;
        playerTextImgToDraw = playerTextImgs.player2;
        playerTextImg_posX = 455;
      }
      drawImageToScale(
        scoreBackgroundImgs[this.playerNum],
        scoreBackgroundImg_posX,
        437,
      );
      drawImageToScale(playerTextImgToDraw, playerTextImg_posX, 437 - 20);
      drawImageToScale(
        playerTextImgs[this.difficulty],
        playerTextImgToDraw.width + scoreBackgroundImg_posX,
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

      let offset = this.playerNum == 0 ? 0 : 8;
      p.tint(255, 100);
      drawText(
        zerosString,
        "scoreDigits",
        1,
        scoreBackgroundImg_posX + 8 + offset,
        441,
      );
      p.tint(255, 255);

      // Draw actual score
      drawText(
        this.scoreCount.toString(),
        "scoreDigits",
        1,
        scoreBackgroundImg_posX + 8 + numOfZeros * letterWidth + offset,
        441,
      );
    }
  }

  class HealthBar {
    constructor(playerNum) {
      this.amountFilled = 0.5;

      this.tick = 0;
      this.animate = true;
      this.gradientColor = "green";
      this.playerNum = playerNum;
      if (this.playerNum == 0) {
        this.xPos = 8;
        this.yPos = 8;
      } else if (this.playerNum == 1) {
        this.xPos = 350;
        this.yPos = 8;
      }
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

      drawRectToScale(
        this.xPos + 8,
        this.yPos + 8,
        capacity.width,
        capacity.height,
      );

      let gradientToDraw = gradientImg.get(
        this.tick % capacity.width,
        0,
        Math.max(1, capacity.width * this.amountFilled),
        capacity.height + 1,
      );
      let dw = this.animate ? Math.sin(this.tick * 0.05) * 3 : 0;
      drawImageToScaleWithWidth(
        gradientToDraw,
        this.xPos + 7,
        this.yPos + 7,
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
    constructor(playerNum) {
      this.count = 0;
      this.showing = false;
      this.scale = 1;
      this.animationIndex = 0;
      this.animationInterval;
      this.hideTimeout;
      this.playerNum = playerNum;
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
      if (this.showing && this.count >= 4) {
        let offset = this.playerNum == 0 ? -270 : 270;
        p.push();
        p.translate(offset, 0);
        drawImageToScale(comboTextImg, xPos + numberWidth + 5, 267, this.scale);
        drawText(this.count.toString(), "pink", this.scale, xPos, 240);
        p.pop();
      }
    }
  }

  class FeedbackText {
    constructor(playerNum) {
      this.showing = false;
      this.text = "OK";
      this.state = "ok";
      this.scale = 1;
      this.animationIndex = 0;
      this.animationInterval;
      this.hideTimeout;
      this.playerNum = playerNum;
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
        this.text = "PERFECT";
      } else if (this.state == "early") {
        this.text = "Early!";
      } else if (this.state == "late") {
        this.text = "Late!";
      } else if (this.state == "miss") {
        this.text = "Miss";
      } else if (this.state == "mine") {
        this.text = "Bad!";
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
        let offset = this.playerNum == 0 ? -270 : 270;
        p.push();
        p.translate(offset, 0);
        drawText(this.text, "mainYellow", this.scale, null, 150);
        p.pop();
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
};

new p5(mainScene, "main-song-canvas-container");
