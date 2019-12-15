module.exports = (function() {
  

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
  class InvalidConstructorException extends Exception{
    constructor(msg = "") {
      super("Given constructor must inherit form Array.\n" + msg);
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

  


  const ar = "xrray";

  function init(ArConstr = Array) {
    if(!(new ArConstr() instanceof Array)) throw new InvalidConstructorException();
    if (ArConstr.xrray === ar) return ArConstr;

    ArConstr.xrray = ar;

    const appendToArray = appendToPrototypeOf(ArConstr.prototype)


    appendToArray(["each", "ea"], function(f, t = this) {
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

    appendToArray("empty", {get() {
      return this.length === 0;
    }})

    appendToArray("last", {
      get() {
        if (this.length === 0) return undefined;
        return this[this.length-1];
      },
      set(to) {
        this[this.length === 0 ? 0 : this.length] = to
      }
  
    })

    appendToArray("realLength", {get() {
      let l = 0;
      for (let i = 0; i < this.length; i++) {
        if (this.hasOwnProperty(i)) l++;
      }
      return l;
    }})

    appendToArray("first", {
      get() {
        return this[0];
      },
      set(to) {
        this[0] = to;
      }
    })

    appendToArray("clear", function() {
      this.length = 0;
      return this;
    })

    appendToArray("Clear", function() {
      return new ArConstr();
    })

    appendToArray("add", function(...values) {
      this.push(...values);
      return this;
    })
    appendToArray("Add", function(...values) {
      return new ArConstr().add(...this, ...values);
    })


    appendToArray("set", function(a = []) {
      if(this === a) return this;
      if(a instanceof Array) return this.clear().add(...a);
      return this.clear().add(a);
    })

    appendToArray("Set", function(a = []) {
      return new ArConstr().add(...a);
    })

    appendToArray("clone", function() {
      return this.Set(this);
    })
    appendToArray("Reverse", function() {
      return this.Set(this).reverse();
    })

    appendToArray("gather", function(...a) {
      a.ea((e) => {
        if (!this.includes(e)) this.add(e);
      })
      return this;
    })

    appendToArray("Gather", function(...a) {
      let t = this.clone();
      a.ea((e) => {
        if (!t.includes(e)) t.add(e);
      })
      return t;
    })

    

    let mark = Symbol("Mark");

    //Throws InvalidValueException when the given value cannot be found withing this
    // TODO: differentate indexall and indexfirst
    appendToArray("index", function(...values) {
      let that = this.Set(this);
      let indexes = new ArConstr();
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
    appendToArray(["removeI", "rmI"], function(...indices) {
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
    appendToArray(["RemoveI", "RmI"], function(...indices) {
      return this.Set(this).removeI(...indices);
    })

    

    //Throws InvalidValueException when the given value cannot be found withing this
    appendToArray(["removeV", "rmV"], function(...values) {
      return this.removeI(...this.index(...values));
    })

    //Throws InvalidValueException when the given value cannot be found withing this
    appendToArray(["RemoveV", "RmV"], function(...values) {
      return this.Set(this).removeV(...values);
    })

    //Throws InvalidValueException when the given param is detected as value but cannot be found withing this
    appendToArray(["remove", "rm"], function(...valueOrIndex) {
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
    appendToArray(["Remove", "Rm"], function(...valueOrIndex) {
      return this.Set(this).remove(...valueOrIndex);
    })

    appendToArray("Get", function(...indexes) {
      let n = [];
      indexes.flat(Infinity).forEach((i) => {
        n.add(this[i]);
      });
      return n;
    })

    appendToArray("get", function(...indexes) {
      return this.set(this.Get(...indexes))
    })

    appendToArray("dda", function(...values) {
      return this.reverse().add(...values).reverse();
    })

    appendToArray("Dda", function(...values) {
      return this.Reverse().add(...values).reverse();
    })


    //Throws IndexOutOfBoundsException when given index is out of bounds of a
    appendToArray("rem", function(amount) {
      isIndex(amount,this);
      this.length -= amount;
      return this;
    })
    //Throws IndexOutOfBoundsException when given index is out of bounds of a
    appendToArray("Rem", function(amount) {
      return this.Set(this).rem(amount);
    })

    //Throws IndexOutOfBoundsException when given index is out of bounds of a
    appendToArray("mer", function(amount) {
      return this.reverse().rem(amount).reverse();
    })
    //Throws IndexOutOfBoundsException when given index is out of bounds of a
    appendToArray("Mer", function(amount) {
      return this.Reverse().rem(amount).reverese();
    })

    //Throws IndexOutOfBoundsException when given index(es) are out of bounds of this
    //Throws InvalidInputException when given parameters are not equal in length
    appendToArray("swapI", function(i1, i2) {
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
    appendToArray("SwapI", function(i1, i2) {
      return this.Set(this).swapI(i1, i2);
    })

    //Throws InvalidValueException when the given value cannot be found withing this
    //Throws InvalidInputException when given parameters are not equal in length
    appendToArray("swapV", function(v1, v2) {
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
    appendToArray("SwapV", function(v1, v2) {
      return this.Set(this).swapV(v1, v2);
    })

    //Throws IndexOutOfBoundsException when given param is detected as index but out of bounds of this
    //Throws InvalidValueException when the given param is detected as value but cannot be found withing this
    appendToArray("swap", function(vi1, vi2) {
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
    appendToArray("Swap", function(vi1, vi2) {
      return this.Set(this).swap(vi1, vi2)
    })

    appendToArray("prior", function(i, by = 1) {
      let r = i - by;
      if (r >= 0) return this[r];
      return this[this.length-(by-i)]
    })

    appendToArray("next", function(i, by = 1) {
      let r = i + by;
      if (r <= this.length-1) return this[r];
      return this[by-(i-this.length-1)]
    })

    appendToArray("inject", function(item, index) {
      this.splice(index, 0, item);
      return this
    })

    appendToArray("contains", function(...vals) {
      for (let v of vals) {
        if (!this.includes(v)) return false
      }
      return true
    })

    appendToArray("excludes", function(...vals) {
      for (let v of vals) {
        if (this.includes(v)) return false
      }
      return true
    })

    appendToArray(["closest", "nearest"], function(to /*: number*/) {
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

    return ArConstr
  }
  init.Exception = Exception;
  init.IndexOutOfBoundsException = IndexOutOfBoundsException;
  init.InvalidInputException = InvalidInputException;
  init.InvalidConstructorException = InvalidConstructorException;
  init.InvalidValueException = InvalidValueException;
  //init.version = "unknown";
  return init;
}());
