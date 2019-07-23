require('./xrray')(Array);

console.log("start");

let a = [];

a[1] = "ewq"
a[3] = "qwe"

a.ea((e, i) => {
  return new Promise((res) => {
    setTimeout(() => {
      console.log(e, i);
      res()
    }, 1000)
  })
})
