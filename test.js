// var stooge = {name: 'moe', age: 32}
// _.isMatch(stooge, {age: 32})
// => true
function isMatch(obj, attrs) {
  const keys = _.keys(attrs), length = keys.length
  if (obj == null) return !length
  for (let i = 0; i < length; i++) {
    let key = keys[i]
    if (obj[key] !== attrs[key] || !key in obj) return false
  }
  return true
}

function max(obj, iteratee, context) {
  let keys, max = -Infinity, result
  if (iteratee === null && !!obj) {
    if (!isArrayLike(obj)) {
      keys = _.keys(obj)
      for (let i = 0; i < keys.length; i++) {
          if (obj[key] > max) {
            result = obj[key]
          }
      }
    }
  } else {

  }
}

function filter(obj, predicate, context) {
  const result = []
  predicate = cb(predicate)
  _.forEach(obj, function (value, index, obj) {
    if(predicate(value, index, obj)) result.push(value)
  })
 return result 
}
