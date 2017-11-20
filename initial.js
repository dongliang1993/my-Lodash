/**
 * 去除数组最后一个元素array.
 * 参数
 * array (Array): 需要查询的数组.
 * 返回值
 * (Array): 返回截取的数组array.
 * 例子
  _.initial([1, 2, 3]);
  // => [1, 2]
**/
function initial (array = []) {
  const result = array.slice()
  result.pop()
  return result
}