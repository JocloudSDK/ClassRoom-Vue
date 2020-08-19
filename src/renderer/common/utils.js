function randomid () {
  return String(parseInt(Math.random() * (900000000) + 1000000000, 10))
}

const RANDOM_ROOMID = () => {
  return String(parseInt(Math.random() * (9000000) + 10000000, 10))
}

const UID = randomid()
export default {
  UID,
  RANDOM_ROOMID,
  randomid
}
