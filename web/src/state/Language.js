import Promise from 'bluebird';
import request from '../utils/request';

const path = 'static/data';

export default class Language {
  constructor(extension, text, displayExtensions) {
    this.extension = extension;
    const display = displayExtensions || `.${extension}`;
    this.text = `${text} - ${display}`;
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

  loadPositions() {
    if (this.positions) {
      return Promise.resolve(this.positions);
    }

    // First of all, kick off download of words positions
    const prefix = `${path}/${this.extension}`;
    const positionsDownloadPromise = request(`${prefix}/index.json`).then((positions) => {
      this.positions = positions;
      return positions;
    });

    return positionsDownloadPromise;
  }

  loadContext() {
    if (this.context) {
      return Promise.resolve(this.context);
    }

    const prefix = `${path}/${this.extension}`;
    return request(`${prefix}/context.json`).then((ctx) => {
      this.context = makeContext(ctx);

      if (this.pendingWordContext) {
        // TODO: This probably needs to be moved out from here. It's only purpose
        // here is to provide lines when someone requests `getLinesWithWord()`
        // before context is loaded.
        this.buildLinesWithWord(this.pendingWordContext.word).then((lines) => {
          this.pendingWordContext.resolve(lines);
          this.pendingWordContext = null;
        });
      }

      return this.context;
    });
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
    const lines = groupSameLines(word.context);
    context[word.word] = {
      lines,
      word: word.word,
      total: word.useCount,
    };
  });

  return context;
}

function groupSameLines(contextLines) {
  // if the same word appears twice in the line it will result be rendered twice
  // in the context
  const uniqueLines = new Map();
  contextLines.forEach((contextLine) => {
    const line = contextLine[0];
    uniqueLines.set(line, (uniqueLines.get(line) || 0) + contextLine[1]);
  });
  return Array.from(uniqueLines);
}

