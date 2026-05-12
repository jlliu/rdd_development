const testScenesData = [
  // Parts list for scene 0
  [
    {
      dialogue: ["Hello?"],
      instructions: "ENTER = CONTINUE",
      trigger: "ENTER",
    },
    {
      dialogue: ["Is anyone there?"],
      instructions: "ENTER = CONTINUE",
      trigger: "ENTER",
    },
  ],

  // Parts list for scene 1: Color check
  [
    {
      dialogue: ["Can you see me?"],
      instructions: "ENTER = CONTINUE",
      trigger: "ENTER",
    },
  ],

  // Parts list for scene 2: Sound check
  [
    {
      dialogue: ["Can you hear me?"],
      instructions: "ENTER = CONTINUE",
      trigger: "ENTER",
    },
  ],

  // Parts list for scene 3: Body Scan
  [
    {
      dialogue: ["Can you feel it?"],
      instructions: "ENTER = CONTINUE",
      trigger: "ENTER",
    },

    {
      dialogue: ["The bracing,"],
      instructions: "ENTER = CONTINUE",
      trigger: "ENTER",
    },
    {
      dialogue: ["the sinking,"],
      instructions: "ENTER = CONTINUE",
      trigger: "ENTER",
    },
    {
      dialogue: ["the ache?"],
      instructions: "ENTER = CONTINUE",
      trigger: "ENTER",
    },
  ],

  // Parts list for scene 3: Input test
  [
    {
      dialogue: ["I thought I could", "be in control."],
      instructions: "LEFT ARROW = TEST INPUT",
      trigger: "LEFT",
    },
    {
      dialogue: ["If I took the blame,", "I could fix it."],
      instructions: "DOWN ARROW = TEST INPUT",
      trigger: "DOWN",
    },
    {
      dialogue: ["If I was perfect, I", "wouldn't be abandoned."],
      instructions: "UP ARROW = TEST INPUT",
      trigger: "UP",
    },
    {
      dialogue: ["If I did everything right,", "I could be safe."],
      instructions: "RIGHT ARROW = TEST INPUT",
      trigger: "RIGHT",
    },
  ],
  //Parts list for scene 4: image test
  [
    // I want to let go...
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    // I want to be free
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    // But there is a comfort in holding on,
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    // In repetition
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },

    ////////////////////////////////////
    // To finally release
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    // Is to grieve
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    // THe loss of a world
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    // The loss of control
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    //////////////////////////
    // Sometimes....
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    // it is just a losing game
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },

    // BUT
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    // WE
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    // DONT
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    // HAVE
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    // TO
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    // PLAY
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    // IT
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    // LIKE
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    // IT
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    // ONCE
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    // WAS
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    // ...
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    // ...
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    // ...
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
  ],

  // Font sprite sheet animation
  [
    //I
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    //thought
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    //I
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    //needed
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    //to
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    //be
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    //fixed
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    //...
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },

    // I
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    // Just
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    // Needed
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    // A
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    // Witness
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    // ...
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    // ...
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    // ...
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
  ],

  // MEMORY TEST
  [
    // WANTING
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    //IS
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    //OK
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    // CLEAR
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },

    // HURTING
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    //IS
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    //OK
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    // [CLEAR]
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },

    // MISTAKES
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    //ARE
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    //OK
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    // [CLEAR]
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },

    // NEEDING
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    //IS
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    //OK
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    // [CLEAR]
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },

    // ANGER
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    //IS
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    //OK
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    // [CLEAR]
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },

    // FEAR
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    //IS
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    //OK
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    // [CLEAR]
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },

    // REGRET
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    //IS
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    //OK
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    // [CLEAR]
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },

    // SHAME
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    //IS
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    //OK
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    // [CLEAR]
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },

    //I
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    // AM
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    // HERE
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    //I
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    // AM
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    // HERE
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    //I
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    // AM
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    // HERE
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    //I
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    // AM
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    // HERE
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    //I
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    // AM
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    // HERE
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    //I
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    // AM
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    // HERE
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    //I
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    // AM
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    // HERE
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    //I
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },
    // AM
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
    // HERE
    {
      dialogue: [""],
      instructions: "TAP LEFT",
      trigger: "LEFT",
    },

    //SWITCH TO BLACK
    {
      dialogue: [""],
      instructions: "TAP RIGHT",
      trigger: "RIGHT",
    },
  ],

  //  [
  //   // Part 1: Song banner data
  //   {
  //     dialogue: ["I want to let go."],
  //     instructions: "ENTER = CONTINUE",
  //   },
  //   {
  //     dialogue: ["I want to be free."],
  //     instructions: "ENTER = CONTINUE",
  //   },
  //   {
  //     dialogue: ["But there is a comfort", "in holding on,"],
  //     instructions: "ENTER = CONTINUE",
  //   },
  //   {
  //     dialogue: ["in repetition."],
  //     instructions: "ENTER = CONTINUE",
  //   },

  //   // Part 2: Arrow sprites

  //   {
  //     dialogue: ["To finally release"],
  //     instructions: "ENTER = CONTINUE",
  //   },

  //   {
  //     dialogue: ["is to also grieve"],
  //     instructions: "ENTER = CONTINUE",
  //   },

  //   {
  //     dialogue: ["the loss of a world,"],
  //     instructions: "ENTER = CONTINUE",
  //   },
  //   {
  //     dialogue: ["the loss of control."],
  //     instructions: "ENTER = CONTINUE",
  //   },
  //   // WIN/FAILED
  //   {
  //     dialogue: ["Sometimes,"],
  //     instructions: "ENTER = CONTINUE",
  //   },

  //   {
  //     dialogue: ["it is just a losing game."],
  //     instructions: "ENTER = CONTINUE",
  //   },

  //   // CD  images
  //   {
  //     dialogue: ["But"],
  //     instructions: "ENTER = CONTINUE",
  //   },
  //   {
  //     dialogue: ["we"],
  //     instructions: "ENTER = CONTINUE",
  //   },
  //   {
  //     dialogue: ["no"],
  //     instructions: "ENTER = CONTINUE",
  //   },
  //   {
  //     dialogue: ["longer"],
  //     instructions: "ENTER = CONTINUE",
  //   },
  //   {
  //     dialogue: ["have"],
  //     instructions: "ENTER = CONTINUE",
  //   },
  //   {
  //     dialogue: ["to"],
  //     instructions: "ENTER = CONTINUE",
  //   },
  //   {
  //     dialogue: ["play"],
  //     instructions: "ENTER = CONTINUE",
  //   },
  //   {
  //     dialogue: ["the"],
  //     instructions: "ENTER = CONTINUE",
  //   },
  //   {
  //     dialogue: ["game"],
  //     instructions: "ENTER = CONTINUE",
  //   },
  //   {
  //     dialogue: ["like"],
  //     instructions: "ENTER = CONTINUE",
  //   },
  //   {
  //     dialogue: ["it"],
  //     instructions: "ENTER = CONTINUE",
  //   },
  //   {
  //     dialogue: ["once"],
  //     instructions: "ENTER = CONTINUE",
  //   },
  //   {
  //     dialogue: ["was."],
  //     instructions: "ENTER = CONTINUE",
  //   },

  //   // Part 3: Arrow sprites
  // ],
];

const imageTestDialogue = [
  ["I want to let go,"],
  ["I want to be free."],
  ["But there is a comfort", "in holding on,"],
  ["in repetition."],

  ["To finally release"],
  ["is to grieve"],
  ["the loss of a world,"],
  ["the loss of control."],

  ["Sometimes, it is just"],
  ["a losing game."],

  ["But"],
  ["we"],
  ["don't"],
  ["have"],
  ["to"],
  ["play"],
  ["it"],
  ["like"],
  ["it"],
  ["once"],
  ["was."],
];

const memoryTestWords = [
  "WANTING",
  "HURTING",
  "FEELING",
  "NEEDING",
  "ANGER",
  "FEAR",
  "REGRET",
  "SHAME",
];

// const settingsDialogue = [
//   //Scene 0
//   {
//     left: "...WHO ARE YOU?",
//     right: {
//       options: ["I AM YOU"],
//     },
//   },

//   //Scene 1
//   {
//     left: "...WHO AM I?",
//     right: {
//       options: ["YOU ARE ME"],
//     },
//   },

//   //Scene 2
//   {
//     left: ["WHAT ARE YOU", "DOING HERE?"],
//     right: {
//       title: "I'M HERE",
//       options: ["TO SEE", "TO HEAR", "TO FEEL", "TO KNOW"],
//     },
//   },

//   //Scene 3
//   {
//     left: ["..."],
//     right: {
//       title: "CAN YOU LET ME",
//       options: ["SEE YOU?", "HEAR YOU?", "FEEL YOU?", "KNOW YOU?"],
//     },
//   },

//   //Scene 4
//   {
//     left: ["..."],
//     right: {
//       options: [["I WANT TO KNOW", "WHAT YOU WANT", "TO SAY"]],
//     },
//   },

//   //Scene 5
//   {
//     left: ["..."],
//     right: {
//       options: [["I WANT TO KNOW", "WHAT IT FEELS", "LIKE"]],
//     },
//   },

//   //Scene 6
//   {
//     left: ["IT FEELS", "LIKE..."],
//     right: {
//       options: ["AN ACHE?", "A KNOT?", "A PIT?", "A VOID?"],
//     },
//   },

//   //Scene 7
//   {
//     left: ["IN MY..."],
//     right: {
//       options: ["CHEST?", "HEAD?", "BELLY?", "HEART?"],
//     },
//   },

//   //Scene 8
//   {
//     left: ["YOU FEEL IT", "TOO?"],
//     right: {
//       options: ["OF COURSE", "OF COURSE", "OF COURSE", "OF COURSE"],
//     },
//   },

//   //Scene 9
//   {
//     left: ["IT HURTS"],
//     right: {
//       options: ["I KNOW"],
//     },
//   },
//   //Scene 10
//   {
//     left: ["IT HURTS"],
//     right: {
//       options: [["I WILL FEEL", "IT WITH YOU"]],
//     },
//   },

//   //Scene 11
//   {
//     left: ["..."],
//     right: {
//       options: ["..."],
//     },
//   },

//   //Scene 12
//   {
//     left: ["..."],
//     right: {
//       options: ["TELL ME MORE"],
//     },
//   },

//   //Scene 13
//   {
//     left: ["..."],
//     right: {
//       options: ["..."],
//     },
//   },

//   //Scene 14
//   {
//     left: ["..."],
//     right: {
//       options: ["..."],
//     },
//   },

//   //Scene 15
//   {
//     left: ["WHY DID YOU", "LEAVE ME", "BEHIND?"],
//     right: {
//       options: ["I'M SORRY"],
//     },
//   },

//   //Scene 16
//   {
//     left: ["..."],
//     right: {
//       title: "I WANTED TO",
//       options: ["HELP YOU", "PROTECT YOU", "SAVE YOU", "DEFEND YOU"],
//     },
//   },

//   //Scene 17
//   {
//     left: ["..."],
//     right: {
//       title: "I MADE MYSELF",
//       options: ["SPLINTERED", "FRAGMENTED", "DIVIDED", "DISJOINT"],
//     },
//   },

//   //Scene 18
//   {
//     left: ["..."],
//     right: {
//       title: "I WANTED TO",
//       options: ["FORGET", "ESCAPe", "RUN", "HIDE"],
//     },
//   },

//   //Scene 19
//   {
//     left: ["..."],
//     right: {
//       title: "BUT NOW,",
//       options: ["I AM HERE", "I AM HERE", "I AM HERE", "I AM HERE"],
//     },
//   },

//   //Scene 20
//   {
//     left: ["..."],
//     right: {
//       title: "I WON'T",
//       options: ["FORGET YOU", "ABANDON YOU", "LEAVE YOU", "NEGLECT YOU"],
//     },
//   },

//   //Scene 21
//   {
//     left: ["..."],
//     right: {
//       options: ["..."],
//     },
//   },

//   //Scene 22
//   {
//     left: ["I FEEL SO", "LONELY"],
//     right: {
//       options: [["I'M HERE", "WITH YOU"]],
//     },
//   },

//   //Scene 23
//   {
//     left: ["I FEEL SO", "UNLOVABLE"],
//     right: {
//       options: [["I LOVE YOU"]],
//     },
//   },

//   //Scene 24
//   {
//     left: ["I FEEL SO", "WORTHLESS"],
//     right: {
//       options: [["I TREASURE", "YOU"]],
//     },
//   },

//   //Scene 25
//   {
//     left: ["I FEEL SO LEFT", "BEHIND"],
//     right: {
//       options: [["I WON'T", "LEAVE YOU"]],
//     },
//   },

//   //Scene 26
//   {
//     left: ["I FEEL SO EMPTY"],
//     right: {
//       options: [["AND YOU ARE", "STILL WHOLE"]],
//     },
//   },

//   //Scene 27
//   {
//     left: ["I FEEL SO", "HOPELESS"],
//     right: {
//       options: [["AND YOU STILL", "KEEP BREATHING"]],
//     },
//   },

//   //Scene 28
//   {
//     left: ["I FEEL SO", "MISUNDERSTOOD"],
//     right: {
//       options: [["AND YOU STILL", "KEEP TRYING"]],
//     },
//   },

//   //Scene 29
//   {
//     left: ["I FEEL SO", "HELPLESS"],
//     right: {
//       options: [["AND YOU STILL", "KEEP CREATING"]],
//     },
//   },

//   //Scene 30
//   {
//     left: ["I FEEL SO TIRED"],
//     right: {
//       options: [["YOU'VE DONE", "SO MUCH"]],
//     },
//   },

//   //Scene 31
//   {
//     left: ["I FEEL SO TIRED"],
//     right: {
//       options: [["YOU CAN", "REST"]],
//     },
//   },

//   //Scene 32
//   {
//     left: ["I FEEL SO TIRED"],
//     right: {
//       options: [["I CAN", "TAKE IT FROM", "HERE"]],
//     },
//   },
// ];

// const exitDialogue = [
//   //Scene 0
//   {
//     left: ["WHERE ARE YOU", "GOING?"],
//     right: {
//       options: ["NOT TOO FAR"],
//     },
//   },

//   //Scene 1
//   {
//     left: ["WHEN WILL YOU", "BE BACK?"],
//     right: {
//       options: ["ANYTIME YOU", "NEED"],
//     },
//   },

//   //Scene 2
//   {
//     left: ["CAN YOU STAY A", "BIT LONGER?"],
//     right: {
//       options: ["OF COURSE"],
//     },
//   },
// ];
