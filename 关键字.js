eval({
    label: "关键字",
    tmp: {},
    ds: {modules: {3: "课表", 4: "成绩", 24: "评教"}},
    funcs: {
        get: function (ctx, url, data, handler) {
            var self = ctx("this")
            ctx("http")("get", "/api/mp/dynamic/cgi", {
                params: {
                    mpId: ctx("mp").id,
                    api: url,
                    data: JSON.stringify(data)
                }
            }).then(function (resp) {
                var list = (JSON.parse(resp.json().data))
                handler(list)
            })

        },
        db: function (ctx, table, method, params, handler) {
            params["mpId"] = ctx("mp").id
            ctx("http")("get", "/api/mp/dynamic/db/" + table + "/" + method, {
                params: params
            }).then(function (resp) {
                handler(resp.json().data)
            })
        },

        module: function (modules, id) {
            return modules[id]
        },


        ready: function (ctx) {
            var self = ctx("this")
            var options = []
            for (var id in self.config.ds.modules) {
                var name = self.config.ds.modules[id]
                options.push({name: name, value: id})
            }
            self.config.children.moduleSelect.options = options;
            self.config.funcs.db(ctx, "keywords", "list", {}, function (keywords) {
                self.config.children.keywordsList.items = keywords.map(function (keyword) {
                    return keyword.regexp + "->" + self.config.funcs.module(self.config.ds.modules, keyword.moduleId)
                })
            })


        }
    },
    children: {
        keywordsList: {type: "ListItem", label: "关键字列表", items: []},
        regexpInput: {type: "InputItem", label: "新关键字规则(正则)", value: ""},
        moduleSelect: {type: "SelectItem", label: "新关键字模块", options: []},
        addButton: {
            type: "ButtonItem", label: "添加关键字", func: function (ctx) {
                var self = ctx("this")
                self.config.funcs.db(ctx, "keywords", "add", {
                    moduleID: self.config.children.moduleSelect.value,
                    regexp: self.config.children.regexpInput.value
                }, function () {
                    self.config.funcs.ready(ctx)
                })
            }
        }
    }
})
