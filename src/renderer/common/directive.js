export default {
  install (Vue, options) {
    Vue.directive('test', {
      inserted: (el, binding, vnode) => {
        if (!binding.value) return
        el.innerHTML = binding.value
      }
    })

    Vue.directive('drag', {
      inserted: (el, binding, vnode) => {}
    })
  }
}
