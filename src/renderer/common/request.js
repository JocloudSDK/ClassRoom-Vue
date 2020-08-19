import axios from 'axios'

axios.interceptors.request.use(req => {
  req.headers['X-CSRF-TOKEN'] = Date.now().toString()
  return req
}, err => {
  console.log('axios interceptors req error: ', err)
})

axios.interceptors.response.use(res => {
  return res.data
})

export default ({
  method = 'GET',
  url,
  body,
  params,
  headers,
  raw = false
}) => {
  axios.defaults.timeout = 60 * 1000
  axios.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8'

  return new Promise((resolve, reject) => {
    axios({
      url,
      method,
      data: body,
      params,
      headers
    }).then(res => {
      return resolve(res)
    }).catch(err => {
      return resolve(err)
    })
  })
}
