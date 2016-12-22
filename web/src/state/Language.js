import Promise from 'bluebird';
import request from '../utils/request';

const path = 'static/data';

export default class Language {
  constructor(extension/* , text */) {
    this.extension = extension;
    this.text = `.${extension}`;
    this.positions = null;
  }

  markSelected(isSelected) {
    this.selected = isSelected;
  }

  getLinesWithWord(word) {
    if (!this.context) {
      // this means we haven't downloaded data yet.
      const resolveLater = new Promise((resolve) => {
        this.pendingWordContext = { resolve, word };
      });
      return resolveLater;
    }

    return this.buildLinesWithWord(word);
  }

  load() {
    if (this.positions) {
      return Promise.resolve(this.positions);
    }

    // First of all, kick off download of words positions
    const prefix = `${path}/${this.extension}`;
    const positionsDownloadPromise = request(`${prefix}/index.json`).then((positions) => {
      this.positions = positions;
      return positions;
    });

    // Secondary (not as important), download context where words are used.
    request(`${prefix}/context.json`).then((ctx) => {
      this.context = makeContext(ctx);
      if (this.pendingWordContext) {
        this.buildLinesWithWord(this.pendingWordContext.word).then((lines) => {
          this.pendingWordContext.resolve(lines);
          this.pendingWordContext = null;
        });
      }
    });

    return positionsDownloadPromise;
  }

  buildLinesWithWord(word) {
    if (!this.context) throw new Error('You are not supposed to call this function directly. use getLinesWithWord() instead');
    const wordContext = this.context[word];
    if (!wordContext) throw new Error(`${word} is not part of the ${this.extension}. How did you get here?`);

    return Promise.resolve(wordContext);
  }
}

function makeContext(arrayOfWords) {
  const context = Object.create(null);
  arrayOfWords.forEach((word) => {
    context[word.word] = {
      word: word.word,
      lines: word.context,
      total: getTotal(word.context),
    };
  });

  return context;
}

function getTotal(lines) {
  let sum = 0;
  lines.forEach((line) => {
    sum += line[1];
  });
  return sum;
}
