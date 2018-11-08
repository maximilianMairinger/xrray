# Xrray
Eases the handling of Arrays.
## Intro
Attaches some functions to a given Constructor extending (or being) Array. Every added manipulating function has an "first letter in caps" equivalent that initializes a new Array within which the changes take place, thus not changing the initial one. Every manipulating function returns itself.
## Examples
### Setup
```javascript
    const xrray = require("xrray");
    //Xrray is getting assigned to the default Constructor
    let Xrray = xrray();
```
### Usage
```javascript
    let a = new Xrray("a", undefined, "b", "c", null, "d");
    console.log(a.Clear());   //Xrray ["a", "b", "c", "d"]
    console.log(a);           //Xrray ["a", undefined, "b", "c", null, "d"]

    a.clear().add("e", "f");
    console.log(a);           //Xrray ["a", "b", "c", "d", "e", "f"]

    console.log(a.set(["d", "c", "b", "a"]).Reverse());   //Xrray ["a", "b", "c", "d"]
    console.log(a);                                       //Xrray ["d", "c", "b", "a"]

    a.set([1, 2, 3, "a", "b", "c"]);

    console.log(a.index("a", "b"));     //Xrray [3, 4]
    console.log(a.Get(1, 2, 3));        //Xrray [2, 3, "a"]

    //Detected as values
    console.log(a.Remove("a", "c"));    //Xrray [1, 2, 3, "b"]
    //Detected as Indexes
    console.log(a.Remove(1, 2));        //Xrray [1, "a", "b", "c"]

    //Force Type value
    console.log(a.RemoveV(1, 2));       //Xrray [3, "a", "b", "c"]
    //Force Type index
    console.log(a.RemoveI(1, 2));       //Xrray [1, "a", "b", "c"]

    //Detected as value
    console.log(a.Swap(2, "b"));        //Xrray [1, "b", 3, "a", 2, "c"]
    //Detected as indexes
    console.log(a.Swap(1, 3));          //Xrray [1, "a", 3, 2, "b", "c"]

    //(everything! not just the second pair) Detected as values
    console.log(a.Swap([1, 2], [2, "c"]));            //Xrray ["c", 1, 3, "a", "b", 2]
    //Would be equal to
    console.log(a.SwapV([1], [2]).swapV(2, "c"));     //Xrray ["c", 1, 3, "a", "b", 2]

    console.log(a.Rem(3));        //Xrray [1, 2, 3]
    //Spelled backwards... thus rem backwards
    console.log(a.Mer(3));        //Xrray ["a", "b", "c"]

    console.log(a.set("middle")); //Xrray ["middle"]

    console.log(a.Add("last"));   //Xrray ["middle", "last"]
    console.log(a.Dda("first"));  //Xrray ["first", "middle"]

    console.log(a.empty);         //false
    console.log(a.Set().empty);   //true
```
### Exceptions
```javascript
    //note that xrray is written small here (thus it is the required package)
    const Exception = xrray.Exception;
    //The following Exceptions all inherit from xrray.Exception
    const IndexOutOfBoundsException = xrray.IndexOutOfBoundsException;
    const InvalidIntegerException = xrray.InvalidIntegerException;
    const InvalidInputException = xrray.InvalidInputException;
    const InvalidConstructorException = xrray.InvalidConstructorException;
    const InvalidValueException = xrray.InvalidValueException;

    let a = new Xrray("a", "b", "c");

    try {
      a.index("w");
    } catch (e) {
      if(e instanceof InvalidValueException){
        console.log(e.message);           //InvalidValueException: Unable to find given value: String w; within: a,b,c;
        console.log("Value:" + e.value);  //Value: w
        console.log("Array:" + e.array);  //Array: a,b,c
      }
    }
    try {
      a.RemoveI("first");
    } catch (e) {
      if(e instanceof InvalidIntegerException){
        console.log(e.message);           //InvalidIntegerException: Given value must be an Integer.
      }
    }
    try {
      a.RemoveI(5);
    } catch (e) {
      if(e instanceof IndexOutOfBoundsException){
        console.log(e.message);           //IndexOutOfBoundsException: Given value "5" must be in range 0-2.
      }
    }
    try {
      a.swapI(["a"],["b","c"])
    } catch (e) {
      if(e instanceof InvalidInputException){
        console.log(e.message);           //InvalidInputException: Given input is invalid.
                                          //Parameter i1 and i2 must ether be two indexes, or two index-Arrays of the same length.
      }
    }
    try {
      let Xrray2 = xrray(class NotAnArray {constructor() {}});
    } catch (e) {
      if(e instanceof InvalidConstructorException){
        console.log(e.message);
      }
    }

```
### Test
```javascript
    //To test if xrray has been installed on a constructor call:
    console.log(Xrray.xrray);           //true
    Xrray.prototype.add = undefined;
    console.log(Xrray.xrray);           //false

    //To test if xrray has been installed on an instance call:
    let a = new Xrray();
    console.log(a.xrray);         //true
    a.add = undefined;
    console.log(a.xrray);         //false
```
## API
Comming soon...
