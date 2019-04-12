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
      super("Unable to find given value: " + value.constructor.name + " " + value + "; within the following array.", array);
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

    Constr.xrray = true;
    p.xrray = true;

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

    p.each = p.ea = function(f, t = this) {
      if (this.length > 0) {
        let e = f.call(t, t[0], i, this);
        if (e instanceof Promise) {
          return (async () => {
            let r = await e;
            if (r !== undefined) return r;

            for (var i = 1; i < t.length; i++) {
              let e = await f.call(t, t[i], i, this);
              if (e !== undefined) return e;
            }
          })();
        }
        else {
          if (e !== undefined) return e;
          for (var i = 1; i < t.length; i++) {
            let e = f.call(t, t[i], i, this);
            if (e !== undefined) return e;
          }
        }
      }
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
    p.rmI = p.removeI;
    //Throws InvalidIntegerException when given value is not an integer
    //Throws IndexOutOfBoundsException when given index is out of bounds of this
    p.RemoveI = function(...indexes) {
      return this.Set(this).removeI(...indexes);
    }
    p.RmI = p.RemoveI;

    //Throws InvalidValueException when the given value cannot be found withing this
    p.removeV = function(...values) {
      return this.removeI(this.index(...values));
    }
    p.rmV = p.removeV;

    //Throws InvalidValueException when the given value cannot be found withing this
    p.RemoveV = function(...values) {
      return this.Set(this).removeV(...values);
    }
    p.RmV = p.RemoveV;

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

    p.prior = function(i) {
      if (i !== 0) return this[i-1];
      return this[this.length-1]
    }
    p.next = function(i) {
      if (i !== this.length-1) return this[i+1];
      return this[0]
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
