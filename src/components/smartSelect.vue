<template lang="pug">
div
  transition(name="modal")
    .div__mask(v-show="show")
      .div__container
        div(class="float div__container_head")
          input(
            class="div__container_head_input"
            v-model="query"
            autofocus
            placeholder="Введите название..."
            @click="numPage = 1"
          )
          .div__container_head_cancel(@click="sendEmit(data.name, null)")
            p X
        pagination(
          :numPage="numPage"
          :dataLength="dataLenght"
          :itemOnPage="itemsSize"
          @newPage="newPage"
        )
        div(class="flex div__container_items")
          template(v-if="data.items.length > 0" v-for="item in smartScroll ")
            p.div__container_item(@click="sendEmit(data.name, item)") {{ item }}
          p.div__container_noData(v-else) noData

</template>
<script>
import pagination from './pagination';

export default {
  props: [
    'show',
    'data',
  ],
  components: {
    pagination,
  },
  data() {
    return {
      query: '',
      numPage: 1,
      itemsSize: 20,
    };
  },
  methods: {
    close() {
      this.numPage = 1;
      this.query = '';
    },
    sendEmit(name, item) {
      this.close();
      this.$emit('itemPicked', { name, item });
    },
    newPage(NumberPage) {
      this.numPage = NumberPage;
    },
  },
  computed: {
    sortItems() {
      let { items } = this.data;

      if (typeof items[0] === 'object') {
        const keys = Object.keys(items[0]);

        items = items.map(item => item[keys[0]]);
      }

      const sortedItems = items.sort();
      return sortedItems;
    },
    smartSearch() {
      if (this.data.length === 0 || !this.data.items) {
        // this.$emit('itemPicked', { name: '', item: undefined });
        // this.sendEmit('', null);
        return [];
      }
      if (this.sortItems.length < 1) {
        return [];
      }
      const vm = this;
      return this.sortItems.filter(item =>
        item.toLowerCase().indexOf(vm.query.toLowerCase()) !== -1,
      );
    },
    smartScroll() {
      const itemsSize = this.itemsSize;

      const offset = (this.numPage - 1) * itemsSize; // start
      const endItems = itemsSize + offset; // end

      const items = this.smartSearch;
      const newArr = items.slice(offset, endItems);
      return newArr;
    },
    dataLenght() {
      if (this.smartSearch) {
        return this.smartSearch.length || 0;
      }
      return 0;
    },
  },
};
</script>
<style lang="stylus">
* {
    box-sizing: border-box;
    transition:all .2s linear;
}

.div__mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    transition: opacity .3s ease;
    overflow-y visible
    overflow-x hidden
}

.div__container {
    min-width 350px
    width: 50%
    margin: 40px auto 0;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif;
}


.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .div__container,
.modal-leave-active .div__container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.div__container_head
  height 50px

.div__container_head_input
  float left
  padding 10px
  max-width 70%

.div__container_head_cancel
  float right
  border-radius 10px
  background-color #f68181
  padding 5px 20px
  margin-left 20px
  text-align center
  font-size .5em
  cursor pointer
  &:hover
    transform translateY(-1px)
    box-shadow 4px 4px 4px 0 rgba(150,0,0,.3)

.div__container_head
  margin 10px

.div__container_pagination
  justify-content space-around
  font-size 3rem
  font-weight bold

.div__container_pagination_prev, .div__container_pagination_next
  cursor pointer
  border 1px solid grey
  border-radius 5px
  margin auto
  padding 10px 50px


.div__container_items
  flex-wrap: wrap


.div__container_item
  cursor pointer
  border 1px solid grey
  border-radius 10px
  padding 5px
  margin 7px
  &:hover
    transform translateY(-1px)
    box-shadow 2px 2px 2px 0px rgba(0,0,0,.3)

@media (max-width: 768px)
  .div__container
      padding 20px

</style>
