// TODO: options to give rm function that return true or false depending on if the element should be removed
// TODO: remove unsafe option (just remove all elems or indexes that are there) dont throw if invalid
// TODO: addIfNotAlreadyIncluded: collect()


class Exception extends Error {
  constructor(msg) {
    super();
    this.message = this.constructor.name;
    if (msg !== undefined) this.message += ": " + msg;
  }
}
class IndexOutOfBoundsException extends Exception {
  constructor(index, array) {
    super("Given value \"" + index + "\" must be in range 0-" + (array.length-1) + ".");
    this.index = index;
    this.array = array;
  }
}
class InvalidInputException extends Exception {
  constructor(msg) {
    super("Given input is invalid.\n" + msg);
  }
}
class InvalidValueException extends Exception {
  constructor(value, array) {
    super("Unable to find given value: " + value.constructor.name + " " + JSON.stringify(value) + "; within following array: " + array.toString());
    this.value = value;
    this.array = array;
  }
}

//Throws IndexOutOfBoundsException when given index is out of bounds of a
function isIndex(i, a) {
  if(!a.hasOwnProperty(i)) throw new IndexOutOfBoundsException(i,a);
}

function appendToPrototypeOf(of) {
  return function(name, func) {
    const isFunc = typeof func === "function"
    if (name instanceof Array) {
      for (let i = 0; i < name.length; i++) {
        appendToPrototype(name[i], func, isFunc)
      }
    }
    else appendToPrototype(name, func, isFunc)
  }

  function appendToPrototype(name, func, isFunc) {
    let ob
    if (isFunc) {
      ob = {
        value: func,
        enumerable: false
      }
    }
    else {
      ob = func
      ob.enumerable = false
    }

    Object.defineProperty(of, name, ob)
  }
}


const xrraySymbol = Symbol("xrray")

function init(Xrray = Array) {
  if (Xrray[xrraySymbol] !== undefined) return Xrray;
  if (Xrray.prototype.each !== undefined) {
    console.warn("You might be using two different versions of xrray. Check all dependencies and their sub dependencies for differences")
    return Xrray
  }
  Xrray[xrraySymbol] = true;

  const appendToXrray = appendToPrototypeOf(Xrray.prototype)


  appendToXrray(["each", "ea"], function(f, t = this) {
    if (this.length > 0) {
      let e;
      let startI;
      for (startI = 0; startI < t.length; startI++) {
        if (t.hasOwnProperty(startI)) {
          e = f.call(t, t[startI], startI, this);
          break;
        }
      }
      startI++;
      if (e instanceof Promise) {
        return (async () => {
          let r = await e;
          if (r !== undefined) return r;

          for (let i = startI; i < t.length; i++) {
            if (!t.hasOwnProperty(i)) continue;
            let e = await f.call(t, t[i], i, this);
            if (e !== undefined) return e;
          }
        })();
      }
      else {
        if (e !== undefined) return e;
        for (let i = startI; i < t.length; i++) {
          if (!t.hasOwnProperty(i)) continue;
          let e = f.call(t, t[i], i, this);
          if (e !== undefined) return e;
        }
      }
    }
  })

  appendToXrray("empty", {get() {
    return this.length === 0;
  }})

  appendToXrray("last", {
    get() {
      if (this.length === 0) return undefined;
      return this[this.length-1];
    },
    set(to) {
      this[this.length === 0 ? 0 : this.length] = to
    }

  })

  appendToXrray("realLength", {get() {
    let l = 0;
    for (let i = 0; i < this.length; i++) {
      if (this.hasOwnProperty(i)) l++;
    }
    return l;
  }})

  appendToXrray("first", {
    get() {
      return this[0];
    },
    set(to) {
      this[0] = to;
    }
  })

  appendToXrray("clear", function() {
    this.length = 0;
    return this;
  })

  appendToXrray("Clear", function() {
    return new Xrray();
  })

  appendToXrray("add", function(...values) {
    this.push(...values);
    return this;
  })
  appendToXrray("Add", function(...values) {
    return new Xrray().add(...this, ...values);
  })


  appendToXrray("set", function(a = []) {
    if(this === a) return this;
    if(a instanceof Array) return this.clear().add(...a);
    return this.clear().add(a);
  })

  appendToXrray("Set", function(a = []) {
    return new Xrray().add(...a);
  })

  appendToXrray("clone", function() {
    return this.Set(this);
  })
  appendToXrray("Reverse", function() {
    return this.Set(this.reverse());
  })

  appendToXrray("gather", function(...a) {
    a.ea((e) => {
      if (!this.includes(e)) this.add(e);
    })
    return this;
  })

  appendToXrray("Gather", function(...a) {
    let t = this.clone();
    a.ea((e) => {
      if (!t.includes(e)) t.add(e);
    })
    return t;
  })

  

  let mark = Symbol("Mark");

  //Throws InvalidValueException when the given value cannot be found withing this
  // TODO: differentate indexall and indexfirst
  appendToXrray("index", function(...values) {
    let that = this.Set(this);
    let indexes = new Xrray();
    values.ea((v) => {
      if(!this.includes(v)) throw new InvalidValueException(v,this);
      while (true) {
        let index = that.indexOf(v);
        if (indexes.last !== index && index !== -1){
          indexes.add(index);
          that[index] = mark;
        }
        else break;
      }
    });
    return indexes;
  })
  
  //Throws IndexOutOfBoundsException when given index is out of bounds of this
  appendToXrray(["removeI", "rmI"], function(...indices) {
    let rollback = this.Set(this);
    try {
      for (let i = 0; i < indices.length; i++) {
        isIndex(indices[i], this)
        this[indices[i]] = mark;
      }
      for (let i = 0; i < this.length; i++) {
        if (this[i] === mark) {
          this.splice(i, 1);
          i--;
        }
      }
    } catch (e) {
      if (e instanceof IndexOutOfBoundsException) this.set(rollback);
      throw e;
    }
    return this;
  })
  
  //Throws IndexOutOfBoundsException when given index is out of bounds of this
  appendToXrray(["RemoveI", "RmI"], function(...indices) {
    return this.Set(this).removeI(...indices);
  })

  

  //Throws InvalidValueException when the given value cannot be found withing this
  appendToXrray(["removeV", "rmV"], function(...values) {
    return this.removeI(...this.index(...values));
  })

  //Throws InvalidValueException when the given value cannot be found withing this
  appendToXrray(["RemoveV", "RmV"], function(...values) {
    return this.Set(this).removeV(...values);
  })

  //Throws InvalidValueException when the given param is detected as value but cannot be found withing this
  appendToXrray(["remove", "rm"], function(...valueOrIndex) {
    try {
      this.removeI(...valueOrIndex);
    } catch (e) {
      if (e instanceof IndexOutOfBoundsException) this.removeV(...valueOrIndex);
      else throw e;
    }
    return this;
  })


  //Throws IndexOutOfBoundsException when given param is detected as index but out of bounds of this
  //Throws InvalidValueException when the given param is detected as value but cannot be found withing this
  appendToXrray(["Remove", "Rm"], function(...valueOrIndex) {
    return this.Set(this).remove(...valueOrIndex);
  })

  appendToXrray("Get", function(...indexes) {
    let n = [];
    indexes.flat(Infinity).forEach((i) => {
      n.add(this[i]);
    });
    return n;
  })

  appendToXrray("get", function(...indexes) {
    return this.set(this.Get(...indexes))
  })

  appendToXrray("dda", function(...values) {
    return this.reverse().add(...values).reverse();
  })

  appendToXrray("Dda", function(...values) {
    return this.Reverse().add(...values).reverse();
  })


  //Throws IndexOutOfBoundsException when given index is out of bounds of a
  appendToXrray("rem", function(amount) {
    isIndex(amount,this);
    this.length -= amount;
    return this;
  })
  //Throws IndexOutOfBoundsException when given index is out of bounds of a
  appendToXrray("Rem", function(amount) {
    return this.Set(this).rem(amount);
  })

  //Throws IndexOutOfBoundsException when given index is out of bounds of a
  appendToXrray("mer", function(amount) {
    return this.reverse().rem(amount).reverse();
  })
  //Throws IndexOutOfBoundsException when given index is out of bounds of a
  appendToXrray("Mer", function(amount) {
    return this.Reverse().rem(amount).reverese();
  })

  //Throws IndexOutOfBoundsException when given index(es) are out of bounds of this
  //Throws InvalidInputException when given parameters are not equal in length
  appendToXrray("swapI", function(i1, i2) {
    i1 = [i1].flat(Infinity);
    i2 = [i2].flat(Infinity);
    if(i1.length === i2.length) {
      let rollback = this.Set(this);
      try {
        for (let i = 0; i < i1.length; i++) {
          isIndex(i1[i],this);
          isIndex(i2[i],this);
          [this[i1[i]],this[i2[i]]] = [this[i2[i]],this[i1[i]]];
        }
      } catch (e) {
        if(e instanceof IndexOutOfBoundsException) this.set(rollback);
        throw e;
      }
      return this;
    }
    throw new InvalidInputException("Parameter i1 and i2 must ether be two indexes, or two index-Arrays of the same length.");
  })
  //Throws IndexOutOfBoundsException when given index(es) are out of bounds of this
  //Throws InvalidInputException when given parameters are not equal in length
  appendToXrray("SwapI", function(i1, i2) {
    return this.Set(this).swapI(i1, i2);
  })

  //Throws InvalidValueException when the given value cannot be found withing this
  //Throws InvalidInputException when given parameters are not equal in length
  appendToXrray("swapV", function(v1, v2) {
    v1 = this.Set(v1).flat(2);
    v2 = this.Set(v2).flat(2);
    if (v1.length === v2.length) {
      for (var i = 0; i < v1.length; i++) {
        this.swapI(this.index(v1[i]),this.index(v2[i]));
      }
      return this;
    }
    throw new InvalidInputException("Parameter v1 and v2 must ether be two values, or two value-Arrays of the same length.");
  })
  //Throws InvalidValueException when the given value cannot be found withing this
  //Throws InvalidInputException when given parameters are not equal in length
  appendToXrray("SwapV", function(v1, v2) {
    return this.Set(this).swapV(v1, v2);
  })

  //Throws IndexOutOfBoundsException when given param is detected as index but out of bounds of this
  //Throws InvalidValueException when the given param is detected as value but cannot be found withing this
  appendToXrray("swap", function(vi1, vi2) {
    try {
      this.swapI(vi1, vi2);
    } catch (e) {
      if (e instanceof IndexOutOfBoundsException) this.swapV(vi1, vi2);
      else throw e;
    }
    return this;
  })
  //Throws IndexOutOfBoundsException when given param is detected as index but out of bounds of this
  //Throws InvalidValueException when the given param is detected as value but cannot be found withing this
  appendToXrray("Swap", function(vi1, vi2) {
    return this.Set(this).swap(vi1, vi2)
  })

  appendToXrray("prior", function(i, by = 1) {
    let r = i - by;
    if (r >= 0) return this[r];
    return this[this.length-(by-i)]
  })

  appendToXrray("next", function(i, by = 1) {
    let r = i + by;
    if (r <= this.length-1) return this[r];
    return this[by-(i-this.length-1)]
  })

  appendToXrray("inject", function(item, index) {
    this.splice(index, 0, item);
    return this
  })

  appendToXrray("contains", function(...vals) {
    for (let v of vals) {
      if (!this.includes(v)) return false
    }
    return true
  })

  appendToXrray("excludes", function(...vals) {
    for (let v of vals) {
      if (this.includes(v)) return false
    }
    return true
  })

  appendToXrray(["closest", "nearest"], function(to /*: number*/) {
    let a = []
    for (let i = 0; i < this.length; i++) {
      a[i] = Math.abs(this[i] - to)
    }
    let smallest = Infinity
    let index = -1
    for (let i = 0; i < a.length; i++) {
      let diff = a[i]
      if (diff < smallest) {
        smallest = diff
        index = i
      }
    }
    return index
  })

  appendToXrray("inner", function(step, callParams) {
    if (callParams !== undefined) {
      this.ea((e, i) => {
        this[i] = e[step](...callParams)
      })
    }
    else {
      this.ea((e, i) => {
        this[i] = e[step]
      })
    }
    
    return this
  })

  appendToXrray("Inner", function(step, callParams) {
    return this.Set(this).inner(step, callParams)
  })

  
  appendToXrray("call", function(...callParams) {
    if (callParams !== undefined) {
      this.ea((e, i) => {
        this[i] = e(...callParams)
      })
    }
    
    return this
  })

  appendToXrray("Call", function(...callParams) {
    return this.Set(this).call(...callParams)
  })


  appendToXrray("replace", function(func) {
    this.forEach((e, i) => {
      this[i] = func(e, i)
    })
    
    return this
  })

  appendToXrray("Replace", function(func) {
    return this.Set(this).replace(func)
  })

  appendToXrray("clean", function() {
    let toBeRm = []
    for (let i = 0; i < this.length; i++) {
      if (this[i] === undefined || this[i] === null) toBeRm.add(i)
    }
    this.rmI(...toBeRm)
    return this
  })

  appendToXrray("Clean", function() {
    return this.Set(this).clean(func)
  })



  return Xrray
}
init.Exception = Exception;
init.IndexOutOfBoundsException = IndexOutOfBoundsException;
init.InvalidInputException = InvalidInputException;
init.InvalidValueException = InvalidValueException;
//init.version = "unknown";


module.exports = init
module.exports.default = init

