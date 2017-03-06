eval({
    label: "模板消息",
    tmp: {},
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
        read: function (ctx, table, handler) {
            ctx("http")("get", "/api/mp/dynamic/db/" + table + "/read", {
                params: {
                    mpId: ctx("mp").id,
                }
            }).then(function (resp) {
                handler(resp.json().data)
            })
        },

        ready: function (ctx) {
            var self = ctx("this")
            self.config.funcs.read(ctx, "component", function (componentData) {
                self.config.children.lessonTemplate.value = componentData.lessonTemplateId
                self.config.children.scoreTemplate.value = componentData.scoreTemplateId

                self.config.funcs.get(ctx, "cgi-bin/template/get_industry", {}, function (data) {
                    self.config.children.primaryIndustry.value = data.primary_industry.first_class + "/" + data.primary_industry.second_class
                    self.config.children.secondaryIndustry.value = data.secondary_industry.first_class + "/" + data.secondary_industry.second_class
                })

                self.config.funcs.get(ctx, "cgi-bin/template/get_all_private_template", {}, function (data) {
                    data.template_list.forEach(function (item) {
                        if (item.template_id == componentData.lessonTemplateId) {
                            self.config.children.lessonTemplateHTML.html = "<div><p>" + item.title + "</p><p>" + item.example + "</p></div>"
                        } else if (item.template_id == componentData.scoreTemplateId) {
                            self.config.children.scoreTemplateHTML.html = "<div><p>" + item.title + "</p><p>" + item.example + "</p></div>"
                        }
                    })
                })
            })


        }
    },
    children: {
        primaryIndustry: {type: "InputItem", label: "主行业", value: "", readonly: true},
        secondaryIndustry: {type: "InputItem", label: "副行业", value: "", readonly: true},
        lessonTemplate: {type: "InputItem", label: "课表推送模板", value: "", readonly: true},
        lessonTemplateHTML: {type: "SlotItem", html: ""},
        scoreTemplate: {type: "InputItem", label: "成绩推送模板", value: "", readonly: true},
        scoreTemplateHTML: {type: "SlotItem", html: ""},
    }
})
