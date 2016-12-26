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
        <div class='all-words' :class='{ "context-visible": isContextVisible }'>
          <table cellspacing='0'>
            <tr class='line' v-for='line in allWords'>
              <td align='right' class='place'>{{line.place}}</td>
              <td>{{line.word}}</td>
              <td class='count' align='right'>{{line.total}}</td>
            </tr>
          </table>
        </div>
        <div class='context' :class='{ "context-visible": isContextVisible }'>
          <h3>
            <a href='#' class='close-context' @click.prevent='closeContext'>back to all</a>
            {{sideBar.header}}
          </h3>
          <div class='lines-with-word'>
            <div class='line' v-for='line in sideBar.lines'>
              <div class='parts' :title='line.text'>
                <span v-for='part in line.parts' :class='{highlight: part.bold}'>{{part.text}}</span>
              </div>
              <div class='count'>{{line.count}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
    closeContext() {
      this.sideBar.close();
    }
  },
  computed: {
    isContextVisible() {
      return this.sideBar.show;
    }
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
  overflow: hidden;
  width: 100%;
  flex: 1;
  position: relative;

  .all-words, .context {
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    transition: all .25s ease;
  }
  .all-words {
    overflow-y: auto;
  }

  .context {
    transform: translate(300px, 0);

    left: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    color: white;

    h3 {
      margin: 0;
      padding: 20px 10px;
      background-color: #333;
      position: relative;
    }
    .close-context {
      position: absolute;
      color: #999;
      top: 4px;
      right: 10px;
      font-size: 12px;
      text-decoration: none;
    }
    .lines-with-word {
      overflow-y: auto;
    }

    .line {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      border-bottom: 1px solid #333;
      padding: 10px 0;
      .parts {
        padding-left: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .count {
      padding-right: 10px;
    }

    .lines-with-word {
    }

    .highlight {
      color: orangered;
    }
  }

  .context-visible {
    transform: translate(0, 0);
    transition: all .25s ease;
  }

  .all-words.context-visible {
    transform: translate(-300px, 0);
  }
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
