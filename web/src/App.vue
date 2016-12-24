<template>
  <div id="app">
    <words-cloud-renderer></words-cloud-renderer>
    <div class='language-picker'>
      <div>
      Most used words in
      <drop-click :selected='languages.selected' :items='languages.list'
                  @selected='updateSelectedLanguage'>
        <template slot='item' scope='props'>
          <option :value='props.item.extension'>{{props.item.text}}</option>
        </template>
      </drop-click> files
      </div>
      <div>
        <a href='#' @click.prevent='openGlobalSideBar'>Show all as a list</a>
      </div>
    </div>
    <word-context-sidebar :vm='sideBar'></word-context-sidebar>
  </div>
</template>

<script>
import appState from './state/appState';
import WordsCloudRenderer from './components/WordsCloudRenderer';
import WordContextSidebar from './components/WordContextSidebar';
import DropClick from './components/DropClick';

export default {
  name: 'app',
  components: {
    WordsCloudRenderer,
    WordContextSidebar,
    DropClick,
  },
  data() {
    return appState;
  },
  methods: {
    updateSelectedLanguage(newLanguage) {
      appState.updateSelected(newLanguage);
    },
  },
};
</script>

<style lang="styl">
* {
  box-sizing: border-box;
}
body {
  padding: 0;
  margin: 0;
  overflow: hidden;
  font-family: Abel, sans-serif;
}

.language-picker {
  position: absolute;
  background: white;
}
#app {
  color: #2c3e50;
}

blockquote {
  box-shadow: 0 0 6px rgba(0,0,0,0.5);
  padding: .75em .5em .75em 1em;
  max-width: 400px;
  border-left: 0.5em solid #DDD;
}
</style>
