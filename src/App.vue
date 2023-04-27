<script lang="ts" setup>
import { RouterView } from 'vue-router'
import { darkTheme, NConfigProvider, NGlobalStyle } from 'naive-ui'
</script>

<template>
  <NConfigProvider :theme="darkTheme">
    <NGlobalStyle />
    <main>
      <RouterView />
    </main>
  </NConfigProvider>
</template>
