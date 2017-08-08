// Save bytes in the minified (but not gzipped) version:
// 缓存变量, 便于压缩代码
// 此处「压缩」指的是压缩到 min.js 版本
// 而不是 gzip 压缩
var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

// Create quick reference variables for speed access to core prototypes.
// 缓存变量, 便于压缩代码
// 同时可减少在原型链中的查找次数(提高代码效率)
// http://www.cnblogs.com/ziyunfei/archive/2012/09/22/2698505.html
// 应该没有什么必要吧？
var
  push             = ArrayProto.push,
  slice            = ArrayProto.slice,
  toString         = ObjProto.toString,
  hasOwnProperty   = ObjProto.hasOwnProperty;

// All **ECMAScript 5** native function implementations that we hope to use
// are declared here.
// ES5 原生方法, 如果浏览器支持, 则 underscore 中会优先使用
var
  nativeIsArray      = Array.isArray,
  nativeKeys         = Object.keys,
  nativeBind         = FuncProto.bind,
  nativeCreate       = Object.create;

// Shortcut function for checking if an object has a given property directly
// on itself (in other words, not on a prototype).
// 判断对象中是否有指定 key
// own properties, not on a prototype
_.has = function(obj, key) {
  // obj 不能为 null 或者 undefined
  return obj != null && hasOwnProperty.call(obj, key);
};

// Is a given variable an object?
// 判断是否为对象
// 这里的对象包括 function 和 object
// null则认为不是 object，用 !!obj 排除
_.isObject = function(obj) {
  const type = typeof obj
  return type === 'function' || type === 'object' && !!obj
}

// 闭包
// void 0 就是 undefined
// https://github.com/hanzichi/underscore-analysis/issues/1
const property = function(key) {
  return function(obj) {
    return obj == null ? void 0 : obj[key]
  }
}

// Math.pow(2, 53) - 1 是 JavaScript 中能精确表示的最大数字
const MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

// getLength 函数
// 该函数传入一个参数，返回参数的 length 属性值
// 用来获取 array 以及 arrayLike 元素的 length 属性值
const getLength = property('length')

// 判断是否是 ArrayLike Object
// 类数组，即拥有 length 属性并且 length 属性值为 Number 类型的元素，就这两条规则
// 包括数组、arguments、HTML Collection 以及 NodeList 等等
// 包括类似 {length: 10} 这样的对象
// 包括字符串、函数等
// https://segmentfault.com/a/1190000000415572 参考文章
const isArrayLike = function(collection) {
  // 返回参数 collection 的 length 属性值
  const length = getLength(collection);
  return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX
}

// Retrieve the names of an object's own properties.
// Delegates to **ECMAScript 5**'s native `Object.keys`
// ===== //
// _.keys({one: 1, two: 2, three: 3});
// => ["one", "two", "three"]
// ===== //
// 返回一个对象的 keys 组成的数组
// 仅返回 own enumerable properties 组成的数组
_.keys = function(obj) {
  // 容错
  // 如果传入的参数不是对象，则返回空数组
  if (!_.isObject(obj)) return [];

  // 如果浏览器支持 ES5 Object.key() 方法
  // 则优先使用该方法
  if (nativeKeys) return nativeKeys(obj);

  var keys = [];

  // own enumerable properties
  for (var key in obj)
    // hasOwnProperty
    if (_.has(obj, key)) keys.push(key);

  // Ahem, IE < 9.
  // IE < 9 下不能用 for in 来枚举某些 key 值
  // 传入 keys 数组为参数
  // 因为 JavaScript 下函数参数按值传递
  // 所以 keys 当做参数传入后会在 `collectNonEnumProps` 方法中改变值
  if (hasEnumBug) collectNonEnumProps(obj, keys);

  return keys;
}

// Retrieve all the property names of an object.
// 返回一个对象的 keys 数组
// 不仅仅是 own enumerable properties
// 还包括原型链上继承的属性
_.allKeys = function(obj) {
  // 容错
  // 不是对象，则返回空数组
  if (!_.isObject(obj)) return [];

  const keys = []
  for (var key in obj) keys.push(key)

  // Ahem, IE < 9.
  // IE < 9 下的 bug，同 _.keys 方法
  if (hasEnumBug) collectNonEnumProps(obj, keys)

  return keys
}

// IE < 9 下不能用 for in 来枚举的 key 值集合
// 其实还有个 `constructor` 属性
// 个人觉得可能是 `constructor` 和其他属性不属于一类
// nonEnumerableProps[] 中都是方法
// 而 constructor 表示的是对象的构造函数
// 所以区分开来了
var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                    'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];
// Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
// IE < 9 下 不能用 for key in ... 来枚举对象的某些 key
// 比如重写了对象的 `toString` 方法，这个 key 值就不能在 IE < 9 下用 for in 枚举到
// IE < 9，{toString: null}.propertyIsEnumerable('toString') 返回 false
// IE < 9，重写的 `toString` 属性被认为不可枚举
// 据此可以判断是否在 IE < 9 浏览器环境中
const hasEnumBug = !{toString: null}.propertyIsEnumerable('toString')

// obj 为需要遍历键值对的对象
// keys 为键数组
// 利用 JavaScript 按值传递的特点
// 传入数组作为参数，能直接改变数组的值
function collectNonEnumProps(obj, keys) {
  var nonEnumIdx = nonEnumerableProps.length
  var constructor = obj.constructor

  // 获取对象的原型
  // 如果 obj 的 constructor 被重写
  // 则 proto 变量为 Object.prototype
  // 如果没有被重写
  // 则为 obj.constructor.prototype
  var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

  // Constructor is a special case.
  // `constructor` 属性需要特殊处理 (是否有必要？)
  // see https://github.com/hanzichi/underscore-analysis/issues/3
  // 如果 obj 有 `constructor` 这个 key
  // 并且该 key 没有在 keys 数组中
  // 存入 keys 数组.
  var prop = 'constructor';
  if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

  // 遍历 nonEnumerableProps 数组中的 keys
  while (nonEnumIdx--) {
    prop = nonEnumerableProps[nonEnumIdx];
    // prop in obj 应该肯定返回 true 吧？是否有判断必要？
    // obj[prop] !== proto[prop] 判断该 key 是否来自于原型链
    // 即是否重写了原型链上的属性
    if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
      keys.push(prop);
    }
  }
}

// Return the number of elements in an object.
// 如果是数组（类数组），返回长度（length 属性）
// 如果是对象，返回键值对数量
_.size = function(obj) {
  if (obj == null) return 0; // 这里用 == 是因为 undefined == null, 不穿参数返回 0
  return isArrayLike(obj) ? obj.length : _.keys(obj).length;
};

// Retrieve the values of an object's properties.
// ===== //
// _.values({one: 1, two: 2, three: 3});
// => [1, 2, 3]
// ===== //
// 将一个对象的所有 values 值放入数组中
// 仅限 own properties 上的 values
// 不包括原型链上的
// 并返回该数组
// 为什么不用 [] 这种方式而是用 new Array ？
_.values = function(obj) {
  // 仅包括 own properties
  const keys = _.keys(obj)
  const length = keys.length
  const values = Array(length)
  for (var i = 0; i < length; i++) {
    values[i] = obj[keys[i]]
  }
  return values
}

// Invert the keys and values of an object. The values must be serializable.
// 将一个对象的 key-value 键值对颠倒
// 即原来的 key 为 value 值，原来的 value 值为 key 值
// 需要注意的是，value 值不能重复（不然后面的会覆盖前面的）
// 且新构造的对象符合对象构造规则
// 并且返回新构造的对象
_.invert = function(obj) {
  // 返回的新的对象
  const result = {}
  const keys = _.keys(obj)
  for (let i = 0, length = keys.length; i < length; i++) {
    result[obj[keys[i]]] = keys[i]
  }
  return result
}

// Converts lists into objects. Pass either a single array of `[key, value]`
// pairs, or two parallel arrays of the same length -- one of keys, and one of
// the corresponding values.
// 将数组转化为对象
_.object = function(list, values) {
  const result = {}
  for (let i = 0, length = getLength(list); i < length; i++) {
    if (values) {
      result[list[i]] = values[i]
    } else {
      result[list[i][0]] = list[i][1]
    }
  }
  return result
}

// Is the given value `NaN`? (NaN is the only number which does not equal itself).
// 判断是否是 NaN
// NaN 是唯一的一个 `自己不等于自己` 的 number 类型
// 这样写有 BUG
// _.isNaN(new Number(0)) => true
// 详见 https://github.com/hanzichi/underscore-analysis/issues/13
// 最新版本（edge 版）已经修复该 BUG
_.isNaN = function(obj) {
  return _.isNumber(obj) && obj !== +obj;
};

// Is a given value a boolean?
// 判断是否是布尔值
// 基础类型（true、 false）
// 以及 new Boolean() 两个方向判断
// 有点多余了吧？
// 个人觉得直接用 toString.call(obj) 来判断就可以了
// toString.call(obj) 的知识 http://www.cnblogs.com/youhong/p/6209054.html
// http://www.jb51.net/article/79941.htm
// type 是对象的构造函数
_.isBoolean = function(obj) {
  return obj === true || obj === false || toString.call(obj) === '[object Boolean]'
}

// Is a given value equal to null?
// 判断是否是 null
_.isNull = function(obj) {
  return obj === null
}

// Is a given value an array?
// Delegates to ECMA5's native Array.isArray
// 判断是否为数组
_.isArray = nativeIsArray || function(obj) {
  return toString.call(obj) === '[object Array]'
}

// Is a given variable undefined?
// 判断是否是 undefined
// undefined 能被改写 （IE < 9）
// undefined 只是全局对象的一个属性
// 在局部环境能被重新定义
// 但是「void 0」始终是 undefined
_.isUndefined = function(obj) {
  return obj === void 0
}

// Is a given array, string, or object empty?
// An "empty" object has no enumerable own-properties.
// 是否是 {}、[] 或者 "" 或者 null、undefined
_.isEmpty = function(obj) {
  if (obj == null) return true // null 和 undefined

  // 如果是数组、类数组、或者字符串
  // 根据 length 属性判断是否为空
  // 后面的条件是为了过滤 isArrayLike 对于 {length: 10} 这样对象的判断 bug？
  // 感觉类数组对象不会进入这里
  if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0

  // 如果是对象
  // 根据 keys 数量判断是否为 Empty
  return _.keys(obj).length === 0;
};
