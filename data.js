/* Reference data: normalized values from the v1.7.x community tables.
   1.0 = +++, 0.9 = ++, 0.8 = +, 0.7 = --, 0.6 = ---. */
window.GDT_REFERENCE = {
  genres:['Action','Adventure','RPG','Simulation','Strategy','Casual'],
  audiences:['Young','Everyone','Mature'],
  topics:[
    ['Abstract',.9,1,.6,.6,.8,.6,.8,.9,1],['Airplane',1,.6,.8,1,1,1,1,1,.9],['Aliens',1,.8,1,.6,.9,.7,.9,1,1],['Alternate History',1,.8,1,.8,.9,.6,.6,1,1],['Assassin',1,.7,1,.8,.6,.6,.6,.8,1],['Business',.6,.8,.8,1,1,.6,.9,1,.7],['City',.7,.6,.7,1,1,.7,.9,1,.8],['Colonization',.7,.6,.6,1,1,.7,.7,1,.8],['Comedy',.6,1,.8,.6,.6,1,.8,.9,1],['Construction',.7,.6,.6,1,.9,.8,.8,1,.9],['Cooking',.9,.7,.8,1,.7,1,.8,1,.6],['Crime',1,.7,.8,.9,.7,.6,.6,.8,1],['Cyberpunk',1,.8,1,.8,.7,.6,.7,.9,1],['Dance',.9,.6,.6,1,.6,1,1,.9,.8],['Detective',.6,1,1,.8,.6,.9,.9,1,.8],['Disasters',.9,.8,.7,1,1,.7,.7,.9,1],['Dungeon',1,.8,1,1,1,.6,.8,1,1],['Dystopian',.8,.9,.8,1,.9,.6,.6,.8,1],['Evolution',.7,.6,.6,1,1,.6,.8,1,.7],['Expedition',.7,.9,.6,.9,1,.6,.8,1,.9],['Extreme Sports',1,.6,.6,1,.7,.9,1,.7,1],['Fantasy',1,1,1,.8,1,.6,1,1,1],['Farming',.6,.7,1,1,.8,.9,.9,1,.8],['Fashion',.6,.8,1,1,.6,1,1,.8,.6],['Game Dev',.6,.7,.6,1,.6,.8,.9,1,.7],['Government',.6,.6,.6,1,1,.7,.6,1,.8],['Hacking',.7,.8,.7,1,1,.6,.7,.9,1],['History',.8,.8,.8,1,1,.9,.8,1,.9],['Horror',1,1,.8,.6,.7,.8,.6,.9,1],['Hospital',.6,.6,.8,1,.8,.7,.7,1,.8],['Hunting',1,.9,.9,1,.7,.9,.9,1,.9],['Law',.6,1,.9,.9,.9,.6,.8,1,.7],['Life',.6,1,.9,1,.6,.8,1,1,.8],['Mad Science',.9,1,.7,.9,.6,.6,.8,.9,1],['Martial Arts',1,.8,1,1,.7,1,.7,.9,1],['Medieval',1,1,1,.8,1,.7,1,1,.9],['Military',1,.6,.8,1,1,.6,.7,.9,1],['Movies',.8,.8,.6,1,.6,1,.9,1,.9],['Music',1,.9,.6,1,.6,1,1,.9,.8],['Mystery',.6,1,1,.8,.6,.8,.8,.9,1],['Mythology',1,.8,.9,.9,.8,.7,.7,1,1],['Ninja',1,.8,.8,.6,.8,.9,1,.9,.9],['Pirate',.8,1,.9,.9,.7,.8,1,1,.8],['Post Apocalyptic',1,.8,1,.6,.9,.6,.6,.9,1],['Prison',1,1,.8,1,.8,.6,.7,.9,1],['Racing',.9,.6,.8,1,.7,1,1,1,.9],['Rythm',1,.7,.7,1,.6,1,1,.9,.8],['Romance',.6,1,.8,.9,.6,.9,.8,1,1],['School',.8,1,1,1,1,.8,1,.9,.7],['Sci-Fi',1,1,1,1,1,.8,.8,1,1],['Space',1,.8,.6,1,1,.7,.8,1,1],['Sports',1,.6,.6,1,.7,1,1,1,.8],['Spy',1,1,1,.8,.7,.8,.8,.9,1],['Superheroes',1,.6,.9,.6,.6,.7,1,1,1],['Surgery',.8,.7,.6,1,.7,.6,.8,1,.9],['Technology',.6,.7,.6,1,.9,.6,.8,1,.9],['Thief',.9,.8,1,.8,.9,.7,.7,1,1],['Time Travel',.9,1,1,.7,.6,.7,.9,1,.8],['Transport',.6,.6,.6,1,1,.6,.9,1,.7],['UFO',1,.8,.6,.8,1,.8,.8,1,.9],['Vampire',1,.8,1,.6,.6,.7,.7,1,1],['Virtual Pet',.6,.8,.9,1,.9,1,1,.8,.7],['Vocabulary',.6,.6,.6,1,1,1,.9,1,.6],['Werewolf',1,.8,1,.6,.6,.7,.7,.9,1],['Wild West',.9,.7,1,.6,.6,.7,1,.9,1],['Zombies',1,.7,.9,.7,.9,1,.9,.8,1]
  ],
  platforms:[
    ['PC',.9,1,.9,1,1,.6,.8,.9,1],['Govodore 64',.9,1,.9,.9,1,.7,.8,.9,1],['TES',.8,.7,.8,.8,.7,1,1,.9,.6],['Master V',.9,.7,.8,.8,.7,1,.9,1,.7],['Gameling',.8,.7,.9,.9,.6,1,1,.9,.6],['Vena Gear',.9,.8,.8,.9,.6,1,.9,1,.8],['Vena Oasis',1,.8,.8,.9,.6,.7,.8,1,.9],['Super TES',.9,.9,.9,1,.7,.9,1,.9,.7],['Playsystem',1,.8,1,.9,.7,.6,.8,1,.9],['TES 64',.9,.8,.7,.8,.7,.9,1,.9,.9],['DreamVast',1,.7,.8,1,.7,.7,.7,1,1],['Playsystem 2',1,.8,1,.9,.7,.9,.9,1,.8],['mBox',1,.8,.9,.9,.7,.7,.8,1,.9],['Game Sphere',.8,.8,.7,.8,.7,1,.9,.9,.8],['GS',.9,.9,1,.9,.9,1,1,.9,.8],['PPS',1,.7,1,.8,.8,.8,.8,.9,1],['mBox 360',1,.9,1,.9,.7,.9,.8,.9,1],['Nuu',.8,.6,.7,1,.7,1,1,1,.7],['Playsystem 3',1,.9,.9,1,.7,.8,.8,1,.9],['grPhone',.8,.8,.7,.9,.7,1,.9,1,.6],['grPad',.8,.9,.7,.9,.9,1,.9,1,.6],['mPad',.7,.9,.8,.9,.7,.9,.7,.9,.8],['Wuu',.9,.7,.8,1,.7,1,.9,1,.7],['OYA',.9,.7,.8,.9,.8,1,.8,1,.9],['mBox One',1,.8,.9,.9,.7,.9,.7,1,.8],['Playsystem 4',1,.8,1,.9,.7,.9,.8,1,.9],['Swap',.9,.8,1,.8,.7,1,.9,1,.8],['mBox Next',.9,.9,.9,.8,.7,1,.9,1,.8],['Playsystem 5',1,.7,.9,1,.7,.9,.8,1,.9]
  ],
  basePriorities:{
    Action:[1,.9,.7,.6,.9,1,.8,1,.9],
    Adventure:[.7,.8,1,1,.8,.7,1,.9,.8],
    RPG:[.7,.9,1,1,.9,.8,1,.9,.8],
    Simulation:[.9,1,.8,.7,.9,1,.8,1,.9],
    Strategy:[.9,1,.8,.7,1,.9,1,.8,.9],
    Casual:[.6,1,.7,.7,1,.6,.7,1,.9]
  },
  adjustments:{
    Sports:{Action:[.9,null,1,.7,.8,1,.6,null,null],Adventure:[null,.9,null,null,.9,null,null,null,null],RPG:[null,1,.9,null,null,null,.7,1,.9],Simulation:[null,null,null,.8,null,null,.7,null,null],Strategy:[.8,1,.9,null,null,null,.8,1,.9]},
    Racing:{Action:[null,.9,null,null,null,null,.7,.9,1],Simulation:[null,null,null,null,null,null,.7,.9,1],Strategy:[null,null,null,null,null,null,.7,.9,1]},
    Mystery:{Action:[.9,.8,1,.9,1,.8,1,.8,.9],Simulation:[.8,1,.9,.8,1,.9,1,.8,.9],Strategy:[.8,1,.9,.8,1,.9,1,.8,.9]},
    Horror:{Action:[null,null,null,.7,1,.9,.9,.8,1],Adventure:[null,null,null,null,null,null,.7,.9,1]},
    Detective:{Action:[.9,.8,1,.9,1,.8,1,.8,.9],Simulation:[.8,1,.9,.8,1,.9,1,.8,.9],Strategy:[.8,1,.9,.8,1,.9,1,.8,.9]},
    Cyberpunk:{Action:[1,.8,.9,.8,1,.9,1,.9,.8],Adventure:[null,null,null,null,null,null,1,.9,.8],Simulation:[null,null,null,null,null,null,1,null,null],Strategy:[null,null,null,null,null,null,1,null,null]},
    Law:{Action:[null,null,null,1,.8,.9,null,null,null],Simulation:[.8,.9,1,1,.8,.9,1,.9,.8],Casual:[null,null,null,1,.9,null,null,null,null]},
    Music:{Action:[null,null,null,null,null,null,.8,.9,1],Adventure:[null,null,null,null,null,null,.9,.8,1],RPG:[null,null,null,null,null,null,.9,.8,1],Simulation:[null,null,null,null,null,null,.8,.9,1],Strategy:[null,null,null,null,null,null,.9,.8,1],Casual:[null,null,null,null,null,null,.7,.9,1]}
  }
};
