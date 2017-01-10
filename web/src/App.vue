<template>
  <div id="app">
    <words-cloud-renderer></words-cloud-renderer>
    <div class='language-picker no-print' :class='{ "list-expanded": listState.expanded }'>
      <a href='#' class='header no-select' :class='{ "context-visible": isContextVisible }'  @click.prevent='toggleList' >
      Most used words in
      <drop-click :selected='languages.selected' :items='languages.list'
                  @selected='updateSelectedLanguage'>
        <template slot='item' scope='props'>
          <option :value='props.item.extension'>{{props.item.text}}</option>
        </template>
      </drop-click> files
      </a>


      <div class='word-list'>
        <div class='all-words list' :class='{ "context-visible": isContextVisible }'>
          <a class='line' v-for='word in allWords' @click.prevent='selectWord(word.text)' href='#' :title='word.text'>
            <div class='place'>{{word.place}}</div>
            <div class='word'>{{word.text}}</div>
            <div class='count' align='right'>{{word.total}}</div>
          </a>
        </div>
        <div class='context' :class='{ "context-visible": isContextVisible }'>
          <div class='context-header'>
            <a href='#' class='back-to-all' @click.prevent='closeContext'>all &rarr;&nbsp;</a>
            <a href='#' class='context-word'  @click.prevent='toggleList'>{{sideBar.header}}</a>
          </div>
          <div class='list'>
            <div class='line' v-for='line in sideBar.lines'>
              <div class='parts' :title='line.text'>
                <span v-for='part in line.parts' :class='{highlight: part.bold}'>{{part.text}}</span>
              </div>
              <div class='count'>{{line.count}}</div>
            </div>
          </div>
        </div>
      </div>

      <a href='#' class='expand-list context-action' @click.prevent='toggleList' >{{listState.expanded ? 'hide list' : 'show list'}}</a>
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
    toggleList(e) {
      if (e.target.nodeName === 'SELECT') return;

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
small-sidebar-height = 70px;

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
    color: #999;
    padding: 20px 10px;
    font-size: 22px;
    background-color: black;
    position: relative;
  }
}

.no-select {
  user-select: none;
  cursor: default;
}

.context-action {
  position: absolute;
  color: #999;
  top: 4px;
  right: 10px;
  font-size: 12px;
}

.back-to-all {
  color: #999;
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
    transition: transform .25s ease;
  }

  .list {
    overflow-y: auto;
  }

  .all-words {
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

    }
  }

  .context {
    transform: translate(sidebar-width, 0);

    left: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    color: white;

    .context-header {
      margin: 0;
      font-size: 1.17em;
      height: small-sidebar-height;
      background-color: #111;
      position: relative;
      display: flex;
      flex-shrink: 0;
      padding: 0 10px;

      a {
        line-height: small-sidebar-height;
      }

      .context-word {
        color: white;
        flex: 1;
        display: block;
      }
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
    transition: transform .25s ease;
  }

  .all-words.context-visible {
    transform: translate(-(sidebar-width), 0);
  }
}

#app {
  color: #999;
}

.scene-container {
  position: absolute;
  left: sidebar-width;
  top: 0;
  bottom: 0;
  right: 0;
}

@media print {
  .no-print, .no-print * {
    display: none !important;
  }
}

@media (min-width: 670px) {
  .line:hover {
    background-color: #333;
    color: white;
  }
}

@media (max-width: 670px) {
  .expand-list {
    display: block;
    height: 60px;
  }
  .scene-container {
    left: 0;
    bottom: small-sidebar-height;
  }

  .list {
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }
  .language-picker {
    width: 100%;
    height: small-sidebar-height;
    bottom: 0;

    .header.context-visible {
      display: none;
    }

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
