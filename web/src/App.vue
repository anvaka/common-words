<template>
  <div id="app">
    <words-cloud-renderer></words-cloud-renderer>
    <div class='language-picker no-print' :class='{ "list-expanded": listState.expanded }'>
      <div class='header'>
      Most used words in
      <drop-click :selected='languages.selected' :items='languages.list'
                  @selected='updateSelectedLanguage'>
        <template slot='item' scope='props'>
          <option :value='props.item.extension'>{{props.item.text}}</option>
        </template>
      </drop-click> files
      <a href='#' class='expand-list context-action' @click.prevent='toggleList' >{{listState.expanded ? 'hide list' : 'show list'}}</a>
      </div>
      <div class='word-list'>
        <div class='all-words' :class='{ "context-visible": isContextVisible }'>
          <a class='line' v-for='word in allWords' @click.prevent='selectWord(word.text)' href='#' :title='word.text'>
            <div class='place'>{{word.place}}</div>
            <div class='word'>{{word.text}}</div>
            <div class='count' align='right'>{{word.total}}</div>
          </a>
        </div>
        <div class='context' :class='{ "context-visible": isContextVisible }'>
          <h3>
            <a href='#' class='context-action' @click.prevent='closeContext'>back to all</a>
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
import DropClick from './components/DropClick';

export default {
  name: 'app',
  components: {
    WordsCloudRenderer,
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
    },
    toggleList() {
      this.listState.expanded = !this.listState.expanded;
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

sidebar-width = 300px;

* {
  box-sizing: border-box;
}
body {
  padding: 0;
  margin: 0;
  overflow: hidden;
  font-family: Abel, sans-serif;
}

a {
  text-decoration: none;
}

.language-picker {
  position: absolute;
  display: flex;
  flex-direction: column;
  background: #191919;
  height: 100%;
  width: sidebar-width;
  box-shadow: 0 -2px 22px rgba(0,0,0,.4);
  .header {
    padding: 20px 10px;
    font-size: 22px;
    background-color: black;
  }
}

.context-action {
  position: absolute;
  color: #999;
  top: 4px;
  right: 10px;
  font-size: 12px;
}
.expand-list { display: none; }

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
    display: flex;
    flex-direction: column;

    .line {
      color: #999;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;

      .place {
        padding: 4px 4px 0 10px;
        font-size: 12px;
        color: #444;
        width: 40px;
      }

      .word {
        font-size: 1.17em;
        padding: 8px 0;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
      }


      &:hover {
        background-color: #333;
        color: white;
      }
    }
  }

  .context {
    transform: translate(sidebar-width, 0);

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

    .highlight {
      color: orangered;
    }
  }

  .count {
    padding-right: 10px;
  }

  .context-visible {
    transform: translate(0, 0);
    transition: all .25s ease;
  }

  .all-words.context-visible {
    transform: translate(-(sidebar-width), 0);
  }
}

#app {
  color: #999;
}

@media print {
  .no-print, .no-print * {
    display: none !important;
  }
}

@media (max-width: 670px) {
  .expand-list { display: block; }
  .language-picker {
    width: 100%;
    height: 70px;
    bottom: 0;
    transition: height .25s ease-out;

    .context {
      transform: translate(100vw, 0);
    }

    .all-words.context-visible {
      transform: translate(-(100vw), 0);
    }
    .context-visible {
      transform: translate(0, 0);
    }
  }
  .language-picker.list-expanded {
    height: 100%;
  }
}

</style>
