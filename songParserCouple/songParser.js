const testSong = `0000
0000
0000
0000
,
0000
0000
0000
0000
,
0000
0000
0000
0000
,
0000
0000
0000
0000
,
0000
0000
0000
0000
,
0010
0000
0000
0000
,
1000
0000
0000
0000
,
0010
0010
0010
0000
,
1000
0000
0000
0000
,
0010
0000
0000
0000
,
0001
0000
0000
0000
,
0010
0010
0010
0000
,
0001
0000
0000
0000
,
0100
0100
0000
0000
,
1000
0000
0001
0000
,
1000
0000
0000
0000
,
0100
0000
0000
0000
,
1001
0000
0000
0000
,
1000
0000
0001
0000
,
0100
0000
0000
0000
,
0001
0000
1000
0000
,
0010
0000
0010
0000
,
0100
0000
0000
0000
,
0010
0000
0000
0000
,
0220
0000
0000
0330
,
0000
0000
0000
0000
,
1000
0000
1000
0000
,
0010
0000
0000
0000
,
1000
1000
1000
0000
,
0010
0000
0000
0000
,
0001
0000
0001
0000
,
0010
0000
0000
0000
,
0001
0001
0001
0000
,
0010
0000
0000
0000
,
0100
0100
0000
0000
,
1000
0000
0001
0000
,
1000
0000
1000
0000
,
1001
0000
0000
0000
,
1001
0000
0000
0000
,
0001
0000
1000
0000
,
0100
0000
0000
0000
,
1000
0000
0001
0000
,
0010
0000
0010
0000
,
0100
0000
0000
0000
,
0010
0000
0100
0000
,
0110
0000
0000
0000
,
1001
0000
0000
0000
,
1000
0000
0001
0000
,
0100
0000
0000
0000
,
0001
0000
1000
0000
,
0010
0010
0000
0000
,
0100
0100
0000
0000
,
0001
0000
1000
0000
,
1001
0000
0000
0000
,
0110
0000
0000
0000
,
1001
0000
0000
0000
`;

let getDirection = function (arrowIndex) {
  if (arrowIndex == 0) {
    return "left";
  }
  //Down
  if (arrowIndex == 1) {
    return "down";
  }
  //Up
  if (arrowIndex == 2) {
    return "up";
  }
  //Right
  if (arrowIndex == 3) {
    return "right";
  }
  if (arrowIndex == 4) {
    return "left";
  }
  //Down
  if (arrowIndex == 5) {
    return "down";
  }
  //Up
  if (arrowIndex == 6) {
    return "up";
  }
  //Right
  if (arrowIndex == 7) {
    return "right";
  }
};

let parseSong = function (songText, offsetId, bpm, delay) {
  console.log(songText);
  let measures = songText.split(/\s+,\s+/);
  console.log(measures);

  let testBPM = 139;

  let noteData1 = [];

  let noteData2 = [];

  let totalBeats = measures.length * 4;
  let beatsPerSecond = testBPM / 60;
  let secondsPerBeat = 1 / beatsPerSecond;
  let secondsPerMeasure = secondsPerBeat * 4;
  let lastHoldIndices = [null, null, null, null, null, null, null];

  let totalNotes1 = 0;
  let totalNotes2 = 0;

  let runningId = offsetId;

  let uniqueIdCount = 0;

  measures.forEach(function (measure, measureIndex) {
    let split = measure.split("\n");
    console.log("measureIndex: " + measureIndex);

    let filteredMeasure = split.filter((line) => line.length);
    console.log("filtered measure");
    console.log(filteredMeasure);

    //How much is this measure subdivided by?
    let subdivisionNum = filteredMeasure.length;
    //Then go into each subdivision...
    filteredMeasure.forEach(function (subdivision, subdivisionIndex) {
      let subdivisionSplit = subdivision.split("");
      console.log(subdivisionSplit);

      //Create a new note for the lines that we see, based on the length of the note....

      let p1_hasNotes = false;
      let p2_hasNotes = false;

      let notesToAdd1 = [];
      let notesToAdd2 = [];

      subdivisionSplit.forEach(function (arrowElement, arrowIndex) {
        // To hadndle IDs, look at first half (p1)
        // after looking at every 8 slots in the line...
        // Are there arrows on one half only? Then
        // If not, the note in this line should get the next ID, and future ones should get the next one
        console.log(arrowElement);
        let secondsPerSubdivision = secondsPerMeasure / subdivisionNum;
        let startTime =
          measureIndex * secondsPerMeasure +
          subdivisionIndex * secondsPerSubdivision;

        let startBeat =
          measureIndex * 4 + (subdivisionIndex / subdivisionNum) * 4;

        if (parseInt(arrowElement)) {
          //DETERMINE START TIME

          // Create a new note if applicable

          if (parseInt(arrowElement) == 1) {
            // console.log(startTime);
            let thisNoteData = {
              id: null,
              uniqueId: uniqueIdCount,
              startBeat: startBeat,
              startTime: startTime,
              noteType: "instant",
              measure: measureIndex,
            };
            uniqueIdCount++;

            //DETERMINE DIRECTION

            thisNoteData.direction = getDirection(arrowIndex);

            if (arrowIndex < 4) {
              // noteData1.push(thisNoteData);
              notesToAdd1.push(thisNoteData);
              totalNotes1++;
              p1_hasNotes = true;
            } else {
              // noteData2.push(thisNoteData);
              notesToAdd2.push(thisNoteData);
              totalNotes2++;
              p2_hasNotes = true;
            }
          } else if (parseInt(arrowElement) == 2) {
            //Otherwise account for holds

            let thisNoteData = {
              id: null,
              uniqueId: uniqueIdCount,
              startBeat: startBeat,
              startTime: startTime,
              noteType: "hold",
              measure: measureIndex,
            };
            uniqueIdCount++;

            //DETERMINE DIRECTION
            //Left
            thisNoteData.direction = getDirection(arrowIndex);

            if (arrowIndex < 4) {
              // noteData1.push(thisNoteData);
              notesToAdd1.push(thisNoteData);
              totalNotes1++;
              lastHoldIndices[arrowIndex] = thisNoteData.uniqueId;
              p1_hasNotes = true;
            } else {
              // noteData2.push(thisNoteData);
              notesToAdd2.push(thisNoteData);
              totalNotes2++;
              lastHoldIndices[arrowIndex] = thisNoteData.uniqueId;
              p2_hasNotes = true;
            }
          } else if (parseInt(arrowElement) == 3) {
            // need to record end time for a previous hold...
            // How are we supposed to find this????
            // This is always gonna match up with the last "2" / hold we saw in this arrow direction.... maybe we can just store this as an array

            //TODO: figure out the accurate hold index here...
            if (arrowIndex < 4) {
              let uniqueIdOfLastHold = lastHoldIndices[arrowIndex];
              let lastHoldNote;
              noteData1.forEach(function (noteData) {
                if (noteData.uniqueId == uniqueIdOfLastHold) {
                  lastHoldNote = noteData;
                }
              });
              // let lastHoldNote = noteData1[lastHoldIndices[arrowIndex]];
              lastHoldNote.endTime = startTime;
              //not sure if end measure is accurate
              lastHoldNote.endBeat = startBeat;
              lastHoldNote.endMeasure = Math.floor(startBeat / 4);
            } else {
              let uniqueIdOfLastHold = lastHoldIndices[arrowIndex];
              let lastHoldNote;
              noteData2.forEach(function (noteData) {
                if (noteData.uniqueId == uniqueIdOfLastHold) {
                  lastHoldNote = noteData;
                }
              });

              lastHoldNote.endTime = startTime;
              //not sure if end measure is accurate
              lastHoldNote.endBeat = startBeat;
              lastHoldNote.endMeasure = Math.floor(startBeat / 4);
            }
          }

          //DETERMINE END TIME AND TYPE (if hold)

          //CHANGE THIS. 2 means the start, and 3 means the end of a previous one...
          // if (parseInt(arrowElement) > 1) {
          //   let holdFor = parseInt(arrowElement) - 1;
          //   let holdLength = holdFor * secondsPerSubdivision;
          //   thisNoteData.noteType = "hold";
          //   thisNoteData.endTime = thisNoteData.startTime + holdLength;
          //   //not sure if end measure is accurate
          //   thisNoteData.endBeat = thisNoteData.startBeat + holdFor;
          //   thisNoteData.endMeasure = Math.floor(thisNoteData.endBeat / 4);
          // }
        } else if (arrowElement == "M") {
          console.log("THIS IS A MINE!!!");
          // Ignore for now...

          // let thisNoteData = {
          //   id: noteData.length + offsetId,
          //   startBeat: startBeat,
          //   startTime: startTime,
          //   noteType: "mine",
          //   measure: measureIndex,
          // };

          // //DETERMINE DIRECTION

          // thisNoteData.direction = getDirection(arrowIndex);
          // noteData.push(thisNoteData);
          // totalNotes++; // Don't affect total notes
        } else {
          // This is a zero
        }
        // console.log("this is zero");
      });

      // Now that we've seen every part of the line, assess cases.
      // Case 1: Only p1 has one or more notes. Assign each note incrementlal id
      if (p1_hasNotes && !p2_hasNotes) {
        console.log("CASE 1");
        notesToAdd1.forEach(function (note, index) {
          let id = runningId;
          runningId++;
          note.id = id;
          noteData1.push(note);
        });
      }
      // Case 2: Only p2 has one or more notes. Assign each note incrementlal id
      else if (p2_hasNotes && !p1_hasNotes) {
        console.log("CASE 2");
        notesToAdd2.forEach(function (note, index) {
          let id = runningId;
          runningId++;
          note.id = id;
          noteData2.push(note);
        });
      }
      // Case 3: p1 and p2 both have notes. (I've designed it so that they should equal). Give p2 the same IDs as p1
      else if (p1_hasNotes && p2_hasNotes) {
        console.log("CASE 3");
        let originalRunningId = runningId;
        notesToAdd1.forEach(function (note, index) {
          let id = runningId;
          runningId++;
          note.id = id;
          noteData1.push(note);
        });
        console.log(originalRunningId);
        runningId = originalRunningId;
        notesToAdd2.forEach(function (note, index) {
          let id = runningId;
          console.log("id is: " + id);
          runningId++;
          note.id = id;
          noteData2.push(note);
        });
      }

      // Case 4: Zeros on every end.
    });
  });

  // console.log(noteData);

  //Create notes by measures

  let measureData1 = new Array(measures.length);
  // console.log(measureData);

  let measureData2 = new Array(measures.length);

  noteData1.forEach(function (note) {
    if (measureData1[note.measure] != null) {
      measureData1[note.measure].push(note);
    } else {
      measureData1[note.measure] = [note];
    }
  });

  noteData2.forEach(function (note) {
    if (measureData2[note.measure] != null) {
      measureData2[note.measure].push(note);
    } else {
      measureData2[note.measure] = [note];
    }
  });

  // console.log(measureData);
  // return measureData;
  // console.log(JSON.stringify(measureData));
  let songData1 = {
    measureData: measureData1,
    bpm: bpm,
    delay: delay,
    totalNotes: totalNotes1,
  };

  let songData2 = {
    measureData: measureData2,
    bpm: bpm,
    delay: delay,
    totalNotes: totalNotes2,
  };
  return [JSON.stringify(songData1), JSON.stringify(songData2)];
};

let parseButton = document.querySelector("#parseButton");
let inputSong = document.querySelector("#inputSong");
let numberInput = document.querySelector("#number");
let bpmInput = document.querySelector("#bpm");
let delayInput = document.querySelector("#delay");
let resultTextarea = document.querySelector("#results");
let resultTextarea2 = document.querySelector("#results2");
parseButton.addEventListener("click", function () {
  let offsetVal = parseInt(numberInput.value);
  let bpmVal = parseFloat(bpmInput.value);
  let delayVal = parseFloat(delay.value);
  let results = parseSong(inputSong.value, offsetVal, bpmVal, delayVal);
  resultTextarea.innerHTML = results[0];
  resultTextarea2.innerHTML = results[1];
});
