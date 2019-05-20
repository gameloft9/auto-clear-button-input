/**
 * 基于jQuery的自带清空按钮的input插件(方便以后复用)
 * 使用示例：
 * <input id="test" type="text" data-auto-clear-button>
 * 也可以通过$('#test').autoClearButtonInputInput('create');创建清空按钮
 * 说明：
 * 1、清空按钮样式支持自定义，只需提供default_input_close_button css类覆盖同名样式或者
 *    通过$.autoClearButtonInput.setDefault({
		icon: 'your-css-class'
	  });
 进行初始化设置的css类。
 * 2、支持通过jquery元素直接调用create 、destroy、show、hide等方法。例如：
 *    $('#test').autoClearButtonInput('hide'); // 隐藏清空按钮
 * Created by gameloft9 on 2019/5/15.
 */
;(function () {
    'use strict';

    /**
     * 类定义
     */
    var AutoClearButtonInput = function (element) {
        this.$element = $(element);
        this.$clearButton = null;
        // 还可以扩展别的
        this.validateFunction = null;
    };

    /**
     * 常量定义
     * */
    AutoClearButtonInput.DEFINITIONS = {
        CLEAR_BUTTON: '[data-auto-clear-button^="event"]',// 清除按钮选择器定义
        HAS_CLEAR_BUTTON: "has-clear-button", // 已经初始化过清除按钮了
        CREATE: 'create', // 创建clear-button对象
        DESTROY: 'destroy', // 销毁clear-button对象
        SHOW: 'show', // 显示清空按钮
        HIDE: 'hide', // 去掉清空按钮
        WARN: "warn", // 添加警告色
        CLEAR_WARN: "clearWarn", // 去掉警告色
        SET_VALIDATE_FUNCTION: "setValidateFunction", // 设置校验方法
        VALIDATE: "validate" // 校验input内容
    };

    /**
     * 添加方法
     * */
    AutoClearButtonInput.prototype.create = function () {
        if (this.$clearButton) {// 已经创建过，返回
            return;
        }

        var element = this.$element; // input元素
        element.css({'padding-right': '30px'});
        element.attr('data-auto-clear-button', 'true');

        // 清除按钮html+CSS
        //样式
        var cssStr = '<style type="text/css">';
        cssStr += '.input_warn{border: 1px solid #FF5151;color: #FF5151;}';
        // 关闭按钮样式，提供一个默认实现
        cssStr += '.default_input_close_button{height: 22px;width: 22px;background-size: 22px 22px;right: 23px;top:7px;}';
        cssStr += '</style>';
        var head = document.getElementsByTagName('head')[0]; //样式必须放在head里面，放body里面不起作用？
        head.innerHTML += cssStr;

        // input后面添加清除按钮
        this.$clearButton = $('<span></span>')
            .attr('aria-hidden', 'true')
            .attr('data-auto-clear-button', 'event')
            .addClass($.autoClearButtonInput.DEFAULTS.icon)
            .css({
                'cursor': 'pointer',
                'pointer-events': 'auto',
                'display': 'inline-block',
                'background-repeat': 'no-repeat',
                'background-position-x': 0,
                'background-position-y': 0,
                'position': 'relative',
                'background-image': 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAAAXNSR0IArs4c6QAAA2NJREFUWAntmd9rE0EQxydJL4UiKIJN2ipt/VGVSqkkCFUKFs2DoIJ/qaCCSC3qQ60PqT+KYq0/Uh+KiRVRkELvNPG+kTmPzV5m95JTDjqQ7mVvd+fTudm5nUmm5QulSLIpYm2j7gEn/cQG+q3gx84OvVx/R1uNBrmuR95Pj5rNP9skm82QM+BQPu/QWKFAZ04dp31DQ1YImX5tutW1V/Tmwya5nmcFkHccOnl0gkoz00bzegYGZNWH9SxBVTrHBy/70IDvJrGBm02iO0sP6Ou3793Wt7538MB+unppgbIR4SAWMPz09uJD2nVdayCTCYP5PF2rXNT6tzUwYG/evU+/YOIEJeeb+MaVyx3QEYbXk4ARlk0aFtqhA7pUu1gBw2eTcgOdiaALOsNiDIxoELXBxooFwieuHB4p0mhhWDsdOqGbxfjFgdClE4BW5ufatzZqm/S4+lw3LLJv/lyJjo0fad+/92iZPn3e7hgL3RzujCyMl4JJnJ2anKDz5dkOhVEdYdioMeiHbjBAjIDDj6Q9K/Rnq94gWJbFFFqFXX9f01qX12UGERhhTHrdwg1soHWwT56+YDZtCwawiMBrrze0C6idptBxYFkXWETgeqNzE/ACaitB9wILXWARo8Su5aGGowR8GcJtLpsLogH64bOSG2BcWMAiAuM8aytR0LxOHFjMBYvoEnz4ZmWmreoePC8uLOaDRQQmyrAu6xZuoAqyjviSkYGjzqWSUnWD8Xj49IXyWf5q1YJFtDByMFtRYeEGb2sfg2VOTI7HggaLuOmQMNqc0HSw4WgAWAi3y9VnwT8iXYBFtPDI8CFpneC+BAu4XiyNTFsEnjk9FQB1u5BgeW4v0CgLiMCoGyAV7yamsLxGHGgwgEUEhhI+i7LCcIvDN59n0W8aZ3XQo4Vo92MGI2AUOVA30Emr9TcZNYXldVToqJcUdHOhxThrxnl0ZVWfTfDG1GULDNethWUBW9/+oh02V5oNnrIxMFa6tdj/womWMNSJwsr1ykLQY+QSPBoVGRQ5/pVAF3SGxQoYr0ZUZFDkSFqgA7pUVVYuwZCpKlUxNCoyqSkGMjRaRI9UlFvD0LhOTUFbBYd/I7tFwogcTPeTwaD/Iij6sRfnlP/2k4EKntT35ONTn8n3gPts0I7lfgOlutd4Y0SEtwAAAABJRU5ErkJggg==")'
            });
        element.after(this.$clearButton);
        element.addClass(AutoClearButtonInput.DEFINITIONS.HAS_CLEAR_BUTTON); // 标记已经初始化过清除按钮

        // 控制显示隐藏
        var btn = this.$clearButton;
        btn.hide(); // 初始化隐藏
        this.$clearButton.prev('input').on("input", function () {
            var $input = $(this);
            var content = $input.val();
            if (content === null || typeof content === 'undefined' || content === "") {
                btn.hide();// 无内容隐藏清空按钮
                $input.autoClearButtonInput(AutoClearButtonInput.DEFINITIONS.CLEAR_WARN);
                return;
            }

            btn.show();// 有内容则显示清空按钮
        });
    };

    /**
     * 销毁
     * */
    AutoClearButtonInput.prototype.destroy = function () {
        var element = this.$element;

        element.attr('data-auto-clear-button', 'false');

        this.$clearButton.remove();
        this.$clearButton = null;
    };

    /**
     * 显示
     * */
    AutoClearButtonInput.prototype.show = function () {
        if (this.$clearButton) {
            this.$clearButton.css({'display': 'block'});
        }
    };

    /**
     * 隐藏
     * */
    AutoClearButtonInput.prototype.hide = function () {
        if (this.$clearButton) {
            this.$clearButton.css({'display': 'none'});
        }
    };

    /**
     * 警告
     * */
    AutoClearButtonInput.prototype.warn = function () {
        if (this.$clearButton) {
            this.$clearButton.prev('input').addClass("input_warn")
        }
    };

    /**
     * 去掉警告
     * */
    AutoClearButtonInput.prototype.clearWarn = function () {
        if (this.$clearButton) {
            this.$clearButton.prev('input').removeClass("input_warn");
        }
    };

    /**
     * 设置校验方法
     * */
    AutoClearButtonInput.prototype.setValidateFunction = function (validateFunction) {
        this.validateFunction = validateFunction;
    };

    /**
     * 校验内容
     * */
    AutoClearButtonInput.prototype.validate = function () {
        if (!$.autoClearButtonInput.DEFAULTS.enableValidation) {
            // 关闭校验功能
            return true;
        }

        if (this.validateFunction) {
            var content = this.$clearButton.prev('input').val();
            var valid = this.validateFunction(content);// 调用校验方法

            if (valid) {
                this.$clearButton.prev('input').autoClearButtonInput(AutoClearButtonInput.DEFINITIONS.CLEAR_WARN);
            } else {
                this.$clearButton.prev('input').autoClearButtonInput(AutoClearButtonInput.DEFINITIONS.WARN);
            }

            return valid;
        }
    };


    /**
     * 插件入口
     * @param method 要调用的方法名
     */
    function Plugin(method,param) {
        var $this = $(this);
        var instance = $this.data('clearButtonInstance'); // 获取ClearButton实例

        if (!instance) {
            // 没有则创建一个存起来
            instance = new AutoClearButtonInput(this);
            $this.data('clearButtonInstance', instance);
        }

        // 方法调用支持'create' 'destroy' 'show' 'hide'
        if (typeof method === 'string') {
            instance[method](param);
        }
    }

    /**
     * 给jQuery挂一个autoClearButtonInput方法，设置默认配置
     * */
    $.autoClearButtonInput = function (options) {
        this.options = $.extend(true, {}, $.autoClearButtonInput.DEFAULTS, options);
    };

    /**
     * 扩展pureCleanButton对象
     * */
    $.extend($.autoClearButtonInput, {
        // 默认配置
        DEFAULTS: {
            // 关闭icon，可以自己实现该CSS类进行覆盖，或者通过setDefault另外设置一个
            icon: 'default_input_close_button',
            // 是否启用校验功能
            enableValidation: false
        },
        // 设置配置，如果有同名会覆盖默认的
        setDefault: function (settings) {
            $.extend($.autoClearButtonInput.DEFAULTS, settings);
        }
    });

    // 挂到元素对象上
    $.fn.autoClearButtonInput = Plugin;
    $.fn.autoClearButtonInput.Constructor = AutoClearButtonInput;

    /**
     * 如果有冲突让出autoClearButtonInput变量
     */
    var old = $.fn.autoClearButtonInput;
    $.fn.autoClearButtonInput.noConflict = function () {
        $.fn.autoClearButtonInput = old;
        return this;
    };

    /**
     * 处理清除按钮点击事件
     * 用$(document).on()可以处理动态添加的元素
     */
    $(document).on('click', AutoClearButtonInput.DEFINITIONS.CLEAR_BUTTON, function (e) {
        var $btn = $(e.target);
        var $input = $(this).prev("input");

        // 清空并聚焦
        $input.val("").focus();
        // 清除警告
        $input.autoClearButtonInput(AutoClearButtonInput.DEFINITIONS.CLEAR_WARN);
        // 隐藏清除按钮
        $btn.hide();
    });

    /**
     * 实现通过属性创建清空按钮机制
     * */
    $(window).on('load', function () {
        $.each($("input:text,input[type='tel']"),// 类型可以扩展
            function (index, element) {
                var $element = $(element);

                // 跳过没有添加data-auto-clear-button属性、或者属性=false，或者已经初始化了的元素
                if ((typeof $element.attr("data-auto-clear-button") === 'undefined'
                    || $element.attr("data-auto-clear-button") === 'false') && !$element.hasClass(AutoClearButtonInput.DEFINITIONS.HAS_CLEAR_BUTTON)) {
                    return;
                }

                // 初始化添加清空按钮
                Plugin.call($element, AutoClearButtonInput.DEFINITIONS.CREATE);
            });
    });
})(jQuery);
