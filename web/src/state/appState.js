import queryState from 'query-state';
import LanguageCollection from './LanguageCollection';
import createSideBarState from './createSideBarState.js';

const qs = queryState.instance({
  lang: 'js',
});

const languages = new LanguageCollection();
languages.add('js', 'JavaScript');
languages.add('jsx', 'React');
languages.add('css', 'Cascading Style Sheets');
languages.add('java', 'Java');
languages.add('py', 'Python');
languages.add('R', 'R');
languages.add('lua', 'Lua');
languages.add('php', 'PHP');
languages.add('rb', 'Ruby');
languages.add('cpp', 'C++');
languages.add('pl', 'Perl');
languages.add('cs', 'C#');
languages.add('go', 'Go');
languages.select(qs.get('lang'));

qs.onChange(() => {
  languages.select(qs.get('lang'));
});

function updateSelected(newLanguage) {
  languages.select(newLanguage);
  qs.set('lang', languages.selected);
}

function selectWord(word) {
  appState.sideBar.showContext(word);
  // console.log('select', word);
  // languages.getContextForWord(word).then(context => {
  //   appState.
  // });
}

const appState = {
  languages,
  sideBar: createSideBarState(languages),
  updateSelected,
  selectWord,
};

export default appState;

