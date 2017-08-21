//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.
//     中文注释 by hanzichi @https://github.com/hanzichi
//     我的源码解读顺序（跟系列解读文章相对应）
//     Object -> Array -> Collection -> Function -> Utility

(function() {

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094


  // Collection Functions
  // 数组或者对象的扩展方法
  // 共 25 个扩展方法
  // --------------------

  // Create a reducing function iterating left or right.
  // dir === 1 -> _.reduce
  // dir === -1 -> _.reduceRight
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        // 迭代，返回值供下次迭代调用
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      // 每次迭代返回值，供下次迭代调用
      return memo;
    }

    // _.reduce（_.reduceRight）可传入的 4 个参数
    // obj 数组或者对象
    // iteratee 迭代方法，对数组或者对象每个元素执行该方法
    // memo 初始值，如果有，则从 obj 第一个元素开始迭代
    // 如果没有，则从 obj 第二个元素开始迭代，将第一个元素作为初始值
    // context 为迭代函数中的 this 指向
    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;

      // Determine the initial value if none is provided.
      // 如果没有指定初始值
      // 则把第一个元素指定为初始值
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        // 根据 dir 确定是向左还是向右遍历
        index += dir;
      }

      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  // 与 ES5 中 Array.prototype.reduce 使用方法类似
  // _.reduce(list, iteratee, [memo], [context])
  // _.reduce 方法最多可传入 4 个参数
  // memo 为初始值，可选
  // context 为指定 iteratee 中 this 指向，可选
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  // 与 ES5 中 Array.prototype.reduceRight 使用方法类似
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  // 寻找数组或者对象中第一个满足条件（predicate 函数返回 true）的元素
  // 并返回该元素值
  // _.find(list, predicate, [context])
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    // 如果 obj 是数组，key 为满足条件的下标
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      // 如果 obj 是对象，key 为满足条件的元素的 key 值
      key = _.findKey(obj, predicate, context);
    }

    // 如果该元素存在，则返回该元素
    // 如果不存在，则默认返回 undefined（函数没有返回，即返回 undefined）
    if (key !== void 0 && key !== -1) return obj[key];
  };


  // Return all the elements for which a truth test fails.
  // 寻找数组或者对象中所有不满足条件的元素
  // 并以数组方式返回
  // 所得结果是 _.filter 方法的补集
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  // 根据指定的键值对
  // 选择对象
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  // 寻找第一个有指定 key-value 键值对的对象
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };


  // Sort the object's values by a criterion produced by an iteratee.
  // 排序
  // _.sortBy(list, iteratee, [context])
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);

    // 根据指定的 key 返回 values 数组
    // _.pluck([{}, {}, {}], 'value')
    return _.pluck(
      // _.map(obj, function(){}).sort()
      // _.map 后的结果 [{}, {}..]
      // sort 后的结果 [{}, {}..]
      _.map(obj, function(value, index, list) {
        return {
          value: value,
          index: index,
          // 元素经过迭代函数迭代后的值
          criteria: iteratee(value, index, list)
        };
      }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');

  };


  // Array Functions
  // 数组的扩展方法
  // 共 20 个扩展方法
  // Note: All array functions will also work on the arguments object.
  // However, Underscore functions are not designed to work on "sparse" arrays.
  // ---------------


  // Internal implementation of a recursive `flatten` function.
  // 递归调用数组，将数组展开
  // 即 [1, 2, [3, 4]] => [1, 2, 3, 4]
  // flatten(array, shallow, false)
  // flatten(arguments, true, true, 1)
  // flatten(arguments, true, true)
  // flatten(arguments, false, false, 1)
  // ===== //
  // input => Array 或者 arguments
  // shallow => 是否只展开一层
  // strict === true，通常和 shallow === true 配合使用
  // 表示只展开一层，但是不保存非数组元素（即无法展开的基础类型）
  // flatten([[1, 2], 3, 4], true, true) => [1, 2]
  // flatten([[1, 2], 3, 4], false, true) = > []
  // startIndex => 从 input 的第几项开始展开
  // ===== //
  // 可以看到，如果 strict 参数为 true，那么 shallow 也为 true
  // 也就是展开一层，同时把非数组过滤
  // [[1, 2], [3, 4], 5, 6] => [1, 2, 3, 4]
  var flatten = function(input, shallow, strict, startIndex) {
    // output 数组保存结果
    // 即 flatten 方法返回数据
    // idx 为 output 的累计数组下标
    var output = [], idx = 0;

    // 根据 startIndex 变量确定需要展开的起始位置
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      // 数组 或者 arguments
      // 注意 isArrayLike 还包括 {length: 10} 这样的，过滤掉
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        // flatten current level of array or arguments object
        // (!shallow === true) => (shallow === false)
        // 则表示需深度展开
        // 继续递归展开
        if (!shallow)
          // flatten 方法返回数组
          // 将上面定义的 value 重新赋值
          value = flatten(value, shallow, strict);

        // 递归展开到最后一层（没有嵌套的数组了）
        // 或者 (shallow === true) => 只展开一层
        // value 值肯定是一个数组
        var j = 0, len = value.length;

        // 这一步貌似没有必要
        // 毕竟 JavaScript 的数组会自动扩充
        // 但是这样写，感觉比较好，对于元素的 push 过程有个比较清晰的认识
        output.length += len;

        // 将 value 数组的元素添加到 output 数组中
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        // (!strict === true) => (strict === false)
        // 如果是深度展开，即 shallow 参数为 false
        // 那么当最后 value 不是数组，是基本类型时
        // 肯定会走到这个 else-if 判断中
        // 而如果此时 strict 为 true，则不能跳到这个分支内部
        // 所以 shallow === false 如果和 strict === true 搭配
        // 调用 flatten 方法得到的结果永远是空数组 []
        output[idx++] = value;
      }
    }

    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  // 将嵌套的数组展开
  // 如果参数 (shallow === true)，则仅展开一层
  // _.flatten([1, [2], [3, [[4]]]]);
  // => [1, 2, 3, 4];
  // ====== //
  // _.flatten([1, [2], [3, [[4]]]], true);
  // => [1, 2, 3, [[4]]];
  _.flatten = function(array, shallow) {
    // array => 需要展开的数组
    // shallow => 是否只展开一层
    // false 为 flatten 方法 strict 变量
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  // without_.without(array, *values)
  // Returns a copy of the array with all instances of the values removed.
  // ====== //
  // _.without([1, 2, 1, 0, 3, 1, 4], 0, 1);
  // => [2, 3, 4]
  // ===== //
  // 从数组中移除指定的元素
  // 返回移除后的数组副本
  _.without = function(array) {
    // slice.call(arguments, 1)
    // 将 arguments 转为数组（同时去掉第一个元素）
    // 之后便可以调用 _.difference 方法
    return _.difference(array, slice.call(arguments, 1));
  };
  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  // 数组去重
  // 如果第二个参数 `isSorted` 为 true
  // 则说明事先已经知道数组有序
  // 程序会跑一个更快的算法（一次线性比较，元素和数组前一个元素比较即可）
  // 如果有第三个参数 iteratee，则对数组每个元素迭代
  // 对迭代之后的结果进行去重
  // 返回去重后的数组（array 的子数组）
  // PS: 暴露的 API 中没 context 参数
  // _.uniq(array, [isSorted], [iteratee])
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    // 没有传入 isSorted 参数
    // 转为 _.unique(array, false, undefined, iteratee)
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }

    // 如果有迭代函数
    // 则根据 this 指向二次返回新的迭代函数
    if (iteratee != null)
      iteratee = cb(iteratee, context);

    // 结果数组，是 array 的子集
    var result = [];

    // 已经出现过的元素（或者经过迭代过的值）
    // 用来过滤重复值
    var seen = [];

    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          // 如果指定了迭代函数
          // 则对数组每一个元素进行迭代
          // 迭代函数传入的三个参数通常是 value, index, array 形式
          computed = iteratee ? iteratee(value, i, array) : value;

      // 如果是有序数组，则当前元素只需跟上一个元素对比即可
      // 用 seen 变量保存上一个元素
      if (isSorted) {
        // 如果 i === 0，是第一个元素，则直接 push
        // 否则比较当前元素是否和前一个元素相等
        if (!i || seen !== computed) result.push(value);
        // seen 保存当前元素，供下一次对比
        seen = computed;
      } else if (iteratee) {
        // 如果 seen[] 中没有 computed 这个元素值
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        // 如果不用经过迭代函数计算，也就不用 seen[] 变量了
        result.push(value);
      }
    }

    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  // union_.union(*arrays)
  // Computes the union of the passed-in arrays:
  // the list of unique items, in order, that are present in one or more of the arrays.
  // ========== //
  // _.union([1, 2, 3], [101, 2, 1, 10], [2, 1]);
  // => [1, 2, 3, 101, 10]
  // ========== //
  // 将多个数组的元素集中到一个数组中
  // 并且去重，返回数组副本
  _.union = function() {
    // 首先用 flatten 方法将传入的数组展开成一个数组
    // 然后就可以愉快地调用 _.uniq 方法了
    // 假设 _.union([1, 2, 3], [101, 2, 1, 10], [2, 1]);
    // arguments 为 [[1, 2, 3], [101, 2, 1, 10], [2, 1]]
    // shallow 参数为 true，展开一层
    // 结果为 [1, 2, 3, 101, 2, 1, 10, 2, 1]
    // 然后对其去重
    return _.uniq(flatten(arguments, true, true));
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  // _.difference(array, *others)
  // Similar to without, but returns the values from array that are not present in the other arrays.
  // ===== //
  // _.difference([1, 2, 3, 4, 5], [5, 2, 10]);
  // => [1, 3, 4]
  // ===== //
  // 剔除 array 数组中在 others 数组中出现的元素
  _.difference = function(array) {
    // 将 others 数组展开一层
    // rest[] 保存展开后的元素组成的数组
    // strict 参数为 true
    // 不可以这样用 _.difference([1, 2, 3, 4, 5], [5, 2], 10);
    // 10 就会取不到
    var rest = flatten(arguments, true, true, 1);

    // 遍历 array，过滤
    return _.filter(array, function(value){
      // 如果 value 存在在 rest 中，则过滤掉
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  // ===== //
  // _.zip(['moe', 'larry', 'curly'], [30, 40, 50], [true, false, false]);
  // => [["moe", 30, true], ["larry", 40, false], ["curly", 50, false]]
  // ===== //
  // 将多个数组中相同位置的元素归类
  // 返回一个数组
  _.zip = function() {
    return _.unzip(arguments);
  };



  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  // The iteratee may also be the string name of the property to sort by (eg. length).
  // ===== //
  // _.sortedIndex([10, 20, 30, 40, 50], 35);
  // => 3
  // ===== //
  // var stooges = [{name: 'moe', age: 40}, {name: 'curly', age: 60}];
  // _.sortedIndex(stooges, {name: 'larry', age: 50}, 'age');
  // => 1
  // ===== //
  // 二分查找
  // 将一个元素插入已排序的数组
  // 返回该插入的位置下标
  // _.sortedIndex(list, value, [iteratee], [context])
  _.sortedIndex = function(array, obj, iteratee, context) {
    // 注意 cb 方法
    // iteratee 为空 || 为 String 类型（key 值）时会返回不同方法
    iteratee = cb(iteratee, context, 1);

    // 经过迭代函数计算的值
    // 可打印 iteratee 出来看看
    var value = iteratee(obj);

    var low = 0, high = getLength(array);

    // 二分查找
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value)
        low = mid + 1;
      else
        high = mid;
    }

    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions
  // _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  // _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    // API 调用形式
    // _.indexOf(array, value, [isSorted])
    // _.indexOf(array, value, [fromIndex])
    // _.lastIndexOf(array, value, [fromIndex])
    return function(array, item, idx) {
      var i = 0, length = getLength(array);

      // 如果 idx 为 Number 类型
      // 则规定查找位置的起始点
      // 那么第三个参数不是 [isSorted]
      // 所以不能用二分查找优化了
      // 只能遍历查找
      if (typeof idx == 'number') {
        if (dir > 0) { // 正向查找
          // 重置查找的起始位置
          i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else { // 反向查找
          // 如果是反向查找，重置 length 属性值
          length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        // 能用二分查找加速的条件
        // 有序 & idx !== 0 && length !== 0

        // 用 _.sortIndex 找到有序数组中 item 正好插入的位置
        idx = sortedIndex(array, item);

        // 如果正好插入的位置的值和 item 刚好相等
        // 说明该位置就是 item 第一次出现的位置
        // 返回下标
        // 否则即是没找到，返回 -1
        return array[idx] === item ? idx : -1;
      }

      // 特判，如果要查找的元素是 NaN 类型
      // 如果 item !== item
      // 那么 item => NaN
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }

      // O(n) 遍历数组
      // 寻找和 item 相同的元素
      // 特判排除了 item 为 NaN 的情况
      // 可以放心地用 `===` 来判断是否相等了
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }

      return -1;
    };
  }



  // Function (ahem) Functions
  // 函数的扩展方法
  // 共 14 个扩展方法
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    // 非 new 调用 _.bind 返回的方法（即 bound）
    // callingContext 不是 boundFunc 的一个实例
    if (!(callingContext instanceof boundFunc))
      return sourceFunc.apply(context, args);

    // 如果是用 new 调用 _.bind 返回的方法

    // self 为 sourceFunc 的实例，继承了它的原型链
    // self 理论上是一个空对象（还没赋值），但是有原型链寒假快乐；“
    var self = baseCreate(sourceFunc.prototype);

    // 用 new 生成一个构造函数的实例
    // 正常情况下是没有返回值的，即 result 值为 undefined
    // 如果构造函数有返回值
    // 如果返回值是对象（非 null），则 new 的结果返回这个对象
    // 否则返回实例
    // @see http://www.cnblogs.com/zichi/p/4392944.html
    var result = sourceFunc.apply(self, args);

    // 如果构造函数返回了对象
    // 则 new 的结果是这个对象
    // 返回这个对象
    if (_.isObject(result)) return result;

    // 否则返回 self
    // var result = sourceFunc.apply(self, args);
    // self 对象当做参数传入
    // 会直接改变值
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  // ES5 bind 方法的扩展（polyfill）
  // 将 func 中的 this 指向 context（对象）
  // _.bind(function, object, *arguments)
  // 可选的 arguments 参数会被当作 func 的参数传入
  // func 在调用时，会优先用 arguments 参数，然后使用 _.bind 返回方法所传入的参数
  _.bind = function(func, context) {
    // 如果浏览器支持 ES5 bind 方法，并且 func 上的 bind 方法没有被重写
    // 则优先使用原生的 bind 方法
    if (nativeBind && func.bind === nativeBind)
      return nativeBind.apply(func, slice.call(arguments, 1));

    // 如果传入的参数 func 不是方法，则抛出错误
    if (!_.isFunction(func))
      throw new TypeError('Bind must be called on a function');

    // polyfill
    // 经典闭包，函数返回函数
    // args 获取优先使用的参数
    var args = slice.call(arguments, 2);
    var bound = function() {
      // args.concat(slice.call(arguments))
      // 最终函数的实际调用参数由两部分组成
      // 一部分是传入 _.bind 的参数（会被优先调用）
      // 另一部分是传入 bound（_.bind 所返回方法）的参数
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };

    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  // _.partial(function, *arguments)
  // _.partial 能返回一个方法
  // pre-fill 该方法的一些参数
  _.partial = function(func) {
    // 提取希望 pre-fill 的参数
    // 如果传入的是 _，则这个位置的参数暂时空着，等待手动填入
    var boundArgs = slice.call(arguments, 1);

    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        // 如果该位置的参数为 _，则用 bound 方法的参数填充这个位置
        // args 为调用 _.partial 方法的 pre-fill 的参数 & bound 方法的 arguments
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }

      // bound 方法还有剩余的 arguments，添上去
      while (position < arguments.length)
        args.push(arguments[position++]);

      return executeBound(func, bound, this, this, args);
    };

    return bound;
  };

  
  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  // 和 setTimeout(func, 0) 相似（源码看来似乎应该是 setTimeout(func, 1)）
  // _.defer(function, *arguments)
  // 如果传入 *arguments，会被当做参数，和 _.delay 调用方式类似（少了第二个参数）
  // 其实核心还是调用了 _.delay 方法，但第二个参数（wait 参数）设置了默认值为 1
  // 如何使得方法能设置默认值？用 _.partial 方法
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  // 函数节流（如果有连续事件响应，则每间隔一定时间段触发）
  // 每间隔 wait(Number) milliseconds 触发一次 func 方法
  // 如果 options 参数传入 {leading: false}
  // 那么不会马上触发（等待 wait milliseconds 后第一次触发 func）
  // 如果 options 参数传入 {trailing: false}
  // 那么最后一次回调不会被触发
  // **Notice: options 不能同时设置 leading 和 trailing 为 false**
  // 示例：
  // var throttled = _.throttle(updatePosition, 100);
  // $(window).scroll(throttled);
  // 调用方式（注意看 A 和 B console.log 打印的位置）：
  // _.throttle(function, wait, [options])
  // sample 1: _.throttle(function(){}, 1000)
  // print: A, B, B, B ...
  // sample 2: _.throttle(function(){}, 1000, {leading: false})
  // print: B, B, B, B ...
  // sample 3: _.throttle(function(){}, 1000, {trailing: false})
  // print: A, A, A, A ...
  // ----------------------------------------- //
  _.throttle = function(func, wait, options) {
    var context, args, result;

    // setTimeout 的 handler
    var timeout = null;

    // 标记时间戳
    // 上一次执行回调的时间戳
    var previous = 0;

    // 如果没有传入 options 参数
    // 则将 options 参数置为空对象
    if (!options)
      options = {};

    var later = function() {
      // 如果 options.leading === false
      // 则每次触发回调后将 previous 置为 0
      // 否则置为当前时间戳
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      // console.log('B')
      result = func.apply(context, args);

      // 这里的 timeout 变量一定是 null 了吧
      // 是否没有必要进行判断？
      if (!timeout)
        context = args = null;
    };

    // 以滚轮事件为例（scroll）
    // 每次触发滚轮事件即执行这个返回的方法
    // _.throttle 方法返回的函数
    return function() {
      // 记录当前时间戳
      var now = _.now();

      // 第一次执行回调（此时 previous 为 0，之后 previous 值为上一次时间戳）
      // 并且如果程序设定第一个回调不是立即执行的（options.leading === false）
      // 则将 previous 值（表示上次执行的时间戳）设为 now 的时间戳（第一次触发时）
      // 表示刚执行过，这次就不用执行了
      if (!previous && options.leading === false)
        previous = now;

      // 距离下次触发 func 还需要等待的时间
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;

      // 要么是到了间隔时间了，随即触发方法（remaining <= 0）
      // 要么是没有传入 {leading: false}，且第一次触发回调，即立即触发
      // 此时 previous 为 0，wait - (now - previous) 也满足 <= 0
      // 之后便会把 previous 值迅速置为 now
      // ========= //
      // remaining > wait，表示客户端系统时间被调整过
      // 则马上执行 func 函数
      // @see https://blog.coding.net/blog/the-difference-between-throttle-and-debounce-in-underscorejs
      // ========= //

      // console.log(remaining) 可以打印出来看看
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          // 解除引用，防止内存泄露
          timeout = null;
        }

        // 重置前一次触发的时间戳
        previous = now;

        // 触发方法
        // result 为该方法返回值
        // console.log('A')
        result = func.apply(context, args);

        // 引用置为空，防止内存泄露
        // 感觉这里的 timeout 肯定是 null 啊？这个 if 判断没必要吧？
        if (!timeout)
          context = args = null;
      } else if (!timeout && options.trailing !== false) { // 最后一次需要触发的情况
        // 如果已经存在一个定时器，则不会进入该 if 分支
        // 如果 {trailing: false}，即最后一次不需要触发了，也不会进入这个分支
        // 间隔 remaining milliseconds 后触发 later 方法
        timeout = setTimeout(later, remaining);
      }

      // 回调返回值
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  // 函数去抖（连续事件触发结束后只触发一次）
  // sample 1: _.debounce(function(){}, 1000)
  // 连续事件结束后的 1000ms 后触发
  // sample 1: _.debounce(function(){}, 1000, true)
  // 连续事件触发后立即触发（此时会忽略第二个参数）
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      // 定时器设置的回调 later 方法的触发时间，和连续事件触发的最后一次时间戳的间隔
      // 如果间隔为 wait（或者刚好大于 wait），则触发事件
      var last = _.now() - timestamp;

      // 时间间隔 last 在 [0, wait) 中
      // 还没到触发的点，则继续设置定时器
      // last 值应该不会小于 0 吧？
      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        // 到了可以触发的时间点
        timeout = null;
        // 可以触发了
        // 并且不是设置为立即触发的
        // 因为如果是立即触发（callNow），也会进入这个回调中
        // 主要是为了将 timeout 值置为空，使之不影响下次连续事件的触发
        // 如果不是立即执行，随即执行 func 方法
        if (!immediate) {
          // 执行 func 函数
          result = func.apply(context, args);
          // 这里的 timeout 一定是 null 了吧
          // 感觉这个判断多余了
          if (!timeout)
            context = args = null;
        }
      }
    };

    // 嗯，闭包返回的函数，是可以传入参数的
    // 也是 DOM 事件所触发的回调函数
    return function() {
      // 可以指定 this 指向
      context = this;
      args = arguments;

      // 每次触发函数，更新时间戳
      // later 方法中取 last 值时用到该变量
      // 判断距离上次触发事件是否已经过了 wait seconds 了
      // 即我们需要距离最后一次事件触发 wait seconds 后触发这个回调方法
      timestamp = _.now();

      // 立即触发需要满足两个条件
      // immediate 参数为 true，并且 timeout 还没设置
      // immediate 参数为 true 是显而易见的
      // 如果去掉 !timeout 的条件，就会一直触发，而不是触发一次
      // 因为第一次触发后已经设置了 timeout，所以根据 timeout 是否为空可以判断是否是首次触发
      var callNow = immediate && !timeout;

      // 设置 wait seconds 后触发 later 方法
      // 无论是否 callNow（如果是 callNow，也进入 later 方法，去 later 方法中判断是否执行相应回调函数）
      // 在某一段的连续触发中，只会在第一次触发时进入这个 if 分支中
      if (!timeout)
        // 设置了 timeout，所以以后不会进入这个 if 分支了
        timeout = setTimeout(later, wait);

      // 如果是立即触发
      if (callNow) {
        // func 可能是有返回值的
        result = func.apply(context, args);
        // 解除引用
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  // 返回一个 predicate 方法的对立方法
  // 即该方法可以对原来的 predicate 迭代结果值取补集
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };


  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  // 函数至多只能被调用一次
  // 适用于这样的场景，某些函数只能被初始化一次，不得不设置一个变量 flag
  // 初始化后设置 flag 为 true，之后不断 check flag
  // ====== //
  // 其实是调用了 _.before 方法，并且将 times 参数设置为了默认值 2（也就是 func 至多能被调用 2 - 1 = 1 次）
  _.once = _.partial(_.before, 2);


  // Object Functions
  // 对象的扩展方法
  // 共 38 个扩展方法
  // ----------------


  // Extend a given object with all the properties in passed-in object(s).
  // extend_.extend(destination, *sources)
  // Copy all of the properties in the source objects over to the destination object
  // and return the destination object
  // It's in-order, so the last source will override properties of the same name in previous arguments.
  // 将几个对象上（第二个参数开始，根据参数而定）的所有键值对添加到 destination 对象（第一个参数）上
  // 因为 key 值可能会相同，所以后面的（键值对）可能会覆盖前面的
  // 参数个数 >= 1
  _.extend = createAssigner(_.allKeys);


  // Return a copy of the object only containing the whitelisted properties.
  // 根据一定的需求（key 值，或者通过 predicate 函数返回真假）
  // 返回拥有一定键值对的对象副本
  // 第二个参数可以是一个 predicate 函数
  // 也可以是 >= 0 个 key
  // _.pick(object, *keys)
  // Return a copy of the object
  // filtered to only have values for the whitelisted keys (or array of valid keys)
  // Alternatively accepts a predicate indicating which keys to pick.
  /*
  _.pick({name: 'moe', age: 50, userid: 'moe1'}, 'name', 'age');
  => {name: 'moe', age: 50}
  _.pick({name: 'moe', age: 50, userid: 'moe1'}, ['name', 'age']);
  => {name: 'moe', age: 50}
  _.pick({name: 'moe', age: 50, userid: 'moe1'}, function(value, key, object) {
    return _.isNumber(value);
  });
  => {age: 50}
  */
  _.pick = function(object, oiteratee, context) {
    // result 为返回的对象副本
    var result = {}, obj = object, iteratee, keys;
    // 容错
    if (obj == null) return result
    // 如果第二个参数是函数
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      // 如果第二个参数不是函数
      // 则后面的 keys 可能是数组
      // 也可能是连续的几个并列的参数
      // 用 flatten 将它们展开
      keys = flatten(arguments, false, false, 1);

      // 也转为 predicate 函数判断形式
      // 将指定 key 转化为 predicate 函数
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }

    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      // 满足条件
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

  // Return a copy of the object without the blacklisted properties.
  // 跟 _.pick 方法相对
  // 返回 _.pick 的补集
  // 即返回没有指定 keys 值的对象副本
  // 或者返回不能通过 predicate 函数的对象副本
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      // _.negate 方法对 iteratee 的结果取反
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // _.defaults(object, *defaults)
  // Fill in a given object with default properties.
  // Fill in undefined properties in object
  // with the first value present in the following list of defaults objects.
  // 和 _.extend 非常类似
  // 区别是如果 *defaults 中出现了和 object 中一样的键
  // 则不覆盖 object 的键值对
  // 如果 *defaults 多个参数对象中有相同 key 的对象
  // 则取最早出现的 value 值
  // 参数个数 >= 1
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  // 给定 prototype
  // 以及一些 own properties
  // 构造一个新的对象并返回
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);

    // 将 props 的键值对覆盖 result 对象
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  // 对象的 `浅复制` 副本
  // 注意点：所有嵌套的对象或者数组都会跟原对象用同一个引用
  // 所以是为浅复制，而不是深度克隆
  _.clone = function(obj) {
    // 容错，如果不是对象或者数组类型，则可以直接返回
    // 因为一些基础类型是直接按值传递的
    // 思考，arguments 呢？ Nodelists 呢？ HTML Collections 呢？
    if (!_.isObject(obj))
      return obj;

    // 如果是数组，则用 obj.slice() 返回数组副本
    // 如果是对象，则提取所有 obj 的键值对覆盖空对象，返回
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  // _.chain([1,2,3,200])
  // .filter(function(num) { return num % 2 == 0; })
  // .tap(alert)
  // .map(function(num) { return num * num })
  // .value();
  // => // [2, 200] (alerted)
  // => [4, 40000]
  // 主要是用在链式调用中
  // 对中间值立即进行处理
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };


  // Internal recursive comparison function for `isEqual`.
  // "内部的"/ "递归地"/ "比较"
  // 该内部方法会被递归调用
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    // a === b 时
    // 需要注意 `0 === -0` 这个 special case
    // 0 和 -0 被认为不相同（unequal）
    // 至于原因可以参考上面的链接
    if (a === b) return a !== 0 || 1 / a === 1 / b;

    // A strict comparison is necessary because `null == undefined`.
    // 如果 a 和 b 有一个为 null（或者 undefined）
    // 判断 a === b
    if (a == null || b == null) return a === b;

    // Unwrap any wrapped objects.
    // 如果 a 和 b 是 underscore OOP 的对象
    // 那么比较 _wrapped 属性值（Unwrap）
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;

    // Compare `[[Class]]` names.
    // 用 Object.prototype.toString.call 方法获取 a 变量类型
    var className = toString.call(a);

    // 如果 a 和 b 类型不相同，则返回 false
    // 类型都不同了还比较个蛋！
    if (className !== toString.call(b)) return false;

    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      // 以上五种类型的元素可以直接根据其 value 值来比较是否相等
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        // 转为 String 类型进行比较
        return '' + a === '' + b;

      // RegExp 和 String 可以看做一类
      // 如果 obj 为 RegExp 或者 String 类型
      // 那么 '' + obj 会将 obj 强制转为 String
      // 根据 '' + a === '' + b 即可判断 a 和 b 是否相等
      // ================

      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        // 如果 +a !== +a
        // 那么 a 就是 NaN
        // 判断 b 是否也是 NaN 即可
        if (+a !== +a) return +b !== +b;

        // An `egal` comparison is performed for other numeric values.
        // 排除了 NaN 干扰
        // 还要考虑 0 的干扰
        // 用 +a 将 Number() 形式转为基本类型
        // 即 +Number(1) ==> 1
        // 0 需要特判
        // 如果 a 为 0，判断 1 / +a === 1 / b
        // 否则判断 +a === +b
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;

      // 如果 a 为 Number 类型
      // 要注意 NaN 这个 special number
      // NaN 和 NaN 被认为 equal
      // ================

      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;

      // Date 和 Boolean 可以看做一类
      // 如果 obj 为 Date 或者 Boolean
      // 那么 +obj 会将 obj 转为 Number 类型
      // 然后比较即可
      // +new Date() 是当前时间距离 1970 年 1 月 1 日 0 点的毫秒数
      // +true => 1
      // +new Boolean(false) => 0
    }


    // 判断 a 是否是数组
    var areArrays = className === '[object Array]';

    // 如果 a 不是数组类型
    if (!areArrays) {
      // 如果 a 不是 object 或者 b 不是 object
      // 则返回 false
      if (typeof a != 'object' || typeof b != 'object') return false;

      // 通过上个步骤的 if 过滤
      // !!保证到此的 a 和 b 均为对象!!

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      // 通过构造函数来判断 a 和 b 是否相同
      // 但是，如果 a 和 b 的构造函数不同
      // 也并不一定 a 和 b 就是 unequal
      // 比如 a 和 b 在不同的 iframes 中！
      // aCtor instanceof aCtor 这步有点不大理解，啥用？
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }

    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    // 第一次调用 eq() 函数，没有传入 aStack 和 bStack 参数
    // 之后递归调用都会传入这两个参数
    aStack = aStack || [];
    bStack = bStack || [];

    var length = aStack.length;

    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    // 将嵌套的对象和数组展开
    // 如果 a 是数组
    // 因为嵌套，所以需要展开深度比较
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      // 根据 length 判断是否应该继续递归对比
      length = a.length;

      // 如果 a 和 b length 属性大小不同
      // 那么显然 a 和 b 不同
      // return false 不用继续比较了
      if (length !== b.length) return false;

      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        // 递归
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // 如果 a 不是数组
      // 进入这个判断分支

      // Deep compare objects.
      // 两个对象的深度比较
      var keys = _.keys(a), key;
      length = keys.length;

      // Ensure that both objects contain the same number of properties before comparing deep equality.
      // a 和 b 对象的键数量不同
      // 那还比较毛？
      if (_.keys(b).length !== length) return false;

      while (length--) {
        // Deep compare each member
        // 递归比较
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }

    // Remove the first object from the stack of traversed objects.
    // 与 aStack.push(a) 对应
    // 此时 aStack 栈顶元素正是 a
    // 而代码走到此步
    // a 和 b isEqual 确认
    // 所以 a，b 两个元素可以出栈
    aStack.pop();
    bStack.pop();

    // 深度搜索递归比较完毕
    // 放心地 return true
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  // 判断两个对象是否一样
  // new Boolean(true)，true 被认为 equal
  // [1, 2, 3], [1, 2, 3] 被认为 equal
  // 0 和 -0 被认为 unequal
  // NaN 和 NaN 被认为 equal
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given value a DOM element?
  // 判断是否为 DOM 元素
  _.isElement = function(obj) {
    // 确保 obj 不是 null, undefined 等假值
    // 并且 obj.nodeType === 1
    return !!(obj && obj.nodeType === 1);
  };


  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  // _.isArguments 方法在 IE < 9 下的兼容
  // IE < 9 下对 arguments 调用 Object.prototype.toString.call 方法
  // 结果是 => [object Object]
  // 而并非我们期望的 [object Arguments]。
  // so 用是否含有 callee 属性来做兼容
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  // _.isFunction 在 old v8, IE 11 和 Safari 8 下的兼容
  // 觉得这里有点问题
  // 我用的 chrome 49 (显然不是 old v8)
  // 却也进入了这个 if 判断内部
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }


  // Utility Functions
  // 工具类方法
  // 共 14 个扩展方法
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  // 如果全局环境中已经使用了 `_` 变量
  // 可以用该方法返回其他变量
  // 继续使用 underscore 中的方法
  // var underscore = _.noConflict();
  // underscore.each(..);
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };


  // List of HTML entities for escaping.
  // HTML 实体编码
  // escapeMap 用于编码
  // see @http://www.cnblogs.com/zichi/p/5135636.html
  // in PHP, htmlspecialchars — Convert special characters to HTML entities
  // see @http://php.net/manual/zh/function.htmlspecialchars.php
  // 能将 & " ' < > 转为实体编码（下面的前 5 种）
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    // 以上四个为最常用的字符实体
    // 也是仅有的可以在所有环境下使用的实体字符（其他应该用「实体数字」，如下）
    // 浏览器也许并不支持所有实体名称（对实体数字的支持却很好）
    "'": '&#x27;',
    '`': '&#x60;'
  };

  // _.invert 方法将一个对象的键值对对调
  // unescapeMap 用于解码
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };

    // Regexes for identifying a key that needs to be escaped
    // 正则替换
    // 注意下 ?:
    var source = '(?:' + _.keys(map).join('|') + ')';

    // 正则 pattern
    var testRegexp = RegExp(source);

    // 全局替换
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };

  // Escapes a string for insertion into HTML, replacing &, <, >, ", `, and ' characters.
  // 编码，防止被 XSS 攻击等一些安全隐患
  _.escape = createEscaper(escapeMap);

  // The opposite of escape
  // replaces &amp;, &lt;, &gt;, &quot;, &#96; and &#x27; with their unescaped counterparts
  // 解码
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  // 生成客户端临时的 DOM ids
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  // ERB => Embedded Ruby
  // Underscore 默认采用 ERB-style 风格模板，也可以根据自己习惯自定义模板
  // 1. <%  %> - to execute some code
  // 2. <%= %> - to print some value in template
  // 3. <%- %> - to print some values HTML escaped
  _.templateSettings = {
    // 三种渲染模板
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',  // 回车符
    '\n':     'n',  // 换行符
    // http://stackoverflow.com/questions/16686687/json-stringify-and-u2028-u2029-check
    '\u2028': 'u2028', // Line separator
    '\u2029': 'u2029'  // Paragraph separator
  };

  // RegExp pattern
  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    /**
      '      => \\'
      \\     => \\\\
      \r     => \\r
      \n     => \\n
      \u2028 => \\u2028
      \u2029 => \\u2029
    **/
    return '\\' + escapes[match];
  };

  // 将 JavaScript 模板编译为可以用于页面呈现的函数
  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  // oldSettings 参数为了兼容 underscore 旧版本
  // setting 参数可以用来自定义字符串模板（但是 key 要和 _.templateSettings 中的相同，才能 overridden）
  // 1. <%  %> - to execute some code
  // 2. <%= %> - to print some value in template
  // 3. <%- %> - to print some values HTML escaped
  // Compiles JavaScript templates into functions
  // _.template(templateString, [settings])
  _.template = function(text, settings, oldSettings) {
    // 兼容旧版本
    if (!settings && oldSettings)
      settings = oldSettings;

    // 相同的 key，优先选择 settings 对象中的
    // 其次选择 _.templateSettings 对象中的
    // 生成最终用来做模板渲染的字符串
    // 自定义模板优先于默认模板 _.templateSettings
    // 如果定义了相同的 key，则前者会覆盖后者
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    // 正则表达式 pattern，用于正则匹配 text 字符串中的模板字符串
    // /<%-([\s\S]+?)%>|<%=([\s\S]+?)%>|<%([\s\S]+?)%>|$/g
    // 注意最后还有个 |$
    var matcher = RegExp([
      // 注意下 pattern 的 source 属性
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    // 编译模板字符串，将原始的模板字符串替换成函数字符串
    // 用拼接成的函数字符串生成函数（new Function(...)）
    var index = 0;

    // source 变量拼接的字符串用来生成函数
    // 用于当做 new Function 生成函数时的函数字符串变量
    // 记录编译成的函数字符串，可通过 _.template(tpl).source 获取（_.template(tpl) 返回方法）
    var source = "__p+='";

    // replace 函数不需要为返回值赋值，主要是为了在函数内对 source 变量赋值
    // 将 text 变量中的模板提取出来
    // match 为匹配的整个串
    // escape/interpolate/evaluate 为匹配的子表达式（如果没有匹配成功则为 undefined）
    // offset 为字符匹配（match）的起始位置（偏移量）
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      // \n => \\n
      source += text.slice(index, offset).replace(escaper, escapeChar);

      // 改变 index 值，为了下次的 slice
      index = offset + match.length;

      if (escape) {
        // 需要对变量进行编码（=> HTML 实体编码）
        // 避免 XSS 攻击
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        // 单纯的插入变量
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        // 可以直接执行的 JavaScript 语句
        // 注意 "__p+="，__p 为渲染返回的字符串
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offset.
      // return 的作用是？
      // 将匹配到的内容原样返回（Adobe VMs 需要返回 match 来使得 offset 值正常）
      return match;
    });

    source += "';\n";

    // By default, `template` places the values from your data in the local scope via the `with` statement.
    // However, you can specify a single variable name with the variable setting.
    // This can significantly improve the speed at which a template is able to render.
    // If a variable is not specified, place data values in local scope.
    // 指定 scope
    // 如果设置了 settings.variable，能显著提升模板的渲染速度
    // 否则，默认用 with 语句指定作用域
    if (!settings.variable)
      source = 'with(obj||{}){\n' + source + '}\n';

    // 增加 print 功能
    // __p 为返回的字符串
    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      // render 方法，前两个参数为 render 方法的参数
      // obj 为传入的 JSON 对象，传入 _ 参数使得函数内部能用 Underscore 的函数
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      // 抛出错误
      e.source = source;
      throw e;
    }

    // 返回的函数
    // data 一般是 JSON 数据，用来渲染模板
    var template = function(data) {
      // render 为模板渲染函数
      // 传入参数 _ ，使得模板里 <%  %> 里的代码能用 underscore 的方法
      //（<%  %> - to execute some code）
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    // template.source for debug?
    // obj 与 with(obj||{}) 中的 obj 对应
    var argument = settings.variable || 'obj';

    // 可通过 _.template(tpl).source 获取
    // 可以用来预编译，在服务端预编译好，直接在客户端生成代码，客户端直接调用方法
    // 这样如果出错就能打印出错行
    // Precompiling your templates can be a big help when debugging errors you can't reproduce.
    // This is because precompiled templates can provide line numbers and a stack trace,
    // something that is not possible when compiling templates on the client.
    // The source property is available on the compiled template function for easy precompilation.
    // see @http://stackoverflow.com/questions/18755292/underscore-js-precompiled-templates-using
    // see @http://stackoverflow.com/questions/13536262/what-is-javascript-template-precompiling
    // see @http://stackoverflow.com/questions/40126223/can-anyone-explain-underscores-precompilation-in-template
    // JST is a server-side thing, not client-side.
    // This mean that you compile Unserscore template on server side by some server-side script and save the result in a file.
    // Then use this file as compiled Unserscore template.
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  // 使支持链式调用
  /**
  // 非 OOP 调用 chain
  _.chain([1, 2, 3])
    .map(function(a) { return a * 2; })
    .reverse().value(); // [6, 4, 2]

  // OOP 调用 chain
  _([1, 2, 3])
    .chain()
    .map(function(a){ return a * 2; })
    .first()
    .value(); // 2
  **/
  _.chain = function(obj) {
    // 无论是否 OOP 调用，都会转为 OOP 形式
    // 并且给新的构造对象添加了一个 _chain 属性
    var instance = _(obj);

    // 标记是否使用链式操作
    instance._chain = true;

    // 返回 OOP 对象
    // 可以看到该 instance 对象除了多了个 _chain 属性
    // 其他的和直接 _(obj) 的结果一样
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // OOP
  // 如果 `_` 被当做方法（构造函数）调用, 则返回一个被包装过的对象
  // 该对象能使用 underscore 的所有方法
  // 并且支持链式调用

  // Helper function to continue chaining intermediate results.
  // 一个帮助方法（Helper function）
  var result = function(instance, obj) {
    // 如果需要链式操作，则对 obj 运行 _.chain 方法，使得可以继续后续的链式操作
    // 如果不需要，直接返回 obj
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  // 可向 underscore 函数库扩展自己的方法
  // obj 参数必须是一个对象（JavaScript 中一切皆对象）
  // 且自己的方法定义在 obj 的属性上
  // 如 obj.myFunc = function() {...}
  // 形如 {myFunc: function(){}}
  // 之后便可使用如下: _.myFunc(..) 或者 OOP _(..).myFunc(..)
  _.mixin = function(obj) {
    // 遍历 obj 的 key，将方法挂载到 Underscore 上
    // 其实是将方法浅拷贝到 _.prototype 上
    _.each(_.functions(obj), function(name) {
      // 直接把方法挂载到 _[name] 上
      // 调用类似 _.myFunc([1, 2, 3], ..)
      var func = _[name] = obj[name];

      // 浅拷贝
      // 将 name 方法挂载到 _ 对象的原型链上，使之能 OOP 调用
      _.prototype[name] = function() {
        // 第一个参数
        var args = [this._wrapped];

        // arguments 为 name 方法需要的其他参数
        push.apply(args, arguments);
        // 执行 func 方法
        // 支持链式操作
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  // 将前面定义的 underscore 方法添加给包装过的对象
  // 即添加到 _.prototype 中
  // 使 underscore 支持面向对象形式的调用
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  // 将 Array 原型链上有的方法都添加到 underscore 中
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);

      if ((name === 'shift' || name === 'splice') && obj.length === 0)
        delete obj[0];

      // 支持链式操作
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  // 添加 concat、join、slice 等数组原生方法给 Underscore
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  // 一个包装过(OOP)并且链式调用的对象
  // 用 value 方法获取结果
  // _(obj).value === obj?
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  // 兼容 AMD 规范
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));
