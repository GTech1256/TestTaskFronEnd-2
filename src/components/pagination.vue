<template lang="pug">
  div
    .flex.div__pagination(v-show="didShowPagination")
      p.arrow(class="div__pagination_prev" :class="{disable:disablePrevBtn}" @click="prevPage") <
      p.el(v-show="showDots.first" @click="selectPage(1)") 1
      p.el(
        v-show="showDots.first"
        id="prevDots"
        @click="selectPage(numPage - 10)"
      ) -10
      template(v-for="num in middleNums")
        p.el(:class="{active:num.isActive}" @click="selectPage(num.num)") {{ num.num }}
      p.el(
        id="nextDots"
        v-show="showDots.second"
        @click="selectPage(numPage + 10)"
      ) +10
      p.el(v-show="showDots.second" @click="selectPage(maxPages)") {{ maxPages }}
      p.arrow(:class="{disable:disableNextBtn, div__pagination_next:true}" @click="nextPage") >
    .div__mobile.flex
      p.arrow(class="div__pagination_prev" :class="{disable:disablePrevBtn}" @click="prevPage") <
      input.div__mobile_input(type="number" placeholder="число страницы" :value="numPage" )
      p.arrow(:class="{disable:disableNextBtn, div__pagination_next:true}" @click="nextPage") >
    hr
</template>
<script>
export default {
  props: [
    'dataLength',
    'itemOnPage',
  ],
  data() {
    return {
      numPage: 1,
    };
  },
  methods: {
    nextPage() {
      if (this.numPage + 1 <= this.maxPages) {
        this.selectPage(this.numPage + 1);
      }
    },
    prevPage() {
      if (this.numPage - 1 !== 0) {
        this.selectPage(this.numPage - 1);
      }
    },
    selectPage(pageNumber) {
      const realPageNumber = pageNumber < 0 ?
        0 : pageNumber > this.maxPages ?
          this.maxPages : pageNumber;

      this.numPage = realPageNumber;
      this.$emit('newPage', realPageNumber);
    },
  },
  computed: {
    showDots() {
      return {
        first: this.numPage > 2,
        second: this.numPage + 1 < this.maxPages,
      };
    },
    middleNums() {
      const numPage = this.numPage;
      let middleNums = [
        {
          num: numPage,
          isActive: true,
        },

      ];
      if (numPage > 1) {
        middleNums.push({ num: numPage - 1 });
      }
      if (!this.disableNextBtn) {
        middleNums.push({ num: numPage + 1 });
      }
      middleNums = middleNums.sort((a, b) => (a.num > b.num ? 1 : b.num > a.num ? -1 : 0));
      return middleNums;
    },
    maxPages() {
      return Math.ceil(this.dataLength / this.itemOnPage);
    },
    didShowPagination() {
      return this.maxPages !== 0 && this.maxPages !== 1;
    },
    disablePrevBtn() {
      return parseInt(this.numPage, 10) === 1;
    },
    disableNextBtn() {
      return parseInt(this.numPage, 10) === parseInt(this.maxPages, 10);
    },
  },
};
</script>
<style lang="stylus" scoped>

mainColor= #3AA6D0
lightColor= #62B1D0
darkenColor= darken(mainColor,20%)
darkColor= darken(mainColor,40%)
greyColor= #b4b4b4
lightGreyColor= #d9d9d9


.disable
  cursor default
  opacity .2
  color: grey

p
  cursor pointer
  padding 10px

p:hover
  color: mainColor
  border-color: mainColor

.div__pagination
  margin 0
  justify-content space-around
  font-size 1.5rem

.el
  border 1px solid black;
  border-radius 5px;

.active
  cursor default
  color: darkenColor
  border-color: darkenColor
  border-width: 3px


.div__container_pagination
  justify-content space-around
  font-size 3rem
  font-weight bold


#prevDots #nextDots
  color red


.arrow
  opacity .7

.div__mobile
  display none
  margin 0
  justify-content space-between
  font-size 1.5rem

.div__mobile_input
  padding 10px

@media (max-width: 920px)
  /*.div__pagination
    display none
  .div__mobile
    display flex*/


  .arrow
    display none

@media (max-width: 450px)
  *
    font-size 1rem
  .el
    padding 5px 5px

@media (max-width: 280px)
  *
    font-size .8rem
  .el
    padding 4px 4px


</style>
