<template lang="pug">

  .items
    .flex.items__item(
      v-for="params in inputs"
      @click="openSmartSelect(params.name, params.data, $event)"
    )
      label(:for="params.name")
        h1 {{params.value }}

      .items__item_input
        p {{ textInputs(params) }}

    label.flex.items__item(for="datetime")
      span
          h1 Дата/Время*
      input(
        type="datetime-local"
        id="datetime"
        required
        v-model="datetime"
      )
    label.flex.items__item(for="numItemsFromBack")
      span
          h1 Количество элементов*:
      input.items_load(
        type="number"
        id="numItemsFromBack"
        required
        v-model="numItemsFromBack"
      )

    .btn.flex(@click="getData")
      p Получить данные

</template>
<script>

import axios from 'axios';
import fakeDB from '../../../static/fakeDB/index';

function getValidDate(dateText) {
  // нормализация времени
  const date = new Date(dateText);
  if (date === '' || typeof date.getMonth !== 'function') {
    throw ({ type: 'info', text: 'Не правильный формат даты' });
  }
  if (date.getTime() === 0) {
    throw ({ type: 'info', text: 'Дата/Время не указаны' });
  }
  return date.toISOString();
}
function getValidIsBuy(isBuy) {
  isBuy = isBuy === 'Покупка' ? true : isBuy === 'Продажа' ? false : undefined;

  if (typeof isBuy !== 'boolean') {
    throw ('showMsg', { type: 'warning', text: 'Покупка/Продажа не выбрана' });
  }
  return isBuy;
}


const mainLink = 'https://koshelek.ru/api';
let oldCountry;

const apiEnum = {
  cities: () => (`${mainLink}/localbitcoins/cities`),
  countryCodes: () => (`${mainLink}/localbitcoins/countryCodes`),
  dataByDateBuyOnline: (date, isBuy, isOnline) => {
    let onlineText = isOnline === undefined || isOnline === null ? '' : isOnline ? 'online/' : 'local/';
    const buyText = isBuy === undefined || isBuy === null ? '' : isBuy ? 'buy/' : 'sell/';
    if (buyText === '') { onlineText = ''; }
    return `${mainLink}/localbitcoins/${buyText}${onlineText}${date}`;
  },
};


export default {
  props: [
    'picked',
  ],
  data() {
    return {
      datetime: null,
      numItemsFromBack: 100,
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
      this.selects.country.data = fakeDB.Localbitcoins.countrys;
    }
  },
  methods: {
    textInputs(params) {
      return this.picked[params.name] === undefined || this.picked[params.name] === null ?
        params.data && params.data[0] ? 'Выбрать значение' :
          'Нет значений' : this.picked[params.name];
    },
    openSmartSelect(name, items, { pageX, pageY }) {
      if (items && items.length > 0) {
        const dataForEmit = { name, items, pos: { pageX, pageY } };
        this.$emit('pickData', dataForEmit);
      } else {
        switch (name) {
          case 'country':
            this.$emit('showMsg', { type: 'info', text: 'Страны еще не загрузились' });
            break;
          case 'cities':
            this.$emit('showMsg', { type: 'info', text: 'Сначало нужно выбрать страну' });
            break;
          default:
            break;
        }
      }
    },
    async getData() {
      try {
        // нормализация времени
        const date = getValidDate(this.datetime);

        // нормализация Покупка/Продажа
        const isBuy = getValidIsBuy(this.picked.isBuy);

        // нормализация isOnline
        let isOnline = this.picked.isOnline;
        isOnline = isOnline === 'Онлайн' ? true : isOnline === 'Локально' ? false : undefined;
        //

        let link = apiEnum.dataByDateBuyOnline(date, isBuy, isOnline);

        // вынести в отдельную функцию с циклом значений ? : &
        link += '?';
        const validContry = this.picked.country && this.picked.country.length > 0;
        // если выбрана страна
        if (validContry) {
          link += `&countryCode=${this.picked.country}`;
        }
        // если выбран город
        const validCity = this.picked.cities && this.picked.cities.length > 0;
        if (validCity && validContry) {
          link += `&city=${this.picked.cities.replace(' ', '%20')}`;
        }
        if (!isNaN(parseInt(this.numItemsFromBack, 10))) {
          link += `&top=${this.numItemsFromBack}`;
        }
        // добавление доп полей ?countryCode=10&city=10&currency=10&top=10
        // console.log(link);

        (async function setResult(vm) {
          try {
            const response = await axios.get(link);
            if (response.data.length === 0) {
              vm.$emit('showMsg', { type: 'info', text: 'По вашему запросу нечего не найдено' });
            }


            vm.$emit('showTable', response.data);
          } catch (e) {
            vm.$emit('showTable', fakeDB.Localbitcoins.result);
            vm.$emit('showMsg', { type: 'crash', text: 'Ошибка получение результата. Данные загружены из локального хранилища' });
          }
        }(this));
      } catch (e) {
        // console.log(e);
        this.$emit('showMsg', { type: e.type, text: e.text });
      }
    },
  },
  watch: {
    picked: {
      handler({ country }) {
        if (oldCountry !== country) {
          const countrys = this.selects.country.data;
          const countryCode = country;

          let cities = [];

          if (typeof countryCode === 'string') {
            cities = countrys.filter(val => val.countryCode === countryCode);

            this.selects.cities.data = cities.map(item => item.cities)[0];
          }

          oldCountry = country;
        }
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

.items_load
  outline:none;
  padding: 0;
  border: 0;
  font-size 2rem
  margin auto 0
  width 10%
  text-align center


</style>

