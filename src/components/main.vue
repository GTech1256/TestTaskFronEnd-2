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
    h1(id="message") * - Обязательно
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

.panel__tabs_label:hover
  background tabsColor
  cursor pointer


input:checked + .panel__tabs_label
  font-weight bold
  background darken(tabsColor,10%)


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
  display:flex
  width:60%
  justify-content: space-between
  border-bottom: 1px hidden grey
  margin-bottom:20px
  padding-bottom: 10px
  align-items: center;

.items__item:hover
  background: linear-gradient(
    to top,
    rgba(28,98,210,0.5) 0%,
    rgba(255,255,255,0.69) 17%,
    rgba(255,255,255,1) 100%
  )
  border-bottom-style: solid
  margin-bottom:19px

.items__item:focus
  border-bottom-style: solid
  margin-bottom:9px

.items__item_input
  padding 10px 40px
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
  align-content: flex-end
  background-color:mainColor
  width:150px;
  height: 50px;
  line-height: 50px;
  color:white
  text-align:center
  content-align:middle
  border-radius:10px

.btn:hover
  background-color:darkenColor

.btn:active
  background-color:darkColor

select, input
  height:3em
  border-radius:10px
  min-width:100px

.fade-enter-active, .fade-leave-active
  transition: opacity ease-out .5s

.fade-enter, .fade-leave-to
  opacity: 0

/*
vue transition name="currentTabIndex === 0 ? 'component-left':'component-right'"
слайдер глючит
.component-right-enter-active {
  display: inline-block;
  animation: btnOff .3s ease-in-out;
}

.component-right-leave-active {
  display: inline-block;
  animation: btnOn .3s ease-in-out;
}

.component-left-enter-active {
  display: inline-block;
  animation: btnOn .3s ease-in-out;
  animation-direction: reverse;
}

.component-left-leave-active {
  display: inline-block;
  animation: btnOff .3s ease-in-out reverse;
}

@keyframes btnOn {
  from { transform: translateX(0px); opacity: 1; }
  to { transform: translateX(-40px); opacity: 0; }
}

@keyframes btnOff {
  from { transform: translateX(40px); opacity: 0;}
  to { transform: translateX(0px); opacity: 1; }
}
*/

//@media (max-width: 1200px)


//@media (max-width: 992px)


//@media (max-width: 768px)


@media (max-width: 768px)
  .items__item
    flex-wrap wrap

  .panel
    padding 20px

  .panel__tabs_label
    font-size 1rem

  .items__item:hover
    background: none

@media (max-width: 400px)
  .panel
    margin 1px

  .panel__tabs_label
    font-size .7rem


</style>

