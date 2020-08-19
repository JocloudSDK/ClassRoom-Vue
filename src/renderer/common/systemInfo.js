const plateformFun = () => {
  const plateform = window.navigator.userAgent
  let _result = 'web'
  if (plateform.match('Mac')) {
    _result = 'mac'
    return _result
  }
  if (plateform.match('win')) {
    _result = 'win'
    return _result
  }
  return _result
}

export const plateform = plateformFun()
