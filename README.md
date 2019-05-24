# auto-clear-button-input
自带清除按钮的输入框插件

输入框自带清除按钮是很常见的需求了，网上有很多方案，最基础的是原生实现input和清除按钮，然后绑定一大堆事件，此种方案非常原始，而且复用性极差。稍微好点的方案有基于bootstrap和jQuery的，将input和清除按钮集成起来，但样式依赖bootstrap，加重了文件引入数，而且很容易有jQuery版本不兼容的问题。这里提供一个插件，仅依赖jQuery，我们实现的功能有：  
1、以一种很简单的方式提供清除按钮的创建  
2、可自定义清除按钮样式  
3、支持一些常用功能，例如显示，隐藏、显示警告色等  
4、为input提供简单的校验功能  
5、提供清除按钮点击回调功能

### 使用示例
#### 1、创建清除按钮
为input元素添加data-auto-clear-button属性，这样就会自动创建清除按钮，如下所示：
```html
<input data-auto-clear-button id="mobile" type="tel" placeholder="请输入您注册的手机号"/>
或者
<input data-auto-clear-button="true" id="mobile" type="tel" placeholder="请输入您注册的手机号"/>
```
##### 效果图：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190520171830861.png)
也可以在需要的时候，通过js创建：
```javascript
$('#mobile').autoClearButtonInput('create');
```
#### 2、自定义清除按钮样式
插件自带一个清除按钮样式，但是你也可以自己定义清除按钮样式。方法是通过setDefaut方法设置icon为自定义的清除按钮样式。
```js
$.autoClearButtonInput.setDefault({
	 icon: 'your-close-button-css-class' // 自定义清除按钮样式
});
```
#### 3、常用方法
插件提供了一些常用方法，如下所示：
```js
1、创建清除按钮
$('#mobile').autoClearButtonInput('create');
2、销毁按钮
$('#mobile').autoClearButtonInput('destroy');
3、显示清除按钮
$('#mobile').autoClearButtonInput('show');
4、隐藏清除按钮
$('#mobile').autoClearButtonInput('hide');
5、显示警告
$('#mobile').autoClearButtonInput('warn');
6、清除警告
$('#mobile').autoClearButtonInput('clearWarn');
7、设置校验方法
$('#mobile').autoClearButtonInput('setValidateFunction',function(data){});
8、校验内容
$('#mobile').autoClearButtonInput('validte');
```
#### 4、默认设置
该插件提供了两个默认设置：
|icon|enableValidation|
|--|--|
|自定义关闭按钮样式类|是否启用校验功能|
可以通过setDefault方法更改默认配置：
```js
 $.autoClearButtonInput.setDefault({
            icon: 'my_input_close_button', // 自定义关闭按钮样式
            enableValidation: true // 关闭校验功能，默认关闭
        });
```

#### 5、校验功能
该插件提供了简单的校验功能，默认是关闭的，启用方法参考第4节内容。我们可以通过setValidationFunction方法，自定义校验逻辑，返回结果即可。
```js
$('#mobile').autoClearButtonInput('setValidateFunction',function(data){
		       return checkPhone(data); // 校验逻辑，自行实现，返回true or false
        })
```
然后通过validate方法进行校验：
```js
var isValid = $('#mobile').autoClearButtonInput("validate");
```
当校验不通过时，输入框会变红，如下所示：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190520173546408.png)
