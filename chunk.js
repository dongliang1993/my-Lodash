// 这个思路很简单
// 关键点在于 array 可以根据 size 分成几块
// 举几种情况：
// 一：
// array = ['a', 'b', 'c', 'd'], size = 2
// 生成的二维数组应该是 array.length / 2 = 2项
// 二：
// array = ['a', 'b', 'c', 'd'], size = 3
// 生成的二维数组应该是 array.length / 3 = 1.x项
// 题目规则说，不能够正好拆分的，单独成一项，
// 所以就是 Math.ceil(array.length / size)
// 三：
// 如果 size 的长度比 array.length 的长度还要长呢？
// 直接返回一个二维数组就可以了
function chunk(array, size = 1) {
  const length = array.length
  const subChunkLength = Math.ceil(length / size)
  const result = new Array(subChunkLength)
  // 可以写成
  // let length = array.length
  //     subChunkLength = Math.ceil(length / size)
  //     result = new Array(subChunkLength)
  // 但是个人认为，还是要合理的使用 const 和 let
  for (let i = 0; i < subChunkLength; i++) {
    result[i] = array.slice(i * size, size * (i + 1) )
  }
  return result
}
// 看似大功告成，让我们来考虑一些极端的情况
// 四:
// 如果传入的 size 是 0 ，或者是个负数呢？
// 这个时候直接返回一个空数组

function chunk(array, size = 1) {
  if (size <= 0) {
    return []
  }
  const length = array.length
  const subChunkLength = Math.ceil(length / size)
  const result = new Array(subChunkLength)
  // 可以写成
  // let length = array.length
  //     subChunkLength = Math.ceil(length / size)
  //     result = new Array(subChunkLength)
  // 但是个人认为，还是要合理的使用 const 和 let
  for (let i = 0; i < subChunkLength; i++) {
    result[i] = array.slice(i * size, size * (i + 1) )
  }
  return result
}