(function(w) {

    var g = {};

    //默认数据
    var defaultdata = {
        user: {
            nickname: '小明',
            age: 18,
            sex: '男',
            avatar: '../../image/photo.png'
        },
        setting: {
            translate: '智能翻译',
            mouse: {
              name: '小燕',
              value: 'xiaoyan'
            },
            voice: {
                name:'普通话',
                value:'mandarin'
              },
            wakeup: false
        },
        robot: {
            name: '小助手',
            avatar: '../../image/voice_2x.png'
        },
        chat: {
            content: [
              {
                text: '你好',
                type: 1
            }, {
                text: 'Hello',
                type: 2
            }, {
                text: '你好',
                type: 1
            }, {
                text: 'Hello',
                type: 2
            }, {
                text: '你好',
                type: 1
            }, {
                text: 'Hello',
                type: 2
            }
          ]
        }
    }

    //Object.assign兼容处理
    if (typeof Object.assign != 'function') {
        // Must be writable: true, enumerable: false, configurable: true
        Object.defineProperty(Object, "assign", {
            value: function assign(target, varArgs) { // .length of function is 2
                'use strict';
                if (target == null) { // TypeError if undefined or null
                    throw new TypeError('Cannot convert undefined or null to object');
                }

                var to = Object(target);

                for (var index = 1; index < arguments.length; index++) {
                    var nextSource = arguments[index];

                    if (nextSource != null) { // Skip over if undefined or null
                        for (var nextKey in nextSource) {
                            // Avoid bugs when hasOwnProperty is shadowed
                            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                                to[nextKey] = nextSource[nextKey];
                            }
                        }
                    }
                }
                return to;
            },
            writable: true,
            configurable: true
        });
    }
    //获取数据
    g.getData = function() {

        //获取本地数据
        var datastr = api.getPrefs({
            sync: true,
            key: 'data'
        });

        if (datastr == '') {
            api.setPrefs({
                key: 'data',
                value: JSON.stringify(defaultdata)
            }, function(ret, err) {
                return defaultdata;
                console.log('数据初始化成功');
            });
            return defaultdata;

        }

        return JSON.parse(datastr);
    }

    //保存数据
    //{ setting: { type : '普通话'}}
    g.saveData = function(key, value) {

        //修改数据
        var data = this.getData();
        var obj = Object.assign({}, data[key], value);
        data[key] = obj;

        //保存数据
        api.setPrefs({
            key: 'data',
            value: JSON.stringify(data)
        }, function(ret, err) {

            //更新数据
            api.sendEvent({
                name: 'datarefresh',
                extra: {
                    key: key, //“setting”
                    value: value //{ type： “普通话”}
                }
            });
        });
    }

    //刷新数据
    g.dataRefresh = function(app) {
        api.addEventListener({
            name: 'datarefresh'
        }, function(ret, err) {
            if (ret) {
                var key = ret.value.key;
                var obj = Object.assign({}, app.$data[key], ret.value.value);
                app.$data[key] = obj;
            } else {
                alert(JSON.stringify(err));
            }
        });

    }

    w.$tools = g;

})(window)
