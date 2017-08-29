## 用 Async/Await 基本用法

如果你之前曾经在项目中遇到过异步调用 (不管是前端还是 Node)，你一定会感慨在 JavaScript 里面处理异步是多么恶心。

一般来说，我们解决回调有三种方式：callbacks(回调)，generators(生成器) 或 promises ，Async/Await

以前我们只能通过回调函数层层嵌套，写出'三角'样式的代码，后来又演化出来很多方案，最后 Promise 以简单、易用、兼容性好取胜，但是仍然有非常多的问题。其实 JavaScript 一直想在语言层面彻底解决这个问题，在 ES6 中就已经支持原生的 Promise，还引入了 Generator 函数，终于在 ES7 中决定支持 async 和 await

在正式接触我们今天的主题之前，首先回顾一些基础。

考虑一下这个代码：
```js
function fetchList() {
  const data = fetch('http://test.com/list') // 假设这是一个真实的接口
  console.log(data)
}
fetchList()
```
按照我们大脑的预期，这段代码执行应该是【先去请求接口获取数据，然后把它赋值给 data，最后打印出来】，然而这段代码没有按照预期执行，而是打印出了 undefined。

如果我们用 await/async 改造一下，就会出现我们预期的结果:
```js
async function fetchList() {
  let data = await fetch('http://test.com/list')
  console.log(data)
}
fetchList()
```
只添加了两个关键字，就能达到我们的目的。:-D

### ES6 之前的异步 JavaScript

在我们深入学习 async 和 await 之前，有必要先了解一下 promises 。要弄懂 promises，我们需要再回到简单的回调。

在 ES6 中引入了 Promises ，并对在 JavaScript 中编写异步代码做了很大的改进。摆脱了 “回调地狱”，这让我们对 Promises 产生了一点亲切感。

回调是一个函数，可以将结果传递给函数并在该函数内进行调用，以响应任何事件。 这是JS的基础。

```js
function readFile('file.txt', (err, data) => {
  // 回调函数内部
  if (err) throw err
  console.log(data)
})
```

这是一个简单的读取、打印数据的操作，在文件完成之前进行读取是不可能的。如果这个你能接受的话，那想按顺序读取和记录五个不同的文件怎么办？

在 Promises 出现之前，为了执行顺序任务，你需要嵌套回调，如下所示：

```js
// 这就是标准的回调地狱
function combineFiles(file1, file2, file3, printFileCallBack) {
  let newFileText = ''
  readFile(string1, (text) => {
    newFileText += text
    readFile(string2, (text) => {
      newFileText += text
      readFile(string3, (text) => {
        newFileText += text
        printFileCallBack(newFileText)
      })
    })
  })
}
```

很难理解和跟踪代码。这还不包括可能出现的错误处理，比如其中一个文件不存在。

### Promise 使这种情况变的更好

这时 Promise 就派上用场了。Promise 是对尚未存在的数据进行推理的一种方法。你所不知道的 JavaScript 系列 的作者 Kyle Simpson 以异步 JavaScript 演讲而闻名。他对 Promise 的 解释 是：这就像是在快餐店里点餐。

点餐。

付钱并获得取餐小票。

等餐。

当餐准备好了，他们会叫你的单号提醒你取餐。

取餐。

正如他指出的，当你在等餐的时候，你是不可能吃你的午餐，但是你可以盼它，你可以为你的午餐做好准备。当你等餐的时候，你可以进行其它事情，即使现在没有拿到菜，但是这个午餐已经 “promise” 给你了。这就是所谓的 Promise。一个用于表示终将出现数据的对象。

```js
readFile(file1)
  .then((file1-data) => { /* do something */ })
  .then((previous-promise-data) => { /* do the next thing */ })
  .catch( /* handle errors */ )
```
这是 Promise 的语法。它主要的优点就是可以将队列事件以一种直观的方式链接在一起。虽然这个示例清晰易懂，但是还是用到了回调。Promise 只是让回调显得比较简单和更加直观。

### 最佳（且最新）方式： Async ／ Await

几年前，async 函数被纳入了 JavaScript 生态系统。截止上个月，async 函数成为了 JavaScript 语言的官方特性，并得到了广泛支持。

async 和 await 关键字基于 pormise 和 generator 做了简单的封装。本质上，它允许我们在所需的任意位置使用 await 关键字来“暂停”一个函数。

```js
async function logger() {
  // 暂停直到获取到返回数据
  let data = await fetch('http://sampleapi.com/posts')
  console.log(data)
}
```
这段代码会按照你所期望的那样运行。 它记录了来自 API 调用的数据。如果你连这个都理解困难，那我也不知道咋办了。

这样做的好处是非常直观。 你以大脑思考的方式编写代码，然后告诉代码在所需的位置暂停。

另一个好处就是可以使用 promise 不能使用的 try 和 catch ：
```js
async function logger ()  {
    try {
        let user_id = await fetch('/api/users/username')
        let posts = await fetch('/api/`${user_id}`')
        let object = JSON.parse(user.posts.toString())
        console.log(posts)
    } catch (error) {
        console.error('Error:', error)
    }
}
```
这是一个故意写错的例子，为了证明了一点：catch 将捕获在该过程中的任何步骤发生的错误。至少有 3 个地方 try 可能会失败，这是在异步代码中的一种最干净的方式来处理错误。

我们也可以使用 async 函数让循环和条件判断不再令人头疼：
```js
async function count() {
    let counter = 1
    for (let i = 0; i < 100; i++) {
        counter += 1
        console.log(counter)
        await sleep(1000)
    }
}
```

这是一个愚蠢的例子，但这将会按照预期运行并且容易阅读。 如果您在控制台中运行此操作，你会看到代码在调用 sleep 的时候暂停，下一个循环也不会等一秒钟再启动。

### 一些要注意的细节
现在，你应该已经确信 async 和 await 的美妙之处，接下来我们深入了解一些细节：

1.async 和 await 基于 promise 的。 使用 async 的函数将会始终返回一个 promise 对象。 这一点很重要，要记住，这可能是你遇到的容易犯错的地。

2.在使用 await 的时候我们暂停了函数，而非整段代码。

3.async 和 await 是非阻塞的。

4.你仍然可以使用 Promise 例如 Promise.all()。正如我们之前的例子：
```js
async function logPosts ()  {
    try {
        let user_id = await fetch('/api/users/username')
        let post_ids = await fetch('/api/posts/${user_id}')
        let promises = post_ids.map(post_id => {
            return  fetch('/api/posts/${post_id}')
        }
        let posts = await Promise.all(promises)
        console.log(posts)
    } catch (error) {
        console.error('Error:', error)
    }
}
```
5. await 只能用于被声明为 async 的函数。
因此，不能在全局范围内使用 await。

```js
// 抛出异常
function logger (callBack) {
    console.log(await callBack)
}

// 正常工作
async function logger () {
    console.log(await callBack)
}
```
现在就可以用啦

截至2017年6月，几乎所有浏览器都可以使用 async 和 await 关键字。为了确保你的代码随时可用，则需要使用 Babel 将你的 JavaScript 代码编译为旧浏览器也支持的语法。
