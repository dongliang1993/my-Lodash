function fill (array, value = '', start = 0, end = array.length) {
  // 为了防止稀疏数组，要用 for 循环
  for (let i = start; i < end; i++) {
    array[i] = value
  }
  return array
}