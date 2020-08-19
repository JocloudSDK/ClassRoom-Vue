export default {
  methods: {
    buildCommand (key, value, jsonValue) {
      return JSON.stringify({
        key: key,
        value: !value ? '' : (typeof value === 'number' ? String(value) : value),
        jsonValue: !jsonValue ? '' : jsonValue
      })
    }
  }
}
