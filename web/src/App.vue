<template>
  <div id="app">
    <words-cloud-renderer></words-cloud-renderer>
    <div class='language-picker'>
      <div class='header'>
      Most used words in
      <drop-click :selected='languages.selected' :items='languages.list'
                  @selected='updateSelectedLanguage'>
        <template slot='item' scope='props'>
          <option :value='props.item.extension'>{{props.item.text}}</option>
        </template>
      </drop-click> files
      </div>
      <div class='word-list'>
        <table cellspacing='0'>
          <tr class='line' v-for='line in allWords'>
            <td align='right' class='place'>{{line.place}}</td>
            <td>{{line.word}}</td>
            <td class='count' align='right'>{{line.total}}</td>
          </tr>
        </table>
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
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.9);
  height: 100%;
  width: 300px;
  box-shadow: 0 -2px 22px rgba(0,0,0,.4);
  .header {
    padding: 20px 10px;
    font-size: 22px;
    background-color: black;
  }
}
.word-list {
  overflow-y: auto;
  width: 100%;
  flex: 1;

  table {
    width: 100%;
  }

  tr.line {
    cursor: pointer;
    &:hover {
      background-color: #333;
      color: white;
    }
  }
  td.place {
    padding: 0 4px 0 10px;
  }
  td.count {
    padding-right: 10px;
  }
}
#app {
  color: #999;
}

blockquote {
  box-shadow: 0 0 6px rgba(0,0,0,0.5);
  padding: .75em .5em .75em 1em;
  max-width: 400px;
  border-left: 0.5em solid #DDD;
}
</style>
