<template lang="pug">

  div(class="items")
    div(v-for="params in selects" class="flex items__item")
      label(:for="params.name" @click="this.$emit('pickData',['тест','da'])" )
        h1 {{params.value}}
      div(
        class="items__item_input"
        @click="$emit('pickData', { name: params.name, items: params.data })"
      )
        p {{ picked[params.name]|| 'Выбрать значение' }}
    .btn(@click="getRates")
      p Получить данные

</template>
<script>

import axios from 'axios';
import localDB from '../../static/localDB';

const mainLink = 'https://koshelek.ru/api/Rates';
const pairsLink = `${mainLink}/pairs`;
const marketsLink = `${mainLink}/markets`;

export default {
  props: [
    'picked',
  ],
  data() {
    return {
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
  async created() {
    try {
      const pairsResponse = await axios.get(pairsLink);
      let { data } = pairsResponse;
      this.selects[0].data = data;
      // this.selects[0].picked = data[0];

      const marketsResponse = await axios.get(marketsLink);

      ({ data: { data } = marketsResponse });

      this.selects[1].data = data;
      // this.selects[1].picked = data[0];
    } catch (e) {
      console.error(e);
      this.$emit('showMsg', { type: 'crash', text: 'Ошибка отправки/принятия запроса' });
    }
  },
  methods: {
    async getRates() {
      try {
        const pair = this.picked.pairs;
        if (!pair) {
          this.$emit('showMsg', { type: 'warning', text: 'Пара не выбрана' });
          return;
        }
        let link = `${mainLink}/${pair}`;

        const markets = this.picked.markets;
        if (!markets) {
          this.$emit('showMsg', { type: 'info', text: 'Биржа не учтена т к не выбрана' });
        } else {
          link += `/${markets}`;
        }
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
  },
};
</script>
<style lang="stylus">


.flex
  display:flex


h1
  font-size:1.5rem


</style>

