require('./xrray')(Array);




let a = {
  w: "qwe1",
  q: (a) => a+1,
  e: "asd"
}

let b = {
  w: "qwe",
  q: (a) => a+2,
  r: "asd"
}

let e = [a, b]


e.inner("q", [2])

console.log(e);



