<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style lang="stylus">

mainColor = #ffffff

.flex {
  display: flex;
}

* {
  transition:background .2s linear;
  font-style:normal;
  font-family: "Roboto", helvetica, arial, sans-serif;
}

</style>
