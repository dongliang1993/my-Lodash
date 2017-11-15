// 写这个函数之前，我们先要了解一下 JavaScript中奇葩的假值
// JavaScript中有 6 个值为“假”，这六个值是
// false
// null
// undefined
// 0
// '' (空字符串)
// NaN

// 注意，这里面 false 本身是布尔类型，其它 5 个则不是。
// 除了这 6 个外，其它均为“真”, 包括对象、数组、正则、函数等。
// 注意 '0'、'null'、'false'、{}、[]也都是真值。是的，js 中 负数也是真值
// !!-1  ====>  true 

// 更让人生气的是，假值之间有的相等，有的不相等
// 叉腰，可把你牛逼坏了
// console.log( false == null )      // false
// console.log( false == undefined ) // false
// console.log( false == 0 )         // true
// console.log( false == '' )        // true
// console.log( false == NaN )       // false
 
// console.log( null == undefined ) // true
// console.log( null == 0 )         // false
// console.log( null == '' )        // false
// console.log( null == NaN )       // false
 
// console.log( undefined == 0)   // false
// console.log( undefined == '')  // false
// console.log( undefined == NaN) // false
 
// console.log( 0 == '' )  // true
// console.log( 0 == NaN ) // false

// 对于“==”，以上得出下列结论
// false 除了和自身比较为 true 外，和 0，"" 比较也为 true
// null 只和 undefined 比较时为 true， 反过来 undefined 也仅和 null 比较为 true，没有第二个
// 0 除了和 false 比较为 true，还有空字符串 ''" 和空数组 []
// 空字符串 '' 除了和 false 比较为 true，还有一个数字 0

// 好了，感慨一下 js 这个神坑后，我们回到正题
// 要求返回一个不含假值的数组，我们第一反应就是遍历这个数组，
// 如果这一项判定不为假值，就把它放到一个数组中
// 最后把这个数组返回
// 类似这样
function compact(array) {
  const result = []
  for (let i = 0, length = array.length; i < length; i++) {
    //Falsey Values的布尔值类型都为false
		//可以用!!来判断是什么类型的布尔值，也可放在循环中自动判断
    if (!!array[i]) { // 如果该项判断为真      
      result.push(array[i])
    }
  }
  return result
}

// 简化一下
// 真美 ╮(╯_╰)╭
function compact(array) {
  return array.filter(item => !!item)
}