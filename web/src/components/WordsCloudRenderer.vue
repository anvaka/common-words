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
import { instance } from 'query-state';

import bus from '../state/bus';
import appState from '../state/appState.js';
import colors from '../utils/colors.js';
import clap from '../utils/clap.js';
import getSVGHeader from '../utils/svgHeader.js';

const queryState = instance();
const random = require('ngraph.random').random(42);

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
      const themeName = queryState.get('theme');
      const theme = colors[themeName] || colors.brownee;
      document.body.style.backgroundColor = theme.back;
      const scene = this.scene;

      recenter(this.scene, this.zoomer, positions);

      asyncFor(positions, renderWord, () => {
        window.exportSVG = exportSVG;
      }, {
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

      function exportSVG(width, height) {
        const boundingBox = scene.getBoundingClientRect();
        const scale = scene.transform.baseVal[0].matrix.a;
        const svgText = getSVGHeader(width || 1540, height || 1540, {
          width: boundingBox.width / scale,
          height: boundingBox.height / scale
        }) + '<g>' + scene.innerHTML + '</g></svg>';
        download(svgText, queryState.get('lang') + '.svg');
      }
    },
  },
};

function download(svgText, name) {
  // need to unescape/encode becuase utf8 cannot be used in btoa. See
  // http://stackoverflow.com/questions/23223718/failed-to-execute-btoa-on-window-the-string-to-be-encoded-contains-characte
  const uri = 'data:image/svg+xml;base64,' + window.btoa(window.unescape(window.encodeURIComponent(svgText)));
  const saveLink = document.createElement('a');
  const downloadSupported = 'download' in saveLink;
  if (downloadSupported) {
    saveLink.download = name;
    saveLink.href = uri;
    saveLink.style.display = 'none';
    document.body.appendChild(saveLink);
    saveLink.click();
    document.body.removeChild(saveLink);
  } else {
    window.open(uri, '_temp', 'menubar=no,toolbar=no,status=no');
  }
}

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
  return array[random.next(array.length)];
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
.scene-container svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
