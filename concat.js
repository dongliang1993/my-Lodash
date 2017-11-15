// 这个 concat 函数 js 是有对应的 API 的
// 不过我们可以先自己尝试不用原生提供的，先自己写一写

// 注意，这个函数是个纯函数，不会修改传入的值
function concat() {
  const result = []
  for (let i = 0; i < arguments.length; i++) {
    result.push(arguments[i])
  }
  return result
}
// 叉会腰，老子真是太厉害了
// 敲到麻袋~~ 真的是正确的么？
// 让我们来看一下
// var array = [1];
// var other = _.concat(array, 2, [3], [[4]]);
 
// console.log(other);
// // => [1, 2, 3, [4]]
 
// console.log(array);
// // => [1]
// 试一下自己的 
// concat(array, 2, [3], [[4]])
// ===> [[1], 2, [3], [[4]]]
// 好像。。。。有点。。。。不一样啊。。。。

// 可以看到， lodash 中的 concat 和原生中的 conncat 是一样的
// 会默认降维打击（好装逼。。），二维数组变成一维，一维变身常数
// 司高义

// 所以我们要重写一下了。。。
function concat() {
  let result = []
  for (let i = 0; i < arguments.length; i++) {
    result = result.concat(arguments[i])
  }
  return result
}

// 然而 arguments 这货有点奇葩
// JavaScript 中每个函数内都能访问一个特别变量 arguments。
// 这个变量维护着所有传递到这个函数中的参数列表。
// 注意: 由于 arguments 已经被定义为函数内的一个变量。
// 因此通过 var 关键字定义 arguments 或者将 arguments 声明为一个形式参数，
// 都将导致原生的 arguments 不会被创建。
// arguments 变量不是一个数组（Array）。 
// 尽管在语法上它有数组相关的属性 length，但它不从 Array.prototype 继承，
// 实际上它是一个对象（Object）。
// 因此，无法对 arguments 变量使用标准的数组方法，比如 push, pop 或者 slice。
// 虽然使用 for 循环遍历也是可以的，但是为了更好的使用数组方法
// 最好把它转化为一个真正的数组。
// 下面的代码将会创建一个新的数组，包含所有 arguments 对象中的元素。
// Array.prototype.slice.call(arguments);
// 这个转化比较慢，在性能不好的代码中不推荐这种做法。
const argumentsToArr = (arg) => {
	return Array.prototype.slice.call(arg)
}

function concat() {
  const argArr = argumentsToArr(arguments)
  let result = []
  for (let i = 0, length = argArr.length; i < length; i++) {
    result = result.concat(argArr[i])
  }
  return result
}

// final
function concat(...arg) {
  let result = []
  for (let i = 0, length = arg.length; i < length; i++) {
    result = result.concat(arg[i])
  }
  return result
}

// real final
function concat(...arg) {
  return arg.reduce((a, b) => {
    return a.concat(b)
  }, [])
}
