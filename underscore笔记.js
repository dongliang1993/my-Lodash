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
  hasOwnProperty   = ObjProto.hasOwnProperty

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
// own properties, not on a prototype
// 判断对象中是否有指定 key，不会沿着原型链去找
_.has = function(obj, key) {
  // obj 不能为 null 或者 undefined
  // 因为 null == undefined ，所以 obj != null 就排除了两者
  return obj != null && hasOwnProperty.call(obj, key)
}

// Is a given variable an object?
// 判断是否为对象
// 这里的对象包括 function 和 object
// null则认为不是 object，用 !!obj 排除
_.isObject = function(obj) {
  const type = typeof obj
  return type === 'function' || type === 'object' && !!obj
}

// 闭包
// 不知道为什么要包一层，可能是为了可读性更好吧
// void 0 就是 undefined
// https://github.com/hanzichi/underscore-analysis/issues/1
const property = function(key) {
  return function(obj) {
    // 也算是个容错处理吧，undefined[key] 会报错
    return obj == null ? void 0 : obj[key]
  }
}

// Math.pow(2, 53) - 1 是 JavaScript 中能精确表示的最大数字
const MAX_ARRAY_INDEX = Math.pow(2, 53) - 1

// getLength 函数
// 该函数传入一个参数，返回参数的 length 属性值
// 用来获取 array 以及 arrayLike 元素的 length 属性值
const getLength = property('length')

// 判断是否是 ArrayLike Object
// 类数组，即拥有 length 属性并且 length 属性值为 Number 类型的元素，就这两条规则
// 包括数组、arguments、HTML Collection 以及 NodeList 等等
// 包括类似 {length: 10} 这样的对象
// https://segmentfault.com/a/1190000000415572 参考文章
const isArrayLike = function(collection) {
  // 返回参数 collection 的 length 属性值
  const length = getLength(collection)
  return typeof length === 'number' && length >= 0 && length <= MAX_ARRAY_INDEX
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
  if (!_.isObject(obj)) return []

  // 如果浏览器支持 ES5 Object.key() 方法
  // 则优先使用该方法
  if (nativeKeys) return nativeKeys(obj)

  var keys = []
  for (var key in obj) {
    // 循环将迭代对象的所有可枚举属性和从它的构造函数的 prototype 继承而来的（包括被覆盖的内建属性）。
    // 所以要做个限制, 只遍历自身的可枚举属性，注意，是自身和可枚举两个条件
    if (_.has(obj, key)) keys.push(key)
  }
  // Ahem, IE < 9.
  // IE < 9 下不能用 for in 来枚举某些 key 值
  // 传入 keys 数组为参数
  // 因为 JavaScript 下函数参数按值传递
  // 所以 keys 当做参数传入后会在 `collectNonEnumProps` 方法中改变值
  if (hasEnumBug) collectNonEnumProps(obj, keys) return keys
}

// Retrieve all the property names of an object.
// 返回一个对象的 keys 数组
// 不仅仅是 own enumerable properties
// 还包括原型链上继承的属性
_.allKeys = function(obj) {
  // 容错
  // 不是对象，则返回空数组
  if (!_.isObject(obj)) return []

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
// TODO
function collectNonEnumProps(obj, keys) {
  var nonEnumIdx = nonEnumerableProps.length
  var constructor = obj.constructor

  // 获取对象的原型
  // 如果 obj 的 constructor 被重写
  // 则 proto 变量为 Object.prototype
  // 如果没有被重写
  // 则为 obj.constructor.prototype
  var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto

  // Constructor is a special case.
  // `constructor` 属性需要特殊处理 (是否有必要？)
  // see https://github.com/hanzichi/underscore-analysis/issues/3
  // 如果 obj 有 `constructor` 这个 key
  // 并且该 key 没有在 keys 数组中
  // 存入 keys 数组.
  var prop = 'constructor'
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
  if (obj == null) return 0 // undefined, null 返回 0
  return isArrayLike(obj) ? obj.length : _.keys(obj).length
}

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
  // 为什么不用 for in ？
  // 一个原因是 for in 会遍历原型链上的，另一个原因是
  // for in 遍历的顺序是不稳定的
  // 然而 _.keys 也是 for in 实现的。。。  尴尬了
  for (let i = 0, length = keys.length; i < length; i++) {
    result[obj[keys[i]]] = keys[i]
  }
  return result
}

// Converts lists into objects. Pass either a single array of `[key, value]`
// pairs, or two parallel arrays of the same length -- one of keys, and one of
// the corresponding values.
// 将数组转化为对象
// 分为一维数组和二维数组,处理方法不同
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
  return _.isNumber(obj) && obj !== +obj
}

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
  // {length: 10} 这样的类数组对象会直接到最后的return
  if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0

  // 如果是对象
  // 根据 keys 数量判断是否为 Empty
  return _.keys(obj).length === 0
}

// Internal function that returns an efficient (for current engines) version
// of the passed-in callback, to be repeatedly applied in other Underscore
// functions.
// 函数的名字是 优化回调, 接受三个参数，func、上下文、参数个数
// 感觉这个函数最主要的作用是把传进来的函数和上下文绑定在一起 ，
// 然后根据 argCount 参数确定处理几个参数
// underscore 内部方法
// 根据 this 指向（context 参数）
// 以及 argCount 参数
// 二次操作返回一些回调、迭代方法
var optimizeCb = function(func, context, argCount) {
  // 如果没有指定 this 指向，则返回原函数
  if (context === void 0)
    return func

  switch (argCount == null ? 3 : argCount) {
    case 1: return function(value) {
      return func.call(context, value)
    }
    case 2: return function(value, other) {
      return func.call(context, value, other);
    }

    // 如果有指定 this，但没有传入 argCount 参数
    // 则执行以下 case
    // _.each、_.map
    case 3: return function(value, index, collection) {
      return func.call(context, value, index, collection)
    }

    // _.reduce、_.reduceRight
    case 4: return function(accumulator, value, index, collection) {
      return func.call(context, accumulator, value, index, collection)
    }
  }

  // 其实不用上面的 switch-case 语句
  // 直接执行下面的 return 函数就行了
  // 不这样做的原因是 call 比 apply 快很多
  // .apply 在运行前要对作为参数的数组进行一系列检验和深拷贝，.call 则没有这些步骤
  // 具体可以参考：
  // https://segmentfault.com/q/1010000007894513
  // http://www.ecma-international.org/ecma-262/5.1/#sec-15.3.4.3
  // http://www.ecma-international.org/ecma-262/5.1/#sec-15.3.4.4
  return function() {
    return func.apply(context, arguments)
  }
}

// The cornerstone, an `each` implementation, aka `forEach`.
// Handles raw objects in addition to array-likes. Treats all
// sparse array-likes as if they were dense.
// 与 ES5 中 Array.prototype.forEach 使用方法类似
// 遍历数组或者对象的每个元素
// 第一个参数为数组（包括类数组）或者对象
// 第二个参数为迭代方法，对数组或者对象每个元素都执行该方法
// 该方法又能传入三个参数，分别为 (item, index, array)（(value, key, obj) for object）
// 与 ES5 中 Array.prototype.forEach 方法传参格式一致
// 第三个参数（可省略）确定第二个参数 iteratee 函数中的（可能有的）this 指向
// 即 iteratee 中出现的（如果有）所有 this 都指向 context
// notice: 不要传入一个带有 key 类型为 number 的对象！
// notice: _.each 方法不能用 return 跳出循环（同样，Array.prototype.forEach 也不行）
_.each = _.forEach = function(obj, iteratee, context) {
  // 根据 context 确定不同的迭代函数
  iteratee = optimizeCb(iteratee, context)
  var i, length
  // 如果是类数组
  // 默认不会传入类似 {length: 10} 这样的数据
  if (isArrayLike(obj)) {
    // 遍历
    for (i = 0, length = obj.length; i < length; i++) {
      iteratee(obj[i], i, obj)
    }
  } else { // 如果 obj 是对象
    // 获取对象的所有 key 值
    const keys = _.keys(obj)
    // 如果是对象，则遍历处理 values 值
    for (i = 0, length = keys.length; i < length; i++) {
      iteratee(obj[keys[i]], keys[i], obj) // (value, key, obj)
    }
  }
  
  // 返回 obj 参数
  // 供链式调用（Returns the list for chaining）
  // 应该仅 OOP 调用有效
  return obj
}


// Returns a predicate for checking whether an object has a given set of
// `key:value` pairs.
// 判断一个给定的对象是否有某些键值对
// 函数名字叫【 匹配器 】
_.matcher = _.matches = function(attrs) {
  attrs = _.extendOwn({}, attrs);
  return function(obj) {
    return _.isMatch(obj, attrs);
  };
};

// Returns whether an object has a given set of `key:value` pairs.
// attrs 参数为一个对象
// 判断 object 对象中是否有 attrs 中的所有 key-value 键值对
// 返回布尔值
_.isMatch = function(object, attrs) {
  // 提取 attrs 对象的所有 keys
  var keys = _.keys(attrs), length = keys.length;

  // 如果 object 为空
  // 根据 attrs 的键值对数量返回布尔值
  if (object == null) return !length;

  // 这一步有必要？
  var obj = Object(object);

  // 遍历 attrs 对象键值对
  for (var i = 0; i < length; i++) {
    var key = keys[i];

    // 如果 obj 对象没有 attrs 对象的某个 key
    // 或者对于某个 key，它们的 value 值不同
    // 则证明 object 并不拥有 attrs 的所有键值对
    // 则返回 false
    if (attrs[key] !== obj[key] || !(key in obj)) return false;
  }

  return true;
};

// Assigns a given object with all the own properties in the passed-in object(s)
// (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
// 跟 extend 方法类似，但是只把 own properties 拷贝给第一个参数对象
// 只继承 own properties 的键值对
// 参数个数 >= 1
_.extendOwn = _.assign = createAssigner(_.keys);

// An internal function for creating assigner functions.
// 有三个方法用到了这个内部函数
// _.extend & _.extendOwn & _.defaults
// _.extend = createAssigner(_.allKeys);
// _.extendOwn = _.assign = createAssigner(_.keys);
// _.defaults = createAssigner(_.allKeys, true);
var createAssigner = function(keysFunc, undefinedOnly) {
  // 返回函数
  // 经典闭包（undefinedOnly 参数在返回的函数中被引用）
  // 返回的函数参数个数 >= 1
  // 将第二个开始的对象参数的键值对 "继承" 给第一个参数
  return function(obj) {
    var length = arguments.length;
    // 只传入了一个参数（或者 0 个？）
    // 或者传入的第一个参数是 null
    if (length < 2 || obj == null) return obj;

    // 枚举第一个参数除外的对象参数
    // 即 arguments[1], arguments[2] ...
    for (var index = 1; index < length; index++) {
      // source 即为对象参数
      var source = arguments[index],
          // 提取对象参数的 keys 值
          // keysFunc 参数表示 _.keys
          // 或者 _.allKeys
          keys = keysFunc(source),
          l = keys.length;

      // 遍历该对象的键值对
      for (var i = 0; i < l; i++) {
        var key = keys[i];
        // _.extend 和 _.extendOwn 方法
        // 没有传入 undefinedOnly 参数，即 !undefinedOnly 为 true
        // 即肯定会执行 obj[key] = source[key]
        // 后面对象的键值对直接覆盖 obj
        // ==========================================
        // _.defaults 方法，undefinedOnly 参数为 true
        // 即 !undefinedOnly 为 false
        // 那么当且仅当 obj[key] 为 undefined 时才覆盖
        // 即如果有相同的 key 值，取最早出现的 value 值
        // *defaults 中有相同 key 的也是一样取首次出现的
        if (!undefinedOnly || obj[key] === void 0)
          obj[key] = source[key];
      }
    }

    // 返回已经继承后面对象参数属性的第一个参数对象
    return obj;
  };
};

// A mostly-internal function to generate callbacks that can be applied
// to each element in a collection, returning the desired result — either
// identity, an arbitrary callback, a property matcher, or a property accessor.
var cb = function(value, context, argCount) {
  if (value == null) return _.identity;
  if (_.isFunction(value)) return optimizeCb(value, context, argCount);
  if (_.isObject(value)) return _.matcher(value);
  return _.property(value);
};

// Return the results of applying the iteratee to each element.
// 与 ES5 中 Array.prototype.map 使用方法类似
// 传参形式与 _.each 方法类似
// 遍历数组（每个元素）或者对象的每个元素（value）
// 对每个元素执行 iteratee 迭代方法
// 将结果保存到新的数组中，并返回
_.map = _.collect = function(obj, iteratee, context) {
  // 根据 context 确定不同的迭代函数
  iteratee = cb(iteratee, context);

  // 如果传参是对象，则获取它的 keys 值数组（短路表达式）
  // http://www.qdfuns.com/notes/17897/234cca8e6a0bc114e22e93bb7d58c6a4.html
  var keys = !isArrayLike(obj) && _.keys(obj),
      // 如果 obj 为对象，则 length 为 key.length
      // 如果 obj 为数组，则 length 为 obj.length
      length = (keys || obj).length,
      results = Array(length); // 结果数组

  // 遍历
  for (let index = 0; index < length; index++) {
    // 如果 obj 为对象，则 currentKey 为对象键值 key
    // 如果 obj 为数组，则 currentKey 为 index 值
    var currentKey = keys ? keys[index] : index;
    results[index] = iteratee(obj[currentKey], currentKey, obj);
  }

  // 返回新的结果数组
  return results;
};

// Generator function to create the findIndex and findLastIndex functions
// (dir === 1) => 从前往后找
// (dir === -1) => 从后往前找
function createPredicateIndexFinder(dir) {
  // 经典闭包
  return function(array, predicate, context) {
    predicate = cb(predicate, context)

    var length = getLength(array)

    // 根据 dir 变量来确定数组遍历的起始位置
    var index = dir > 0 ? 0 : length - 1;

    for (; index >= 0 && index < length; index += dir) {
      // 找到第一个符合条件的元素
      // 并返回下标值
      if (predicate(array[index], index, array))
        return index;
    }

    return -1;
  };
}

// Returns the first index on an array-like that passes a predicate test
// 从前往后找到数组中 `第一个满足条件` 的元素，并返回下标值
// 没找到返回 -1
// _.findIndex(array, predicate, [context])
_.findIndex = createPredicateIndexFinder(1);

// 从后往前找到数组中 `第一个满足条件` 的元素，并返回下标值
// 没找到返回 -1
// _.findLastIndex(array, predicate, [context])
_.findLastIndex = createPredicateIndexFinder(-1);

// Determine if the array or object contains a given item (using `===`).
// Aliased as `includes` and `include`.
// 判断数组或者对象中（value 值）是否有指定元素
// 如果是 object，则忽略 key 值，只需要查找 value 值即可
// 即该 obj 中是否有指定的 value 值
// 返回布尔值
_.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
  // 如果是对象，返回 values 组成的数组
  if (!isArrayLike(obj)) obj = _.values(obj);

  // fromIndex 表示查询起始位置
  // 如果没有指定该参数，则默认从头找起
  if (typeof fromIndex != 'number' || guard) fromIndex = 0;

  // _.indexOf 是数组的扩展方法（Array Functions）
  // 数组中寻找某一元素
  return _.indexOf(obj, item, fromIndex) >= 0;
};
