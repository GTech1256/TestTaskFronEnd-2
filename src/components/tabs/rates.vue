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

    .flex.items__item(
      v-for="params in selects"
      @click="emitPick(params,$event)"
    )
      label(:for="params.name" )
        h1 {{exchangersName(params)}}
      .items__item_input
        p {{ textInputs(params) }}

    label.flex.items__item(for="dateFrom")
      span
          h1 Первый день

      input(
        type="datetime-local"
        id="dateFrom"
        required
        v-model="dateFrom"
      )
    label.flex.items__item(for="dateTo")
      span
          h1 Последний день

      input(
        type="datetime-local"
        id="dateTo"
        required
        v-model="dateTo"
      )

    .btn.flex(@click="getRates")
      p Получить данные

</template>
<script>

// import customCheckbox from '../customCheckbox';


import axios from 'axios';
import localDB from '../../../static/localDB';

function didValidDate(dateFrom, dateTo) {
  if (!dateFrom || dateFrom.getTime() === 0 || !dateTo || dateTo.getTime() === 0) {
    return {
      status: false,
      message: 'Время не учтено т к не выбрано',
    };
  }
  if (dateFrom.getTime() >= dateTo.getTime()) {
    return {
      status: false,
      message: 'Время не учтено т к выбран не правильный промежуток',
    };
  }
  return {
    status: true,
    message: 'всё хорошо',
  };
}

let oldMarket;

export default {
  props: [
    'picked',
    'mainLink',
    'typeRate',
  ],
  components: {
    // customCheckbox,
  },
  data() {
    return {
      dateFrom: null,
      dateTo: null,
      didLoadByMarket: true,
      pairsData: [],
      exchangersData: [],
      selects: [
        {
          value: 'Пара*:',
          name: 'pairs',
          data: [],
          picked: '',
        },
        {
          value: ['Биржа:', 'Обменники:'],
          name: 'exchangers',
          data: [],
          picked: '',
        },
      ],
    };
  },
  async created() {
    try {
      const pairsResponse = await axios.get(this.getLinks.pairs);
      let { data } = pairsResponse;
      // to normalize name
      // data = this.normalizePairsByAssociation(data);

      this.pairsData = data;
      const exchangersResponse = await axios.get(this.getLinks.second);
      ({ data: { data } = exchangersResponse });


      this.exchangersData = data;
    } catch (e) {
      console.error(e);
      this.$emit('showMsg', { type: 'crash', text: 'Ошибка отправки/принятия запроса' });
    }
  },
  computed: {
    getLinks() {
      return {
        pairs: `${this.mainLink}/pairs`,
        second: `${this.mainLink}/${this.typeRate}`,
      };
    },
  },
  watch: {
    async didLoadByMarket(didLoadByMarket) {
      if (didLoadByMarket) {
        this.loadPairsByMarket();
      } else if (this.picked.exchangers) {
        const exchangersResponse = await axios.get(this.getLinks.pairs);

        const { data } = exchangersResponse;


        this.pairsData = data;
      }
    },
    picked: {
      handler({ exchangers }) {
        if (exchangers !== oldMarket) {
          if (this.didLoadByMarket) {
            this.loadPairsByMarket();
            this.$emit('itemPicked', { name: 'pairs' });
          }
          oldMarket = exchangers;
        }
      },
      deep: true,
    },
    pairsData(data) {
      this.selects[0].data = data;
    },
    exchangersData(data) {
      this.selects[1].data = data;
    },
  },
  methods: {
    emitPick({ name, data }, { clientX, clientY }) {
      const dataForEmit = { name, items: data, pos: { clientX, clientY } };
      console.log(dataForEmit);
      this.$emit('pickData', dataForEmit);
    },
    exchangersName({ name, value }) {
      if (name !== 'exchangers') {
        return value;
      }
      // this.typeRate = 'exchangers';
      const indexValue = this.typeRate === 'exchangers' ? 1 : 0;
      return value[indexValue];
    },
    textInputs(params) {
      return this.picked[params.name] === undefined || this.picked[params.name] === null ?
        params.data && params.data[0] ? 'Выбрать значение' :
          'Нет значений' : this.picked[params.name];
    },
    async getRates() {
      try {
        // вынести в отдельный js

        // getPairs
        let pair = this.picked.pairs;
        if (!pair) {
          this.$emit('showMsg', { type: 'warning', text: 'Пара не выбрана' });
          return;
        }
        pair = pair.replace('/', '%2');
        //

        let link = `${this.mainLink}/${pair}`;

        // getExchangers
        let exchangers = this.picked.exchangers;
        if (!exchangers) {
          this.$emit('showMsg', { type: 'info', text: 'Биржа не учтена т к не выбрана' });
        } else {
          exchangers = exchangers.replace('/', '%2');
          link += `/${exchangers}`;
        }
        //

        // getDataFrom
        let dateFrom = new Date(this.dateFrom);
        let dateTo = new Date(this.dateTo);
        const didValidDateResult = didValidDate(dateFrom, dateTo);
        if (!didValidDateResult.status) {
          this.$emit('showMsg', { type: 'info', text: didValidDateResult.message });
        } else {
          dateFrom = dateFrom.toISOString();
          dateFrom = dateFrom.replace('/', '%2');
          link += `?dateFrom=${dateFrom}`;

          dateTo = dateTo.toISOString();
          dateTo = dateTo.replace('/', '%2');
          link += `&dateTo=${dateTo}`;
        }
        // console.log(link);

        // Set response
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
      const { associaces } = localDB;
      const newArr = array.map((item) => {
        const newName = associaces[item] || item;
        return newName;
      });

      return newArr;
    },
    async loadPairsByMarket() {
      let exchangers = this.picked.exchangers;
      if (!exchangers) {
        return;
      }
      exchangers = exchangers.replace('/', '%2');
      const link = `${this.getLinks.pairs}/${exchangers}`;

      const response = await axios.get(link);
      this.pairsData = response.data;
    },
  },
};
</script>
<style lang="stylus">

lightGreyColor= #d9d9d9

h1
  font-size:1.5rem

.items__params
  min-width 200px
  margin 10px

.items__params_checkbox
  display flex
  max-width 30%
  border 2px solid lightGreyColor
  border-radius 20px
  padding 20px

  margin 20px 0


.items__params_by_pairs_text
  font-weight: bold
  margin auto 10px

.items__params_by_pairs_input
  max-width 30%


.items__params_checkbox:hover
 box-shadow 6px 6px 6px 0px rgba(0,0,0,.2)

@media(max-width: 768px)

  .items__params_checkbox
    flex-direction column
    justify-content center
    align-items center
    text-align center
    margin auto


@media(max-width: 430px)
  .items__params
    font-size .7rem

  .items__params_by_pairs_input
    width 25px
    height 25px


</style>

