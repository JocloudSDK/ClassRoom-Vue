<template>
  <div class="small-class">
    <template v-for="(item, key) in users">
      <s-view
        :key="`key-${key}`"
        :item="item"
        :voices="voices"/>
    </template>
  </div>
</template>

<script>
import SView from './com/s-view'
export default {
  props: {
    users: [Object, Array],
    voices: Array
  },
  components: {
    SView
  },
  data () {
    return {}
  },
  methods: {}
}
</script>

<style lang="less">
.small-class {
  white-space: nowrap;
  height: 202px;
  overflow-x: scroll;
  overflow-y: hidden;
  cursor: pointer;
  &::-webkit-scrollbar {
    height: 11px;
    background: rgba(0, 0, 0, 0.1);
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: rgba(0, 0, 0, 0.2);
  }
}
</style>
