<template>
  <div v-if='vm.show' class='sidebar-lines'>
    <h3>{{vm.header}}</h3>
    <div class='lines-with-word'>
      <div class='line' v-for='line in vm.lines'>
        <div class='parts'>
          <span v-for='part in line.parts' :class='{highlight: part.bold}'>{{part.text}}</span>
        </div>
        <div class='count'>{{line.count}}</div>
      </div>
    </div>
    <a href='#' class='close-sidebar' @click.prevent='close'>close</a>
  </div>
</template>

<script>
export default {
  props: ['vm'],
  methods: {
    close() {
      this.vm.close();
    },
  },
};
</script>

<style lang='stylus'>
.close-sidebar {
  position: absolute;
  color: #aaa;
  text-decoration: none;
  right: 10px;
  top: 10px;
  font-size: 10px;
}
.sidebar-lines {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 300px;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 -2px 22px rgba(0,0,0,.4);
  color: white;

  h3 {
    margin: 0;
    padding: 20px 10px;
    background-color: #333;
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
</style>
