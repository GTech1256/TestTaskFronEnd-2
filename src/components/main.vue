<template lang="pug">

div(class="panel")
  smartSelect(:show="showPicker" :data="dataForPick" @itemPicked="setPickedItem")
  div(id="center")
    div(class="flex panel__tabs")
      template(v-for="tab in tabs")
        input(
          type="radio"
          name="flex"
          :id="tab.name.eng"
          :checked="tab.name.eng === tabs[currentTabIndex].name.eng"
        )
        label(:for="tab.name.eng" @click="currentTabIndex = tab.id" class="panel__tabs_label")
          p(@click="tableData=[]") {{tab.name.eng}}
      //.lang(@click="changeLang" :style="{backgroundImage: getLangImage}")
          p {{lang}}
    #message
      h1 * - Обязательно
    transition(name="fade")
      message( :message="message" v-if="showMessage")

    transition(name="fade" mode="out-in")
      component(
        :key="tabs[currentTabIndex].id"
        class="panel__content_itm"
        :is="tabs[currentTabIndex].value"
        @pickData="showSelect($event)"
        :picked="pickedData"
        @showMsg="ShowMsg"
        @showTable="showTable"
        @itemPicked="setPickedItem"
        :typeRate= 'tabs[currentTabIndex].typeRate'
        :mainLink= 'tabs[currentTabIndex].mainLink'
      )

    tableResponse(:data="tableData" v-if="tableData.length > 0")
    h1(v-else) Нет Данных


</template>
<script>
// import MarketRates from './tabs/MarketRates';
import Localbitcoins from './tabs/Localbitcoins';
// import ExchangerRates from './tabs/ExchangerRates';
import rates from './tabs/rates';

import smartSelect from './smartSelect';
import tableResponse from './tableResponse';
import message from './message';

function startScroll(elementID) {
  const divPos = document.getElementById(elementID).offsetTop;
  const toUP = document.documentElement.scrollTop > divPos;
  const pexelsScroll = toUP ? -6 : 6;

  const interval = setInterval(() => {
    const docPos = document.documentElement.scrollTop;

    if (!toUP && docPos > divPos) {
      clearInterval(interval);
    } else if (toUP && docPos < divPos) {
      clearInterval(interval);
    } else {
      window.scrollBy(0, pexelsScroll);
    }
  }, 1);
}

export default {

  data() {
    return {
      tabs: [
        {
          id: 0,
          name: { eng: 'Rates p2p/OTC', rus: 'P2P/OTC' },
          value: rates,
          typeRate: 'markets',
          mainLink: 'https://koshelek.ru/api/MarketRates',
        },
        {
          id: 1,
          name: { eng: 'Rates Crypto Exchanges', rus: 'Биржи' },
          value: Localbitcoins,
        },
        {
          id: 2,
          name: { eng: 'Rates Exchange points', rus: 'Обменники' },
          value: rates,
          typeRate: 'exchangers',
          mainLink: 'https://koshelek.ru/api/ExchangerRates',
        },
      ],
      tabNow: rates,
      lang: {
        langNow: 0,
        langs: ['rus', 'eng'],
      },
      currentTabIndex: 2,
      showPicker: false,
      dataForPick: [],
      pickedData: {},
      showMessage: false,
      message: { type: 'info', text: 'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum' },
      tableData: [],
      messageInterval: null,
    };
  },
  watch: {
    currentTabIndex() {
      this.pickedData = {};
    },
    tableData(data) {
      if (data.length > 0) {
        setTimeout(() => {
          startScroll('toTable');
        }, 500);
      }
    },
  },
  methods: {
    changeLang() {
      // console.log('nLang');
      const lang = this.lang;
      lang.langNow = lang.langNow === 0 ? 1 : 0;
      this.lang = lang;
    },
    showSelect(event) {
      this.showPicker = true;
      this.dataForPick = event;
    },
    setPickedItem(event) {
      this.showPicker = false;
      this.dataForPick = '';
      if (event) {
        this.$set(this.pickedData, event.name, event.item);
      }
    },
    ShowMsg(event) {
      if (this.showMessage) {
        clearInterval(this.messageInterval);
      } else {
        this.showMessage = true;
      }
      this.message = event;

      const vm = this;


      this.messageInterval = setTimeout(() => {
        vm.showMessage = false;
      }, 3000);

      startScroll('message');
    },
    showTable(event) {
      this.tableData = event;
    },
  },
  components: {
    smartSelect,
    tableResponse,
    message,
  },
};

</script>
<style lang="stylus">

mainColor= #3AA6D0
lightColor= #62B1D0
darkenColor= darken(mainColor,15%)
darkColor= darken(mainColor,40%)
greyColor= #b4b4b4
lightGreyColor= #d9d9d9

panelColor = white
tabsColor = #cccccc

body
  background-color: darkenColor
  font-family: arial


ul
  list-style-type none

label
  margin-right 15px

.panel__tabs > input
  display:none

.panel__tabs_label
  padding:.2em 1em
  margin: 0px .25em 0 0;
  border-radius: 20px
  font-size 1.5rem
  &:hover
    background tabsColor
    cursor pointer
    transform translateY(-2px)
    box-shadow 6px 6px 6px 0px rgba(0,0,0,.3)


input:checked + .panel__tabs_label
  font-weight bold
  background darken(tabsColor,10%)
  transform translateY(-5px)
  box-shadow 6px 6px 6px 0px rgba(0,0,0,.2)


.flex
  display: flex;

.float
  display float

.panel
  background-color: panelColor
  margin: 20px;
  padding: 50px;
  border:1px solid black
  border-radius:5px;
  min-height:700px;
  box-shadow: 0px 0px 30px 0px rgba(50, 48, 50, 0.43);


.panel__content
  flex-direction: column


.panel__content_itm
  margin: 5px;
  margin-bottom 50px

.lang
  margin-left: auto;

.items__item
  padding 10px
  display:flex
  width:60%
  justify-content: space-between
  border-bottom: 1px hidden grey
  margin-bottom:20px
  padding-bottom: 10px
  align-items: center;
  &:hover
    transform: translateY(-3px);
    box-shadow: 6px 6px 6px 0 rgba(0,0,0,0.2);
    border 1px solid rgba(0,0,0,0.2)

.items__item:hover .items__item_input
  transform: translateY(-1px);
  box-shadow: 2px 2px 2px 0 rgba(0,0,0,0.2);


.items__item:focus
  border-bottom-style: solid
  margin-bottom:9px

.items__item_input
  margin auto 0
  padding 0 40px
  border 1px solid lightGreyColor
  border-radius 5px;
  cursor pointer
  text-align center

.items__item_input:hover
  border-color greyColor
  background-color:lightGreyColor

.items__item_input:active
  border-color black
  background-color:greyColor

.btn
  cursor pointer
  background-color:mainColor
  text-align center
  width:150px;
  height: 50px;
  color:white
  border-radius:10px
  &:hover
    background-color:lightColor
    box-shadow: 6px 6px 6px 0 rgba(0,0,0,0.2);
    border 1px solid rgba(0,0,0,0.2)
  &:active
    background-color:darkColor
    box-shadow: none
  > p
    margin auto


select, input
  height:3em
  border-radius:10px
  min-width:100px

.fade-enter-active, .fade-leave-active
  transition: opacity ease-out .5s

.fade-enter, .fade-leave-to
  opacity: 0


//@media (max-width: 1200px)


//@media (max-width: 992px)


//@media (max-width: 768px)


@media (max-width: 768px)
  .items__item
    flex-direction column
    justify-content center

  .panel
    padding 20px

  .panel__tabs_label
    font-size 1rem

  .items__item:hover
    background: none

  #center
    justify-content center

  #message
    display flex
    justify-content center

  .items__item
    margin 30px auto

  .btn
    margin auto

@media (max-width: 400px)
  .panel
    margin 1px

  .panel__tabs_label
    font-size .7rem


</style>

