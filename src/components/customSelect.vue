<template lang="pug">
  .selectPanel(:style="{ top: selectPosition.pageY+'px', left: selectPosition.pageX+'px' }")
    .panel__select
      .panel__select_item(v-for="item in getItems" @click="sendEmit(data.name, item)")
        p {{ item }}
</template>
<script>
export default {
  props: {
    data: Object,
    selectPosition: Object,
  },
  methods: {
    sendEmit(name, item) {
      // airbnb ESling don't redefine variables, use {} for 1 or more lines in IF|ELSE|IFELSE
      if (item === 'Убрать') {
        this.$emit('itemPicked', { name });
      } else {
        this.$emit('itemPicked', { name, item });
      }
    },
  },
  computed: {
    getItems() {
      const { items } = this.data;
      if (items && items.length <= 10 && items[items.length - 1] !== 'Убрать') {
        items.push('Убрать');
      }

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
  // --
  box-shadow: inset 35px 52px 133px -71px rgba(0,0,0,0.42);

.panel__select_item
  width panelWidth
  height 40px
  padding 2px 10px
  &:hover
    background-color rgba(0,0,0,0.2)
  > p
    margin 10px 0

</style>

