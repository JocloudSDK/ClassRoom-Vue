<template>
  <div class="test">
    just for test
    <button type="button" name="button"></button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      etm: null
    }
  },
  create () {},
  mounted () {},
  methods: {
    init () {
      console.log('初始化方法')
      // this.etm = new ElectronThunderManager()
      // const result = this.etm.initialize('1833618279', 0)
      // console.log('初始化结果 : ', result)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
