<template>
  <div id="app">
    <h3>Common Language</h3>
    <h4>
      Visualization of most common words in code
    </h4>
    <blockquote>
      <p>I querried 1.9TB of source code to build this website!</p>
      <footer>anvaka - author of `Common Language`</footer>
    </blockquote>
  </div>
</template>

<script>
import Hello from './components/Hello';

export default {
  name: 'app',
  components: {
    Hello,
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
#app {
  color: #2c3e50;
  margin-top: 60px;
}
h3, h4 {
  text-align: center;
}
blockquote {
  box-shadow: 0 0 6px rgba(0,0,0,0.5);
  padding: .75em .5em .75em 1em;
  max-width: 400px;
  border-left: 0.5em solid #DDD;
}
</style>
