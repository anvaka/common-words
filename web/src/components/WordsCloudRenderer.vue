<template>
  <svg>
    <g ref='scene'></g>
  </svg>
</template>

<script>
import panzoom from 'panzoom';
import svg from 'simplesvg';
import bus from '../state/bus';
import appState from '../state/appState.js';
import clap from '../utils/clap.js';

export default {
  mounted() {
    bus.on('loading', this.clearScene, this);
    bus.on('loaded', this.renderScene, this);

    this.zoomer = panzoom(this.$refs.scene);
    this.scene = svg(this.$refs.scene);
    this.disposeClap = clap(this.scene, this.selectText.bind(this));
  },

  destroyed() {
    bus.off('loading', this.clearScene, this);
    bus.off('loaded', this.renderScene, this);
    this.zoomer.dispose();
    this.disposeClap();
  },

  methods: {
    clearScene() {
      this.scene.innerHTML = '';
    },

    selectText(e) {
      if (e.target.tagName !== 'text') return;

      appState.selectWord(e.target.text());
    },


    renderScene(positions) {
      positions.forEach((p) => {
        let transform = `translate(${p.x}, ${p.y})`;
        if (p.rotate) transform += ' rotate(-90)';

        const text = svg('text', {
          transform,
          x: p.dx,
          'font-size': p.fontSize,
          'font-family': p.fontFamily,
          'dominant-baseline': 'text-before-edge',
          fill: '#000',
        });
        text.text(p.text);

        this.scene.appendChild(text);
      });
    },
  },
};
</script>

<style lang='styl'>
svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

</style>
