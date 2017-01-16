module.exports = {
  // these symbols are ignored in the source code. Keep in mind, this is
  // a javascript code, so each \\ here is \ in SQL code
  symbols: "[,;\\t#%$+&^\\-`!*/\\}\\\\?\\{\\(\\)\\[\\]<>|@:\"\\'.=]",
  // I noticed that license text contributes the most to overall set of words.
  // While it was interesting at the begnining it became boring very quickly.
  // So, we will completely ignore lines that contain any of these license "markers"
  words: '(' + [
    '\\blicense',
    '\\bcopyright holders\\b',
    '\\bnoninfringement',
    '\\bwarranty',
    '\\bwarranties',
    '\\bmerchantability',
    '\\bfitness',
    '\\blaw',
    '\\bfree software\\b',
    '\\bcopyright',
    '\\brights',
    '\\bgnu',
    '\\bgpl',
    '\\blgpl',
    '\\bmit',
    '\\bbsd',
    '\\bliability',
    '\\bbusiness interruption',
    '\\bfranklin st', // free software foundation address
    '\\bmay\\b', // i noticed "may" appears mostly in licenses too..
    '\\bsoftware',
    '\\bin the hope', // This program is distributed in the hope that it will be useful,
    '\\bpermi',
    '\\bobtain',
    '\\bdisclaimer',
    '\\bdamage',
    '\\bprocurement',
    '\\bany later',
    '\\bany way',
    '\\bany direct',
    '\\bany kind'
  ].join('|') + ')'
};
