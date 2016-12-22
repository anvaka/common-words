import queryState from 'query-state';
import LanguageCollection from './LanguageCollection';
import createSideBarState from './createSideBarState.js';

const qs = queryState.instance({
  lang: 'js',
});

const languages = new LanguageCollection();
languages.add('js', 'JavaScript');
languages.add('jsx', 'React');
languages.add('java', 'Java');
languages.add('css', 'Cascading Style Sheets');
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

