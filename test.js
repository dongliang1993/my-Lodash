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

// _.initial([5, 4, 3, 2, 1]);
// => [5, 4, 3, 2]
function now() {
  return Date.now()
}

function random(min, max) {
  const tempMin = Math.ceil(min)
  const tempMax = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

function propertyOf(obj) {
  return obj == null ? function(){} : function (property) {
    return obj[property]
  }
}

function identity(value) {
  return value
}

function times(n, func, context) {
  const times = Math.floor(n)
  const iteratee = optimizeCb(iteratee, context, 1)
}

function isFunction(func) {
  return typeof func === 'function'
}

function last(array, n = 1) {
  if (array == null) return undefined
  const length = array.length
  return Array.prototype.slice.call(array, Math.max(n, length - n), length)
}

function range(start, stop, step = 1) {
  if (stop == null) { // 只传了一个参数
    stop = start    
    start = 0
  }
  const length = (Math.ceil((stop - start) / step))
  const result = Array(length)
  for (let i = 0; i < length; i++) {
    result[i] = start + i * step
  }
  return result
}

function delay(func, await, ...arg) {
  return setTimeout(() => {
    func.apply(null, arg)
  }, await)
}

function compose(...funcs) {
  const funcsArr = funcs
  const start = funcsArr.length - 1
  return function(...args) {
    // 第一次的结果
    let result = funcsArr[start].apply(this, args)
    for (let i = start - 1; i >= 0; i--) {
      result = funcsArr[i].call(this, result)
    }
    return result
  }
}

function after(times, func) {
  return function() {
    if (times-- < 1) {
      func.apply(this, arguments)
    }
  }
}

function mapObject(obj, iteratee, context) {
  const result = {}
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      let value = iteratee(obj[key], key, obj)
      result[key] = value
    }
  }
  return result
}
