// slice() 方法返回一个从开始到结束（不包括结束）选择的数组的一部分浅拷贝到一个新数组对象。
// 原始数组不会被修改。
// 如果begin 参数为负数，则表示从原数组中的倒数第几个元素提取
// slice(-2) 表示提取原数组中的倒数第二个元素到最后一个元素（包含最后一个元素）

function drop (arr, number = 1) {
  if (number <= 0) {
    // 如果传入的个数 <= ，直接返回原数组
    return arr
  }
  const arrLength = arr.length
  // 如果 number - arrLength >=0 
  // 比如 number = 10 ，length = 3
  // 这个时候应该返回一个空数组
  // 我们是倒着切的
  // 所以直接slice（arr.length）就可以了
  return arr.slice(number - arrLength >= 0 ? arrLength : number - arrLength)
}