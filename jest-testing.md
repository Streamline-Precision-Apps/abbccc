# Brief Description of JEST
**JEST** is a testing framework designed to ensure the correctness of any javascript codebase with test cases.

**why do we need to include test cases for our code?**

Testing code manually is helpful but does not catch all possible bugs that may occur in an application with **JEST** we can confidently say that the app has been tested and works with unit tests to back it up.

To Learn on your own, please visit this link and read the docs.

JEST Documentation
- [Jest Getting Started Docs](https://jestjs.io/docs/getting-started) 

Recommended Youtube Videos 
- [Next.js with React Testing Library, Jest, TypeScript](https://youtu.be/AS79oJ3Fcf0?si=LuawN9ObsH4RMquT)
- [Introduction to Jest Testing | JavaScript Unit Tests](https://youtu.be/x6NUZ8dc9Qg?si=qgzabhqfY1iO684j)




# Lesson Learned
After researching into this i tested again auth.js and it was difficult to do so since server does not work for jest
Feel free to learn but Play wright will probably be the way to go. 





# Notes on JEST Javascript from video
*For a refresher on key things and formats read this section.*


### Getting Started With A Problem
Let's start out with an example in writing your first test case with this function

```
function sum(a,b) {
    return a + b
}
// export to jest
module.exports = sum
```
What to expect?

*Based on this function we can expect a + b = sum*


#### To Access JEST we must do the following:
1. Install a package.json file if you do not have one
    ```   
    npm init -y
    ```

2. Next Install JEST for the project as a Dev Dependency
    ```
    npm install jest -D
    ```

**Now we are ready to test!** 
***
### Writing The first Test
Next we will test the code in a new file named *sum.test.js*

```
/sum.test.js

const sum = require('./sum)

test('adds 1 + 2 to equal 3', ()=> {
    expect(sum(1,2)).toBe(3)
})

```
Congrats you created your first test but now lets run it. 

***
### Running your Test
1. Go to your package.json file and look under scripts. 

2. Replace Test Script to look like the following:
    ```
    "script":{
        "test" : "jest"
        /* you can add "jest --coverage to get the coverage details 
        if we tested all code
        */
    },
    ```
3. open terminal and state
    ```
    npm test
    ```
After the test runs you will see test results from JEST for the test suites that pasted, Total Number of Tests, snapshot, and time it took to run all of them. 

What we just ran is called a unit test, we tested a pure function to see if it gave desire results.

**Your function should only do one thing is a clean code principal**

***

### Another Test Case

Next Test Case
```
/isPalindrome.js

// we reverse the string, there are more efficient ways but this came to mind
function isPalindrome(word) {
    return word.toLowercase() === word.lowercase().split('').reverse().join('').replaceAll(',','')
}

module.exports = isPalindrome

```

Test File Reports under a Test Suite
```
/isPalindrome.test.js

const isPalindrome = require('./isPalindrome')


// testing for true

test('Tacocat returns true', () => {
    expect(isPalindrome('Tacocat')).toBe(true)
})


// testing for false

test('Devun returns false', () => {
    expect(isPalindrome('Devun')).toBe(false)
})
```

### Another Test Case

/ShallowObjClone.js

```
function shallowObjectClone(obj){
    return { ...obj}
}
module.exports = shallowObjectClone
```

```
/shallowObjectClone.test.js

const shallowObjectClone = require('./shallowObjectClone')

test('create a clone of the object parameter',() => {
    const myObj = { person: "Hitchhiker", number: 42}
    expect(shallowObjectClone(myObj)).toStrictEquals(myObj)
})

```

when should I use the following matchers?
- .toBe()
- .toStrictEquals()
- ..toEquals()
- ...etc

Visit the Docs [Here](https://jestjs.io/docs/expect) to test the different possibilities. 

***
### Revisiting and making is Palindrome function better.  
***
**Reverse String function**

*/reverseString.js*
```

function reverseString(word){
    return word.split('').reverse().join('').replaceAll(',','')
}
module.exports = reverseString
```

**Is Palindrome function**

*/isPalindrome.js*
```

const reverseString = require('./reverseString')

function isPalindrome(word) {
    return word.toLowercase() === reverseString(word).lowercase()
}

module.exports = isPalindrome

```
*** 
**Reverse String test**

*/reverseString.test.js*
```

const reverseString = require('./reverseString')


// testing for true

test('Reverse any given string', () => {
    expect(reverseString('Dave')).toBe('evaD')
})

```
**Is Palindrome test**

*/isPalindrome.test.js*
```

const isPalindrome = require('./isPalindrome')

test('Tacocat returns true', () => {
    expect(isPalindrome('Tacocat')).toBe(true)
})

```




