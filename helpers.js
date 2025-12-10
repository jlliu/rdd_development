// Global js helpers

let characterString = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890.,?!-"'()[] `;
let characterList = characterString.split("");

let digitString = "1234567890";

let digitList = digitString.split("");

let mainPinkCharacters = `ABCDEFGHIJKLNOPQRSTUVXYZabcdefghijklnopqrstuvxyz1234567890.,?!-"'()[] `;

let terminalString = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890.,?!-"'()[]> `;
let terminalList = terminalString.split("");

let widePinkCharacters = `MWmw`;

let fonts = {
  mainYellow: {
    sets: [
      {
        src: "/assets/font-spritesheet.png",
        charSet: characterString.split(""),
        size: { width: 40, height: 58 },

        imgObj: null,
      },
    ],

    charsToImgs: {},
  },

  smallYellow: {
    sets: [
      {
        src: "/assets/smallYellowSpritesheet.png",
        charSet: characterString.split(""),
        size: { width: 24, height: 35 },
        imgObj: null,
      },
    ],

    charsToImgs: {},
  },

  greenHelper: {
    sets: [
      {
        src: "/assets/green-helper-text-spritesheet.png",
        charSet: characterString.split(""),
        size: { width: 24, height: 35 },
        imgObj: null,
      },
    ],
    charsToImgs: {},
  },

  whitePixel: {
    sets: [
      {
        src: "/assets/white-pixel-font-spritesheet.png",
        charSet: characterString.split(""),
        size: { width: 24, height: 35 },

        imgObj: null,
      },
    ],

    charsToImgs: {},
  },

  whiteTerminal: {
    sets: [
      {
        src: "/assets/white-terminal.png",
        charSet: terminalString.split(""),
        size: { width: 18, height: 29 },
        imgObj: null,
      },
    ],

    charsToImgs: {},
  },

  // pinkDigits: {
  //   src: "assets/combo-number-spritesheet.png",
  //   charSet: digitString.split(""),
  //   size: { width: 64, height: 72 },
  //   charsToImgs: {},
  //   imgObj: null,
  // },

  pink: {
    sets: [
      {
        src: "/assets/main-pink-character-spritesheet.png",
        charSet: mainPinkCharacters.split(""),
        size: { width: 60, height: 84 },
      },
      {
        src: "/assets/wide-pink-character-spritesheet.png",
        charSet: widePinkCharacters.split(""),
        size: { width: 84, height: 84 },
        imgObj: null,
      },
    ],
    charsToImgs: {},
    // src: "assets/assets/main-pink-character-spritesheet.png",
    // charSet: mainPinkCharacters.split(""),
    // size: { width: 60, height: 84 },
    // charsToImgs: {},
    // imgObj: null,
  },

  // widePink: {
  //   src: "assets/assets/wide-pink-character-spritesheet.png",
  //   charSet: widePinkCharacters.split(""),
  //   size: { width: 84, height: 84 },
  //   charsToImgs: {},
  //   imgObj: null,
  // },

  // pin
};

const hitAnimationTimings = {
  1: 1.12,
  2: 1.15,
  3: 1.14,
  4: 1.1,
  5: 1.05,
};

const codeGlowTimings = {
  1: 0,
  2: 0.2,
  3: 0.6,
  4: 0.9,
  5: 1.5,
  6: 1.3,
  7: 1.15,
  8: 1.1,
  9: 1,
};

const fadeOutTiming = {
  1: 1,
  2: 0.95,
  3: 0.9,
  4: 0.8,
  5: 0.65,
  6: 0.4,
  7: 0.1,
  8: 0,
};

const arrowHitSizeTimings = {
  1: 0.85,
  2: 0.8,
  3: 0.81,
  4: 0.83,
  5: 0.87,
  6: 0.9,
  7: 0.91,
  8: 0.95,
  9: 0.97,
};

const arrowHitGradientTimings = {
  1: 0.8,
  2: 1,
  3: 0.9,
  4: 0.85,
  5: 0.8,
  6: 0.7,
  7: 0.55,
  8: 0.4,
  9: 0.2,
};

function hsl2rgb(h, s, l) {
  let a = s * Math.min(l, 1 - l);
  let f = (n, k = (n + h / 30) % 12) =>
    l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  return [f(0), f(8), f(4)];
}

// Navigation helpers
const canvasLoadedEvent = new Event("canvasLoaded");
const showSceneEvent = new CustomEvent("showScene");
const hideSceneEvent = new CustomEvent("hideScene");
const endRevelationSceneEvent = new CustomEvent("endRevelationScene");
const sceneTransitionTime = 1000;

// Background, title, tutorial, difficulty, songSelector, mainSong, revelation, unlockCanvas, scoreCanvas, experimental, gates, service mode
let totalCanvases = 11; // remove tutorial

let storyModeDifficulty = "Normal";

let globalClock = new Tone.Clock((time) => {}, 1);

globalClock.start();

let sound_fx = {
  eggCrack: new Tone.Player(`/assets/fx/egg-crack.mp3`).toDestination(),
  doorShut: new Tone.Player(`/assets/fx/door-shut.mp3`).toDestination(),
  menuChange: new Tone.Player(`/assets/fx/house_stab.wav`).toDestination(),
};

let songList = [
  {
    bannerImg: `/songAssets/song1-banner.png`,
    title: `Walkin' on Eggshells`,
    cdImg: `song1-cd.png`,
    songData: eggshells,
    songFile: `/songAssets/Music/eggshells.mp3`,
    songPlayer: new Tone.Player(
      `/songAssets/Music/eggshells.mp3`
    ).toDestination(),
    sampleStart: 45.5,
    sampleLength: 14,
    videoUrl: `/songAssets/Backgrounds/eggshells_video.mp4`,
    cleared: false,
    scores: [],
  },
  {
    bannerImg: `songAssets/song2-banner.png`,
    title: `Kung Fu Fawning`,
    cdImg: `song2-cd.png`,
    songData: fawning,
    songFile: `/songAssets/Music/fawning.mp3`,
    songPlayer: new Tone.Player(
      `/songAssets/Music/fawning.mp3`
    ).toDestination(),
    sampleStart: 19,
    sampleLength: 17,
    videoUrl: `/songAssets/Backgrounds/eggshells_video.mp4`,
    cleared: false,
    scores: [],
  },
  {
    bannerImg: `/songAssets/song3-banner.png`,
    title: `Chasing Breadcrumbs`,
    cdImg: `song3-cd.png`,
    songData: breadcrumbs,
    songFile: `/songAssets/Music/breadcrumbs.mp3`,
    songPlayer: new Tone.Player(
      `/songAssets/Music/breadcrumbs.mp3`
    ).toDestination(),
    sampleStart: 45.0,
    sampleLength: 15.0,
    videoUrl: `/songAssets/Backgrounds/eggshells_video.mp4`,
    cleared: false,
    scores: [],
    //Beat is beat bpm change starts on, then length of stop in seconds
    bpmChanges: [
      { beat: 0.0, bpm: 70.0 },
      { beat: 16.0, bpm: 140.0 },
      { beat: 136.0, bpm: 70.0 },
    ],
    //Beat is beat stop starts on, then length of stop in seconds
    stops: [
      { beat: 15.75, length: 1.714288 },
      { beat: 91.0, length: 1.714288 },
      { beat: 94.0, length: 1.714288 },
      { beat: 99.0, length: 1.714288 },
      { beat: 102.0, length: 1.714288 },
    ],
  },
  {
    bannerImg: `songAssets/song4-banner.png`,
    title: `Lone Ranger`,
    cdImg: `song4-cd.png`,
    songData: loneRanger,
    songFile: `/songAssets/Music/lone_ranger.mp3`,
    songPlayer: new Tone.Player(
      `/songAssets/Music/lone_ranger.mp3`
    ).toDestination(),
    sampleStart: 14.5,
    sampleLength: 30.0,
    videoUrl: `/songAssets/Backgrounds/loneRanger_video.mp4`,
    cleared: false,
    scores: [],
  },
  {
    bannerImg: `songAssets/song5-banner.png`,
    title: `FILL THE VOiD`,
    cdImg: `song5-cd.png`,
    songData: fillTheVoid,
    songFile: `/songAssets/Music/void.mp3`,
    songPlayer: new Tone.Player(`/songAssets/Music/void.mp3`).toDestination(),
    sampleStart: 25,
    sampleLength: 12.0,
    videoUrl: `/songAssets/Backgrounds/eggshells_video.mp4`,
    cleared: false,
    scores: [],
    //Beat is beat bpm change starts on, then length of stop in seconds
    bpmChanges: [
      { beat: 0.0, bpm: 156.0 },
      { beat: 96.0, bpm: 78.0 },
      { beat: 128.0, bpm: 156.0 },
    ],
    //Beat is beat stop starts on, then length of stop in seconds
    stops: [
      { beat: 96.0, length: 0.769231 },
      { beat: 128.0, length: 0.384616 },
      { beat: 160.0, length: 1.538464 },
    ],
  },
  {
    bannerImg: `songAssets/song6-banner.png`,
    title: `???`,
    cdImg: `song6-cd.png`,
    songData: eggshells,
    songFile: `/songAssets/Music/sandstorm.ogg`,
    songPlayer: new Tone.Player(
      `/songAssets/Music/ambientLoop.mp3`
    ).toDestination(),
    sampleStart: 3.0,
    sampleLength: 0.2,
    videoUrl: `/songAssets/Backgrounds/eggshells_video.mp4`,
    cleared: false,
    scores: [],
  },
];

// Access images from song selector and score canvas
let songBannersImgs = [];

// Revelation scene

let revelationGlowTime = 5;

let padSelectHoldTime = 1500;
