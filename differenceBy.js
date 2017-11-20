const flatten = (arr) => {
	return [].concat(...arr)
}
function differenceBy(arr, ...arg) {
  let fn,
      iteratee = arg[arg.length - 1],
      result = []
  if (typeof iteratee === 'string') {
    fn = function(obj) {
      return obj[iteratee]
    }
    arg.pop()
  } else if (iteratee instanceof Function) {
    fn = iteratee
    arg.pop()
  }
  const flattenedArg = flatten(arg).map(fn)
  return arr.filter(val => {
    return !flattenedArg.includes(fn(val))
  })
}

