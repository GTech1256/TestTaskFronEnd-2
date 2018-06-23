<template lang="pug">
  .selectPanel(:style="{ top: selectPosition.pageY+'px', left: selectPosition.pageX+'px' }")
    .panel__select
      .panel__select_item(v-for="item in getItems")
        p(@click="sendEmit(data.name, item)") {{ item }}
</template>
<script>
export default {
  props: {
    data: Object,
    selectPosition: Object,
  },
  methods: {
    sendEmit(name, item) {
      this.$emit('itemPicked', { name, item });
    },
  },
  computed: {

    getItems() {
      const { items } = this.data;
      return items;
    },
  },
};
</script>
<style lang="stylus" scoped>

panelWidth = 180px

.selectPanel
  position: absolute;
  background-color white
  box-shadow: 6px 6px 6px 0 rgba(0,0,0,0.2);
  border 1px solid rgba(0,0,0,0.2)
  // убирает линию скрола
  height: 100px;
  width: panelWidth;
  overflow: hidden;
  // --

.panel__select
// убирает линию скрола
  overflow: auto;
  padding-right: 300px
  width: panelWidth;
  height: 100px;

.panel__select_item
  width panelWidth
  height 40px
  padding 2px 10px
  &:hover
    background-color rgba(0,0,0,0.2)
  > p
    margin 10px 0

</style>

