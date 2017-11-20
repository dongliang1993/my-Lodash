
/**
 * 获取value在数组 array所在的索引值 
 * 使用 SameValueZero 来保证比较的质量（第一个全等===的元素）
 * 如果 fromIndex 值是负数, 则从array末尾起算. 
 * 如果 fromIndex为true时，对已排序的数组array执行二分（二进制）查找
 * 参数
 * array (Array): 需要查找的数组
 * value (*): 需要查找的元素
 * [fromIndex=0] (boolean|number): 查询的位置或者true值时对一个已排序的数组进行二分查找.
 * 返回值
 * (number): 返回元素在数组中的索引位置, else -1.
 * 例子
 * _.indexOf([1, 2, 1, 2], 2);
    // => 1

    // using `fromIndex`
    _.indexOf([1, 2, 1, 2], 2, 2);
    // => 3

    // performing a binary search
    _.indexOf([1, 1, 2, 2], 2, true);
    // => 2
 **/
function indexOf (array, value, fromIndex = 0) {
  if (typeof fromIndex === 'boolean') {
    binarySearch(array, value)
  } else {
    for (let i = fromIndex, arrLength = array.length; i < arrLength; i++) {
      if (array[i] === value) {
        return i
      }
    }
  }
}
// 还需要当 fromIndex = true 的时候，进行二分查找
// 先实现一个 二分查找
/**
 * 二分查找，递归实现。
 * @param target
 * @param arr
 * @param start
 * @param end
 * @returns {*}
 */
function binarySearch (arr, target, start = 0, end = arr.length - 1) {
  let mid = parseInt(start + (end - start) / 2)
  if (target === arr[mid]) {
    return mid
  } else if (target > arr[mid]) {
    return binarySearch(arr, target, mid + 1, end)
  } else {
    return binarySearch(arr, target, start, mid - 1)
  }
  return -1
}
