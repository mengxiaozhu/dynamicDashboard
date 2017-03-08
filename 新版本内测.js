eval({
    label: "新版本内测",
    tmp: {},
    funcs: {
        read: function (ctx, table, handler) {
            ctx("http")("get", "/api/mp/dynamic/db/" + table + "/read", {
                params: {
                    mpId: ctx("mp").id,
                }
            }).then(function (resp) {
                handler(resp.json().data)
            })
        },
        write: function (ctx, table, key, value, handler) {
            ctx("http")("get", "/api/mp/dynamic/db/" + table + "/write", {
                params: {
                    mpId: ctx("mp").id,
                    key: key,
                    value: value,
                }
            }).then(function (resp) {
                handler(resp.json().data)
            })
        },


        ready: function (ctx) {
            var self = ctx("this")
            self.config.funcs.read(ctx, "component", function (component) {
                self.config.children.versionInput.value = component.grayVersion
            })
        }
    },
    children: {
        versionInput: {type: "InputItem", label: "当前版本", value: ""},
        version2Button: {
            type: "ButtonItem", label: "切换为旧版(v2)", func: function (ctx) {
                var self = ctx("this")
                self.config.funcs.write(ctx, "component", "gray_version", "2", function () {
                    self.config.funcs.ready(ctx)
                })
            }
        },
        version3Button: {
            type: "ButtonItem", label: "切换为新版(v3)", func: function (ctx) {
                var self = ctx("this")
                self.config.funcs.write(ctx, "component", "gray_version", "3", function () {
                    self.config.funcs.ready(ctx)
                })
            }
        }
    }
})
