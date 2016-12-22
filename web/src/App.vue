<template>
  <div id="app">
    <words-cloud-renderer></words-cloud-renderer>
    <div class='language-picker'>
      Most used words in <select v-model='languages.selected'>
        <option v-for='lang in languages.list' :value='lang.extension'>{{lang.text}}</option>
      </select> files.
    </div>
    <sidebar :vm='sideBar'></sidebar>
  </div>
</template>

<script>
import appState from './state/appState';
import WordsCloudRenderer from './components/WordsCloudRenderer';
import Sidebar from './components/Sidebar';

export default {
  name: 'app',
  components: {
    WordsCloudRenderer,
    Sidebar,
  },
  data() {
    return appState;
  },
  watch: {
    'languages.selected': function updateSelected(newValue) {
      appState.updateSelected(newValue);
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
