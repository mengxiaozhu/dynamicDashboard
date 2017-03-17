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

        loadModulesToSelect: function (ctx) {
            var context = ctx()
            var self = context.me
            var select = context.select
            // 获取所有模块
            self.sdk.db.base("module", "list", {}, function (modules) {
                var ms = {}
                modules.forEach(function (module) {
                    ms[module.id] = module.name
                })
                self.config.ds.modules = ms
                var options = []
                for (var id in self.config.ds.modules) {
                    var name = self.config.ds.modules[id]
                    options.push({name: name, value: id})
                }
                self.config.children.moduleSelect.options = options;
            })
        },


        ready: function (ctx) {
            var context = ctx()
            var self = context.me
            var select = context.select

            self.config.funcs.loadModulesToSelect(ctx)

            // 获取现有关键字
            self.sdk.db.base("keywords", "list", {}, function (keywords) {
                keywords = keywords.filter(function (keyword) {
                    return !keyword.deletedTime
                })
                self.config.children.keywordsList.items = keywords.map(function (keyword) {
                    return keyword.regexp + "->" + self.config.funcs.module(self.config.ds.modules, keyword.moduleId)
                })

                var options = {}

                select("toDeleteSelect").options = keywords.map(function (keyword) {
                    return {name: keyword.regexp, value: keyword.id}
                })
            })


        }
    },
    children: {
        keywordsList: {type: "ListItem", label: "关键字列表", items: []},
        toDeleteSelect: {type: "SelectItem", label: "需要删除的关键字", options: []},
        deleteButton: {
            type: "ButtonItem", label: "删除这个关键字", func: function (ctx) {
                var context = ctx()

                var me = context.me
                var sdk = me.sdk
                var select = context.select
                var funcs = context.funcs
                sdk.db.base("keywords", "remove", {id: select("toDeleteSelect").value}, function () {
                    funcs.ready(ctx)
                })
            }
        },
        regexpInput: {type: "InputItem", label: "新关键字规则(正则)", value: ""},
        moduleSelect: {type: "SelectItem", label: "新关键字模块", options: []},
        addButton: {
            type: "ButtonItem", label: "添加关键字", func: function (ctx) {
                var self = ctx("this")
                var regexp = self.config.children.regexpInput.value
                var moduleID = self.config.children.moduleSelect.value
                if (!moduleID || !regexp) {
                    alert("无效输入")
                    return
                }
                self.config.funcs.db(ctx, "keywords", "add", {
                    moduleID: moduleID,
                    regexp: regexp
                }, function () {
                    self.config.funcs.ready(ctx)
                })
            }
        }
    }
})
