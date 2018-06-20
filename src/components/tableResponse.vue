<template lang="pug">

  div
    pagination.pagination(
      :numPage="pageNumber"
      :dataLength="data.length"
      :itemOnPage="itemOnPage"
      @newPage="newPage"
    )
    .div__itemsChange.flex
      label.div__itemsChange_text(for="numItems") Количество элементов в таблице:
      input.div__itemsChange_input(id="numItems" placeholder="20" v-model="itemOnPage")
    table(class="table-fill")
      thead
        tr
          th(class="text-left" v-for="headerText in tableType.headers")
            p {{ headerText }}

      tbody(class="table-hover")
        tr(v-for="items in paginatedItems")
          td(class="text-left" v-for="item in items")
            p {{item}}

</template>
<script>
import pagination from './pagination';

export default {
  props: [
    'data',
  ],
  components: {
    pagination,
  },
  data() {
    return {
      tables: [{
        name: 'rates',
        headers: ['Прямой курс', 'Обратный курс', 'Метка времени'],
      }, {
        name: 'ads',
        headers: ['id', 'adId', 'createdAt', 'tempPrice', 'currency', 'lat', 'lon', 'city', 'countryCode', 'locationString', 'tradeType', 'onlineProvider', 'bankName', 'maxAmount', 'minAmount', 'paymentWindowMinutes', 'userName', 'appearedAt', 'liveAt'],
      },
      ],
      pageNumber: 1,
      itemOnPage: 100,
    };
  },
  watch: {
    /* itemOnPage(oldV, newV) {
      console.log(newV);
      if (newV < 5 || oldV < 5) {
        this.itemOnPage = 5;
      }
    }, */
  },
  methods: {
    newPage(pageNum) {
      this.pageNumber = pageNum;
    },
  },
  computed: {
    tableType() {
      const lngData = Object.keys(this.data[0]).length;
      const indexTable = lngData === 2 ? 0 : 1;
      const headers = this.tables[indexTable].headers;
      // console.log(this.data[0]);
      return {
        headers,
        indexTable,
      };
    },
    paginatedItems() {
      const currentPage = this.pageNumber;// 1
      const itemOnPage = this.itemOnPage;// 11
      const items = this.normalizeItems;// [...]

      const endIndex = currentPage * itemOnPage; // index to
      const offset = endIndex - itemOnPage; // index from

      let newItems = [];
      newItems = items.slice(offset, endIndex);

      return newItems;
    },
    normalizeItems() {
      if (this.tableType.indexTable === 0) {
        let data = this.data;
        // console.log(data);
        data = data.map((item) => {
          const t = new Date(item.ts);

          /* data to 23:59:59-31/12/18. */
          // потом паттерн времени сделаю

          const textDate = `${t.getHours()}:${t.getMinutes()}:${t.getMinutes()}-${t.getDate()}/${t.getMonth()}/${t.getFullYear()}`;
          return { val: item.val, bckval: 1 / item.val, ts: textDate };
        });
        // console.log(data);
        return data;
      }
      return this.data;
    },
  },
};
</script>
<style scoped lang="stylus">
@import url(https://fonts.googleapis.com/css?family=Roboto:400,500,700,300,100);

body {
  background-color: #3e94ec;
  font-family: "Roboto", helvetica, arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  text-rendering: optimizeLegibility;
  word-wrap: break-word
}

div.table-title {
   display: block;
  margin: auto;
  max-width: 600px;
  padding:5px;
  width: 100%;
}

.pagination
  margin 0 20%

.table-title h3 {
   color: #fafafa;
   font-size: 30px;
   font-weight: 400;
   text-shadow: -1px -1px 1px rgba(0, 0, 0, 0.1);
   text-transform:uppercase;
}

.div__itemsChange
  margin 10px 35%

.div__itemsChange_text
  font-weight bold
  font-size 2rem
  cursor pointer


.div__itemsChange_input
  outline:none;
  padding: 0;
  border: 0;
  font-size 2rem
  border-bottom 1px solid #cccccc
  border-radius 0
  margin auto 0
  height 1% // border поднимает
  width 25%
  min-width 25%
  margin-right 60px
  text-align center

.div__itemsChange_input:hover
  border-bottom 1px solid grey
  font-size 4rem
  min-width 40%

.div__container_head
  margin auto

/*** Table Styles **/

.table-fill {
  background: white;
  border-radius:3px;
  border-collapse: collapse;
  height: 350px;
  margin: auto;
  max-width: 1000px;
  padding:5px;
  width: 100%;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  animation: float 5s infinite;
}

th {
  color:#D5DDE5;;
  background:#1b1e24;
  border-bottom:4px solid #9ea7af;
  border-right: 1px solid #343a45;
  font-size:23px;
  font-weight: 100;
  padding:24px;
  text-align:left;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  vertical-align:middle;
}

th:first-child {
  border-top-left-radius:3px;
}

th:last-child {
  border-top-right-radius:3px;
  border-right:none;
}

tr {
  border-top: 1px solid #C1C3D1;
  border-bottom-: 1px solid #C1C3D1;
  color:#666B85;
  font-size:16px;
  font-weight:normal;
  text-shadow: 0 1px 1px rgba(256, 256, 256, 0.1);
}

tr:hover td {
  background:#4E5066;
  color:#FFFFFF;
  border-top: 1px solid #22262e;
}

tr:first-child {
  border-top:none;
}

tr:last-child {
  border-bottom:none;
}

tr:nth-child(odd) td {
  background:#dfdfdf;
}

tr:nth-child(odd):hover td {
  background:#4E5066;
}

tr:last-child td:first-child {
  border-bottom-left-radius:3px;
}

tr:last-child td:last-child {
  border-bottom-right-radius:3px;
}

td {
  background:#FFFFFF;
  padding:20px;
  text-align:left;
  vertical-align:middle;
  font-weight:300;
  font-size:18px;
  text-shadow: -1px -1px 1px rgba(0, 0, 0, 0.1);
  border-right: 1px solid #C1C3D1;
}

td:last-child {
  border-right: 0px;
}

th.text-left {
  text-align: left;
}

th.text-center {
  text-align: center;
}

th.text-right {
  text-align: right;
}

td.text-left {
  text-align: left;
}

td.text-center {
  text-align: center;
}

td.text-right {
  text-align: right;
}

p
  margin 0

@media (max-width: 600px)
  td
    padding 10px 5px
  th
    padding 20px 10px
  *
    font-size 1rem

  p
    font-size 1rem

  .div__itemsChange
    margin 10px 20%

  .div__itemsChange_input
    font-size 1.5rem

  .div__itemsChange_input:hover
    font-size 2rem

  .div__itemsChange_text
    font-size 1rem

@media (max-width: 420px)
  p
    font-size .6rem

  .div__itemsChange
    margin 10px 10%

</style>

