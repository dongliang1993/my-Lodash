/**
 * 这个是干嘛的
 * 参数是干嘛的
 * 返回什么
 * 例子
 * 尽量，或者说，如非刻意，不要更改函数的实际传入的参数值
 */

var DongLiang = {
	/**
	 * 将 array 拆分成多个 size 长度的块把这些块组成一个新数组。如果 array 无法被分割成全部等长的块，那么最后剩余的元素将组成一个块。
	 * 参数
	 * array (Array): 需要被处理的数组。
	 * [size=1] (number): 每个块的长度。
	 * 返回值
	 * (Array): 返回一个包含拆分块数组的新数组（相当于一个二维数组）。
	 * 例子
	 * chunk(['a', 'b', 'c', 'd'], 2);
	 * => [['a', 'b'], ['c', 'd']]
	 * chunk(['a', 'b', 'c', 'd'], 3);
	 * => [['a', 'b', 'c'], ['d']]
	 **/
	chunk: function(arr, n) {
		const len = arr.length,
					num,
					result
		if (len < size || size <= 0) {
			return [arr]
		}
		len % size === 0 ? num = len / size : num = Math.floor(len / size) + 1
		result = new Array(num)
		for(let i = 0; i < num; i++) {
			result[i] = arr.slice(size * i, size * (i + 1))
		}
		return result
	},

	isObject: function() {

	}

	keys: function(obj) {
		if(!DongLiang.isObject(obj)) return []
		const result = []
		for (let key in obj) {
			if (obj.hasOwnProperty(key)) {
				result.push(key)
			}
		}
		return result
	}

	/**
	 * 创建一个新数组并包含原数组中所有的非假值元素。例如 false、null、 0、""、undefined 和 NaN 都是“假值”。
	 * 参数
	 * array (Array): 数组参数。
	 * 返回值
	 * (Array): 返回过滤假值后的数组。
	 * 例子
	 * compact([0, 1, false, 2, '', 3]);
	 * // => [1, 2, 3]
	 **/
	compact: function(arr) {
		//Falsey Values的布尔值类型都为false
		//可以用!!来判断是什么类型的布尔值，也可放在循环中自动判断
		var result = [];
		for (var i = 0; i < arr.length; i++) {
			//如果输入的不是一个Falsey，放进空数组中
			if (arr[i]) {
				result.push(arr[i]);
			}
		}
		return result;
	},

	/**
	 * Creates an array of unique array values not included in the other provided arrays using SameValueZero for equality comparisons.
	 * 参数
	 * array (Array): 需要过滤的数组。
	 * [values] (...Array): 数组需要排除掉的值。
	 * 返回值
	 * (Array): 返回过滤后的数组
	 * 例子
	 * difference([1, 2, 3], [4, 2]);
	 * // => [1, 3]
	 * difference([1, '2', 3], [4, 2]);
	 * // => [1, "2", 3]
	 **/
	//思路就是，把第一个数组中的第一个和第二个数组的全部进行比较，
	//要是都不相等，就把第一个push进一个空数组
	//然后是第一个数组的第二个。。。
	difference: function(arr1, arr2) {
		var result = [];
		for (var i = 0; i < arr1.length; i++) {
			var isSingle = true;
			for (var j = 0; j < arr2.length; j++) {
				if (arr1[i] == arr2[j]) {
					isSingle = false;
					break;
				}
			}
			if (isSingle == true) {
				result.push(arr1[i])
			}
		}
		return result;
	},

	/**
	 * 这个方法类似_.difference ，除了它接受一个 iteratee （愚人码头注：迭代器）， 调用array 和 values 中的每个元素以产生比较的标准。 结果值是从第一数组中选择。iteratee 会调用一个参数：(value)。（愚人码头注：首先使用迭代器分别迭代array 和 values中的每个元素，返回的值作为比较值）。

	 * Note: 不像 _.pullAllBy，这个方法会返回一个新数组。
	 * 参数
	 * array (Array): 要检查的数组。
	 * [values] (...Array): 排除的值。
	 * [iteratee=_.identity] (Array|Function|Object|string): iteratee 调用每个元素。
	 * 返回值
	 * (Array): 返回一个过滤值后的新数组。
	 * 例子
	 * _.differenceBy([3.1, 2.2, 1.3], [4.4, 2.5], Math.floor);
	 * // => [3.1, 1.3]
	 *
	 * // The `_.property` iteratee shorthand.
	 * _.differenceBy([{ 'x': 2 }, { 'x': 1 }], [{ 'x': 1 }], 'x');
	 * // => [{ 'x': 2 }]
	 *
	 **/
	differenceBy: function(array, values, iteratee) {
		var fn, result = []
		if (typeof iteratee === 'string') {
			fn = function(obj) {
				return obj[iteratee]
			}
		} else if (iteratee instanceof Function) {
			fn = iteratee
		}
		array.forEach(function(item) {
			var state = values.every(it => fn(it) != fn(item))
			if (state) {
				result.push(item)
			}
		})
		return result
	},

	/**
	 * 这个方法类似_.difference ，除了它接受一个 comparator （愚人码头注：比较器），它调用比较array，values中的元素。 结果值是从第一数组中选择。comparator 调用参数有两个：(arrVal, othVal)。
	 * Note: 不像 _.pullAllBy，这个方法会返回一个新数组。
	 * 参数
	 * array (Array): 要检查的数组。
	 * [values] (...Array): 排除的值。
	 * [comparator] (Function): comparator 调用每个元素。
	 * 返回值
	 * (Array): 返回一个过滤值后的新数组。
	 * 例子
	 * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
	 *
	 * _.differenceWith(objects, [{ 'x': 1, 'y': 2 }], _.isEqual);
	 * // => [{ 'x': 2, 'y': 1 }]
	 *
	 **/
	differenceWith: function(array, values, comparator) {
		var result = []
		array.forEach(function(it) {
			var state = values.every(function(item) {
				return comparator(it, item)
			})
			if (!state) {
				result.push(it)
			}
		})
		return result
	},

	/**
	 * 将 array 中的前 n 个元素去掉，然后返回剩余的部分。
	 * 参数
	 * array (Array): 被操作的数组。
	 * [n=1] (number): 去掉的元素个数。
	 * 返回值
	 * (Array): 返回 array 的剩余部分。
	 * 例子
	 * drop([1, 2, 3]);
	 * // => [2, 3] 默认是1开始的
	 * drop([1, 2, 3], 2);
	 * // => [3]
	 * drop([1, 2, 3], 5);
	 * // => []
	 * drop([1, 2, 3], 0);
	 * // => [1, 2, 3]
	 **/
	drop: function(arr, number) {
		if (number == undefined) {
			number = 1;
		}
		arr.splice(0, number);
		return arr;
	},

	/**
	 * 将 array 尾部的 n 个元素去除，并返回剩余的部分。
	 * 参数
	 * array (Array): 需要被处理数组。
	 * [n=1] (number): 去掉的元素个数。
	 * 返回值
	 * (Array): 返回 array 的剩余部分。
	 * 例子
	 * dropRight([1, 2, 3]);
	 * // => [1, 2]
	 * dropRight([1, 2, 3], 2);
	 * // => [1]
	 * dropRight([1, 2, 3], 5);
	 * // => []
	 * dropRight([1, 2, 3], 0);
	 * // => [1, 2, 3]
	 **/
	dropRight: function(arr, number) {
		var result = arr.reverse();

		if (number == undefined) {
			number = 1;
		}

		result.splice(0, number);
		return result.reverse();
	},

	/**
	 * 创建一个切片数组，去除array中从 predicate 返回假值开始到尾部的部分。predicate 会传入3个参数： (value, index, array)。
	 * 参数
	 * array (Array): 要查询的数组。
	 * [predicate=_.identity] (Function): 这个函数会在每一次迭代调用
	 * 返回值
	 * (Array): 返回array剩余切片。
	 * 例子
	 * var users = [
	 *   { 'user': 'barney',  'active': true },
	 *   { 'user': 'fred',    'active': false },
	 *   { 'user': 'pebbles', 'active': false }
	 * ];
	 *
	 * _.dropRightWhile(users, function(o) { return !o.active; });
	 * // => objects for ['barney']
	 *
	 * // The `_.matches` iteratee shorthand.
	 * _.dropRightWhile(users, { 'user': 'pebbles', 'active': false });
	 * // => objects for ['barney', 'fred']
	 *
	 * // The `_.matchesProperty` iteratee shorthand.
	 * _.dropRightWhile(users, ['active', false]);
	 * // => objects for ['barney']
	 *
	 * // The `_.property` iteratee shorthand.
	 * _.dropRightWhile(users, 'active');
	 * // => objects for ['barney', 'fred', 'pebbles']
	 **/
	dropRightWhile: function(array, predicate) {
		var fn, result = []
		Object.prototype.toString.call(predicate)
		if (Object.prototype.toString.call(predicate) === '[object Function]') {
			fn = predicate
		}

		if (Object.prototype.toString.call(predicate) === '[object Object]') {
			fn = function(value, inedx, array) {
				var flag = true
				for (var key in predicate) {

					if (value[key] != predicate[key]) {
						flag = false
					}
				}
				return flag
			}
		}
		if (predicate instanceof Array) {
			fn = function(value, inedx, array) {
				if (value[predicate[0]] != predicate[1]) {
					return false
				} else {
					return true
				}
			}
		}
		if (typeof predicate === 'string') {
			fn = function(value, inedx, array) {
				return !value.hasOwnProperty(predicate)
			}
		}

		for (var i = 0; i < array.length; i++) {
			if (!fn(array[i], i, array)) {
				result.push(array[i])
			}
		}
		return result
	},

	/**
	 * 使用 value 值来填充（替换） array，从start位置开始, 到end位置结束（但不包含end位置）。
	 * Note: 这个方法会改变 array（愚人码头注：不是创建新数组）
	 * 参数
	 * array (Array): 要填充改变的数组。
	 * value (*): 填充给 array 的值。
	 * [start=0] (number): 开始位置（默认0）。
	 * [end=array.length] (number):结束位置（默认array.length）。
	 * 返回值
	 * (Array): 返回 array。
	 * 例子
	 * var array = [1, 2, 3];
	 * fill(array, 'a');
	 * console.log(array);
	 * // => ['a', 'a', 'a']
	 * fill(Array(3), 2);
	 * // => [2, 2, 2]
	 * fill([4, 6, 8, 10], '*', 1, 3);
	 * // => [4, '*', '*', 10]
	 **/
	fill: function() {
		var length = arguments[0].length;
		if (arguments.length == 2) {
			for (var j = 0; j < length; j++) {
				arguments[0][j] = arguments[1];
			}
		}

		if (arguments.length == 3) {
			for (var i = arguments[2]; i < length; i++) {
				arguments[0][i] = arguments[2];
			}
		}
		if (arguments.length == 4) {
			for (var i = arguments[2]; i < arguments[3]; i++) {
				arguments[0][i] = arguments[1];
			}
		}
		return arguments[0];
	},

	/**
	 * 该方法类似_.find，区别是该方法返回第一个通过 predicate 判断为真值的元素的索引值（index），而不是元素本身。
	 * 参数
	 * array (Array): 要搜索的数组。
	 * [predicate=_.identity] (Array|Function|Object|string): 这个函数会在每一次迭代调用。
	 * [fromIndex=0] (number): The index to search from.
	 * 返回值
	 * (number): 返回找到元素的 索引值（index），否则返回 -1。
	 * 例子
	 * var users = [
	 *   { 'user': 'barney',  'active': false },
	 *   { 'user': 'fred',    'active': false },
	 *   { 'user': 'pebbles', 'active': true }
	 * ];
	 *
	 * _.findIndex(users, function(o) { return o.user == 'barney'; });
	 * // => 0
	 *
	 * _.findIndex(users, { 'user': 'fred', 'active': false });
	 * // => 1
	 *
	 * _.findIndex(users, ['active', false]);
	 * // => 0
	 *
	 * _.findIndex(users, 'active');
	 * // => 2
	 **/
	findIndex: function(array, predicate, fromIndex = 0) {
		var fn
		if (typeof predicate === 'function') {
			fn = predicate
		} else
		if (Object.prototype.toString.call(predicate) === '[object Object]') {
			fn = function(obj) {
				var flag = true
				for (var key in obj) {
					if (obj[key] != predicate[key]) {
						flag = false
					}
				}
				return flag
			}
		} else
		if (Array.isArray(predicate)) {
			fn = function(obj) {
				return obj[predicate[0]] === predicate[1]
			}
		} else
		if (typeof predicate === 'string') {
			fn = function(obj) {
				return obj[predicate]
			}
		}

		for (var i = 0; i < array.length; i++) {
			if (fn(array[i])) {
				return i
			}
		}
	},

	/**
	 * 这个方式类似 _.findIndex， 区别是它是从右到左的迭代集合array中的元素。
	 * 参数
	 * array (Array): 要搜索的数组。
	 * [predicate=_.identity] (Array|Function|Object|string): 这个函数会在每一次迭代调用。
	 * [fromIndex=array.length-1] (number): The index to search from.
	 * 返回值
	 * (number): 返回找到元素的 索引值（index），否则返回 -1。
	 * 例子
	 * var users = [
	 *   { 'user': 'barney',  'active': false },
	 *   { 'user': 'fred',    'active': false },
	 *   { 'user': 'pebbles', 'active': true }
	 * ];
	 *
	 * _.findLastIndex(users, function(o) { return o.user == 'pebbles'; });
	 * // => 0
	 *
	 * _.findLastIndex(users, { 'user': 'barney', 'active': true });
	 * // => 1
	 *
	 * findLastIndex(users, ['active', false]);
	 * // => 2
	 *
	 * _.findLastIndex(users, 'active');
	 * // => 0
	 **/
	findLastIndex: function(array, predicate, fromIndex = 0) {
		var fn
		if (typeof predicate === 'function') {
			fn = predicate
		} else
		if (Object.prototype.toString.call(predicate) === '[object Object]') {
			fn = function(obj) {
				var flag = true
				for (var key in obj) {
					if (obj[key] != predicate[key]) {
						flag = false
					}
				}
				return flag
			}
		} else
		if (Array.isArray(predicate)) {
			fn = function(obj) {
				return obj[predicate[0]] === predicate[1]
			}
		} else
		if (typeof predicate === 'string') {
			fn = function(obj) {
				return obj[predicate]
			}
		}

		for (var i = array.length - 1; i >= 0; i--) {
			if (fn(array[i])) {
				return i
			}
		}
	},

	flatten: function(arr) {
		var result = [];
		for (var i = 0; i < arr.length; i++) {
			result = result.concat(arr[i])
		}
		return result;
	},

	flattenDeep: function(arr) {
		var result = DongLiang.flatten(arr);

		for (var i = 0; i < result.length; i++) {
			if (Array.isArray(result[i])) {
				result = DongLiang.flatten(result);
				i = -1;
			}
		}
		return result;
	},

	/**
	 * 根据 depth 递归减少 array 的嵌套层级
	 * 参数
	 * array (Array): 需要减少嵌套层级的数组。
	 * [depth=1] (number):最多减少的嵌套层级数。
	 * 返回值
	 * (Array): 返回减少嵌套层级后的新数组。
	 * 例子
	 * var array = [1, [2, [3, [4]], 5]];
	 *
	 * _.flattenDepth(array, 1);
	 * // => [1, 2, [3, [4]], 5]
	 *
	 * _.flattenDepth(array, 2);
	 * // => [1, 2, 3, [4], 5]
	 **/
	flattenDepth: function(array, depth = 1) {
		var result = array
		for (var i = 0; i < depth; i++) {
			result = DongLiang.flatten(result)
		}
		return result
	},

	fromPairs: function(arr) {
		var newObject = {};
		var length = arr.length;
		for (var i = 0; i < length; i++) {
			newObject[arr[i][0]] = arr[i][1];
		}
		return newObject;
	},

	head: function(arr) {
		return arr[0];
	},

	indexOf: function(array, vallue, fromIndex) {
		//第三个参数是可选的，如果没有，那么就默认为1
		if (fromIndex == undefined) {
			fromIndex = 1;
		}
		//因为我要判断想要检测的东西是第几次出现的，所以需要一个
		//计数器
		var counter = 0;
		for (var i = 0; i < array.length; i++) {
			if (array[i] == vallue) {
				//一旦找到了和输入的value相等的array[i]，计数器+1
				counter++;
				//只有和第三个参数相同，位数才能输出
				if (counter == fromIndex) {
					return i;
				}
			}
		}
	},

	initial: function(arr) {
		arr.splice(arr.length - 1, 1);
		return arr;
	},

	intersection: function() {

		//类数组对象没有map方法，所以需要先把类数组对象转换为
		//真正的数组
		// var collection = [];
		// for (var i = 0; i < arguments.length; i++) {
		// 	collection.push(arguments[i]);
		// }

		//这种方法也可以,因为slice这个函数里面是this
		var collection = Array.prototype.slice.call(arguments);

		//里面的函数是两个数组取交集
		return collection.reduce(function(arr1, arr2) {

			var result = [];
			for (var i = 0; i < arr2.length; i++) {
				if (arr1.indexOf(arr2[i]) != -1) {
					result.push(arr2[i])
				}
			}
			return result;
		})
	},

	/**
	 * 这个方法类似 _.intersection，区别是它接受一个 iteratee 调用每一个arrays的每个值以产生一个值，通过产生的值进行了比较。结果值是从第一数组中选择。iteratee 会传入一个参数：(value)。
	 * 参数
	 * [arrays] (...Array): 待检查的数组。
	 * [iteratee=_.identity] (Array|Function|Object|string): iteratee（迭代器）调用每个元素。
	 * 返回值
	 * (Array): 返回一个包含所有传入数组交集元素的新数组。
	 * 例子
	 * _.intersectionBy([2.1, 1.2], [4.3, 2.4], Math.floor);
	 * // => [2.1]
	 *
	 * // The `_.property` iteratee shorthand.
	 * _.intersectionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
	 * // => [{ 'x': 1 }]
	 **/
	intersectionBy: function(array1, array2, iteratee) {
		var fn, result = []

		if (typeof iteratee === 'function') {
			fn = iteratee
		} else if (typeof iteratee === 'string') {
			fn = function(obj) {
				return obj[iteratee]
			}
		}

		var temp = array2.map(fn)

		for (var i = 0; i < array1.length; i++) {
			var needTest = fn(array1[i])
			if (temp.includes(needTest)) {
				result.push(array1[i])
			}
		}
		return result
	},

	/**
	 * 这个方法类似 _.intersection，区别是它接受一个 comparator 调用比较arrays中的元素。结果值是从第一数组中选择。comparator 会传入两个参数：(arrVal, othVal)。
	 * 参数
	 * [arrays] (...Array): 待检查的数组。
	 * [iteratee=_.identity] (Array|Function|Object|string): iteratee（迭代器）调用每个元素。
	 * 返回值
	 * (Array): 返回一个包含所有传入数组交集元素的新数组。
	 * 例子
	 * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
	 * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
	 *
	 * _.intersectionWith(objects, others, _.isEqual);
	 * // => [{ 'x': 1, 'y': 2 }]
	 **/
	intersectionWith: function(arr1, arr2, iteratee) {
		var result = []

		arr1.forEach(function(item) {
			arr2.forEach(function(it) {
				if (iteratee(it, item)) {
					result.push(item)
				}
			})
		})

		return result
	},

	join: function(arr, separator) {
		var str;
		if (arguments.length < 2) {
			str = arr.join(',');
		}
		if (arguments.length >= 2) {
			str = arr.join(separator);
		}
		return str;
	},

	last: function(arr) {
		return arr[arr.length - 1];
	},

	lastIndexOf: function(array, value, fromIndex) {
		var newArray = DongLiang.reverse(array);
		var index = DongLiang.indexOf(newArray, value, fromIndex);
		return array.length - 1 - index;
	},

	nth: function(arr, position) {
		//输入的位置可能是正，也可能是负
		if (position >= 0) {
			return arr[position];
		}
		//输入数字为－的时候，是从最后一位开始计数的
		return arr[arr.length + position];
	},

	pull: function() {
		var length = arguments.length;
		if (length == 1) {
			return arguments[0];
		}
		if (length > 1) {
			for (var i = 0; i < arguments[0].length; i++) {
				for (var j = 1; j < length; j++) {
					if (arguments[0][i] == arguments[j]) {
						arguments[0].splice(i, 1)
						j = -1;
					}
				}
			}
		}
		return arguments[0];
	},

	pullAll: function() {
		//如果只输入一个参数，那么把这个变量再吐回来
		var length = arguments.length;
		if (length == 1) {
			return arguments[0];
		}
		//如果输入的参数>1个，那么把第二个数组中的内容从第一个中剔除出去
		if (length > 1) {
			for (var i = 0; i < arguments[0].length; i++) {
				for (var j = 0; j < arguments[1].length; j++) {
					if (arguments[0][i] == arguments[1][j]) {
						arguments[0].splice(i, 1)
						j = -1;
					}
				}
			}
		}
		return arguments[0];
	},

	/**
	 * 这个方法类似于_.pullAll ，区别是这个方法接受一个 iteratee（迭代函数） 调用 array 和 values的每个值以产生一个值，通过产生的值进行了比较。iteratee 会传入一个参数： (value)。
	 * Note: 不同于 _.differenceBy, 这个方法会改变数组 array。
	 * 参数
	 * array (Array): 要修改的数组。
	 * values (Array): 要移除值的数组。
	 * [iteratee=_.identity] (Array|Function|Object|string): iteratee（迭代器）调用每个元素。
	 * 返回值
	 * (Array): 返回 array.
	 * 例子
	 * var array = [{ 'x': 1 }, { 'x': 2 }, { 'x': 3 }, { 'x': 1 }];
	 *
	 * _.pullAllBy(array, [{ 'x': 1 }, { 'x': 3 }], 'x');
	 * console.log(array);
	 * // => [{ 'x': 2 }]
	 **/

	pullAllBy: function(array, values, iteratee) {
		var fn = function(obj) {
			return obj[iteratee]
		}

		return array.filter(function(item) {
			return values.every(function(it) {
				return fn(it) != fn(item)
			})
		})
	},

	/**
	 * 这个方法类似于 _.pullAll，区别是这个方法接受 comparator 调用array中的元素和values比较。comparator 会传入两个参数：(arrVal, othVal)。
	 * 注意: 和 _.differenceWith 不同, 这个方法会改变数组 array。
	 * 参数
	 * array (Array): 要修改的数组。
	 * values (Array): 要移除值的数组。
	 * [comparator] (Function): comparator（比较器）调用每个元素。
	 * 返回值
	 * (Array): 返回 array.
	 * 例子
	 * var array = [{ 'x': 1, 'y': 2 }, { 'x': 3, 'y': 4 }, { 'x': 5, 'y': 6 }];
	 *
	 * _.pullAllWith(array, [{ 'x': 3, 'y': 4 }], _.isEqual);
	 * console.log(array);
	 * // => [{ 'x': 1, 'y': 2 }, { 'x': 5, 'y': 6 }]
	 **/
	pullAllWith: function(array, values, comparator) {
		return array.filter(function(item) {
			return values.every(function(it) {
				return !comparator(it, item)
			})
		})
	},

	//_.sortedIndex([30, 50], 40);
	// => 1
	sortedIndex: function(array, number) {

		for (var i = 0; i < array.length - 1; i++) {
			if ((array[i] < number && array[i + 1] >= number) || (array[i] > number && array[i + 1] <= number)) {
				return i + 1
			}
		}
	},

	/**
	 * 这个方法类似 _.sortedIndex ，除了它接受一个 iteratee （迭代函数），调用每一个数组（array）元素，返回结果和value 值比较来计算排序。iteratee 会传入一个参数：(value)。
	 * @param [arrays]
	 * array (Array): 要检查的排序数组。
	 * value (*): 要评估的值。
	 * [iteratee=_.identity] (Array|Function|Object|string): 迭代函数，调用每个元素。
	 * @returns (Array): (number): 返回 value值 应该在数组array中插入的索引位置 index。
	 *
	 *
	 *var objects = [{ 'x': 4 }, { 'x': 5 }];
	 *_.sortedIndexBy(objects, { 'x': 4 }, function(o) { return o.x; });
	 * => 0
	 *_.sortedIndexBy(objects, { 'x': 4 }, 'x');
	 * => 0
	 *
	 */
	sortedIndexBy: function(array, value, iteratee) {

		for (var i = 0; i < array.length; i++) {
			//如果判断函数是一个字符串的话
			if (typeof iteratee == 'string') {
				if (value[iteratee] <= array[i][iteratee]) {
					return i;
				}
			}
			//如果判断函数是个函数的话
			if (iteratee instanceof Function) {
				if (iteratee(value) <= iteratee(array[i])) {
					return i;
				}
			}
		}
	},

	/**
	 * 这个方法类似 _.sortedLastIndex ，除了它接受一个 iteratee （迭代函数），调用每一个数组（array）元素，返回结果和value 值比较来计算排序。iteratee 会传入一个参数：(value)。
	 * @param [arrays]
	 * array (Array): 要检查的排序数组。
	 * value (*): 要评估的值。
	 * [iteratee=_.identity] (Array|Function|Object|string): 迭代函数，调用每个元素。
	 * @returns (number): 返回 value值 应该在数组array中插入的索引位置 index。
	 *
	 * var objects = [{ 'x': 4 }, { 'x': 5 }];
	 * _.sortedLastIndexBy(objects, { 'x': 4 }, function(o) { return o.x; });
	 * // => 1
	 * _.sortedLastIndexBy(objects, { 'x': 4 }, 'x');
	 * // => 1
	 */
	sortedLastIndexBy: function(array, value, iteratee) {


		for (var i = array.length - 1; i >= 0; i--) {
			//如果判断函数是一个字符串的话
			if (typeof iteratee == 'string') {
				if (value[iteratee] <= array[i][iteratee]) {
					return i;
				}
			}
			//如果判断函数是个函数的话
			if (iteratee instanceof Function) {
				if (iteratee(value) <= iteratee(array[i])) {
					return i;
				}
			}
		}
	},

	/**
	 * 这个方法类似 _.lastIndexOf，除了它是在已经排序的数组array上执行二进制检索。
	 * @param [arrays]
	 * array (Array): 要搜索的数组。
	 * value (*): 搜索的值。
	 * @returns (number): (number): 返回匹配值的索引位置，否则返回 -1。
	 *
	 * _.sortedLastIndexOf([4, 5, 5, 5, 6], 5);
	 * // => 3
	 *
	 */

	sortedLastIndexOf: function(array, value) {

		for (var i = array.length; i >= 0; i--) {

			if (array[i] == value) {
				return i;
			}
		}
		return -1;
	},

	/**
	 * 这个方法类似 _.indexOf，除了它是在已经排序的数组array上执行二进制检索。。
	 * @param [arrays]
	 * array (Array): 要搜索的数组。
	 * vvalue (*): 搜索的值
	 * @returns (Array): (number): (number): 返回匹配值的索引位置，否则返回 -1。
	 *_.sortedIndexOf([4, 5, 5, 5, 6], 5);
	 * => 1
	 *
	 */
	sortedIndexOf: function(array, value) {
		for (var i = 0; i < array.length; i++) {
			if (array[i] >= value) {
				return i
			}
		}
		return -1;
	},

	/**
	 * 此方法类似于_.sortedIndex，除了 它返回 value值 在 array 中尽可能大的索引位置（index）。
	 * @param [arrays]
	 * array (Array): 要搜索的数组。
	 * vvalue (*): 搜索的值
	 * @returns (Array): (number): 返回 value值 应该在数组array中插入的索引位置 index。
	 * sortedLastIndex([4, 5, 5, 5, 6], 5);
	 * => 4
	 *
	 */

	sortedLastIndex: function(array, value) {

		for (var i = array.length - 1; i >= 0; i--) {
			if (array[i] <= value) {
				return i + 1;
			}
		}
		return -1;
	},

	/**
	 * 这个方法类似 _.uniq，除了它会优化排序数组。
	 * @param [arrays]
	 * array (Array): 要搜索的数组。
	 * @returns (number): (Array): 返回一个新的不重复的数组。
	 *
	 * _.sortedUniq([1, 1, 2]);
	 * // => [1, 2]
	 *
	 */
	sortedUniq: function(array) {

		var result = [];
		for (var i = 0; i < array.length; i++) {
			if (result.indexOf(array[i]) == -1) {
				result.push(array[i]);
			}
		}
		return result;
	},

	/**
	 * 这个方法类似 _.uniq，除了它会优化排序数组。
	 * @param [arrays]
	 * array (Array): 要检查的数组。
	 * [iteratee] (Function): 迭代函数，调用每个元素。
	 * @returns (number): (Array): 返回一个新的不重复的数组。
	 *
	 * _.sortedUniqBy([1.1, 1.2, 2.3, 2.4], Math.floor);
	 * // => [1.1, 2.3]
	 *
	 */
	sortedUniqBy: function(array, iteratee) {

		//用来输出最后结果
		var result = [];
		var temporar = [];
		//作为map后的中转
		var interchange = array.map(iteratee);

		for (var i = 0; i < interchange.length; i++) {
			if (temporar.indexOf(interchange[i]) == -1) {
				//如果临时数组中没有检测的那俩，就把它放进临时数组
				//然后在结果数组中放进原始数组中对应下标的项
				temporar.push(interchange[i]);
				result.push(array[i]);
			}
		}
		return result;
	},

	tail: function(arr) {
		arr.splice(0, 1);
		return arr;
	},

	/**
	 * 创建一个数组切片，从array数组的起始元素开始提取n个元素。
	 * @param [arrays]
	 * array (Array): 要检索的数组。
	 * [n=1] (number): 要提取的元素个数。
	 * @returns (number): (Array): 返回 array 数组的切片（从起始元素开始n个元素）。
	 *
	 * _.take([1, 2, 3]);
	 * // => [1]
	 * _.take([1, 2, 3], 2);
	 * // => [1, 2]
	 * _.take([1, 2, 3], 5);
	 * // => [1, 2, 3]
	 *
	 * _.take([1, 2, 3], 0);
	 * // => []
	 */
	take: function(array, number) {
		//如果不输入截取的个数，默认为1
		if (number === undefined) {
			number = 1;
		}
		return array.slice(0, number)
	},

	/**
	 * 创建一个数组切片，从array数组的最后一个元素开始提取n个元素。
	 * @param [arrays]
	 * array (Array): 要检索的数组。
	 * [n=1] (number): 要提取的元素个数。
	 * @returns (number): (Array): 返回 array 数组的切片（从结尾元素开始n个元素）。
	 *
	 * _.takeRight([1, 2, 3]);
	 * // => [3]
	 *
	 * _.takeRight([1, 2, 3], 2);
	 * // => [2, 3]
	 *
	 * _.takeRight([1, 2, 3], 5);
	 * // => [1, 2, 3]
	 *
	 * _.takeRight([1, 2, 3], 0);
	 * // => []
	 *
	 */

	takeRight: function(array, number) {

		//如果没有输入number的话，默认为1
		if (number === undefined) {
			number = 1;
		}
		return array.reverse().slice(0, number).reverse();
	},

	union: function() {
		var result = [];
		//写一个循环，把所有的参数遍历一遍
		for (var i = 0; i < arguments.length; i++) {
			//再写个循环，把每一项的数组再遍历一遍
			for (var j = 0; j < arguments[i].length; j++) {
				//如果没有在Result数组中找到想要的东西，那么
				//indexOf返回-1;
				if (result.indexOf(arguments[i][j]) == -1) {
					result.push(arguments[i][j])
				}
			}
		}
		return result;
	},

	uniq: function(arr) {
		var result = [];
		for (var i = 0; i < arr.length; i++) {
			//result一开始为空数组，里面没有的，就推进去
			if (result.indexOf(arr[i]) == -1) {
				result.push(arr[i]);
			}
		}
		return result;
	},

	unzip: function() {
		//看arguments每项的长度，判断需要几个数组
		var result = [];
		for (var i = 0; i < arguments[0].length; i++) {
			result.push([]);
		}

		//把传入的参数拆分到每个数组
		for (var i = 0; i < arguments.length; i++) {
			for (var j = 0; j < arguments[i].length; j++) {
				result[j][i] = arguments[i][j]
			}
		}
		return result;
	},

	/**
	 * 创建一个剔除所有给定值的新数组，剔除值的时候，使用SameValueZero做相等比较。
	 * 注意: 不像 _.pull, 这个方法会返回一个新数组。
	 * 参数
	 * array (Array): 要检查的数组。
	 * [values] (...*): 要剔除的值。
	 * 返回值
	 * (Array): 返回过滤值后的新数组。
	 * 例子
	 *
	 * _.without([2, 1, 2, 3], 1, 2);
	 * // => [3]
	 **/
	without: function(arr, ...arg) {
		//filter接受一个函数作为它的参数
		return arr.filter(function(value, ...arg) {
			//...arg是一个真正的数组，不是一个类数组对象
			//所以可以直接调用数组上的方法
			//但是注意，arg才是那个数组
			if (arg.indexOf(value) == -1) {
				return value
			}
		})
	},


	zip: function() {
		//先把框架列好
		var result = [
				[],
				[]
			]
			//往框架里面塞东西
		for (var i = 0; i < arguments.length; i++) {
			for (var j = 0; j < arguments[i].length; j++) {
				result[j][i] = (arguments[i][j]);
			}
		}
		return result;
	},

	/**
	 * 这个方法类似 _.fromPairs，除了它接受2个数组，第一个数组中的值作为属性标识符（属性名），第二个数组中的值作为相应的属性值
	 * 参数
	 * [props=[]] (Array): The property identifiers.
	 * [values=[]] (Array): The property values.
	 *
	 * 返回值
	 * (Object): Returns the new object.
	 *
	 * _.zipObject(['a', 'b'], [1, 2]);
	 * // => { 'a': 1, 'b': 2 }
	 *
	 **/
	zipObject: function(props, values) {
		var result = {}

		for (var i = 0; i < props.length; i++) {
			result[props[i]] = values[i]
		}
		return result;
	},

	/**
	 * 创建一个组成对象，key（键）是经过 iteratee（迭代函数） 执行处理collection中每个元素后返回的结果，每个key（键）对应的值是 iteratee（迭代函数）返回该key（键）的次数（愚人码头注：迭代次数）。 iteratee 调用一个参数：(value)。
	 * 参数
	 * collection (Array|Object): 一个用来迭代的集合。
	 * [iteratee=_.identity] (Array|Function|Object|string): 一个迭代函数，用来转换key（键）
	 * 返回值
	 * (Object): 返回一个组成集合对象。
	 * 例子
	 * _.countBy([6.1, 4.2, 6.3], Math.floor);
	 * // => { '4': 1, '6': 2 }
	 * _.countBy(['one', 'two', 'three'], 'length');
	 * // => { '3': 2, '5': 1 }
	 *
	 **/
	// 如何判断一个函数是不是函数？
	// function isFunction(fn) {
	//    return Object.prototype.toString.call(fn)=== '[object Function]';
	// }
	countBy: function(array, iteratee) {
		var result = {}
		if (Object.prototype.toString.call(iteratee) == '[object Function]') {
			array.map(value => iteratee(value)) //将array中的每一项经过iteratee输出
				.map(function(value) {
					if (value in result) {
						result[value]++
					} else {
						result[value] = 1
					}
				})
		}
		if (Object.prototype.toString.call(iteratee) == '[object String]') {
			array.map(value => value.length) //将array中的每一项的长度输出到数组
				.map(function(value) {
					if (value in result) {
						result[value]++
					} else {
						result[value] = 1
					}
				})
		}
		return result
	},

	/**
	 * 通过 predicate（断言函数） 检查 collection（集合）中的 所有 元素是否都返回真值。一旦 predicate（断言函数） 返回假值，迭代就马上停止。predicate（断言函数）调用三个参数： (value, index|key, collection)。
	 * 注意: 这个方法对于对于空集合返回 true，因为空集合的任何元素都是 true 。
	 * 参数
	 * collection (Array|Object): 一个用来迭代的集合。
	 * [predicate=_.identity] (Array|Function|Object|string): 每次迭代调用的函数。
	 * 返回值
	 * (boolean): 如果所有元素经 predicate（断言函数） 检查后都都返回真值，那么就返回true，否则返回 false 。
	 * 例子
	 * every([true, 1, null, 'yes'], Boolean);;
	 * // => false
	 * var users = [
	 *   { 'user': 'barney', 'age': 36, 'active': false },
	 *   { 'user': 'fred',   'age': 40, 'active': false }
	 * ];
	 *_.every(users, { 'user': 'barney', 'active': false });
	 * => false
	 *_.every(users, ['active', false]);
	 * => true
	 * _.every(users, 'active');
	 * // => false
	 **/
	every: function(collection, predicate) {
		//为了不改变输入的函数
		var predicater;

		//如果没有传predicate的话，让predicate为默认的函数
		if (!predicate) {
			predicate = function(a) {
				return a;
			}
		}

		//如果输入的是个函数
		if (typeof predicate == 'function') {
			predicater = predicate
		}

		//如果你输入的第二个东西是数组的话，
		//需要检测属性名和属性值是否匹配
		if (Array.isArray(predicate)) {
			predicater = function(item) {
				var key = predicate[0]
				var value = predicate[1]

				return item[key] == value
			}
		} else if (typeof predicate == 'object') {
			predicater = function(item) {
				for (var key in predicate) {
					if (predicate[key] != item[key]) {
						return false
					}
				}
				return true
			}
		}



		// 如果predicate是一个字符串，要检查它对应的属性值
		if (typeof predicate == 'string') {
			predicater = function(item) {
				return item[predicate]
			}
		}

		//如果输入的是对象的话，循环用for in
		for (var key in collection) {
			if (!predicater(collection[key], key, collection)) {
				return false;
			}
		}
		return true;
	},

	/**
	 * 遍历 collection（集合）元素，返回 predicate（断言函数）返回真值 的所有元素的数组。 predicate（断言函数）调用三个参数：(value, index|key, collection)。
	 * 参数
	 * collection (Array|Object): 一个用来迭代的集合。
	 * [predicate=_.identity] (Array|Function|Object|string): 每次迭代调用的函数。
	 * 返回值
	 * (Array): 返回一个新的过滤后的数组。
	 * 例子
	 * var users = [
	 *   { 'user': 'barney', 'age': 36, 'active': true },
	 *   { 'user': 'fred',   'age': 40, 'active': false }
	 * ];
	 * _.filter(users, function(o) { return !o.active; });
	 * // => objects for ['fred']
	 * _.filter(users, { 'age': 36, 'active': true });
	 * // => objects for ['barney']
	 * _.filter(users, ['active', false]);
	 * // => objects for ['fred']
	 *
	 * _.filter(users, 'active');
	 * // => objects for ['barney']
	 **/
	filter: function(arr, fn) {
		var result = [];
		for (var i = 0; i < arr.length; i++) {
			if (fn(arr[i], i, arr)) {
				result.push(arr[i])
			}
		}
		return result;
	},

	map: function(arr, fn) {
		var result = [];
		//如果第一项是数组的话，把数组中的每一个参数传入到后面的
		//函数中
		for (var i = 0; i < arr.length; i++) {
			result.push(fn(arr[i], i, arr));
			// i表示位置
		}
		return result;
	},


	partition: function(arr, fn) {
		var result = [
			[],
			[]
		]
		for (var i = 0; i < arr.length; i++) {
			if (fn(arr[i], i, arr)) {
				result[0].push(arr[i]);
			} else {
				result[1].push(arr[i]);
			}
		}
		return result;
	},

	reduce: function(collection, reducer, initial) {
		var start = 0
		if (initial == undefined) {
			initial = collection[0]
			start = 1
		}

		var result = initial

		for (var i = start; i < collection.length; i++) {
			result = reducer(result, collection[i])
		}

		return result
	},

	//如果输入的是一个数组，返回它的长度
	//如果输入的是一个对象，返回它的属性的个数

	size: function(collection) {
		if (Array.isArray(collection)) {
			return collection.length;
		} else {
			var l = 0;
			for (var key in collection) {
				l++
			}
			return l;
		}
	},

	/**
	 * 如果 value 不是数组, 那么强制转为数组。
	 * 参数
	 * value (*): 要处理的值
	 * 返回值
	 * (Array): 返回转换后的数组。
	 * 例子
	 * _.castArray(1);
	 * // => [1]
	 *
	 * _.castArray({ 'a': 1 });
	 * // => [{ 'a': 1 }]
	 *
	 * _.castArray('abc');
	 * // => ['abc']
	 *
	 * _.castArray(null);
	 * // => [null]
	 *
	 * _.castArray(undefined);
	 * // => [undefined]
	 *
	 * _.castArray();
	 * // => []
	 *
	 * var array = [1, 2, 3];
	 * console.log(_.castArray(array) === array);
	 * // => true
	 **/
	castArray：
	function(value) {
		var result = []
		if (value === undefined) {
			return result
		} else if (Array.isArray(value)) {
			return value
		} else {
			result.push(value)
			return result
		}
	},

	/**
	 * 执行 SameValueZero 比较两者的值，来确定它们是否相等。
	 * 参数
	 * value (*): 要比较的值。
	 * other (*): 另一个要比较的值。
	 * 返回值
	 * (boolean): 如果两个值相等返回 true ，否则返回 false 。
	 * 例子
	 * var object = { 'a': 1 };
	 * var other = { 'a': 1 };
	 *
	 * _.eq(object, object);
	 * // => true
	 *
	 * _.eq(object, other);
	 * // => false
	 *
	 * _.eq('a', 'a');
	 * // => true
	 *
	 * _.eq('a', Object('a'));
	 * // => false
	 *
	 * _.eq(NaN, NaN);
	 * // => true
	 **/
	eq: function(value, other) {
		if (Number.isNaN(value) && Number.isNaN(other)) {
			return true
		}
		return value === other
	},

	/**
	 * 执行 SameValueZero 比较两者的值，来确定它们是否相等。
	 * 参数
	 * value (*): 要比较的值。
	 * other (*): 另一个要比较的值。
	 * 返回值
	 * (boolean): 如果value 大于 other 返回 true，否则返回 false。
	 * 例子
	 * _.gt(3, 1);};
	 * // => true;
	 *
	 * _.gt(3, 3);
	 * // => false
	 *
	 * _.gt(1, 3);
	 * // => false

	 **/
	gt: function(value, other) {
		return value > other
	},

	/**
	 * 检查 value是否大于或者等于 other
	 * 参数
	 * value (*): 要比较的值。
	 * other (*): 另一个要比较的值。
	 * 返回值
	 * (boolean): 如果value 大于或者等于 other 返回 true，否则返回 false。
	 * 例子
	 * _.gte(3, 1);
	 * // => true
	 *
	 * _.gte(3, 3);
	 * // => true
	 *
	 * _.gte(1, 3);
	 * // => false
	 **/
	gte: function(value, other) {
		return value >= other
	},

	/**
	 * 检查 value 是否是一个类 arguments 对象。
	 * 参数
	 * value (*): 要检查的值。
	 * 返回值
	 * (boolean): 如果value是一个 arguments 对象 返回 true，否则返回 false。
	 * 例子
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 **/
	isArguments: function(value) {
		if (value.callee) {
			return true
		}
		return false
	},

	/**
	 * 检查 value 是否是 Array 类对象。
	 * 参数
	 * value (*): 要检查的值。
	 * 返回值
	 * (boolean): 如果value是一个数组返回 true，否则返回 false。
	 * 例子
	 * _.isArray([1, 2, 3]);
	 * // => true
	 * _.isArray(document.body.children);
	 * // => false
	 * _.isArray('abc');
	 * // => false
	 * _.isArray(_.noop);
	 * // => false
	 **/
	isArray: function(value) {
		if (value instanceof Array) {
			return true
		}
		return false
	},

	/**
	 * 检查 value 是否是 ArrayBuffer 对象。
	 * 参数
	 * value (*): 要检查的值。
	 * 返回值
	 * (boolean): 如果value是一个数组 buffer 返回 true，否则返回 false。
	 * 例子
	 *
	 * _.isArrayBuffer(new ArrayBuffer(2));
	 * // => true
	 * _.isArrayBuffer(new Array(2));
	 * // => false
	 *
	 **/
	isArrayBuffer: function(value) {
		//isArrayBuffer是一个构造函数
		return value instanceof ArrayBuffer
	},

	/**
	 * 检查 value 是否是类数组。 如果一个值被认为是类数组，那么它不是一个函数，并且value.length是个整数，大于等于 0，小于或等于 Number.MAX_SAFE_INTEGER。
	 * 参数
	 * value (*): 要检查的值。
	 * 返回值
	 * (boolean): 如果value是一个类数组，那么返回 true，否则返回 false。
	 * 例子
	 * _.isArrayLike([1, 2, 3]);
	 * // => true
	 * _.isArrayLike(document.body.children);
	 * // => true
	 * _.isArrayLike('abc');
	 * // => true
	 * _.isArrayLike(_.noop);
	 * // => false
	 **/
	isArrayLike: function(value) {
		if (!(value instanceof Function) &&
			parseInt(value.length) == value.length
		) {
			return true
		}
		return false
	},

	/**
	 * 这个方法类似_.isArrayLike。除了它还检查value是否是个对象。
	 * 参数
	 * value (*): 要检查的值。
	 * 返回值
	 * (boolean): 如果 value 是一个类数组对象，那么返回 true，否则返回 false。
	 * 例子
	 * _.isArrayLikeObject([1, 2, 3]);
	 * // => true
	 * _.isArrayLikeObject(document.body.children);
	 * // => true
	 * _.isArrayLikeObject('abc');
	 * // => false
	 * _.isArrayLikeObject(_.noop);
	 * // => false
	 **/
	isArrayLikeObject: function(value) {
		if (
			typeof value != 'function' &&
			parseInt(value.length) == value.length &&
			value instanceof Object
		) {
			return true
		}
		return false
	},


	/**
	 * 检查 value 是否为一个整数。。
	 * 参数
	 * value (*): 要检查的值
	 * 返回值
	 * (boolean): 如果 value 是一个整数，那么返回 true，否则返回 false
	 * 例子
	 * _.isInteger(3);
	 * // => true
	 *
	 * _.isInteger(Number.MIN_VALUE);
	 * // => false
	 *
	 * _.isInteger(Infinity);
	 * // => false
	 *
	 * _.isInteger('3');
	 * // => false
	 **/
	isInteger: function(value) {
		if (typeof value == 'number') {
			return value % 1 == 0
		}
		return false
	},

	/**
	 * 检查 value 是否为有效的类数组长度
	 * 参数
	 * value (*): 要检查的值。
	 * 返回值
	 * (boolean): 如果 value 是一个有效长度，那么返回 true，否则返回 false。
	 * 例子
	 * _.isLength(3);
	 * // => true
	 * _.isLength(Number.MIN_VALUE);
	 * // => false
	 * _.isLength(Infinity);
	 * // => false
	 * _.isLength('3');
	 * // => false
	 **/
	isLength: function(value) {
		if (Number.isInteger(value)) {
			return 0 <= value && value < Number.MAX_SAFE_INTEGER
		}
		return false
	},

	/**
	 * 检查 value 是否为一个 Map 对象。
	 * 参数
	 * value (*): 要检查的值。
	 * 返回值
	 * (boolean): 如果 value 是一个 Map 对象，那么返回 true，否则返回 false。
	 * 例子
	 * _.isMap(new Map);
	 * // => true
	 *
	 * _.isMap(new WeakMap);
	 * // => false
	 **/
	isMap: function(value) {
		return value instanceof Map
	},

	/**
	 * 检查 value 是否是 NaN。
	 * 注意: 这个方法基于Number.isNaN，和全局的 isNaN 不同之处在于，全局的 isNaN对 于 undefined 和其他非数字的值返回 true。
	 * 参数
	 * value (*): 要检查的值。
	 * 返回值
	 * (boolean): 如果 value 是一个 NaN，那么返回 true，否则返回 false。
	 * 例子
	 * _.isNaN(NaN);
	 * // => true
	 * _.isNaN(new Number(NaN));
	 * // => true
	 * isNaN(undefined);
	 * // => true
	 * _.isNaN(undefined);
	 * // => false
	 **/
	isNaN: function(value) {
		if (typeof value == 'number' || typeof value == 'undefined') {
			return Number.isNaN(value)
		}
		if (value instanceof Object) {
			return Number.isNaN(value.valueOf())
		}
	},

	/**
	 * 检查 value 是否是一个原生函数。
	 * 参数。
	 * value (*): 要检查的值。
	 * 返回值
	 * (boolean): 如果 value 是一个 原生函数，那么返回 true，否则返回 false。
	 * 例子
	 * _.isNative(Array.prototype.push);
	 * // => true
	 * _.isNative(_);
	 * // => false
	 **/
	isNative: function(fn) {
		return /\s\[native code\]\s/.test(fn.toString())
	},

	/**
	 * 检查 value 是否是 null 或者 undefined。
	 * 参数。
	 * value (*): 要检查的值。
	 * 返回值
	 * (boolean): 如果 value 为null 或 undefined，那么返回 true，否则返回 false。
	 * 例子
	 * _.isNil(null);
	 * // => true
	 *
	 * _.isNil(void 0);
	 * // => true
	 *
	 * _.isNil(NaN);
	 * // => false
	 **/
	isNil: function(value) {
		if (
			//如果是undefined
			(typeof value == 'undefined') ||
			//检测null，不能是0，自己等于自己，不是undefined
			//布尔值为false
			(!value && typeof(value) != "undefined" && value != 0) && value == value
		) {
			return true
		}
		return false
	},

	/**
	 * 检查 valuealue 是否是 null。
	 * 参数。
	 * value (*): 要检查的值。
	 * 返回值
	 * (boolean): 如果 value 为null，那么返回 true，否则返回 false。
	 * 例子
	 * _.isNull(null);
	 * // => true
	 *
	 * _.isNull(void 0);
	 * // => false
	 *
	 **/
	isNull: function(value) {
		if (!value && typeof(value) != "undefined" && value != 0 && value == value) {
			return true
		}
		return false
	},

	/**
	 * 检查 value 是否是原始Number数值型 或者 对象。
	 * 注意: 要排除 Infinity, -Infinity, 以及 NaN 数值类型，用 _.isFinite 方法。
	 * 参数。
	 * value (*): 要检查的值。
	 * 返回值
	 * (boolean): 如果 value 为一个数值，那么返回 true，否则返回 false。
	 * 例子
	 * _.isNumber(3);
	 * // => true
	 *
	 * _.isNumber(Number.MIN_VALUE);
	 * // => true
	 *
	 * _.isNumber(Infinity);
	 * // => true
	 *
	 * _.isNumber('3');
	 * // => false
	 **/
	isNumber: function(value) {
		if (DongLiang.isFinite(value) || value == Infinity || value == -Infinity) {
			return true
		}
		return false
	},

	/**
	 * 检查 value 是否为 Object 的 language type。 (例如： arrays, functions, objects, regexes,new Number(0), 以及 new String(''))。
	 * 参数。
	 * value (*): 要检查的值。
	 * 返回值
	 * (boolean): 如果 value 为一个对象，那么返回 true，否则返回 false。
	 * 例子
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 **/
	isObject: function(value) {
		return value instanceof Object
	},

	/**
	 * 检查 value 是否是 类对象。 如果一个值是类对象，那么它不应该是 null，而且 typeof 后的结果是 "object"。
	 * 参数。
	 * value (*): 要检查的值。
	 * 返回值
	 * (boolean): 如果 value 为一个类对象，那么返回 true，否则返回 false。
	 * 例子
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 **/
	isObjectLike: function(value) {
		return value != null && typeof value == 'object'
	},

	/**
	 * 检查 value 是否是普通对象。 也就是说该对象由 Object 构造函数创建，或者 [[Prototype]] 为 null 。
	 * 参数。
	 * value (*): 要检查的值。
	 * 返回值
	 * (boolean): 如果 value 为一个普通对象，那么返回 true，否则返回 false。
	 * 例子
	 * function Foo() {
	 *   this.a = 1;
	 * }
	 * _.isPlainObject(new Foo);
	 * // => false
	 *
	 * _.isPlainObject([1, 2, 3]);
	 * // => false
	 *
	 * _.isPlainObject({ 'x': 0, 'y': 0 });
	 * // => true
	 *
	 * _.isPlainObject(Object.create(null));
	 * // => true
	 **/
	isPlainObject: function(value) {
		return Object.getPrototypeOf(value) == Object.prototype || Object.getPrototypeOf(value) == null
	},

	/**
	 * 检查 value 是否为RegExp对象。
	 * 参数。
	 * value (*): 要检查的值。
	 * 返回值
	 * (boolean): 如果 value 为一个正则表达式，那么返回 true，否则返回 false。
	 * 例子
	 * _.isRegExp(/abc/);
	 * // => true
	 *
	 * _.isRegExp('/abc/');
	 * // => false
	 *
	 **/
	isRegExp: function(value) {
		return value instanceof RegExp
	},

	/**
	 * 检查 value 是否是一个安全整数。 一个安全整数应该是符合 IEEE-754 标准的非双精度浮点数。
	 * 参数。
	 * value (*): 要检查的值。
	 * 返回值
	 * (boolean): 如果 value 为一个安全整数，那么返回 true，否则返回 false。
	 * 例子
	 * _.isSafeInteger(3);
	 * // => true
	 *
	 * _.isSafeInteger(Number.MIN_VALUE);
	 * // => false
	 *
	 * _.isSafeInteger(Infinity);
	 * // => false
	 *
	 * _.isSafeInteger('3');
	 * // => false
	 *
	 **/
	isSafeInteger: function(value) {
		return Number.isSafeInteger(value)
	},

	/**
	 * 检查 value 是否是一个Set对象。
	 * 参数。
	 * value (*): 要检查的值。
	 * 返回值
	 * (boolean): 如果 value 为一个 set 对象，那么返回 true，否则返回 false。
	 * 例子
	 * _.isSet(new Set);
	 * // => true
	 *
	 * _.isSet(new WeakSet);
	 * // => false
	 *
	 **/
	isSet: function(value) {
		return value instanceof Set
	},

	/**
	 * 检查 value 是否是原始字符串String或者对象。
	 * 参数。
	 * value (*): 要检查的值。
	 * 返回值
	 * (boolean): 如果 value 为一个字符串，那么返回 true，否则返回 false。
	 * 例子
	 * _.isString('abc');
	 * // => true
	 *
	 * _.isString(1);
	 * // => false
	 *
	 **/

	isString: function(value) {
		return value instanceof String || typeof value == 'string'
	},



	/**
	 * 检查 value 是否是原始 Symbol 或者对象。
	 * 参数。
	 * value (*): 要检查的值。
	 * 返回值
	 * (boolean): 如果 value 为一个symbol，那么返回 true，否则返回 false。
	 * 例子
	 * _.isSymbol(Symbol.iterator);
	 * // => true
	 *
	 * _.isSymbol('abc');
	 * // => false
	 *
	 **/

	isSymbol: function(value) {
		return value instanceof Symbol || typeof value == 'symbol'
	},



	/**
	 * 检查 value 是否是 undefined.
	 * 参数。
	 * value (*): 要检查的值。
	 * 返回值
	 * (boolean): 如果 value 是 undefined ，那么返回 true，否则返回 false。
	 * 例子
	 * _.isUndefined(void 0);
	 * // => true
	 *
	 * _.isUndefined(null);
	 * // => false
	 *
	 **/

	isUndefined: function(value) {
		return typeof value == 'undefined'
	},



	/**
	 * 检查 value 是否是 WeakMap 对象。
	 * 参数。
	 * value (*): 要检查的值。
	 * 返回值
	 * (boolean): 如果 value 为一个 WeakMap 对象 ，那么返回 true，否则返回 false。
	 * 例子
	 * _.isWeakMap(new WeakMap);
	 * // => true
	 *
	 * _.isWeakMap(new Map);
	 * // => false
	 *
	 **/

	isWeakMap: function(value) {
		return value instanceof WeakMap
	},


	/**
	 * 检查 value 是否是 WeakSet 对象。
	 * 参数。
	 * value (*): 要检查的值。
	 * 返回值
	 * (boolean): 如果 value 为一个 WeakSet 对象 ，那么返回 true，否则返回 false。
	 * 例子
	 * _.isWeakSet(new WeakSet);
	 * // => true
	 *
	 * _.isWeakSet(new Set);
	 * // => false
	 *
	 **/
	isWeakSet: function(value) {
		return value instanceof WeakSet
	},

	/**
	 * 检查 value 是否小于 other。
	 * 参数。
	 * value (*): 用来比较的值。
	 * other (*): 另一个用来比较的值。
	 * 返回值
	 * (boolean): 如果value 小于 other 返回 true，否则返回 false。
	 * 例子
	 * _.lt(1, 3);
	 * // => true
	 *
	 * _.lt(3, 3);
	 * // => false
	 *
	 * _.lt(3, 1);
	 * // => false
	 **/



	lt: function(value, other) {
		return value < other ? true : false
	},



	/**
	 * 检查 value 是否小于等于 other。
	 * 参数。
	 * value (*): 用来比较的值。
	 * other (*): 另一个用来比较的值。
	 * 返回值
	 * (boolean): 如果value 小于等于 other 返回 true，否则返回 false。
	 * 例子
	 * _.lte(1, 3);
	 * // => true
	 *
	 * _.lte(3, 3);
	 * // => true
	 *
	 * _.lte(3, 1);
	 * // => false
	 **/
	lte: function(value, other) {
		return value <= other ? true : false
	},


	/**
	 * 转换 value 为一个数组。
	 * 参数。
	 * value (*): 要转换的值。
	 * 返回值
	 * (Array): 返回转换后的数组。
	 * 例子
	 * _.toArray({ 'a': 1, 'b': 2 });
	 * // => [1, 2]
	 *
	 * _.toArray('abc');
	 * // => ['a', 'b', 'c']
	 *
	 * _.toArray(1);
	 * // => []
	 *
	 * _.toArray(null);
	 * // => []
	 *
	 **/
	toArray: function(value) {
		var result = []
		if (typeof value == 'string') {
			result = value.split('')
		}
		if (typeof value == 'object' && !!value) {
			result = Object.values(value)
		}
		return result //数字或者null/undefined直接返回空数组
	},


	/**
	 * 转换 value 为一个有限数字。
	 * 参数。
	 * value (*): 要转换的值。
	 * 返回值
	 * (number): 返回转换后的数字。
	 * 例子
	 * _.toFinite(3.2);
	 * // => 3.2
	 *
	 * _.toFinite(Number.MIN_VALUE);
	 * // => 5e-324
	 *
	 * _.toFinite(Infinity);
	 * // => 1.7976931348623157e+308
	 *
	 * _.toFinite('3.2');
	 * // => 3.2
	 *
	 **/

	toFinite: function(value) {
		//如果是字符串'3'，涉及到隐式转换
		var result
		if (value > -Infinity && value < Infinity) {
			result = Number(value)
		} else if (value == Infinity) {
			result = 1.7976931348623157e+308
		} else if (value == -Infinity) {
			result = -1.7976931348623157e+308
		} else {
			result = NaN
		}
		return result
	},



	/**
	 * 转换 value 为一个整数。
	 * 参数。
	 * value (*): 要转换的值。
	 * 返回值
	 * (number): 返回转换后的整数。
	 * 例子
	 * _.toInteger(3.2);
	 * // => 3
	 *
	 * _.toInteger(Number.MIN_VALUE);
	 * // => 0
	 *
	 * _.toInteger(Infinity);
	 * // => 1.7976931348623157e+308
	 *
	 * _.toInteger('3.2');
	 * // => 3
	 *
	 **/
	toInteger: function(value) {
		var result
		if (value > -Infinity && value < Infinity) {
			result = Math.floor(value)
		} else if (value == Infinity) {
			result = 1.7976931348623157e+308
		} else if (value == -Infinity) {
			result = -1.7976931348623157e+308
		} else {
			result = NaN
		}
		return result
	},


	/**
	 * 转换 value 为用作类数组对象的长度整数。
	 * 参数。
	 * value (*): 要转换的值。
	 * 返回值
	 * (number): 返回转换后的整数。
	 * 例子
	 * _.toLength(3.2);
	 * // => 3
	 *
	 * _.toLength(Number.MIN_VALUE);
	 * // => 0
	 *
	 * _.toLength(Infinity);
	 * // => 4294967295
	 *
	 * _.toLength('3.2');
	 * // => 3
	 *
	 **/

	toLength: function(value) {
		var result
		if (value > -Infinity && value < Infinity) {
			result = Math.floor(value)
		} else if (value >= 4294967295) {
			result = 4294967295
		} else {
			throw new Error()
		}
		return result
	},



	/**
	 * 转换 value 为一个数字。
	 * 参数。
	 * value (*): 要处理的值。
	 * 返回值
	 * (number): 返回数字。。
	 * 例子
	 * _.toNumber(3.2);
	 * // => 3.2
	 *
	 * _.toNumber(Number.MIN_VALUE);
	 * // => 5e-324
	 *
	 * _.toNumber(Infinity);
	 * // => Infinity
	 *
	 * _.toNumber('3.2');
	 * // => 3.2
	 *
	 **/
	toNumber: function(value) {
		return Number(value)
	},



	/**
	 * 转换 value 为安全整数。 安全整数可以用于比较和准确的表示。
	 * 参数。
	 * value (*): 要处理的值。
	 * 返回值
	 * (number): 返回转换后的整数。
	 * 例子
	 * _.toSafeInteger(3.2);
	 * // => 3
	 *
	 * _.toSafeInteger(Number.MIN_VALUE);
	 * // => 0
	 *
	 * _.toSafeInteger(Infinity);
	 * // => 9007199254740991
	 *
	 * _.toSafeInteger('3.2');
	 * // => 3
	 *
	 **/
	toSafeInteger: function(value) {
		var result
		if (value > -Number.MAX_SAFE_INTEGER && value < Number.MAX_SAFE_INTEGER) {
			result = Math.floor(value)
		} else if (value >= Number.MAX_SAFE_INTEGER) {
			result = Number.MAX_SAFE_INTEGER
		} else if (value <= -Number.MAX_SAFE_INTEGER) {
			result = -Number.MAX_SAFE_INTEGER
		} else {
			result = NaN
		}
		return result
	},



	/**
	 * 两个数相加。
	 * 参数。
	 * augend (number): 相加的第一个数。
	 * addend (number): 相加的第二个数。
	 * 返回值
	 * (number): 返回总和。
	 * 例子
	 * _.add(6, 4);
	 * // => 10
	 **/
	add: function(augend1, augend2) {
		return augend1 + augend2
	},

	/**
	 * 两个数相除。
	 * 参数。
	 * dividend (number): 相除的第一个数。
	 * divisor (number): 相除的第二个数。
	 * 返回值
	 * (number): 返回商数。
	 * 例子
	 * _.divide(6, 4);
	 * // => 1.5
	 *
	 **/
	divide: function(dividend, divisor) {
		return dividend / divisor
	},

	/**
	 * 根据 precision（精度） 向下舍入 number。（愚人码头注： precision（精度）可以理解为保留几位小数。）
	 * 参数。
	 * number (number): 要向下舍入的值。
	 * [precision=0] (number): 向下舍入的精度。
	 * 返回值
	 * (number): 返回向下舍入的值。
	 * 例子
	 * _.floor(4.006);
	 * // => 4
	 *
	 * _.floor(0.046, 2);
	 * // => 0.04
	 *
	 * _.floor(4060, -2);
	 * // => 4000
	 *
	 **/
	floor: function(number, precision = 0) {
		return (parseInt(number * Math.pow(10, precision)) / Math.pow(10, precision))
	},


	/**
	 * 计算 array 中的最大值。 如果 array 是 空的或者假值将会返回 undefined。
	 * 参数。
	 * array (Array): 要迭代的数组。
	 * 返回值
	 * (*): 返回最大的值。
	 * 例子
	 * _.max([4, 2, 8, 6]);
	 * // => 8
	 *
	 * _.max([]);
	 * // => undefined
	 *
	 *
	 **/
	max: function(array) {
		var biggest = -Infinity
		if (array.length == 0) {
			return undefined
		}
		return array.reduce((biggest, nextvalue) => {
			if (nextvalue > biggest) {
				return biggest = nextvalue
			} else {
				return biggest
			}
		}, biggest)
	},



	/**
	 * 这个方法类似 _.max 除了它接受 iteratee 来调用 array中的每一个元素，来生成其值排序的标准。 iteratee 会调用1个参数: (value) 。
	 * 参数。
	 * array (Array): 要迭代的数组。
	 * [iteratee=_.identity] (Function): 调用每个元素的迭代函数。
	 * 返回值
	 * (*): 返回最大的值。
	 * 例子
	 * var objects = [{ 'n': 1 }, { 'n': 2 }];
	 *
	 * _.maxBy(objects, function(o) { return o.n; });
	 * // => { 'n': 2 }
	 * _.maxBy(objects, 'n');
	 * // => { 'n': 2 }
	 *
	 **/

	maxBy: function(array, iteratee) {
		if (array.length == 0) {
			return undefined
		}

		if (typeof iteratee == 'function') {
			var fn = iteratee
		}
		if (typeof iteratee == 'string') {
			var fn = function(obj) {
				return obj[iteratee]
			}
		}

		return array.reduce((biggest, nextvalue) => {
			if (fn(nextvalue) > fn(biggest)) {
				return nextvalue
			} else {
				return biggest
			}
		})

	},


	/**
	 * 计算 array 的平均值。
	 * 参数。
	 * array (Array): 要迭代的数组。。
	 * 返回值
	 * (number): 返回平均值。
	 * 例子
	 * _.mean([4, 2, 8, 6]);
	 * // => 5
	 *
	 **/

	mean: function(array) {
		var sum = array.reduce((a, b) => a + b)
		return sum / array.length
	},



	/**
	 * 这个方法类似 _.mean， 除了它接受 iteratee 来调用 array中的每一个元素，来生成其值排序的标准。 iteratee 会调用1个参数: (value) 。
	 * 参数。
	 * array (Array): 要迭代的数组。
	 * [iteratee=_.identity] (Function): 调用每个元素的迭代函数。
	 * 返回值
	 * (number): 返回平均值。
	 * 例子
	 * var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
	 *
	 * _.meanBy(objects, function(o) { return o.n; });
	 * // => 5
	 *
	 * _.meanBy(objects, 'n');
	 * // => 5
	 **/
	meanBy: function(array, iteratee) {

		if (typeof iteratee == 'function') {
			var fn = iteratee
		}
		if (typeof iteratee == 'string') {
			var fn = function(obj) {
				return obj[iteratee]
			}
		}

		var sum = array.reduce((result, obj) => {
			return result + fn(obj)
		}, 0)
		return sum / array.length
	},



	/**
	 * 计算 array 中的最小值。 如果 array 是 空的或者假值将会返回 undefined。
	 * 参数。
	 * array (Array): 要迭代的数组。
	 * [iteratee=_.identity] (Function): 调用每个元素的迭代函数。
	 * 返回值
	 * (*): 返回最小的值。
	 * 例子
	 * _.min([4, 2, 8, 6]);
	 * // => 2
	 *
	 * _.min([]);
	 * // => undefined
	 **/

	min: function(array) {
		var smallest = Infinity
		if (array.length == 0) {
			return undefined
		}
		return array.reduce((smallest, nextvalue) => {
			if (nextvalue < smallest) {
				return smallest = nextvalue
			} else {
				return smallest
			}
		}, smallest)
	},

	/**
	 * 这个方法类似 _.min 除了它接受 iteratee 来调用 array中的每一个元素，来生成其值排序的标准。 iteratee 会调用1个参数: (value) 。
	 * 参数。
	 * array (Array): 要迭代的数组。
	 * [iteratee=_.identity] (Function): 调用每个元素的迭代函数。
	 * 返回值
	 * (*): 返回最小的值。
	 * 例子
	 * var objects = [{ 'n': 1 }, { 'n': 2 }];
	 *
	 * _.minBy(objects, function(o) { return o.n; });
	 * // => { 'n': 1 }
	 *
	 * _.minBy(objects, 'n');
	 * // => { 'n': 1 }
	 **/

	minBy: function(array, iteratee) {
		if (array.length == 0) {
			return undefined
		}

		if (typeof iteratee == 'function') {
			var fn = iteratee
		}
		if (typeof iteratee == 'string') {
			var fn = function(obj) {
				return obj[iteratee]
			}
		}

		return array.reduce((smallest, nextvalue) => {
			if (fn(nextvalue) < fn(smallest)) {
				return nextvalue
			} else {
				return smallest
			}
		})
	},



	/**
	 * 两个数相乘。
	 * 参数。
	 * augend (number): 相乘的第一个数。
	 * addend (number): 相乘的第二个数。
	 * 返回值
	 * (number): 返回乘积。
	 * 例子
	 * _.multiply(6, 4);
	 * // => 24
	 }
	 **/
	multiply: function(augend, addend) {
		return augend * addend
	},


	/**
	 * 根据 precision（精度） 四舍五入 number。
	 * 参数。
	 * number (number): 要四舍五入的数字。
	 * [precision=0] (number): 四舍五入的精度。
	 * 返回值
	 * (number): 返回四舍五入的数字。
	 * 例子
	 * _.round(4.006);
	 * // => 4
	 *
	 * _.round(4.006, 2);
	 * // => 4.01
	 *
	 * _.round(4060, -2);
	 * // => 4100
	 **/
	round: function(number, precision = 0) {
		return Math.round(number * Math.pow(10, precision)) / Math.pow(10, precision)
	},

	/**
	 * 两数相减。
	 * 参数。
	 * minuend (number): 相减的第一个数。
	 * subtrahend (number): 相减的第二个数。
	 * 返回值
	 * (number): 返回差。
	 * 例子
	 * _.subtract(6, 4);
	 * // => 2
	 **/
	subtract: function(minuend, subtrahend) {
		return minuend - subtrahend
	},


	/**
	 * 计算 array 中值的总和
	 * 参数。
	 * array (Array): 要迭代的数组。
	 * 返回值
	 * (number): 返回总和。
	 * 例子
	 * _.sum([4, 2, 8, 6]);
	 * // => 20
	 **/
	sum: function(array) {
		return array.reduce((a, b) => a + b)
	},

	/**
	 * 这个方法类似 _.summin 除了它接受 iteratee 来调用 array中的每一个元素，来生成其值排序的标准。 iteratee 会调用1个参数: (value) 。
	 * 参数。
	 * array (Array): 要迭代的数组。
	 * [iteratee=_.identity] (Function): 调用每个元素的迭代函数。
	 * 返回值
	 * (number): 返回总和。
	 * 例子
	 * var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
	 *
	 * _.sumBy(objects, function(o) { return o.n; });
	 * // => 20
	 *
	 * // The `_.property` iteratee shorthand.
	 * _.sumBy(objects, 'n');
	 * // => 20
	 **/
	sumBy: function(array, iteratee) {
		if (array.length == 0) {
			return undefined
		}
		var fn
		if (typeof iteratee == 'function') {
			fn = iteratee
		}
		if (typeof iteratee == 'string') {
			fn = function(obj) {
				return obj[iteratee]
			}
		}

		return array.reduce((sum, obj) => {
			return sum + fn(obj)
		}, 0)
	},

	/**
	 * 返回限制在 lower 和 upper 之间的值。
	 * 参数。
	 * number (number): 被限制的值。
	 * [lower] (number): 下限。
	 * upper (number): 上限
	 * 返回值
	 * (number): 返回被限制的值。
	 * 例子
	 * _.clamp(-10, -5, 5);
	 * // => -5
	 *
	 * _.clamp(10, -5, 5);
	 * // => 5
	 **/
	clamp: function(number, lower, upper) {
		if (number > lower && number < upper) {
			return number
		} else if (number > upper) {
			return upper
		} else if (number < lower) {
			return lower
		}
	},

	/**
	 * 检查 n 是否在 start 与 end 之间，但不包括 end。 如果 end 没有指定，那么 start 设置为0。 如果 start 大于 end，那么参数会交换以便支持负范围。
	 * 参数。
	 * number (number): 要检查的值。
	 * [start=0] (number): 开始范围。
	 * end (number): 结束范围。
	 * 返回值
	 * (boolean): 如果number在范围内 ，那么返回true，否则返回 false。
	 * 例子
	 * _.inRange(3, 2, 4);
	 * // => true
	 *
	 * _.inRange(4, 8);
	 * // => true
	 *
	 * _.inRange(4, 2);
	 * // => false
	 *
	 * _.inRange(2, 2);
	 * // => false
	 *
	 * _.inRange(1.2, 2);
	 * // => true
	 *
	 * _.inRange(5.2, 4);
	 * // => false
	 *
	 * _.inRange(-3, -2, -6);
	 * // => true
	 *
	 **/

	inRange: function(...args) {
		var num, start, end
		num = args[0]
		if (args.length == 2) {
			if (args[1] >= 0) {
				start = 0
				end = args[1]
			} else {
				start = args[1]
				end = 0
			}
		} else if (args.length == 3) {
			if (args[1] > args[2]) {
				start = args[2]
				end = args[1]
			} else {
				start = args[1]
				end = args[2]
			}
		}
		return num >= start && num < end
	},

	/**
	 * 分配来源对象的可枚举属性到目标对象上。 来源对象的应用规则是从左到右，随后的下一个对象的属性会覆盖上一个对象的属性。
	 * 注意: 这方法会改变 object，参考自 Object.assign.
	 * 参数。
	 * object (Object): 目标对象。
	 * [sources] (...Object): 来源对象。
	 * 返回值
	 * (Object): 返回 object.
	 * 例子
	 * function Foo() {
	 *   this.a = 1;
	 * }
	 *
	 * function Bar() {
	 *   this.c = 3;
	 * }
	 * // => false
	 *
	 * Foo.prototype.b = 2;
	 * Bar.prototype.d = 4;
	 *
	 * _.assign({ 'a': 0 }, new Foo, new Bar);
	 * // => { 'a': 1, 'c': 3 }
	 *
	 **/
	assign: function(object, ...args) {
		for (var i = 0; i < args.length; i++) {
			for (var key in args[i]) {
				if (args[i].hasOwnProperty(key)) {
					object[key] = args[i][key]
				}
			}
		}
		return object
	},



	/**
	 * 这个方法类似 _.assign， 除了它会遍历并继承来源对象的属性。
	 * Note: 这方法会改变 object。
	 * 参数。
	 * object (Object): 目标对象。
	 * [sources] (...Object): 来源对象。
	 * 返回值
	 * (Object): 返回 object.
	 * 例子
	 * function Foo() {
	 *   this.a = 1;
	 * }
	 *
	 * function Bar() {
	 *   this.c = 3;
	 * }
	 * // => false
	 *
	 * Foo.prototype.b = 2;
	 * Bar.prototype.d = 4;
	 *
	 * assignIn({ 'a': 0 }, new Foo, new Bar);
	 * //  => { 'a': 1, 'b': 2, 'c': 3, 'd': 4 }
	 *
	 **/

	assignIn: function(object, ...args) {
		for (var i = 0; i < args.length; i++) {
			for (var key in args[i]) {
				object[key] = args[i][key]
			}
		}
		return object
	},

	/**
	 * 创建一个数组，值来自 object 的paths路径相应的值。
	 * Note: 这方法会改变 object。
	 * 参数。
	 * object (Object): 要迭代的对象。
	 * [paths] (...(string|string[])): 要获取的对象的元素路径，单独指定或者指定在数组中。
	 * 返回值
	 * (Array): 返回选中值的数组。
	 * 例子
	 * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
	 *
	 * _.at(object, ['a[0].b.c', 'a[1]']);
	 * // => [3, 4]
	 *
	 **/
	at: function(object, paths) {
		var result = []
		for (var i = 0; i < paths.length; i++) {
			result[i] = eval('object.' + paths[i])
		}
		return result
	},


	/**
	 * 分配来源对象的可枚举属性到目标对象所有解析为 undefined 的属性上。 来源对象从左到右应用。 一旦设置了相同属性的值，后续的将被忽略掉。
	 * Note: 这方法会改变 object。
	 * 参数。
	 * object (Object): 目标对象。
	 * [sources] (...Object): 来源对象。
	 * 返回值
	 * (Array): 返回选中值的数组。
	 * 例子
	 * _.defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
	 * // => { 'a': 1, 'b': 2 }
	 *
	 **/
	defaults: function(object, ...sources) {
		for (var i = 0; i < sources.length; i++) {
			for (var key in sources[i]) {
				if (sources[i].hasOwnProperty(key) && !object.hasOwnProperty(key)) {
					object[key] = sources[i][key]
				}
			}
		}
		return object
	},

	/**
	 * 使用 iteratee 遍历对象的自身和继承的可枚举属性。 iteratee 会传入3个参数：(value, key, object)。 如果返回 false，iteratee 会提前退出遍历。
	 * 参数。
	 * object (Object): 要遍历的对象。
	 * [iteratee=_.identity] (Function): 每次迭代时调用的函数。
	 * 返回值
	 * (Object): 返回 object。
	 * 例子
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.forIn(new Foo, function(value, key) {
	 *   console.log(key);
	 * });
	 * // => Logs 'a', 'b', then 'c' (无法保证遍历的顺序)。
	 **/
	forIn: function(object, iteratee) {
		for (var key in object) {
			iteratee(object, key)
		}
	},

	/**
	 * 检查 value 是否是原始 boolean 类型或者对象。 如果一个值被认为是类数组，那么它不是一个函数，并且value.length是个整数，大于等于 0，小于或等于 Number.MAX_SAFE_INTEGER。
	 * 参数
	 * value (*): 要检查的值。
	 * 返回值
	 * (boolean): 如果 value 是一个布尔值，那么返回 true，否则返回 false。
	 * 例子
	 * _.isBoolean(false);
	 * // => true
	 *
	 * _.isBoolean(null);
	 * // => false
	 **/

	/**
	 * 这个方法类似 _.forIn。 除了它是反方向开始遍历object的。
	 * 参数。
	 * object (Object): 要遍历的对象。
	 * [iteratee=_.identity] (Function): 每次迭代时调用的函数。
	 * 返回值
	 * (Object): 返回 object。
	 * 例子
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * forInRight(new Foo, function(value, key) {
	 *   console.log(key);
	 * });
	 * // => 输出 'c', 'b', 然后 'a'， `_.forIn` 会输出 'a', 'b', 然后 'c'。
	 **/
	forInRight: function(object, iteratee) {
		var temp = []
		for (var key in object) {
			temp.unshift(key)
		}

		for (var i in temp) {
			iteratee(object[temp[i]], temp[i], temp)
		}
		return object
	},


	/**
	 * 使用 iteratee 遍历自身的可枚举属性。 iteratee 会传入3个参数：(value, key, object)。 如果返回 false，iteratee 会提前退出遍历。
	 * 参数。
	 * object (Object): 要遍历的对象。
	 * [iteratee=_.identity] (Function): 每次迭代时调用的函数。
	 * 返回值
	 * (Object): 返回 object。
	 * 例子
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.forOwn(new Foo, function(value, key) {
	 *   console.log(key);
	 * });
	 * // => 输出 'a' 然后 'b' (无法保证遍历的顺序)。
	 **/
	forOwn: function(object, iteratee) {
		for (var key in object) {
			if (object.hasOwnProperty(key)) {
				iteratee(object[key], key, object)
			}
		}
		return object
	},

	/**
	 * 这个方法类似 _.forOwn。 除了它是反方向开始遍历object的。
	 * 参数。
	 * object (Object): 要遍历的对象。
	 * [iteratee=_.identity] (Function): 每次迭代时调用的函数。
	 * 返回值
	 * (Object): 返回 object。
	 * 例子
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.forOwnRight(new Foo, function(value, key) {
	 *   console.log(key);
	 * });
	 * // =>  输出 'b' 然后 'a'， `_.forOwn` 会输出 'a' 然后 'b'
	 **/

	forOwnRight: function(object, iteratee) {
		var keys = []
		for (var key in object) {
			if (object.hasOwnProperty(key)) {
				keys.unshift(key)
			}
		}
		for (var index in keys) {
			iteratee(object[keys[index]], keys[index], keys)
		}
		return object
	},

	/**
	 * 创建一个函数属性名称的数组，函数属性名称来自object对象自身可枚举属性。
	 * 参数。
	 * object (Object): 要检查的对象。。
	 * 返回值
	 * (Array): 返回函数名。
	 * 例子
	 *
	 * function Foo() {
	 *   this.a = _.constant('a');
	 *   this.b = _.constant('b');
	 * }
	 *
	 * Foo.prototype.c = _.constant('c');
	 *
	 * _.functions(new Foo);
	 * // => ['a', 'b']
	 **/
	functions: function(object) {
		var result = []
		for (var key in object) {
			if (object.hasOwnProperty(key)) {
				if (object[key] instanceof Function) {
					result.push(key)
				}
			}
		}
		return result
	},


	/**
	 * 创建一个函数属性名称的数组，函数属性名称来自object对象自身和继承的可枚举属性。
	 * 参数。
	 * object (Object): 要检查的对象。。
	 * 返回值
	 * (Array): 返回函数名。
	 * 例子
	 *
	 * function Foo() {
	 *   this.a = _.constant('a');
	 *   this.b = _.constant('b');
	 * }
	 *
	 * Foo.prototype.c = _.constant('c');
	 *
	 * _.functionsIn(new Foo);
	 * // => ['a', 'b', 'c']
	 **/
	functionsIn: function(object) {
		var result = []
		for (var key in object) {
			if (object[key] instanceof Function) {
				result.push(key)
			}
		}
		return result
	},

	/**
	 * 根据 object对象的path路径获取值。 如果解析 value 是 undefined 会以 defaultValue 取代。
	 * 参数。
	 * object (Object): 要检索的对象。
	 * path (Array|string): 要获取属性的路径。
	 * [defaultValue] (*): 如果解析值是 undefined ，这值会被返回。
	 *
	 * 返回值
	 * (*): 返回解析的值。
	 * 例子
	 *
	 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
	 *
	 * _.get(object, 'a[0].b.c');
	 * // => 3
	 *
	 * _.get(object, ['a', '0', 'b', 'c']);
	 * // => 3
	 *
	 * _.get(object, 'a.b.c', 'default');
	 * // => 'default'
	 **/
	get: function(object, path, defaultValue) {
		var finalPath
		if (typeof path == 'string') {
			finalPath = '.' + path
		}
		if (path instanceof Array) {
			finalPath = path.map(it => '["' + it + '"]').join('')
		}
		try {
			eval('object' + finalPath)
			return eval('object' + finalPath)
		} catch (e) {
			return 'default'
		}
	},

	/**
	 * 检查 path 是否是object对象的直接属性。
	 * 参数。
	 * object (Object): 要检索的对象。
	 * path (Array|string): 要检查的路径path
	 *
	 * 返回值
	 * [defaultValue] (*): 如果解析值是 undefined ，这值会被返回。
	 * (boolean): 如果path存在，那么返回 true ，否则返回 false。
	 * 例子
	 *
	 * var object = { 'a': { 'b': 2 } };
	 * var other = _.create({ 'a': _.create({ 'b': 2 }) });
	 *
	 * _.has(object, 'a');
	 * // => true
	 *
	 * _.has(object, 'a.b');
	 * // => true
	 *
	 * _.has(object, ['a', 'b']);
	 * // => true
	 *
	 * _.has(other, 'a');
	 * // => false
	 **/
	has: function(object, path, defaultValue) {
		var finalPath
		if (typeof path == 'string') {
			finalPath = '.' + path
		}
		if (path instanceof Array) {
			finalPath = path.map(it => '["' + it + '"]').join('')
		}
		try {
			eval('object' + finalPath)
			return true
		} catch (e) {
			return false
		}
	},

	/**
	 * 这个方法类似 _.invert，除了倒置对象 是 collection（集合）中的每个元素经过 iteratee（迭代函数） 处理后返回的结果。每个反转键相应反转的值是一个负责生成反转值key的数组。iteratee 会传入3个参数：(value) 。
	 * 参数。
	 * object (Object): 要键值倒置对象。
	 * [iteratee=_.identity] (Function): 每次迭代时调用的函数。
	 *
	 * 返回值
	 * (Object): 返回新的键值倒置后的对象
	 * 例子
	 * var object = { 'a': 1, 'b': 2, 'c': 1 };
	 *
	 * _.invertBy(object);
	 * // => { '1': ['a', 'c'], '2': ['b'] }
	 *
	 * _.invertBy(object, function(value) {
	 *   return 'group' + value;
	 * });
	 * // => { 'group1': ['a', 'c'], 'group2': ['b'] }
	 *
	 **/
	invertBy: function(object, iteratee) {
		var result = {}
		if (iteratee == undefined) {
			iteratee = function(it) {
				return it
			}
		}
		for (var key in object) {
			if (object.hasOwnProperty(key)) {
				if (!(iteratee(object[key]) in result)) {
					result[iteratee(object[key])] = [key]
				} else {
					result[iteratee(object[key])].push(key)
				}
			}
		}
		return result
	},

	/**
	 * 创建一个对象，这个对象的key与object对象相同，值是通过 iteratee 运行 object 中每个自身可枚举属性名字符串产生的。 iteratee调用三个参数： (value, key, object)。
	 * Note: 这方法会改变 object。
	 * 参数。
	 * object (Object): 要遍历的对象。
	 * [iteratee=_.identity] (Function): 每次迭代时调用的函数。
	 * 返回值
	 * (Object): 返回映射后的新对象。
	 * 例子
	 * var users = {
	 *   'fred':    { 'user': 'fred',    'age': 40 },
	 *   'pebbles': { 'user': 'pebbles', 'age': 1 }
	 * };
	 *
	 * _.mapValues(users, function(o) { return o.age; });
	 * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
	 *
	 * _.mapValues(users, 'age');
	 * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
	 **/
	mapValues: function(object, iteratee) {
		var result = {}
		var fn = iteratee
		if (typeof iteratee === 'string') {
			fn = function(obj) {
				return obj[iteratee]
			}
		}

		for (var obj in object) {
			if (object.hasOwnProperty(obj)) {
				result[obj] = fn(object[obj])
			}
		}
		return result
	},

	/**
	 * 反向版 _.pick; 这个方法一个对象，这个对象由忽略属性之外的object自身和继承的可枚举属性组成。（愚人码头注：可以理解为删除object对象的属性）
	 * 参数。
	 * object (Object): 来源对象。
	 * [props] (...(string|string[])): 要被忽略的属性。（愚人码头注：单独指定或指定在数组中。）
	 * 返回值
	 * (Object): 返回新对象。
	 * 例子
	 * var object = { 'a': 1, 'b': '2', 'c': 3 };
	 *
	 * _.omit(object, ['a', 'c']);
	 * // => { 'b': '2' }
	 **/
	omit: function(object, props) {
		var result = {}
		for (var key in object) {
			if (!props.includes(key)) {
				result[key] = object[key]
			}
		}
		return result
	},

	/**
	 * 反向版 _.pickBy；这个方法一个对象，这个对象忽略 predicate（断言函数）判断不是真值的属性后，object自身和继承的可枚举属性组成。predicate调用与2个参数：(value, key)。
	 * 参数。
	 * object (Object): 来源对象。
	 * [predicate=_.identity] (Function): 调用每一个属性的函数。
	 * 返回值
	 * (Object): 返回新对象。
	 * 例子
	 * var object = { 'a': 1, 'b': '2', 'c': 3 };
	 *
	 * _.omitBy(object, _.isNumber);
	 * // => { 'b': '2' }
	 **/
	omitBy: function(object, predicate) {
		var result = {}
		for (var key in object) {
			if (object.hasOwnProperty(key)) {
				if (!predicate(object[key])) {
					result[key] = object[key]
				}
			}
		}
		return result
	},



	isBoolean: function(value) {
		return typeof value == 'boolean' ? true : false
	},

	/**
	 * 检查 value 是否是 Date 对象。
	 * 参数
	 * value (*): 要检查的值。。
	 * 返回值
	 * (boolean): 如果 value 是一个日期对象，那么返回 true，否则返回 false。
	 * 例子
	 * _.isDate(new Date);
	 * // => true
	 *
	 * _.isDate('Mon April 23 2012');
	 * // => false
	 **/
	isDate: function(value) {
		return value instanceof Date
	},

	/**
	 * 检查 value 是否是可能是 DOM 元素
	 * 参数
	 * value (*): 要检查的值。。
	 * 返回值
	 * (boolean): 如果 value 是一个DOM元素，那么返回 true，否则返回 false。
	 * 例子
	 * _.isElement(document.body);
	 * // => true
	 *
	 * _.isElement('<body>');
	 * // => false
	 **/
	isElement: function(value) {
		return value instanceof HTMLElement
	},

	/**
	 * 检查 value 是否为一个空对象，集合，映射或者set。 判断的依据是除非是有枚举属性的对象，length 大于 0 的 arguments object, array, string 或类jquery选择器。
	 *
	 * 对象如果被认为为空，那么他们没有自己的可枚举属性的对象。
	 *
	 * 类数组值，比如arguments对象，array，buffer，string或者类jQuery集合的length 为 0，被认为是空。类似的，map（映射）和set 的size 为 0，被认为是空。
	 *
	 * 参数
	 * value (*): 要检查的值。
	 * 返回值
	 * (boolean): 如果 value 为空，那么返回 true，否则返回 false。
	 * 例子
	 * _.isEmpty(null);
	 * // => true
	 *
	 * _.isEmpty(true);
	 * // => true
	 *
	 * _.isEmpty(1);
	 * // => true
	 *
	 * _.isEmpty([1, 2, 3]);
	 * // => false
	 *
	 * _.isEmpty({ 'a': 1 });
	 * // => false
	 **/
	isEmpty: function(value) {
		if (value == null || typeof value == 'number' || typeof value == 'boolean') {
			return true
		}
		if (value instanceof Array) {
			return value.length == 0
		}
		if (value instanceof Object) {
			return Object.getOwnPropertyNames(value).length == 0
		}
	},


	isEqual: function(a, b) {
		//如果两个参数类型不同
		if (typeof a !== typeof b) {
			return false
		}
		//如果两个参数不相等
		if (a !== b && typeof a == 'number' && typeof b == 'number') {
			return false;
		}
		if (a === b) {
			return true;
		}
		//如果两个都是NaN,返回true
		if (isNaN(a) && isNaN(b)) {
			return true
		}

		//两个对象情况(包含数组)
		var keys = []

		for (var key in a) {
			keys.push(key)
		}
		for (var key in b) {
			if (keys.indexOf(key) < 0) {
				keys.push(key)
			}
		}

		for (var key of keys) {
			if (!isEqual(a[key], b[key])) {
				return false
			}
		}
		return true

		function isNaN(x) {
			return x !== x;
		}
	},

	/**
	 * 检查 value 是否是 Error, EvalError, RangeError, ReferenceError, SyntaxError, TypeError, 或者 URIError对象。
	 * 参数
	 * value (*): 要检查的值。
	 * 返回值
	 * (boolean): 如果 value 是一个错误（Error）对象，那么返回 true，否则返回 false。
	 * 例子
	 * _.isError(new Error);
	 * // => true
	 *
	 * _.isError(Error);
	 * // => false
	 **/
	isError: function(value) {
		var collection = [Error, EvalError, RangeError, ReferenceError, SyntaxError, TypeError, URIError]
		for (var i = 0; i < collection.length; i++) {
			if (value instanceof collection[i]) {
				return true
			}
		}
		return false
	},

	/**
	 * 检查 value 是否是原始有限数值。
	 *
	 * ** 注意:** 这个方法基于 Number.isFinite.
	 *
	 * 参数
	 * value (*): 要检查的值
	 * 返回值
	 * (boolean): 如果 value 是一个有限数值，那么返回 true，否则返回 false。。
	 * 例子
	 * _.isFinite(3);
	 * // => true
	 *
	 * _.isFinite(Number.MIN_VALUE);
	 * // => true
	 * _.isFinite(Infinity);
	 * // => false
	 *
	 * _.isFinite('3');
	 * // => false
	 **/
	isFinite: function(value) {
		if (typeof value != 'number') {
			return false
		} else if (value !== Infinity && value !== -Infinity) {
			return true
		}
		return false
	},

	/**
	 * 检查 value 是否是 Function 对象。
	 * 参数
	 * value (*): 要检查的值
	 * 返回值
	 * (boolean): 如果 value 是一个函数，那么返回 true，否则返回 false。
	 * 例子
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 *
	 **/
	isFunction: function(value) {
		return value instanceof Function
	},

	/**
	 * 检查 value 是否为一个整数。。
	 * 参数
	 * value (*): 要检查的值
	 * 返回值
	 * (boolean): 如果 value 是一个整数，那么返回 true，否则返回 false
	 * 例子
	 * _.isInteger(3);
	 * // => true
	 *
	 * _.isInteger(Number.MIN_VALUE);
	 * // => false
	 *
	 * _.isInteger(Infinity);
	 * // => false
	 *
	 * _.isInteger('3');
	 * // => false
	 **/
	isInteger: function(value) {
		if (typeof value == 'number') {
			return value % 1 == 0
		}
		return false
	},


	/**
	 * 分配来源对象的可枚举属性到目标对象上。 来源对象的应用规则是从左到右，随后的下一个对象的属性会覆盖上一个对象的属性。
	 * 注意: 这方法会改变 object，参考自 Object.assign.
	 * 参数
	 * object (Object): 目标对象。
	 * [sources] (...Object): 来源对象。
	 * 返回值
	 * (Object): 返回 object.
	 * 例子
	 * function Foo() {
	 *   this.a = 1;
	 * }
	 *
	 * function Bar() {
	 *   this.c = 3;
	 * }
	 *
	 * Foo.prototype.b = 2;
	 * Bar.prototype.d = 4;
	 *
	 * _.assign({ 'a': 0 }, new Foo, new Bar);
	 * // => { 'a': 1, 'c': 3 }
	 *
	 **/
	assign: function(array) {

		//创建一个空对象用来存键值对
		var result = {};
		//输入的参数是多个对象
		for (var i = 0; i < arguments.length; i++) {
			for (var key in arguments[i]) {
				result[key] = arguments[i][key];
			}
		}
		return result;
	},

	forOwn: function(obj, iterator) {

		for (var key in obj) {
			if (obj.hasOwnProperty(key)) { //Object.prototype.hasOwnProperty.call(obj,key)
				if (iterator(obj[key], key, obj) === false) {
					return
				}
			}
		}
	},

	invert: function(object) {
		var result = {};

		for (var key in object) {
			result[object[key]] = key;
		}
		return result;
	},

	//把输入的一个对象中的属性名存入到一个数组中，返回
	keys: function(obj) {
		var result = [];
		//遍历一遍对象,key是对象中的属性名
		for (var key in obj) {
			result.push(key);
		}
		return result;
	},

	mapKeys: function(object, iteratee) {
		var result = {};
		for (var key in object) {
			result[iteratee(object[key], key, object)] = object[key]
		}
		return result;
	},

	pick: function(object, array) {
		var result = {};
		if (Array.isArray(array)) {
			for (var key in object) {
				for (var i = 0; i < array.length; i++) {
					if (key == array[i]) {
						result[key] = object[key];
					}
				}
			}
			return result;
		}
	},

	/**
	 * 创建一个对象，这个对象组成为从 object 中经 predicate 判断为真值的属性。 predicate调用2个参数：(value, key)
	。 * 参数。
	 * object (Object): 来源对象。
	 * [predicate=_.identity] (Function): 调用每一个属性的函数。
	 * 返回值
	 * (Object): 返回新对象。
	 * 例子
	 * var object = { 'a': 1, 'b': '2', 'c': 3 };
	 *
	 * _.pickBy(object, _.isNumber);
	 * // => { 'a': 1, 'c': 3 }
	 **/
	pickBy: function(object, predicate) {
		var result = {}
		for (var key in object) {
			if (object.hasOwnProperty(key)) {
				if (predicate(object[key])) {
					result[key] = object[key]
				}
			}
		}
		return result
	},

	/**
	 * 创建一个object对象自身可枚举属性的键值对数组。这个数组可以通过_.fromPairs撤回。如果object 是 map 或 set，返回其条目。
	。 * 参数。
	 * object (Object): 要检索的对象。
	 * 返回值
	 * (Array): 返回键值对的数组。
	 * 例子
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.toPairs(new Foo);
	 * // => [['a', 1], ['b', 2]] (iteration order is not guaranteed)
	 **/
	toPairs: function(object) {
		var result = []
		for (var key in object) {
			if (object.hasOwnProperty(key)) {
				var keyValue = []
				keyValue[0] = key
				keyValue[1] = object[key]
				result.push(keyValue)
			}
		}
		return result
	},

	/**
	 * 创建一个object对象自身和继承的可枚举属性的键值对数组。这个数组可以通过_.fromPairs撤回。如果object 是 map 或 set，返回其条目。
	 * 参数。
	 * object (Object): 要检索的对象。
	 * 返回值
	 * (Array): 返回键值对的数组。
	 * 例子
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * toPairsIn(new Foo);
	 * // => [['a', 1], ['b', 2], ['c', 3]] (iteration order is not guaranteed)
	 **/
	toPairsIn: function(object) {
		var result = []
		for (var key in object) {
			var keyValue = []
			keyValue[0] = key
			keyValue[1] = object[key]
			result.push(keyValue)
		}
		return result
	},

	/**
	 * 创建 object 自身可枚举属性的值为数组。
	 * 注意: 非对象的值会强制转换为对象。
	 * 参数
	 * object (Object): 要检索的对象。
	 *
	 * 返回值
	 * (Array): 返回对象属性的值的数组。
	 *function Foo() {
	 *  this.a = 1;
	 *  this.b = 2;
	 *}
	 *
	 * Foo.prototype.c = 3;
	 *
	 * values(new Foo);
	 * => [1, 2] (无法保证遍历的顺序)
	 *
	 * values('hi');
	 * => ['h', 'i']
	 *
	 **/
	//把输入的一个对象中的属性值存入到一个数组中，返
	values: function(obj) {

		var result = [];

		if (typeof obj === 'string') {
			obj = new String(obj)
		}
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				result.push(obj[key])
			}
		}
		return result;
	},



	capitalize: function(str) {
		//首先把所有的字母变成小写
		var str = str.toLowerCase();
		//把第一个字母大写，然后和后面的拼接起来
		var newStr = str[0].toUpperCase();
		for (var i = 1; i < str.length; i++) {
			newStr += str[i];
		}
		return newStr;
	},

	endsWith: function(str, target, position) {
		//如果没给位置，默认为第一个
		if (position == undefined) {
			position = str.length;
		}
		var counter = 0;
		for (var i = 0; i < str.length; i++) {
			counter++;
			if ((str[i] == target) && (counter == position)) {
				return true;
			}
		}
		return false;
	},

	/**
	 * 转义string中的 "&", "<", ">", '"', "'", 和 "`" 字符为HTML实体字符。
	 * 注意: 不会转义其他字符。如果需要，可以使用第三方库，例如 he。
	 * 参数
	 * [string=''] (string): 要转义的字符串。
	 * 返回值
	 * (string): 返回处理后的字符串。
	 * 例子
	 * _.escape('fred, barney, & pebbles');
	 * // => 'fred, barney, &amp; pebbles'
	 *
	 **/
	//"&", "<", ">", '"', "'", 和 "`"
	escape: function(string) {
		var htmlExchange = {
			'&': '&amp;',

			'<': '&lt;',

			'>': '&gt;',

			'"': '&quot;',

			"'": '&acute;',
		}
		var reg = new RegExp('([\&\<\>\'\`])+', 'g')
		return string.replace(reg, function(mached, unit) {
			return htmlExchange[unit]
		})
	},

	/**
	 * 转义 RegExp 字符串中特殊的字符 "^", "$", "", ".", "*", "+", "?", "(", ")", "[", "]", "{", "}", 和 "|" in .
	 * 参数
	 * [string=''] (string): 要转义的字符串。
	 * 返回值
	 * (string): 返回处理后的字符串。
	 * 例子
	 * _.escapeRegExp('[lodash](https://lodash.com/)');
	 * // => '\[lodash\]\(https://lodash\.com/\)'
	 *
	 **/
	escapeRegExp: function(string) {
		var exchanged = {
			'^': '\\^',
			'$': '\\$',
			'.': '\\.',
			'*': '\\*',
			'+': '\\+',
			"?": '\\?',
			'(': '\\(',
			')': '\\)',
			'[': '\\[',
			']': '\\]',
			'{': '\\{',
			'}': '\\}',
			"|": '\\|',
		}
		return string.replace(/([\^\$\.\*\+\?\(\)\[\]\{\}\|])/g, function(mached, unit) {
			return exchanged[unit]
		})
	},


	/**
	 * 转换字符串string的首字母为小写。
	 * 参数
	 * [string=''] (string): 要转义的字符串。
	 * 返回值
	 * (string): 返回处理后的字符串。
	 * 例子
	 * _.lowerFirst('Fred');
	 * // => 'fred'
	 *
	 * _.lowerFirst('FRED');
	 * // => 'fRED'
	 *
	 **/
	lowerFirst: function(string) {
		return string.slice(0, 1).toLowerCase() +
			string.slice(1)
	},


	/**
	 * 如果string字符串长度小于 length 则从左侧和右侧填充字符。 如果没法平均分配，则截断超出的长度。
	 * 参数
	 * [string=''] (string): 要填充的字符串。
	 * [length=0] (number): 填充的长度。
	 * [chars=' '] (string): 填充字符。
	 * 返回值
	 * (string): 返回填充后的字符串。
	 * 例子
	 * _.pad('abc', 8);
	 * // => '  abc   '
	 *
	 *  _.pad('abc', 8, '_-');
	 *  // => '_-abc_-_'
	 * _.pad('abc', 3);
	 * // => 'abc'
	 *
	 **/
	pad: function(string, length, chars = ' ') {
		if (string.length < length) {
			var count = Math.ceil((length - string.length) / chars.length)
			for (var i = 0; i < count; i++) {
				if (i % 2 == 0) {
					string = string + chars
				} else {
					string = chars + string
				}
			}
			return string.slice(0, length)
		} else {
			return string
		}
	},

	/**
	 * 如果string字符串长度小于 length 则在右侧填充字符。 如果超出length长度则截断超出的部分
	 * 参数
	 * [string=''] (string): 要填充的字符串。
	 * [length=0] (number): 填充的长度。
	 * [chars=' '] (string): 填充字符。
	 * 返回值
	 * (string): 返回填充后的字符串。
	 * 例子
	 * _.padEnd('abc', 6);
	 * // => 'abc   '
	 *
	 * _.padEnd('abc', 6, '_-');
	 * // => 'abc_-_'
	 * _.padEnd('abc', 3);
	 * // => 'abc'
	 *
	 **/
	padEnd: function(string, length, chars = ' ') {
		if (string.length < length) {
			var count = Math.ceil((length - string.length) / chars.length)
			return (string + chars.repeat(count)).slice(0, length)
		}
		return string
	},

	/**
	 * 如果string字符串长度小于 length 则在左侧填充字符。 如果超出length长度则截断超出的部分。
	 * 参数
	 * [string=''] (string): 要填充的字符串。
	 * [length=0] (number): 填充的长度。
	 * [chars=' '] (string): 填充字符。
	 * 返回值
	 * (string): 返回填充后的字符串。
	 * 例子
	 * _.padStart('abc', 6);
	 * // => '   abc'
	 *
	 * _.padStart('abc', 6, '_-');
	 * // => '_-_abc'
	 * _.padStart('abc', 3);
	 * // => 'abc'
	 *
	 **/
	padStart: function(string, length, chars = ' ') {
		if (string.length < length) {
			var count = Math.ceil((length - string.length) / chars.length)
			return (chars.repeat(count) + string).slice(-length)
		}
		return string
	},

	/**
	 * 转换string字符串为指定基数的整数。 如果基数是 undefined 或者 0，则radix基数默认是10，如果string字符串是16进制，则radix基数为 16。
	 * 参数
	 * string (string): 要转换的字符串。
	 * [radix=10] (number):转换基数。
	 * 返回值
	 * (number): 返回转换后的整数。
	 * 例子
	 * _.parseInt('08');
	 * // => 8
	 *
	 * _.map(['6', '08', '10'], _.parseInt);
	 * // => [6, 8, 10]
	 **/
	parseInt: function(string, radix = '10') {
		var len = string.length
		var result = 0
		for (var i = 0; i < len; i++) {
			result += +(string[len - 1 - i]) * Math.pow(radix, i)
		}
		return result
	},

	/**
	 * 重复 N 次给定字符串。
	 * 参数
	 * [string=''] (string): 要重复的字符串。
	 * [n=1] (number): 重复的次数。
	 * 返回值
	 * (string): 返回重复的字符串。
	 * 例子
	 * _.repeat('*', 3);
	 * // => '***'
	 * _.repeat('abc', 2);
	 * // => 'abcabc'
	 * _.repeat('abc', 0);
	 * // => ''
	 **/
	repeat: function(string, number = '1') {
		if (number == 0) {
			return ''
		}
		var copy = string
		for (var i = 0; i < number - 1; i++) {
			string += copy.slice(0)
		}
		return string
	},

	/**
	 * 替换string字符串中匹配的pattern为给定的replacement 。
	 * 参数
	 * [string=''] (string): 待替换的字符串。
	 * pattern (RegExp|string): 要匹配的内容。
	 * replacement (Function|string): 替换的内容。
	 * 返回值
	 * (string): 返回替换后的字符串
	 * 例子
	 * _.replace('Hi Fred', 'Fred', 'Barney');
	 * // => 'Hi Barney'
	 **/
	replace: function(string, pattern, replacement) {
		var reg = new RegExp(pattern, 'g')
		return string.replace(reg, replacement)
	},


	split: function() {
		var result = [];
		//首先是把输入的字符串转换成数组，所以创建一个空数组，然后把字符串的
		//每一项push进去
		for (var i = 0; i < arguments[0].length; i++) {
			result.push(arguments[0][i])
		}
		//遍历这个数组，寻找其中和差拆分符相同的项，
		//然后把它从这个数组中剔除
		for (var j = 0; j < result.length; j++) {
			if (result[j] == arguments[1]) {
				result.splice(j, 1)
				j = -1;
			}
		}
		//剔除掉拆分符的数组要要按照保留数位进行截取
		result.splice(arguments[2]);
		return result;
	},

	/**
	 * 从string字符串中移除前面和后面的 空格 或 指定的字符。
	 * 参数
	 * [string=''] (string): 要处理的字符串。
	 * [chars=whitespace] (string): 要移除的字符。
	 * 返回值
	 * (string): 返回处理后的字符串。
	 * 例子
	 * _.trim('  abc  ');
	 * // => 'abc'
	 * _.trim('-_-abc-_-', '_-');
	 * // => 'abc'
	 *
	 * _.map(['  foo  ', '  bar  '], _.trim);
	 * // => ['foo', 'bar']
	 **/
	trim: function(string, chars) {
		if (chars == undefined) {
			chars = ' '
		}
		var reg = new RegExp(`(^[${chars}]+)|([${chars}]+$)`, 'g')
		return string.replace(reg, '')
	},

	/**
	 * 从string字符串中移除后面的 空格 或 指定的字符。符。
	 * 参数
	 * [string=''] (string): 要处理的字符串。
	 * [chars=whitespace] (string): 要移除的字符。
	 * 返回值
	 * (string): 返回处理后的字符串。
	 * 例子
	 * _.trimEnd('  abc  ');
	 * // => '  abc'
	 *
	 * _.trimEnd('-_-abc-_-', '_-');
	 * // => '-_-abc'
	 **/
	trimEnd: function(string, chars) {
		if (chars == undefined) {
			chars = ' '
		}
		var reg = new RegExp('[' + chars + ']+$', 'g')
		return string.replace(reg, '')
	},

	/**
	 * 从string字符串中移除前面的 空格 或 指定的字符。。
	 * 参数
	 * [string=''] (string): 要处理的字符串。
	 * [chars=whitespace] (string): 要移除的字符。
	 * 返回值
	 * (string): 返回处理后的字符串。
	 * 例子
	 * _.trimStart('  abc  ');
	 * // => 'abc  '
	 *
	 * _.trimStart('-_-abc-_-', '_-');
	 * // => 'abc-_-'
	 **/
	trimStart: function(string, chars = ' ') {
		var reg = new RegExp('^[' + chars + ']+', 'g')
		return string.replace(reg, '')
	},


	//我们假设的传入的json都是标准形式，然后以后再慢慢改
	//所以我们需要每输入一个json就刷新一下，因为i会被直接修改
	// parseJson: function(str) {
	// 	var json = str;
	// 	var i = 0;
	// 	return parse();


	// 	function parse() {

	// 		//相当于一个指针，告诉我们现在这个字符是指向的什么东西
	// 		// 从i指向的位置开始解析出一个值
	// 		// 并在解析完成后把i指向解析结束后的下一个位置
	// 		// 然后，返回解析出来的值
	// 		var currentChar = json[i];

	// 		//如果遇到的字符是一个"的话
	// 		if (currentChar == '"') {
	// 			return parseString();
	// 		}

	// 		//接下来是如果遇到的东西是个数字的话
	// 		//但是我们要是直接把0~9写在里面会比较乱，
	// 		//所以我们先构造一个函数用来判断是不是数字
	// 		//如果是数字的话，返回一个数字
	// 		if (isDigit(currentChar)) {
	// 			return parseNumber();
	// 		}
	// 		//如果遇到的是一个数组
	// 		if (currentChar == '[') {
	// 			return parseArray();
	// 		}

	// 		if (currentChar == '{') {
	// 			return parseObjct();
	// 		}
	// 		//如果遇到的字符是一个't'的话
	// 		if (currentChar == 't') {
	// 			return parseTrue();
	// 		}

	// 		//如果遇到的字符是一个'f'的话,说明后面是false
	// 		if (currentChar == 'f') {
	// 			return parseFalse();
	// 		}

	// 		//如果遇到的字符是一个'n'的话,说明后面是null
	// 		if (currentChar == 'n') {
	// 			return parseNull();
	// 		}
	// 	}

	// 	// 所有parseXXX的函数都从当前i指向的位置开始解析
	// 	// 解析完成后把i指向其解析完成后的下一个位置
	// 	// 然后返回解析结果

	// 	//返回一个字符串相对难理解
	// 	function parseString() {

	// 		//我们直接在json这个字符串上来查找第二个"，
	// 		//得到他的下标后就就能把属性名给找到了
	// 		//字符串.indexOf(字符，起始点)，我们给起始点设置为i+1
	// 		//这样就不会从查找第一个了
	// 		var startIndex = i;
	// 		var endIndex = json.indexOf('"', startIndex + 1);
	// 		//字符串.slice() 要从"后面一个开始slice
	// 		var string = json.slice(startIndex + 1, endIndex);
	// 		//我们要让这个指针移动到: 那个地方，所以也就是第二个"的后面一个
	// 		i = endIndex + 1
	// 		return string;
	// 	}

	// 	function parseNumber() {
	// 		var startIndex = i;
	// 		var char
	// 		for (var j = startIndex + 1;; j++) {
	// 			char = json[j];
	// 			if (!isDigit(char)) {
	// 				break;
	// 			}
	// 		}

	// 		// var numString = 从start开始，到j结束，不包含j
	// 		var numString = json.slice(startIndex, j)
	// 		i = j
	// 		return parseInt(numString)

	// 	}

	// 	function parseArray() {
	// 		i++;
	// 		var result = [];
	// 		var value;
	// 		while (true) {
	// 			//第一次parse()得到的是数组的一项
	// 			value = parse();
	// 			result.push(value);
	// 			//经历了一次parse()，i已经指向了逗号
	// 			if (json[i] == ',') {
	// 				i++;
	// 				continue;
	// 			}
	// 			if (json[i] == ']') {
	// 				break;
	// 			}
	// 		}
	// 		//接着让指针指向逗号
	// 		i++;
	// 		return result;
	// 	}

	// 	function parseObjct() {
	// 		var result = {};
	// 		i++;
	// 		var key;
	// 		var value;
	// 		while (true) {
	// 			//我假设的是对象的名为一个字符串
	// 			key = parseString();
	// 			//现在指针指向了冒号，再让i++后，指向了值
	// 			i++;

	// 			value = parse();
	// 			result[key] = value;

	// 			if (json[i] == '}') {
	// 				break;
	// 			} else {
	// 				i++;
	// 				continue;
	// 			}
	// 		}
	// 		i++;
	// 		return result;
	// 	}

	// 	//当我们遇到的是一个t的时候，我们就知道是遇到true了
	// 	//所以我们直接就返回true，但是同时我们要让指针向后走4个字符
	// 	//指到true后面的逗号
	// 	function parseTrue() {
	// 		i += 4;
	// 		return true;
	// 	}

	// 	//当我们遇到的是一个f的时候，我们就知道是遇到false了
	// 	//所以我们直接就返回false，但是同时我们要让指针向后走5个字符
	// 	//指到false后面的逗号
	// 	function parseFalse() {
	// 		i += 5;
	// 		return false;
	// 	}

	// 	//当我们遇到的是一个n的时候，我们就知道是遇到null了
	// 	//所以我们直接就返回null，但是同时我们要让指针向后走4个字符
	// 	//指到null后面的逗号
	// 	function parseNull() {
	// 		i += 4;
	// 		return null;
	// 	}

	// 	//为了让当我们遇到的是一个0~9的数字的时候，返回相应的数字
	// 	//我们需要构造一个函数来判断
	// 	function isDigit(char) {
	// 		//因为i可能指到最后一个字符的后一个位置了
	// 		//这时把char取出来的话是undefined
	// 		//比如json = `123 `
	// 		if (!char) {
	// 			return false;
	// 		}
	// 		//怎么判断一个东西是不是一个数字呢？
	// 		//我们可以拿到0和9的unicode，然后看要判断的那个东西的unicode
	// 		//是不是在他们之间
	// 		//这段代码很神奇的是，只要是个数字他就能判断是不是一个数字，几位数都可以！
	// 		//为什么呢？因为我们拿到的codeOfCurrentChar是下表为0的，所以相当于用待检测那个字符串的第一项比较
	// 		var codeof0 = '0'.charCodeAt(0);
	// 		var codeof9 = '9'.charCodeAt(0);

	// 		var codeOfCurrentChar = char.charCodeAt(0);
	// 		if (codeOfCurrentChar >= codeof0 && codeOfCurrentChar <= codeof9) {
	// 			return true;
	// 		} else {
	// 			return false;
	// 		}
	// 	}
	// },

	concat: function() {
		var result = [];
		var length = arguments.length;
		for (var i = 0; i < length; i++) {
			if (typeof arguments[i] == typeof 1) {
				result.push(arguments[i]);
			} else {
				for (var j = 0; j < arguments[i].length; j++) {
					result.push(arguments[i][j]);
				}
			}
		}
		return result;
	},

	/**
	 * 创建一个从 object 中选中的属性的对象。
	 * 注意: 这个方法对于对于空集合返回 true，因为空集合的任何元素都是 true 。
	 * 参数
	 * object (Object): 来源对象。
	 * [props] (...(string|string[])): 要被忽略的属性。（愚人码头注：单独指定或指定在数组中。）
	 * 返回值
	 * (Object): 返回新对象。
	 * 例子
	 * pick(object, ['a', 'c']);
	 * // => { 'a': 1, 'c': 3 }
	 *
	 **/
	pullAt: function() {
		//如果只输入一个参数，那么把这个变量再吐回来
		var length = arguments.length;
		//这个是为了储存从arr中删除的项
		var result = [];
		if (length == 1) {
			return arguments[0];
		}

		//如果输入的参数>1个，那么应用第二个数组限制的范围
		//从第一个中剔除出去，不包括右边界
		if (length > 1) {
			for (var i = arguments[1][0]; i < arguments[1][1]; i++) {
				result = result.concat(arguments[0].splice(i, 1));
			}
			return result;
		}
	},

	reverse: function(arr) {
		var result = [];
		for (var i = 0; i < arr.length; i++) {
			result.unshift(arr[i]);
		}
		return result;
	},

	/**
	 * 创建唯一值的数组，这个数组包含所有给定数组都包含的元素，使用 SameValueZero进行相等性比较。（愚人码头注：可以理解为给定数组的交集
	 * @param [arrays] (...Array): 待检查的数组。
	 * @returns (Array): 返回一个包含所有传入数组交集元素的新数组
	 *
	 */
	slice: function(start, end) {

		if (start === undefined) {
			start = 0
		}
		if (end === undefined) {
			end = this.length;
		}
		var result = [];
		for (var i = start; i < end; i++) {
			result.push(this[i]);
		}
		return result;
	},
}

/**
 * 根据 precision（精度） 向上舍入 number。（愚人码头注： precision（精度）可以理解为保留几位小数。）
 * 参数:
 * number (number): 要向上舍入的值。
 * [precision=0] (number): 向上舍入的的精度。
 *
 * 返回:
 * (number): 返回向上舍入的值。
 *
 * 例子:
 * ceil(4.006);
 * => 5
 *
 * ceil(6.004, 2);
 * => 6.01
 *ceil(6040, -2);
 * => 6100
 */


// function ceil(number, precision) {
// 	//如果不写精度的话，向上取整
// 	if (precision == undefined) {
// 		return parseInt(number + 1);
// 	}
// 	//写精度的话，返回新数字，保留旧数字
// 	if (precision > 0) {
// 		var newNumber = (number).toFixed(precision);
// 		return newNumber;
// 	}
// 	if (precision < 0) {
// 		var newArray = number.split('');
// 		newArray = newArray.splice[newArray.length-1+precision] =

// 	}
// }



/*
==================================================================
compact函数已完成
==================================================================
*/
/**
 * 创建一个新数组并包含原数组中所有的非假值元素。例如 false、null、 0、""、undefined 和 NaN 都是“假值”。
 * 参数:array (Array): 数组参数.
 * 返回值:(Array): 返回过滤假值后的数组.
 * 例子:
 *compact([0, 1, false, 2, '', 3]);
 * => [1, 2, 3]
 */
// function compact(arr) {
// 	function isFalseyValues(x) {
// 		var x1 = !!x;
// 		if (x1) {
// 			return false;
// 		} else {
// 			return true;
// 		}
// 	}

// 	var result = [];
// 	for (var i = 0; i < arr.length; i++) {
// 		//如果输入的是一个Falsey，什么也不做
// 		if (isFalseyValues(arr[i])) {

// 		} else {
// 			result.push(arr[i])
// 		}
// 	}
// 	return result
// }



// function isFalseyValues(x) {
// 	switch (x) {
// 		case false:
// 		case 0:
// 		case null:
// 		case "":
// 		case undefined:
// 		case NaN:
// 			return true;
// 		default:
// 			return false;
// 	}
// }
//这是写了一个函数，判断输入的一个参数是不是FalseyValues
//FalseyValues 包括 :
//The values false, null, 0, "", undefined, and NaN.
//如果输入的是一个Falsey Values，那么返回true
//例子：isFalseyValues(0) =====>true;
//undefined == undefined 并且 undefined === undefined
//但是下面的代码不行，因为NaN很恶心，NaN与任何东西运算都是NaN，
//而且NaN == NaN 是false，所以，switch行不通
//但是呢，我们绞尽脑汁会想到，用布尔值来判断
//undefined,NaN,null,'',0，这种不正常的东西的布尔值都是false
//所以，一下问题就很简单了


/*
==================================================================
concat函数完成
==================================================================
*/
/*
 *作用：创建一个新歌数组，把你传入的两个数组/值连接起来
 *参数：array (Array): 需要连接的数组,[values] (...Array): 需要连接的值
 * 返回值：(Array): 返回过滤后的数组.
 *
 * 例子:
 *var array = [1];
 * var other = concat(array, 2, [3], [[4]]);
 * console.log(other);
 * => [1, 2, 3, [4]]
 * console.log(array);
 * => [1]
 */


//用arrguments，因为参数不确定嘛
//这里出现了一个颠覆三观的bug
//var
// function concat() {
// 	var length = arguments.length;
// 	var result = arguments[0];
// 	for (var i = 1; i < length; i++) {
// 		if (typeof arguments[i] == typeof 1) {
// 			result.push(arguments[i]);
// 		} else {
// 			for (var j = 0; j < arguments[i].length; j++) {
// 				result.push(arguments[i][j]);
// 			}
// 		}
// 	}

// 	return result;
// }
/*
==================================================================
==================================================================
*/


/*
==================================================================
difference函数完成
==================================================================
*/

/**
 *Creates an array of unique array values not included in the other provided arrays using SameValueZero for equality comparisons. * 参数:array (Array): 数组参数.
 *array (Array): 需要过滤的数组,[values] (...Array): 数组需要排除掉的值
 * (Array): 返回过滤后的数组.
 * 例子:
 *difference([1, '2', 3], [4, 2]);
 * => [1, "2", 3]
 */

// function difference(arr1, arr2) {
// 	for (var i = 0; i < arr1.length; i++) {
// 		for (var j = 0; j < arr2.length; j++) {
// 			if (arr1[i] === arr2[j]) {
// 				arr1.splice(i, 1)
// 			}
// 		}
// 	}
// 	return arr1;
// }
/*
==================================================================
==================================================================
*/


/*
==================================================================
drop函数完成
==================================================================
*/
// function drop(arr, number) {
// 	if (arguments.length == 1) {
// 		return arr;
// 	}
// 	if (arguments.length == 2) {
// 		arr.splice(0, number);
// 		return arr;
// 	}
// }


/*
==================================================================
dropRight函数完成
==================================================================
*/
// function dropRigh() {
// 	//先把这个数组颠倒一下，然后再操作，最后把结果再颠倒一下，再输出
// 	var result = arguments[0].reverse();
// 	if (arguments.length == 1) {
// 		result.splice(0, 1);
// 		return result.reverse();
// 	}
// 	if (arguments.length == 2) {
// 		result.splice(0, arguments[1]);
// 		return result.reverse();
// 	}
// }


/*
==================================================================
==================================================================
*/


/*
==================================================================
fill函数完成
==================================================================
*/
// function fill() {
// 	var result = [];
// 	var length = arguments[0].length;
// 	if (arguments.length == 2) {
// 		for (var j = 0; j < length; j++) {
// 			result.push(arguments[1]);
// 		}
// 		return result;
// 	}
// 	if (arguments.length == 3) {
// 		for (var i = arguments[2]; i < length; i++) {
// 			arguments[0].splice(i, 1, arguments[1]);
// 		}
// 	}
// 	if (arguments.length == 4) {
// 		for (var i = arguments[2]; i < arguments[3]; i++) {
// 			arguments[0].splice(i, 1, arguments[1]);
// 		}
// 	}
// 	return arguments[0];
// }



/*
==================================================================
flatten函数完成
==================================================================
*/
// 即如果concat方法的参数是一个元素，该元素会被直接插入到新数组中；
// 如果参数是一个数组，该数组的各个元素将被插入到新数组中；
// function flatten(arr) {
// 	var result = [];
// 	for (var i = 0; i < arr.length; i++) {
// 		result = result.concat(arr[i])
// 	}
// 	return result;
// }



/*
==================================================================
pairs函数
==================================================================
*/
//fromPairs([['a', 1], ['b', 2]]);
// => { 'a': 1, 'b': 2 }


// function fromPairs(arr) {
// 	var newObject = {};
// 	var length = arr.length;
// 	for (var i = 0; i < length; i++) {
// 		newObject[arr[i][0]] = arr[i][1];
// 	}
// 	return newObject;
// }

/*
==================================================================
indexOf函数完成

lastIndexOf([1, 2, 1, 2], 2);
// => 3

// Search from the `fromIndex`.
lastIndexOf([1, 2, 1, 2], 2, 2);
// => 1
==================================================================
*/

// function indexOf(array, vallue, fromIndex) {
// 	//第三个参数是可选的，如果没有，那么就默认为1
// 	if (fromIndex == undefined) {
// 		fromIndex = 1;
// 	}
// 	//因为我要判断想要检测的东西是第几次出现的，所以需要一个
// 	//计数器
// 	var counter = 0;
// 	for (var i = 0; i < array.length; i++) {
// 		if (array[i] == vallue) {
// 			//一旦找到了和输入的value相等的array[i]，计数器+1
// 			counter++;
// 			//只有和第三个参数相同，位数才能输出
// 			if (counter == fromIndex) {
// 				return i;
// 			}
// 		}
// 	}
// }



/*
==================================================================
initial函数完成
==================================================================
*/

// function initial(arr) {
// 	arr.splice(arr.length - 1, 1);
// 	return arr;
// }



/*
==================================================================
intersection函数未完成
==================================================================
*/



/*
==================================================================
join函数完成
==================================================================
*/

// function join(arr, separator) {
// 	var str;
// 	if (arguments.length < 2) {
// 		str = arr.join(',');
// 	}
// 	if (arguments.length >= 2) {
// 		str = arr.join(separator);
// 	}
// 	return str;
// }

/*
==================================================================
last函数完成

last([1, 2, 3]);
// => 3
==================================================================
*/

// function last(arr) {
// 	return arr[arr.length - 1];
// }



/**
 *参数
 *array (Array): 要查询的数组。
 *[n=0] (number): 要返回元素的索引值。
 *
 *返回值
 *(*): 获取array数组的第n个元素。
 *
 *例子
 *
 *var array = ['a', 'b', 'c', 'd'];
 *
 *nth(array, 1);
 *=> 'b'
 *
 *nth(array, -2);
 *=> 'c';
 *
 */


// function nth(arr, position) {
// 	//输入的位置可能是正，也可能是负
// 	if (position >= 0) {
// 		return arr[position];
// 	}
// 	//输入数字为－的时候，是从最后一位开始计数的
// 	return arr[arr.length + position];
// }


/*
==================================================================
pull函数完成
==================================================================
*/

// function pull() {
// 	var length = arguments.length;
// 	if (length == 1) {
// 		return arguments[0];
// 	}
// 	if (length > 1) {
// 		for (var i = 0; i < arguments[0].length; i++) {
// 			for (var j = 1; j < length; j++) {
// 				if (arguments[0][i] == arguments[j]) {
// 					arguments[0].splice(i, 1)
// 					j = -1; //这个是画龙点睛之笔！
// 				}
// 			}
// 		}
// 	}
// 	return arguments[0];
// }



/*
==================================================================
pullAll函数完成

var array = ['a', 'b', 'c', 'a', 'b', 'c'];

pullAll(array, ['a', 'c']);
console.log(array);
// => ['b', 'b']
==================================================================
*/

// function pullAll() {
// 	//如果只输入一个参数，那么把这个变量再吐回来
// 	var length = arguments.length;
// 	if (length == 1) {
// 		return arguments[0];
// 	}
// 	//如果输入的参数>1个，那么把第二个数组中的内容从第一个中剔除出去
// 	if (length > 1) {
// 		for (var i = 0; i < arguments[0].length; i++) {
// 			for (var j = 0; j < arguments[1].length; j++) {
// 				if (arguments[0][i] == arguments[1][j]) {
// 					arguments[0].splice(i, 1)
// 					j = -1;
// 				}
// 			}
// 		}
// 	}
// 	return arguments[0];
// }



/*
==================================================================
pullAt函数   完成

var array = ['a', 'b', 'c', 'd'];
var pulled = pullAt(array, [1, 3]);

console.log(array);
// => ['a', 'c']

console.log(pulled);
// => ['b', 'd']
==================================================================
*/

// function pullAt() {
// 	//如果只输入一个参数，那么把这个变量再吐回来
// 	var length = arguments.length;
// 	//这个是为了储存从arr中删除的项
// 	var result = [];
// 	if (length == 1) {
// 		return arguments[0];
// 	}

// 	//如果输入的参数>1个，那么应用第二个数组限制的范围
// 	//从第一个中剔除出去，不包括右边界
// 	if (length > 1) {
// 		for (var i = arguments[1][0]; i < arguments[1][1]; i++) {
//注意,concat不是在原来数组上进行操作
// 			result = result.concat(arguments[0].splice(i, 1));
// 		}
// 		return result;
// 	}
// }



/*
==================================================================
reverse函数完成
==================================================================
*/
// function reverse(arr) {
// 	arr = arr.reverse();
// 	return arr;
// }

// function reverse1(arr) {
// 	var result = [];
// 	for (var i = 0; i < arr.length; i++) {
// 		result.unshift(arr[i]);
// 	}
// 	return result;
// }


/*
==================================================================
split函数已完成

_.split('a-b-c', '-', 2);
// => ['a', 'b']

==================================================================
*/


// function split() {
// 	var result = [];
// 	//首先是把输入的字符串转换成数组，所以创建一个空数组，然后把字符串的
// 	//每一项push进去
// 	for (var i = 0; i < arguments[0].length; i++) {
// 		result.push(arguments[0][i])
// 	}
// 	//遍历这个数组，寻找其中和差拆分符相同的项，
// 	//然后把它从这个数组中剔除
// 	for (var j = 0; j < result.length; j++) {
// 		if (result[j] == arguments[1]) {
// 			result.splice(j, 1)
// 			j = -1;
// 		}
// 	}
// 	//剔除掉拆分符的数组要要按照保留数位进行截取
// 	result.splice(arguments[2]);
// 	return result;
// }



/*
==================================================================
tail函数完成
==================================================================
*/

// function tail(arr) {
// 	arr.splice(0, 1);
// 	return arr;
// }


/*
==================================================================
take函数完成
==================================================================
*/
// function take() {
// 	var result = [];
// 	for (var i = 0; i < arguments[1]; i++) {
// 		result.push(arguments[0][i]);
// 	}
// 	//这种方法看起来很完美，但是有一个问题，就是一旦我取得位数超出了
// 	//输入数组的长度，那么result还是会接着push进去undefined
// 	//所以要解决
// 	//那我就判断，一旦要的长度超出了我的能力，我就从我数组最后一位
// 	//的后一位开始，把undefiend都删了！因为splice是左闭右开的
// 	if (arguments[1] > arguments[0].length) {
// 		result.splice(arguments[0].length)
// 	}
// 	return result;
// }



/*
==================================================================
takeRight函数完成

_.takeRight([1, 2, 3]);
// => [3]

_.takeRight([1, 2, 3], 2);
// => [2, 3]

_.takeRight([1, 2, 3], 5);
// => [1, 2, 3]

_.takeRight([1, 2, 3], 0);
// => []
==================================================================
*/

// function takeRight() {
// 	var result = [];
// 	var a;
// 	var length = arguments[0].length;
// 	for (var i = length - 1; i >= length - arguments[1]; i--) {
// 		result.unshift(arguments[0][i]);
// 	}

// 	//有一个问题，就是一旦我取得位数超出了
// 	//输入数组的长度，那么result头部还是会接着push进去undefined
// 	//所以要解决
// 	//那我就判断，一旦要的长度超出了我的能力，我就从我数组第一位
// 	//开始，把undefiend都删了，剩下的就是正常的了因为splice是左闭右开的
// 	if (arguments[1] > arguments[0].length) {
// 		result.splice(0, arguments[1] - arguments[0].length)
// 	}
// 	return result;
// }



/*
==================================================================
union函数未完成
==================================================================
*/



// function union() {
// 	var result = [];
// 	//写一个循环，把所有的参数遍历一遍
// 	for (var i = 0; i < arguments.length; i++) {
// 		//再写个循环，把每一项的数组再遍历一遍
// 		for (var j = 0; j < arguments[i].length; j++) {
// 			//如果没有在Result数组中找到想要的东西，那么
// 			//indexOf返回-1;
// 			if (result.indexOf(arguments[i][j]) == -1) {
// 				result.push(arguments[i][j])
// 			}
// 		}
// 	}
// 	return result;
// }



/*
==================================================================
uniq函数完成
==================================================================
*/
//其实就是数组去重
// function uniq(arr) {
// 	var result = [];
// 	for (var i = 0; i < arr.length; i++) {
// 		//result一开始为空数组，里面没有的，就推进去
// 		if (result.indexOf(arr[i]) == -1) {
// 			result.push(arr[i]);
// 		}
// 	}
// 	return result;
// }

/**
 * 这个方法类似于zip，除了它接收分组元素的数组，
 * 并且创建一个数组，分组元素到打包前的结构。
 * （愚人码头：返回数组的第一个元素包含所有的输入数组的第一元素，
 * 第一个元素包含了所有的输入数组的第二元素，依此类推。）
 *
 *
 * 参数
 * [arrays] (...Array): 要处理的数组。
 *
 * 返回
 * (Array): 返回分组元素的新数组。
 *
 * 例子
 *
 * zip(['fred', 'barney'], [30, 40], [true, false]);
 * => [
 	['fred', 30, true],
 	['barney', 40, false]
 ]
 *
 * unzip(zipped);
 * => [['fred', 'barney'], [30, 40], [true, false]]
 *
 */


// function unzip() {
// 	//看arguments每项的长度，判断需要几个数组
// 	var result = [];
// 	for (var i = 0; i < arguments[0].length; i++) {
// 		result.push([]);
// 	}

// 	//把传入的参数拆分到每个数组
// 	for (var i = 0; i < arguments.length; i++) {
// 		for (var j = 0; j < arguments[i].length; j++) {
// 			result[j][i] = arguments[i][j]
// 		}
// 	}
// 	return result;
// }



/**
 * 创建一个分组元素的数组，数组的第一个元素包含所有给定数组的第一个元素，数组的
 * 第二个元素包含所有给定数组的第二个元素，以此类推。
 *
 * 参数
 * [arrays] (...Array): 要处理的数组。
 *
 * 返回
 * (Array): 返回分组元素的新数组。
 *
 * 例子
 *
 * zip(['fred', 'barney'], [30, 40], [true, false]);
 * => [['fred', 30, true], ['barney', 40, false]]
 *
 */

// function zip() {
// 	//先把框架列好
// 	var result = [
// 			[],
// 			[]
// 		]
// 		//往框架里面塞东西
// 	for (var i = 0; i < arguments.length; i++) {
// 		for (var j = 0; j < arguments[i].length; j++) {
// 			result[j][i] = (arguments[i][j]);
// 		}
// 	}
// 	return result;
// }



/*
==================================================================
head函数完成
==================================================================
*/
// function head(arr) {
// 	return arr[0];
// }



/*
==================================================================
capitalize函数完成

capitalize('FRED');
// => 'Fred'
==================================================================
*/

// function capitalize(str) {
// 	//首先把所有的字母变成小写
// 	var str = str.toLowerCase();
// 	//把第一个字母大写，然后和后面的拼接起来
// 	var newStr = str[0].toUpperCase();
// 	for (var i = 1; i < str.length; i++) {
// 		newStr += str[i];
// 	}
// 	return newStr;
// }


/**
 * 参数
 *
 *[string=''] (string): 要检索的字符串。
 *[target] (string): 要检索字符。
 *[position=string.length] (number): 检索的位置。
 *
 * 返回
 *
 * (boolean): 如果字符串string以target字符串结尾，那么返回 true，否则返回 false。
 *
 * 例子
 *
 * endsWith('abc', 'c');
 * => true
 *
 *	endsWith('abc', 'b');
 *	// => false
 *
 *	endsWith('abc', 'b', 2);
 *	// => true
 */

// function endsWith(str, target, position) {
// 	//如果没给位置，默认为第一个
// 	if (position == undefined) {
// 		position = str.length;
// 	}
// 	var counter = 0;
// 	for (var i = 0; i < str.length; i++) {
// 		counter++;
// 		if ((str[i] == target) && (counter == position)) {
// 			return true;
// 		}
// 	}
// 	return false;
// }



/**
 * 参数
 *
 *[string=''] (string): 要检索的字符串。
 *[target] (string): 要检索字符。
 *[position=string.length] (number): 检索的位置。
 *
 * 返回
 *
 * (boolean): 如果字符串string以target字符串结尾，那么返回 true，否则返回 false。
 *
 * 例子
 *
 * endsWith('abc', 'c');
 * => true
 *
 *	endsWith('abc', 'b');
 *	// => false
 *
 *	endsWith('abc', 'b', 2);
 *	// => true
 */



/**
 * 参数
 *
 * [string=''] (string): 待替换的字符串。
 * pattern (RegExp|string): 要匹配的内容。
 * replacement (Function|string): 替换的内容。
 * 返回
 *
 * (string): 返回替换后的字符串
 *
 * 例子
 *
 * replace('Hi Fred', 'Fred', 'Barney');
 *  => 'Hi Barney'
 */

// function replace() {
// 	var array = arguments[0].split(' ');
// 	for (var i = 0; i < array.length; i++) {
// 		if (array[i] == arguments[1]) {
// 			array[i] = arguments[2];
// 		}
// 	}
// 	arguments[0] = array.join(' ');
// 	return arguments[0];
// }


/**
 *参数
 *
 *string (string): 要转换的字符串。
 *[radix=10] (number):转换基数。
 *返回
 *
 *(number): 返回转换后的整数。
 *
 *例子
 *
 *parseInt('08');
 *=> 8
 *
 *map(['6', '08', '10'], _.parseInt);
 *=> [6, 8, 10]
 */

// function parseInt() {

// }


/**
 *参数
 *
 *array (Array): 要搜索的数组。
 *value (*): 要搜索的值。
 *[fromIndex=array.length-1] (number): 开始搜索的索引值。
 *
 *返回值
 *(number): 返回匹配值的索引值，否则返回 -1。
 *
 *例子
 *
 *lastIndexOf([1, 2, 1, 2], 2);
 * => 3
 *
 *lastIndexOf([1, 2, 1, 2], 2, 2);
 *=> 1
 */

// function lastIndexOf(array, value, fromIndex) {
// 	var newArray = DongLiang.reverse(array);
// 	var index = DongLiang.indexOf(newArray, value, fromIndex);
// 	return array.length - 1 - index;
// }



/**
 *参数
 *
 *[arrays] (...Array): 要检查的数组。
 *
 *
 *返回值
 *(Array): 返回过滤值后的新数组。
 *
 *例子
 *
 * xor([2, 1], [2, 3]);
 * => [1, 3]
 *
 */
