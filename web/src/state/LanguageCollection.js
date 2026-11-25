import { markRaw } from 'vue';
import Language from './Language.js';
import bus from './bus.js';

export default class LanguageCollection {
  constructor() {
    this.known = {};
    this.list = [];
    this.selected = '';
  }

  add(extension, text, displayExtensions) {
    if (this.known[extension] !== undefined) throw new Error('Extension is already registered');

    this.known[extension] = this.list.length;
    // Languages hold large, immutable data sets (word positions and contexts).
    // There is no need to make them reactive.
    this.list.push(markRaw(new Language(extension, text, displayExtensions)));
  }

  select(extension) {
    const currentSelected = this.getLanguageByExtension(this.selected);
    if (currentSelected) currentSelected.markSelected(false);

    const newSelected = this.getLanguageByExtension(extension);
    if (!newSelected) throw new Error(`unknown langauge ${extension}`); // hm.. how is this possible?

    this.selected = extension;
    bus.fire('loading');
    newSelected.loadPositions().then((positions) => {
      bus.fire('loaded', positions);
    });
    newSelected.loadContext().then((context) => {
      bus.fire('context-changed', context);
    });
  }

  getLanguageByExtension(extension) {
    const languageIndex = this.known[extension];
    return this.list[languageIndex];
  }
}
