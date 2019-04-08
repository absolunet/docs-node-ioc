<template>
  <main-layout>
    <router-view />
  </main-layout>
</template>

<script>
  import MainLayout from './components/layout/Main';

  export default {
      components: {
          MainLayout
      }
  }
</script>