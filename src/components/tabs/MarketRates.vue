<template lang="pug">

  .items
    .items__params
      label.items__params_checkbox(
        for="didLoadByMarket"
        title="Пары, которыех нет в бирже будут убраны"
      )
        span.items__params_by_pairs_text Загружать пары из биржи
        input.items__params_by_pairs_input(
          type="checkbox"
          id="didLoadByMarket"
          v-model="didLoadByMarket"
          checked
        )

    .items__item.flex(v-for="params in selects")
      label(:for="params.name" @click="this.$emit('pickData',['тест','da'])" )
        h1 {{params.value}}
      .items__item_input( @click="$emit('pickData', { name: params.name, items: params.data })" )
        p {{ picked[params.name] || 'Выбрать значение' }}
        p {{ picked }}
    .btn(@click="getRates")
      p Получить данные

</template>
<script>

// import customCheckbox from '../customCheckbox';


import axios from 'axios';
import localDB from '../../../static/localDB';

/*

GET /api/MarketRates/{pair}           Gets historical data about pair rate || date from | date to

GET /api/MarketRates/{pair}/{market}  Gets historical data about pair rate on concrete market ||
date from | date to

GET /api/MarketRates/pairs            Gets all pairs

GET /api/MarketRates/pairs/{market}   Gets market pairs

GET /api/MarketRates/markets          Gets all markets

 */

const mainLink = 'https://koshelek.ru/api/MarketRates';
const pairsLink = `${mainLink}/pairs`;
const marketsLink = `${mainLink}/markets`;

let oldMarket;

export default {
  props: [
    'picked',
  ],
  components: {
    // customCheckbox,
  },
  data() {
    return {
      didLoadByMarket: true,
      pairsData: [],
      marketsData: [],
      selects: [
        {
          value: 'Пара*:',
          name: 'pairs',
          data: [],
          picked: '',
        },
        {
          value: 'Биржа:',
          name: 'markets',
          data: [],
          picked: '',
        },
      ],
    };
  },
  watch: {
    async didLoadByMarket(didLoadByMarket) {
      if (didLoadByMarket) {
        this.loadPairsByMarket();
      } else if (this.picked.markets) {
        const marketsResponse = await axios.get(pairsLink);

        const { data } = marketsResponse;


        this.pairsData = data;
      }
    },
    picked: {
      handler({ markets }) {
        if (markets !== oldMarket) {
          if (this.didLoadByMarket) {
            this.loadPairsByMarket();
            this.$emit('itemPicked', { name: 'pairs' });
          }
          oldMarket = markets;
        }
      },
      deep: true,
    },
    pairsData(data) {
      this.selects[0].data = data;
      console.log('new pairs', data.length);
    },
    marketsData(data) {
      this.selects[1].data = data;

      /*
      if (!this.picked.markets) {
        return;
      }
      */
    },
  },
  async created() {
    try {
      console.log(pairsLink);
      const pairsResponse = await axios.get(pairsLink);
      let { data } = pairsResponse;
      // to normalize name
      // data = this.normalizePairsByAssociation(data);

      this.pairsData = data;

      const marketsResponse = await axios.get(marketsLink);

      ({ data: { data } = marketsResponse });


      this.marketsData = data;
    } catch (e) {
      console.error(e);
      this.$emit('showMsg', { type: 'crash', text: 'Ошибка отправки/принятия запроса' });
    }
  },
  methods: {
    async getRates() {
      try {
        let pair = this.picked.pairs;
        if (!pair) {
          this.$emit('showMsg', { type: 'warning', text: 'Пара не выбрана' });
          return;
        }
        pair = pair.replace('/', '%2');
        let link = `${mainLink}/${pair}`;

        let markets = this.picked.markets;
        if (!markets) {
          this.$emit('showMsg', { type: 'info', text: 'Биржа не учтена т к не выбрана' });
        } else {
          markets = markets.replace('/', '%2');
          link += `/${markets}`;
        }
        console.log(link);
        const response = await axios.get(link);
        if (response.data.length === 0) {
          this.$emit('showMsg', { type: 'info', text: 'По вашему запросу нечего не найдено' });
        }
        this.$emit('showTable', response.data);
      } catch (e) {
        console.log(e);
        this.$emit('showMsg', { type: 'crash', text: `${e}. Ошибка отправки/принятия запроса. Данные загружены из локальной БД` });
        this.$emit('showTable', localDB.pars);
      }
    },
    normalizePairsByAssociation(array) {
      // array ['','']
      const { associaces } = localDB;
      const newArr = array.map((item) => {
        const newName = associaces[item] || item;
        return newName;
      });
      console.log(newArr);
      return newArr;
    },
    async loadPairsByMarket() {
      let markets = this.picked.markets;
      if (!markets) {
        return;
      }
      markets = markets.replace('/', '%2');
      const link = `${pairsLink}/${markets}`;

      console.log(link);
      const response = await axios.get(link);
      this.pairsData = response.data;
    },
  },
};
</script>
<style lang="stylus">

lightGreyColor= #d9d9d9

.items__params_checkbox
  display flex
  max-width 30%
  border 2px solid lightGreyColor
  border-radius 20px
  padding 20px

  margin 20px 0


.items__params_by_pairs_text
  font-weight: bold
  margin auto 0

.items__params_by_pairs_input
  max-width 30%


h1
  font-size:1.5rem


</style>

