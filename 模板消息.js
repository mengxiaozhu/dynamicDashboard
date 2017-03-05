eval({
    label: "模板消息",
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
            self.config.funcs.get(ctx, "cgi-bin/template/get_industry", {}, function (data) {
                self.config.children.primaryIndustry.value = data.primary_industry.first_class + "/" + data.primary_industry.second_class
                self.config.children.secondaryIndustry.value = data.secondary_industry.first_class + "/" + data.secondary_industry.second_class
            })
        }
    },
    children: {
        primaryIndustry: {type: "InputItem", label: "主行业", value: "",},

        secondaryIndustry: {type: "InputItem", label: "副行业", value: "",},
    }
})
