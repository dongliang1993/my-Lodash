## 原博文地址: http://cheng.logdown.com/posts/2016/03/26/683329
 当我们像下面这样使用 React 的 ES6 class 语法创建一个组件的时候：
```js
class MyClass extends React.component {
    constructor(){
        super()
    }
}
```
不禁会提出两个问题：
  1. 在constructor里面调用super是否是必要的？
  2. super与super(props)的区别？


### 解答一：
如果存在 constructor , 必须调用super，如果没有，则不用

举个栗子：

如果在你声明的组件中存在 constructor ，则必须要加 super，
```js
class MyClass extends React.component {
    render(){
        return <div>Hello { this.props.world }</div>
    }
}
```
这段代码完美无误，你不需要为之去调用super，然而，如果在你的代码中存在 consturctor ，那你必须调用：
```js
class MyClass extends React.component {
    constructor(){
        console.log(this) //Error: 'this' is not allowed before super()

    }
}
```
之所以会报错，是因为若不执行super，则this无法初始化。

你也许会抱着侥幸心理猜测：那我直接写个空的constructor就得了呗~，然而，在ES6中的class语法中，只要你的class是子类，那必须得调用super，换句话说，有constructor就得有super（当然，子类也可以没有constructor）

### 解答二

仅当你想在 constructor 内使用 props 才将 props 传入 super 。React 会自行 props 设置在组件的其他地方（以供访问）。
将 props 传入 super 的作用是可以使你在 constructor 内访问它：
```js
class MyClass extends React.component{
    constructor(props){
        super()
        console.log(this.props) // this.props is undefined

    }
}
```
完善后：
```js
class MyClass extends React.component{
    constructor(props){
        super(props)
        console.log(this.props) // prints out whatever is inside props

    }
}
```
如果你只是想在别处访问它，是不必传入props的，因为React会自动为你设置好：
```js
class MyClass extends React.component{
    render(){
        // There is no need to call `super(props)` or even having a constructor

        // this.props is automatically set for you by React

        // not just in render but another where else other than the constructor

        console.log(this.props)  // it works!

    }
}
```
