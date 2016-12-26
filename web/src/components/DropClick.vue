<template>
<div class='drop-click-container'>
  <span class='drop-click-name' :title='selectedName' :class='{hover: hover}'>
    {{selectedName}}
    <div class='button-dropdown'>&nbsp;</div>
  </span>

  <select class='back-dropdown' v-model='selectedInternal'
        @mouseenter='triggerMouseEnter(true)'
        @mouseleave='triggerMouseEnter(false)'
        @focus='triggerMouseEnter(true)'
        @blur='triggerMouseEnter(false)'>
    <slot name='item' v-for='item in items' :item='item'></slot>
  </select>
</div>
</template>

<style lang='stylus'>
.drop-click-container {
  display: inline-block;
  position: relative;

  .button-dropdown {
    display: inline-block;
    width: 0;
    height: 0;
    border: 4px solid transparent;
    border-top-color: white;
    opacity: 0.8;
    vertical-align: middle;
  }

  .back-dropdown {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
    opacity: 0;
  }

  .drop-click-name {
    color: white;
    overflow: hidden;
    display: inline-block;
    vertical-align: bottom;
    height: 100%;
    white-space: nowrap;
    &.hover {
      color: orange;
      .button-dropdown {
        border-top-color: orange;
      }
    }
  }
}
</style>
<script>
export default {
  props: {
    items: {
      default: []
    },
    selected: {
      default: ''
    },
  },
  data() {
    return {
      hover: false,
      selectedInternal: this.selected,
    };
  },
  watch: {
    selectedInternal() {
      this.$emit('selected', this.selectedInternal);
    },
  },
  computed: {
    selectedName() {
      return this.selected;
    },
  },
  methods: {
    getValue(item) {
      return item.value || item.name;
    },
    triggerMouseEnter(isEnter) {
      this.hover = isEnter;
    }
  }
};
</script>
