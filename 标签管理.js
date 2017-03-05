eval({
    label: "标签管理",
    funcs: {
        get: function (ctx, mapper) {
            var self = ctx("this")
            ctx("http")("get", "/api/mp/dynamic/cgi", {
                params: {
                    mpId: ctx("mp").id,
                    api: "cgi-bin/groups/get",
                    data: JSON.stringify({})
                }
            }).then(function (resp) {
                var list = (JSON.parse(resp.json().data)).groups
                ctx("this").config.children.resultList.items = list.map(mapper)

            })
        }
    },
    children: {
        resultList: {
            type: "ListItem",
            label: "列表",
            items: [],
        },
        getButton: {
            name: "test",
            type: "ButtonItem",
            label: "全部标签",
            func: function (ctx) {
                var self = ctx("this")
                self.config.funcs.get(ctx, function (item) {
                    return JSON.stringify(item)
                })
            }
        },
    }
})
