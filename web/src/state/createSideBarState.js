export default function createSideBarState(languages) {
  const state = {
    show: false,
    header: '',
    word: '',
    showContext,
    close,
  };

  return state;

  function close() {
    state.show = false;
  }

  function showContext(word) {
    const language = languages.getLanguageByExtension(languages.selected);
    if (!language) throw new Error('How come there is no selected language?');

    language.getLinesWithWord(word)
      .then((context) => {
        state.show = true;
        state.lines = context.lines.map(line => toLineViewModel(line, word));
        state.header = `${context.word}  - ${formatNumber(context.total)}`;
      });
  }
}

function toLineViewModel(line, word) {
  const stopWord = new RegExp(`\\b${word}\\b`);
  const words = line[0].split(stopWord).map(text => ({
    text,
    bold: false,
  }));

  const parts = [];
  for (let i = 0; i < words.length - 1; ++i) {
    parts.push(words[i], {
      text: word,
      bold: true,
    });
  }
  parts.push(words[words.length - 1]);

  const count = formatNumber(line[1]);

  return {
    text: line[0],
    count,
    parts,
  };
}

function formatNumber(number) {
  return number.toString(10).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
}

