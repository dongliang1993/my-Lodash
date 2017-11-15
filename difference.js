// 一：第一个参数(目标值)是个数组
// 最简单的思路，把除第一个之外的参数展开一层
// 然后组成一个大的数组
// 遍历这个数组，如果目标数组里面包含这个数组中的值，跳过
// 二：第一个参数(目标值)不是数组
// 直接返回一个空数组

const flatten = (arr) => {
	return [].concat(...arr)
}

function difference(arr, ...arg) {
  if (!Array.isArray(arr)) {
    return []
  }
  const flattenedArg = flatten(arg)
  return arr.filter(val => {
    return !flattenedArg.includes(val)
  })
}