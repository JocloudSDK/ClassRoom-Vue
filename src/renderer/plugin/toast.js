import Toast from '@/components/toast'

export default {
  install (Vue, options) {
    const ToastContrustor = Vue.extend(Toast)

    function Toasts (message, duration = 2000) {
      const toast = new ToastContrustor({
        el: document.createElement('div'),
        data () {
          return {
            message: message,
            showToast: true,
            showContent: true
          }
        }
      })

      document.body.appendChild(toast.$el)

      const timer = setTimeout(() => {
        toast.showContent = false
        clearTimeout(timer)
      }, duration - 250)

      const timers = setTimeout(() => {
        toast.showToast = false
        clearTimeout(timers)
      }, duration)
    }

    Vue.prototype.$toast = Toasts
  }
}
