module.exports = (function() {
  'use strict';
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

  const ar = "array";
  const ob = "object";

  function init(ArConstr = Array, ObConstr = Object) {
    if(!(new ArConstr() instanceof Array)) throw new InvalidConstructorException();
    if (ArConstr.xrray === ar || ObConstr.xrray === ob) return {ArConstr, ObConstr};

    ObConstr.xrray = ob;
    ArConstr.xrray = ar;

    let o = ObConstr.prototype;
    let p = ArConstr.prototype;


    o.cloneData = function() {
      return JSON.parse(JSON.stringify(this))
    }

    o.each = o.ea = function(f, t = this) {
      let allKeys = Object.keys(t);
      let keys = new ArConstr();
      for (let i = 0; i < allKeys.length; i++) {
        if (t.hasOwnProperty(allKeys[i])) keys.add(allKeys[i])
      }
      if (t instanceof Array) {
        for (let i = 0; i < keys.length; i++) {
          let keyNum = parseInt(keys[i])
          if (keyNum == keys[i]) keys[i] = keyNum
          else keys.remove(i)
        }
      }
      if (keys.length > 0) {
        let e;
        let startI = 0;
        e = f.call(t, t[keys[startI]], keys[startI], this);

        startI++;
        if (e instanceof Promise) {
          return (async () => {
            let r = await e;
            if (r !== undefined) return r;

            for (let i = startI; i < keys.length; i++) {
              let e = await f.call(t, t[keys[i]], keys[i], this);
              if (e !== undefined) return e;
            }
          })();
        }
        else {
          if (e !== undefined) return e;
          for (let i = startI; i < keys.length; i++) {
            let e = f.call(t, t[keys[i]], keys[i], this);
            if (e !== undefined) return e;
          }
        }
      }
    }

    Object.defineProperty(p, "empty", {get() {
      return this.length === 0;
    }});

    Object.defineProperty(p, "last", {get() {
      if(this.length === 0) return undefined;
      return this[this.length-1];
    }});

    Object.defineProperty(p, "realLength", {get() {
      let l = 0;
      for (let i = 0; i < this.length; i++) {
        if (this.hasOwnProperty(i)) l++;
      }
      return l;
    }});

    Object.defineProperty(p, "first", {get() {
      return this[0];
    }});

    p.clear = function() {
      this.length = 0;
      return this;
    }
    p.Clear = function() {
      return new ArConstr();
    }

    p.add = function(...values) {
      this.push(...values);
      return this;
    }
    p.Add = function(...values) {
      return new ArConstr().add(...this).add(...values);
    }

    p.set = function(a = []) {
      if(this === a) return this;
      if(a instanceof Array) return this.clear().add(...a);
      return this.clear().add(a);
    }
    p.Set = function(a = []) {
      return new ArConstr().add(...a);
    }

    p.clone = function() {
      return this.Set(this);
    }

    p.Reverse = function() {
      return this.Set(this).reverse();
    }

    p.gather = function(...a) {
      a.ea((e) => {
        if (!this.includes(e)) this.add(e);
      })
      return this;
    }

    p.Gather = function(...a) {
      let t = this.clone();
      a.ea((e) => {
        if (!t.includes(e)) t.add(e);
      })
      return t;
    }

    let mark = {};

    //Throws InvalidValueException when the given value cannot be found withing this
    // TODO: differentate indexall and indexfirst
    p.index = function(...values) {
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
    }
    //Throws IndexOutOfBoundsException when given index is out of bounds of this
    p.removeI = function(...indices) {
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
    }
    p.rmI = p.removeI;
    //Throws IndexOutOfBoundsException when given index is out of bounds of this
    p.RemoveI = function(...indices) {
      return this.Set(this).removeI(...indices);
    }
    p.RmI = p.RemoveI;

    //Throws InvalidValueException when the given value cannot be found withing this
    p.removeV = function(...values) {
      return this.removeI(...this.index(...values));
    }
    p.rmV = p.removeV;

    //Throws InvalidValueException when the given value cannot be found withing this
    p.RemoveV = function(...values) {
      return this.Set(this).removeV(...values);
    }
    p.RmV = p.RemoveV;

    //Throws InvalidValueException when the given param is detected as value but cannot be found withing this
    p.remove = function(...valueOrIndex) {
      try {
        this.removeI(...valueOrIndex);
      } catch (e) {
        if (e instanceof IndexOutOfBoundsException) this.removeV(...valueOrIndex);
        else throw e;
      }
      return this;
    }
    p.rm = p.remove;

    //Throws IndexOutOfBoundsException when given param is detected as index but out of bounds of this
    //Throws InvalidValueException when the given param is detected as value but cannot be found withing this
    p.Remove = function(...valueOrIndex) {
      return this.Set(this).remove(...valueOrIndex);
    }
    p.Rm = p.Remove;

    p.Get = function(...indexes) {
      let n = [];
      indexes.flat(Infinity).forEach((i) => {
        n.add(this[i]);
      });
      return n;
    }
    p.get = function(...indexes) {
      return this.set(this.Get(...indexes))
    }

    p.dda = function(...values) {
      return this.reverse().add(...values).reverse();
    }
    p.Dda = function(...values) {
      return this.Reverse().add(...values).reverse();
    }

    //Throws IndexOutOfBoundsException when given index is out of bounds of a
    p.rem = function(amount) {
      isIndex(amount,this);
      this.length -= amount;
      return this;
    }
    //Throws IndexOutOfBoundsException when given index is out of bounds of a
    p.Rem = function(amount) {
      return this.Set(this).rem(amount);
    }

    //Throws IndexOutOfBoundsException when given index is out of bounds of a
    p.mer = function(amount) {
      return this.reverse().rem(amount).reverse();
    }
    //Throws IndexOutOfBoundsException when given index is out of bounds of a
    p.Mer = function(amount) {
      return this.Reverse().rem(amount).reverese();
    }

    //Throws IndexOutOfBoundsException when given index(es) are out of bounds of this
    //Throws InvalidInputException when given parameters are not equal in length
    p.swapI = function(i1, i2) {
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
    }
    //Throws IndexOutOfBoundsException when given index(es) are out of bounds of this
    //Throws InvalidInputException when given parameters are not equal in length
    p.SwapI = function(i1, i2) {
      return this.Set(this).swapI(i1, i2);
    }

    //Throws InvalidValueException when the given value cannot be found withing this
    //Throws InvalidInputException when given parameters are not equal in length
    p.swapV = function(v1, v2) {
      v1 = this.Set(v1).flat(2);
      v2 = this.Set(v2).flat(2);
      if (v1.length === v2.length) {
        for (var i = 0; i < v1.length; i++) {
          this.swapI(this.index(v1[i]),this.index(v2[i]));
        }
        return this;
      }
      throw new InvalidInputException("Parameter v1 and v2 must ether be two values, or two value-Arrays of the same length.");
    }
    //Throws InvalidValueException when the given value cannot be found withing this
    //Throws InvalidInputException when given parameters are not equal in length
    p.SwapV = function(v1, v2) {
      return this.Set(this).swapV(v1, v2);
    }

    //Throws IndexOutOfBoundsException when given param is detected as index but out of bounds of this
    //Throws InvalidValueException when the given param is detected as value but cannot be found withing this
    p.swap = function(vi1, vi2) {
      try {
        this.swapI(vi1, vi2);
      } catch (e) {
        if (e instanceof IndexOutOfBoundsException) this.swapV(vi1, vi2);
        else throw e;
      }
      return this;
    }
    //Throws IndexOutOfBoundsException when given param is detected as index but out of bounds of this
    //Throws InvalidValueException when the given param is detected as value but cannot be found withing this
    p.Swap = function(vi1, vi2) {
      return this.Set(this).swap(vi1, vi2)
    }

    p.prior = function(i, by = 1) {
      let r = i - by;
      if (r >= 0) return this[r];
      return this[this.length-(by-i)]
    }
    p.next = function(i, by = 1) {
      let r = i + by;
      if (r <= this.length-1) return this[r];
      return this[by-(i-this.length-1)]
    }
    p.copy = p.slice;

    return {ArConstr, ObConstr}
  }
  init.Exception = Exception;
  init.IndexOutOfBoundsException = IndexOutOfBoundsException;
  init.InvalidInputException = InvalidInputException;
  init.InvalidConstructorException = InvalidConstructorException;
  init.InvalidValueException = InvalidValueException;
  //init.version = "unknown";
  return init;
}());
