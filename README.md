Zlock.js H5手势密码
===
Zlock.js 手势密码, 移动端轻量级插件
`移动端`下展示效果
![移动端图片显示](https://github.com/mrzxc/Zlock/tree/master/test/img/demo.gif)
#### [DEMO查看](https://mrzxc.github.io/Zlock/test/index.html)
功能列表
----
* 支持n维矩阵
* 支持颜色配置
* 对外提供良好的接口
* 通过gulp构建
* 代码分工明确,易扩展维护


使用方法  
------  
### 引入js, 初始化密码保存对象(pwdArr), 并初始化Zlock对象  
```javascript  
var zlock = new Zlock({
        matrixNum: 3,                               //矩阵为 matrixNum * matrixNum 默认为 3 * 3矩阵
        bdColor: "rgba(16,16,16,0.8)",              //背景蒙层色 默认为 rgba(16,16,16,0.8)
        solidColor: "#ccccdd",                      //连接线的颜色 默认值 为 "#ccccdd" 
        selectedColor: "rgba(255,255,255,0)",       //选择后的空心圆颜色 默认为透明且透过蒙层
        errorColor: "#ee6666",                      //调用error()方法实现的颜色 默认值为 "#ee6666"
        successColor: "#5bc0de",                    //调用seccess()方法显示的颜色 默认值为 "#5bc0de"
        canvasId: "lock",                           //canvas id
        pwdObj: pwdObj                              //接口对象 后续介绍                            
    });
```
### 关于pwdObj接口对象
* 接口对象必须拥有pwdArr数组, 用户绘制密码会返回到pwdArr对象中
* 调用方法请使用setter方法 如有疑问请移步[Object.defineProperty() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) 以及ES6语法[setter - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/set)
* Zlock类提供了两个状态函数 error() 和 seccess() 以控制密码验证状态