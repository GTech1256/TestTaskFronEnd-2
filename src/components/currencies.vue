<template lang="pug">

  .items
    div(v-for="params in inputs" class="flex items__item")
      label(:for=" params.name")
        h1 {{params.value}}

      .items__item_input(
        @click="openSmartSelect(params.name, params.data)"
      )
        p {{ textInputs(params) }}
    div(class="flex items__item")
      label(for="data")
          h1 Дата/Время*

      input(
        type="date"
        id="datetime"
        required
        v-model="datetime"
      )

    .btn(@click="getData")
      p Получить данные

</template>
<script>

import axios from 'axios';
import localDB from '../../static/localDB';

const mainLink = 'https://koshelek.ru/api';

const apiEnum = {
  cities: () => (`${mainLink}/ads/locations/cities`),
  countryCodes: () => (`${mainLink}/ads/locations/countryCodes`),
  dataByDateBuyOnline: (date, isBuy, isOnline) => {
    let onlineText = isOnline === undefined || isOnline === null ? '' : isOnline ? '/online/' : '/local/';
    const buyText = isBuy === undefined || isBuy === null ? '' : isBuy ? 'buy/' : 'sell/';
    if (buyText === '') { onlineText = ''; }
    return `${mainLink}/ads/${buyText}${onlineText}${date}`;
  },
};


export default {
  props: [
    'picked',
  ],
  data() {
    return {
      datetime: null,
      cities: [],
      selects: {
        isBuy: {
          value: 'Покупка/Продажа*:',
          name: 'isBuy',
          data: ['Продажа', 'Покупка'],
        },
        isOnline: {
          value: 'Online/Offline:',
          name: 'isOnline',
          data: ['Онлайн', 'Локально'],
        },
        /* currency: {
          value: 'Валюта:',
          name: 'currency',
          data: [],
          picked: '',
        }, */
        country: {
          value: 'Страна:',
          name: 'country',
          data: [],
        },
        cities: {
          value: 'Город:',
          name: 'cities',
          data: this.cities,
        },
      },
    };
  },
  async created() {
    try {
      const response = await axios.get(apiEnum.countryCodes());
      this.selects.country.data = response.data;
    } catch (e) {
      console.log(e);
      this.$emit('showMsg', { type: 'crash', text: `${e}. Ошибка отправки/принятия запроса, регионы загружены из локальный БД.` });
      this.selects.country.data = localDB.countryCodes;
    }
  },
  methods: {
    textInputs(params) {
      return this.picked[params.name] === undefined || this.picked[params.name] === null ?
        params.data && params.data[0] ? 'Выбрать значение' :
          'Нет значений' : this.picked[params.name];
    },
    openSmartSelect(name, items) {
      if (items.length > 0) {
        this.$emit('pickData', { name, items });
      }
    },
    async getData() {
      try {
        // нормализация времени
        let date = this.datetime;
        date = new Date(date);
        if (date === '' || typeof date.getMonth !== 'function') {
          this.$emit('showMsg', { type: 'warning', text: 'Не правильный формат даты' });
          return;
        }
        date = date.toISOString();
        // нормализация Покупка/Продажа
        let isBuy = this.picked.isBuy;
        isBuy = isBuy === 'Покупка' ? true : isBuy === 'Продажа' ? false : undefined;

        if (typeof isBuy !== 'boolean') {
          this.$emit('showMsg', { type: 'warning', text: 'Покупка/Продажа не выбрана' });
          return;
        }

        // нормализация isOnline
        let isOnline = this.picked.isOnline;
        isOnline = isOnline === 'Онлайн' ? true : isOnline === 'Локально' ? false : undefined;


        const link = apiEnum.dataByDateBuyOnline(date, isBuy, isOnline);

        console.log(link);

        const response = await axios.get(link);
        if (response.data.length === 0) {
          this.$emit('showMsg', { type: 'info', text: 'По вашему запросу нечего не найдено' });
        }

        this.$emit('showTable', response.data);
      } catch (e) {
        console.log(e);
        console.log(e.response);
        this.$emit('showMsg', { type: 'crash', text: `${e}Ошибка отправки/принятия запроса` });
      }
    },
  },
  watch: {
    picked: {
      handler(oldV, { country }) {
        const countrys = this.selects.country.data;
        const countryCode = country;

        let cities = [];

        if (typeof countryCode === 'string') {
          cities = countrys.filter(val => val.countryCode === countryCode);
          cities = cities.map(item => item.cities);
        }

        this.selects.cities.data = cities;
      },
      deep: true,
    },
  },
  computed: {
    inputs() {
      let selects = this.selects;
      selects = Object.keys(selects).map(item => selects[item]);
      return selects;
    },
  },
};
</script>
<style lang="stylus">


h1
  font-size:1.5rem

#datetime
  padding 10px

</style>

