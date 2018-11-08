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
  class InvalidIntegerException extends Exception {
    constructor(msg = "") {
      super("Given value must be an Integer.\n" + msg);
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
      super("Unable to find given value: " + value.constructor.name + " " + value + "; within: " + array + ";");
      this.value = value;
      this.array = array;
    }
  }

  function def(a) {
    return a !== undefined;
  }

  //Throws InvalidIntegerException when given value is not an integer
  //Throws IndexOutOfBoundsException when given index is out of bounds of a
  function isIndex(i, a) {
    if (typeof i !== "number" || !Number.isInteger(i)) throw new InvalidIntegerException();
    if(i >= a.length || i < 0) throw new IndexOutOfBoundsException(i,a);
  }

  function init(Constr = class extends Array {constructor(...a){super(...a);}}) {
    if(!(new Constr() instanceof Array)) throw new InvalidConstructorException();
    if(Constr.xrray) return Constr;
    let p = Constr.prototype;



    Object.defineProperty(Constr, "xrray", {get() {
      return (def(p.clear) && def(p.Clear) && def(p.add) && def(p.Add) && def(p.set) && def(p.Set) && def(p.Reverse) && def(p.index) && def(p.flat) && def(p.Flat) && def(p.clean) && def(p.Clean) && def(p.removeI) && def(p.RemoveI) && def(p.removeV) && def(p.RemoveV) && def(p.remove) && def(p.Remove) && def(p.Get) && def(p.get) && def(p.dda) && def(p.Dda) && def(p.rem) && def(p.Rem) && def(p.mer) && def(p.Mer) && def(p.swapI) && def(p.SwapI) && def(p.swapV) && def(p.SwapV) && def(p.swap) && def(p.swap));
    }});

    Object.defineProperty(p, "xrray", {get() {
      return (def(this.clear) && def(this.Clear) && def(this.add) && def(this.Add) && def(this.set) && def(this.Set) && def(this.Reverse) && def(this.index) && def(this.flat) && def(this.Flat) && def(this.clean) && def(this.Clean) && def(this.removeI) && def(this.RemoveI) && def(this.removeV) && def(this.RemoveV) && def(this.remove) && def(this.Remove) && def(this.Get) && def(this.get) && def(this.dda) && def(this.Dda) && def(this.rem) && def(this.Rem) && def(this.mer) && def(this.Mer) && def(this.swapI) && def(this.SwapI) && def(this.swapV) && def(this.SwapV) && def(this.swap) && def(this.swap));
    }});

    Object.defineProperty(p, "empty", {get() {
      return this.length === 0;
    }});

    Object.defineProperty(p, "last", {get() {
      if(this.length === 0) return undefined;
      return this[this.length-1];
    }});

    Object.defineProperty(p, "first", {get() {
      return this[0];
    }});

    p.clear = function() {
      this.length = 0;
      return this;
    }
    p.Clear = function() {
      return new Constr();
    }

    p.add = function(...values) {
      this.push(...values);
      return this;
    }
    p.Add = function(...values) {
      return new Constr().add(...this).add(...values);
    }

    p.set = function(a = []) {
      if(this === a) return this;
      if(a instanceof Array) return this.clear().add(...a);
      return this.clear().add(a);
    }
    p.Set = function(a = []) {
      if(a instanceof Array) return new Constr().add(...a);
      return new Constr().add(a);
    }

    p.Reverse = function() {
      return this.Set(this).reverse();
    }

    //Throws InvalidValueException when the given value cannot be found withing this
    // TODO: differentate indexall and indexfirst
    p.index = function(...values) {
      let empty = new Object(null);
      let that = this.Set(this);
      let indexes = new Constr();
      values.forEach((v) => {
        if(!this.includes(v)) throw new InvalidValueException(v,this);
        while (true) {
          let index = that.indexOf(v);
          if (indexes.last !== index && index !== -1){
            indexes.add(index);
            that[index] = empty;
          }
          else break;
        }
      });
      return indexes;
    }

    if (p.flat !== undefined) {
      p.Flat = p.flat;
      p.flat = function(depth) {
        return this.set(this.Flat(depth));
      }
    }
    else {
      p.Flat = function(depth = 1) {
        let n = [];
        let i = 0;
        (function callee(a) {
          for (let e of a) {
            if(e instanceof Array && i < depth){
              i++;
              callee(e);
            }
            else n.add(e);
          }
        }(this));
        return n;
      }
      p.flat = function(depth) {
        return this.set(this.Flat(depth));
      };
    }

    p.clean = function() {
      for (let i = 0; i < this.length; i++) {
        if (this[i] === undefined || this[i] === null) {
          this.splice(i, 1);
          i--;
        }
      }
      return this;
    }
    p.Clean = function() {
      return this.Set(this).clean();
    }

    //Throws InvalidIntegerException when given value is not an integer
    //Throws IndexOutOfBoundsException when given index is out of bounds of this
    p.removeI = function(...indexes) {
      let rollback = this.Set(this);
      try {
        indexes.flat(Infinity).forEach((i) => {
          isIndex(i,this);
          this[i] = null;
        });
        this.clean();
      } catch (e) {
        if(e instanceof InvalidIntegerException || e instanceof IndexOutOfBoundsException) this.set(rollback);
        throw e;
      }
      return this;
    }
    //Throws InvalidIntegerException when given value is not an integer
    //Throws IndexOutOfBoundsException when given index is out of bounds of this
    p.RemoveI = function(...indexes) {
      return this.Set(this).removeI(...indexes);
    }

    //Throws InvalidValueException when the given value cannot be found withing this
    p.removeV = function(...values) {
      return this.removeI(this.index(...values));
    }
    //Throws InvalidValueException when the given value cannot be found withing this
    p.RemoveV = function(...values) {
      return this.Set(this).removeV(...values);
    }

    //Throws IndexOutOfBoundsException when given param is detected as index but out of bounds of this
    //Throws InvalidValueException when the given param is detected as value but cannot be found withing this
    p.remove = function(...valueOrIndex) {
      try {
        this.removeI(...valueOrIndex);
      } catch (e) {
        if (e instanceof InvalidIntegerException) this.removeV(...valueOrIndex);
        else throw e;
      }
      return this;
    }
    //Throws IndexOutOfBoundsException when given param is detected as index but out of bounds of this
    //Throws InvalidValueException when the given param is detected as value but cannot be found withing this
    p.Remove = function(...valueOrIndex) {
      return this.Set(this).remove(...valueOrIndex);
    }

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

    //Throws InvalidIntegerException when given value is not an integer
    //Throws IndexOutOfBoundsException when given index is out of bounds of a
    p.rem = function(amount) {
      isIndex(amount,this);
      this.length -= amount;
      return this;
    }
    //Throws InvalidIntegerException when given value is not an integer
    //Throws IndexOutOfBoundsException when given index is out of bounds of a
    p.Rem = function(amount) {
      return this.Set(this).rem(amount);
    }

    //Throws InvalidIntegerException when given value is not an integer
    //Throws IndexOutOfBoundsException when given index is out of bounds of a
    p.mer = function(amount) {
      return this.reverse().rem(amount).reverse();
    }
    //Throws InvalidIntegerException when given value is not an integer
    //Throws IndexOutOfBoundsException when given index is out of bounds of a
    p.Mer = function(amount) {
      return this.Reverse().rem(amount).reverese();
    }

    //Throws InvalidIntegerException when given parameters are not is not an integer (arrays)
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
          if(e instanceof InvalidIntegerException || e instanceof IndexOutOfBoundsException) this.set(rollback);
          throw e;
        }
        return this;
      }
      throw new InvalidInputException("Parameter i1 and i2 must ether be two indexes, or two index-Arrays of the same length.");
    }
    //Throws InvalidIntegerException when given parameters are not is not an integer (arrays)
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
        if (e instanceof InvalidIntegerException) this.swapV(vi1, vi2);
        else throw e;
      }
      return this;
    }
    //Throws IndexOutOfBoundsException when given param is detected as index but out of bounds of this
    //Throws InvalidValueException when the given param is detected as value but cannot be found withing this
    p.Swap = function(vi1, vi2) {
      return this.Set(this).swap(vi1, vi2)
    }

    return Constr;
  }
  init.Exception = Exception;
  init.IndexOutOfBoundsException = IndexOutOfBoundsException;
  init.InvalidIntegerException = InvalidIntegerException;
  init.InvalidInputException = InvalidInputException;
  init.InvalidConstructorException = InvalidConstructorException;
  init.InvalidValueException = InvalidValueException;
  //init.version = "unknown";
  return init;
}());
