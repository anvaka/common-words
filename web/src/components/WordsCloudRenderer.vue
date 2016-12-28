<template>
  <div class='scene-container'>
    <svg>
      <g ref='scene'></g>
    </svg>
  </div>
</template>

<script>
/* globals document window */
import panzoom from 'panzoom';
import asyncFor from 'rafor';
import svg from 'simplesvg';
import bus from '../state/bus';
import appState from '../state/appState.js';
import colors from '../utils/colors.js';
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
      removeAllChildren(this.scene);
    },

    selectText(e) {
      if (e.target.tagName !== 'text') return;

      appState.selectWord(e.target.text());
    },

    renderScene(positions) {
      const theme = colors.brownee;
      document.body.style.backgroundColor = theme.back;
      const scene = this.scene;

      recenter(this.scene, this.zoomer, positions);

      asyncFor(positions, renderWord, () => 0, {
        probeElements: 20
      });

      function renderWord(p) {
        let transform = `translate(${p.x}, ${p.y})`;
        if (p.rotate) transform += ' rotate(-90)';

        const text = svg('text', {
          transform,
          x: p.dx,
          'font-size': p.fontSize,
          'font-family': p.fontFamily,
          'dominant-baseline': 'text-before-edge',
          fill: randomFromArray(theme.text),
        });
        text.text(p.text);

        scene.appendChild(text);
      }
    },
  },
};

function recenter(scene, zoomer, positions) {
  let maxX = 0;
  let maxY = 0;

  positions.forEach((p) => {
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  });

  scaleToFit(scene.ownerSVGElement.parentNode, zoomer, maxX, maxY);
}

function scaleToFit(container, zoomer, sceneWidth, sceneHeight) {
  // This will make sure that our svg fits vertically and horizontally
  const xScale = container.clientWidth / sceneWidth;
  const yScale = container.clientHeight / sceneHeight;
  const uniformScale = Math.min(xScale, yScale); // pick the smaller one so it fits when scaled
  zoomer.zoomAbs(0, 0, uniformScale);

  // also center it inside the screen:
  const dx = (container.clientWidth - sceneWidth * uniformScale) / 2;
  const dy = (container.clientHeight - sceneHeight * uniformScale) / 2;
  zoomer.moveTo(dx, dy);
}

function randomFromArray(array) {
  const idx = Math.round(Math.random() * 1000) % array.length;
  return array[idx];
}

// no worries! this function removes only DOM elements...
function removeAllChildren(node) {
  if ('innerHTML' in node) {
    node.innerHTML = '';
  } else {
    // Say Hi to IE!
    while (node.hasChildNodes()) {
      node.removeChild(node.lastChild);
    }
  }
}
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
