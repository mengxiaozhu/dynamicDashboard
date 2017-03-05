eval({
    label: "标签管理",
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
        ready: function (ctx) {
            var self = ctx("this")
            self.config.funcs.get(ctx, "cgi-bin/groups/get", {}, function (data) {
                self.config.children.groups.options = data.groups.map(function (item) {
                    return item;
                })
            })
        }
    },
    children: {
        getButton: {
            name: "test",
            type: "ButtonItem",
            label: "全部标签",
            func: function (ctx) {
                var self = ctx("this")
                self.config.funcs.get(ctx, "cgi-bin/groups/get", {}, function (data) {
                    self.config.children.groups.options = data.groups.map(function (item) {
                        return item;
                    })
                })
            }
        },
        groups: {
            type: "SelectItem",
            label: "分组",
            options: []
        },
        //getUserButton: {
        //    name: "test",
        //    type: "ButtonItem",
        //    label: "用户列表",
        //    func: function (ctx) {
        //        var self = ctx("this")
        //        self.config.funcs.get(ctx, "cgi-bin/user/get", {}, function (data) {
        //            self.config.children.resultList.items = data.data.openid.map(function (item) {
        //                return item;
        //            })
        //        })
        //    }
        //},
        resultList: {
            type: "ListItem",
            label: "列表",
            items: [],
        }

    }
})
