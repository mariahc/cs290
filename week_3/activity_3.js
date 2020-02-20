
function deepEqual(obj1, obj2) {
  // check for null
  if (obj1 === null || obj2 === null) {
    // equal iff they're both null
    return (obj1 === obj2);
  }

  // check for object
  if (typeof(obj1) == 'object' || typeof(obj2) == 'object') {
    // not equal if they're not both objects
    if (typeof(obj1) != 'object' || typeof(obj2) != 'object') return false;

    // get sorted object keys
    let obj1Keys = Object.keys(obj1).sort()
    let obj2Keys = Object.keys(obj2).sort()

    // check length
    if (obj1Keys.length != obj2Keys.length) return false;

    // compare each property of each object
    let isEqual = true;
    for (let i = 0; i < obj1Keys.length; i++) {
      // compare key then value
      if (obj1Keys[i] === obj2Keys[i]) {
        if (!deepEqual(obj1[obj1Keys[i]], obj2[obj2Keys[i]])) {
          // stop if inequality found
          isEqual = false;
          break;
        }
      }
    }
    return isEqual;
  }

  // compare value
  return (obj1 === obj2);
}


let ob1 = {oh:0, kay:0, n: null, o: {}, o2: {kay: 1}}
let ob2 = {kay:0, oh:0, n: null, o: {}, o2: {kay: 1}}
let ob3 = {kay:0, oh:0, o: {}, o2: {kay: 1}}

let check = deepEqual(ob1, ob2)
let check2 = deepEqual(ob1, {oh:0, kay:0, n: null, o: {}, o2: {kay: 1}})

console.log(check)
console.log(check2)