function flatten(array, isDeep = false) {
  let result = []
  const baseFlatten = (array, isDeep) => {
    array.forEach(item => {
      if (Array.isArray(item) && isDeep) {
        baseFlatten(item, true)
      } else {
        result = result.concat(item)
      }
    })
  }
  baseFlatten(array, isDeep)
  return result
}