export default function Xrray(Xrray?: { new(...a: any): Array<any> }): void;


declare global {
  
  interface Array<T> {
    /**
     * True if empty
     */
    readonly empty: boolean;
    /**
     * Last element
     */
    last: T;
    /**
     * First element
     */
    first: T;
    /**
     * length without empty slots
     */
    readonly realLength: number;
    /**
     * Clears the array of all elements
     */
    clear(): this;
    /**
     * Clears the array of all elements
     * The inital array stays unchanged; a new one gets inited;
     */
    Clear(): this;
    /**
     * Adds values to the array
     */
    add(...value: T[]): this;
    /**
     * Adds values to the array
     * The inital array stays unchanged; a new one gets inited;
     */
    Add(...value: T[]): this;
    /**
     * Sets the array to the given one without chnaging the refernece
     */
    set(array: T[] | T[]): this;
    /**
     * Sets the array to the given one without chnaging the refernece
     * The inital array stays unchanged; a new one gets inited;
     */
    Set(array: T[] | T[]): this;
    /**
     * Iterates over all own properties
     * awaits any promises
     * when !== undefined gets returned => the the loop stopts and the returned val gets returned
     */
    ea<R>(loop: (e?: T, i?: number, array?: T[]) => R, thisArg?: any): R;
    /**
     * Iterates over all own properties
     * awaits any promises
     * when !== undefined gets returned => the the loop stopts and the returned val gets returned
     */
    each<R>(loop: (e?: T, i?: number, array?: T[]) => R, thisArg?: any): R;
    /**
     * Reverts the array
     * The inital array stays unchanged; a new one gets inited;
     */
    Reverse(): this;
    /**
     * Gets all indexes that match the given values
     */
    index(...values: T[]): number[];
    /**
     * Cleans the array of all nulls and undefineds
     */
    clean(): this;
    /**
     * clones
     */
    clone(): T[];
    /**
     * Cleans the array of all nulls and undefineds
     * The inital array stays unchanged; a new one gets inited;
     */
    Clean(): this;
    /**
     * Removes given indexes
     */
    removeI(...index: number[]): this;
    /**
     * Removes given indexes
     */
    rmI(...index: number[]): this;
    /**
     * Removes given indexes
     * The inital array stays unchanged; a new one gets inited;
     */
    RemoveI(...index: number[]): this;
    /**
     * Removes given indexes
     * The inital array stays unchanged; a new one gets inited;
     */
    RmI(...index: number[]): this;
    /**
     * Removes given values
     */
    removeV(...value: T[]): this;
    /**
     * Removes given values
     */
    rmV(...value: T[]): this;
    /**
     * Removes given values
     * The inital array stays unchanged; a new one gets inited;
     */
    RemoveV(...value: T[]): this;
    /**
     * Removes given values
     * The inital array stays unchanged; a new one gets inited;
     */
    RmV(...value: T[]): this;
    /**
     * The inital array stays unchanged; a new one gets inited;
     */
    remove(...valueOrIndex: T[] | number[]): this;
    /**
     * The inital array stays unchanged; a new one gets inited;
     */
    rm(...valueOrIndex: T[] | number[]): this;
    /**
     * Removes given values / indexes
     * The inital array stays unchanged; a new one gets inited;
     */
    Remove(...valueOrIndex: T[] | number[]): this;
    /**
     * Removes given values / indexes
     * The inital array stays unchanged; a new one gets inited;
     */
    Rm(...valueOrIndex: T[] | number[]): this;
    /**
     * Sets the array to given indexes
     */
    get(...index: number[]): this;
    /**
     * Sets the array to given indexes
     * The inital array stays unchanged; a new one gets inited;
     */
    Get(...index: number[]): this;
    /**
     * Adds given values to the end of the array
     */
    dda(...value: T[]): this;
    /**
     * Adds given values to the end of the array
     * The inital array stays unchanged; a new one gets inited;
     */
    Dda(...value: T[]): this;
    /**
     * Removes given number of elements from the end of the array
     */
    rem(amount: number): this;
    /**
     * Removes given number of elements from the end of the array
     * The inital array stays unchanged; a new one gets inited;
     */
    Rem(amount: number): this;
    /**
     * The inital array stays unchanged; a new one gets inited;
     */
    mer(amount: number): this;
    /**
     * Removes given number of elements from the begin of the array
     * The inital array stays unchanged; a new one gets inited;
     */
    Mer(amount: number): this;
    /**
     * Swaps the two given indexes; the two parameters must have equal length
     */
    swapI(i1: number, i2: number): this;
    /**
     * Swaps the two given indexes; the two parameters must have equal length
     * The inital array stays unchanged; a new one gets inited;
     */
    SwapI(i1: number | number[], i2: number | number[]): this;
    /**
     * Swaps the two given values; the two parameters must have equal length
     */
    swapV(v1: T | T[], v2: T | T[]): this;
    /**
     * Swaps the two given values; the two parameters must have equal length
     * The inital array stays unchanged; a new one gets inited;
     */
    SwapV(v1: T | T[], v2: T | T[]): this;
    /**
     * Swaps the two given indexes or values; the two parameters must have equal length
     */
    swap(vi1: number | number[] | T | T[], vi2: number | number[] | T | T[]): this;
    /**
     * Swaps the two given indexes or values; the two parameters must have equal length
     * The inital array stays unchanged; a new one gets inited;
     */
    Swap(vi1: number | number[] | T | T[], vi2: number | number[] | T | T[]): this;
    /**
     * Like default flat
     * The inital array stays unchanged; a new one gets inited;
     */
    Flat(ammount?: number): this
     /**
      * Add elements a to array but only if they are not already present
      * @returns true if any elements of a are added
      */
     gather(...a: T[]): boolean;
     /**
      * Add elements a to array but only if they are not already present
      * The inital array stays unchanged; a new one gets inited;
      */
     Gather(...a: T[]): T[];
    /**
     * Gets the element prior of that given as index
     * If the prior index would be -1 the last one is returned
     */
    prior(index: number, by?: number): T;
    /**
     * Gets the element next of that given as index
     * If the next index would be length the first one is returned
     */
     next(index: number, by?: number): T;
     /**
      * Inject item at index
      */
     inject(item: T, index: number): this
     /**
     * True if all given vals are included within this
     */
    contains(...vals: T[]): boolean
    /**
     * True if non of the given vals are included within this
     */
    excludes(...vals: T[]): boolean
  
    /**
     * Finds the closest element of an numeric array to given to
     */
    closest: T extends number ? (to: number) => number : typeof undefined
    /**
     * Finds the closest element of an numeric array to given to
     */
    nearest: T extends number ? (to: number) => number : typeof undefined
    
    /*
    * Steps into step of all entries
    */
    inner<Key extends keyof T, Val extends T[Key] = T[Key]>(step: Key, callParams?: Val extends (...args: any) => any ? Parameters<Val> : never): Val extends (...args: any) => any ? ReturnType<Val>[] : Val[]
    /*
    * Steps into step of all entries
    */
    Inner<Key extends keyof T, Val extends T[Key] = T[Key]>(step: Key, callParams?: Val extends (...args: any) => any ? Parameters<Val> : never): Val extends (...args: any) => any ? ReturnType<Val>[] : Val[]
  
  
    /*
    * Calls all entries
    */
    call(...callParams: T extends (...args: any) => any ? Parameters<T> : never): T extends (...args: any) => any ? ReturnType<T>[] : never
    /*
    * Calls all entries
    */
    Call(...callParams: T extends (...args: any) => any ? Parameters<T> : never): T extends (...args: any) => any ? ReturnType<T>[] : never
  
  
    /*
    * Replaces every entry with the return value of the iterator
    */
    replace<R>(loop: (e?: T, i?: number) => R, thisArg?: any): R[]
    /*
    * Replaces every entry with the return value of the iterator
    */
    Replace<R>(loop: (e?: T, i?: number) => R, thisArg?: any): R[]


    distinct(dontDistinctOnlySequentialPairs: boolean, from: "start" | "end"): this
    distinct(dontDistinctOnlySequentialPairs: boolean, from?: "start"): this
    distinct(dontDistinctOnlySequentialPairs?: true): this

    Distinct(dontDistinctOnlySequentialPairs: boolean, from: "start" | "end"): this
    Distinct(dontDistinctOnlySequentialPairs: boolean, from?: "start"): this
    Distinct(dontDistinctOnlySequentialPairs?: true): this
  }
  
}


