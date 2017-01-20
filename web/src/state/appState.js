import queryState from 'query-state';
import LanguageCollection from './LanguageCollection';
import createSideBarState from './createSideBarState.js';
import bus from './bus.js';
import formatNumber from '../utils/formatNumber.js';

const qs = queryState.instance({
  lang: 'js',
});

const languages = new LanguageCollection();
languages.add('js', 'JavaScript');
languages.add('jsx', 'React');
languages.add('css', 'Cascading Style Sheets');
languages.add('html', 'HTML');
languages.add('java', 'Java');
languages.add('py', 'Python');
languages.add('lua', 'Lua');
languages.add('php', 'PHP');
languages.add('rb', 'Ruby');
languages.add('cpp', 'C++', '.C, .cc, .cpp, .c++, .cp, .cxx, .h');
languages.add('pl', 'Perl', '.pm');
languages.add('cs', 'C#');
languages.add('scala', 'Scala');
languages.add('go', 'Go');
languages.add('sql', 'SQL');
languages.add('rs', 'Rust');
languages.add('lisp', 'Lisp', '.lsp, .lisp');
languages.select(qs.get('lang'));

qs.onChange(() => {
  languages.select(qs.get('lang'));
});

function updateSelected(newLanguage) {
  appState.sideBar.close();
  languages.select(newLanguage);
  qs.set('lang', languages.selected);
}

function selectWord(word) {
  appState.sideBar.showContext(word);
}

const appState = {
  languages,
  listState: {
    expanded: false,
  },
  allWords: [],
  sideBar: createSideBarState(languages),
  updateSelected,
  selectWord,
};

export default appState;

bus.on('context-changed', (context) => {
  appState.allWords = Object.keys(context).map(key => context[key])
    .sort((x, y) => y.total - x.total)
    .map((value, idx) => ({
      place: idx,
      text: value.word,
      total: formatNumber(value.total)
    }));
});
