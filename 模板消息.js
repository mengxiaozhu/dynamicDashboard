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
                            self.config.tmp.lessonTemplateID = componentData.lessonTemplateId
                            self.config.children.lessonTemplateHTML.html = "<div><p>" + item.title + "</p><p>" + item.example + "</p></div>"
                        } else if (item.template_id == componentData.scoreTemplateId) {
                            self.config.tmp.lessonTemplateID = componentData.scoreTemplateId
                            self.config.children.scoreTemplateHTML.html = "<div><p>" + item.title + "</p><p>" + item.example + "</p></div>"
                        }
                    })
                })
            })
        },
        addTemplates(ctx){
            var self = ctx("this")
            if (self.config.children.primaryIndustry.value.indexOf("院校") === -1 && self.config.children.secondaryIndustry.value.indexOf("教育") === -1) {
                alert("请现在微信公众平台(mp.weixin.qq.com)修改行业为教育/院校,再进行模板设置操作!")
                return
            }

            self.config.funcs.read(ctx, "component", function (componentData) {
                if (!componentData.lessonTemplateId) {
                    ctx("http")("get", "/api/component/template/lesson/enable", {
                        params: {
                            mpId: ctx("mp").id
                        }
                    }).then(function (resp) {
                        alert("课表推送模板添加成功!")
                        self.config.funcs.ready()
                    })
                }

                if (!componentData.scoreTemplateId) {
                    ctx("http")("get", "/api/component/template/score/enable", {
                        params: {
                            mpId: ctx("mp").id
                        }
                    }).then(function (resp) {
                        alert("成绩推送模板添加成功!")
                        self.config.funcs.ready()
                    })
                }

                if (!!componentData.scoreTemplateId && !!componentData.lessonTemplateId) {
                    alert("课表/成绩模板正常,无需添加.")
                }
            });

        }
    },
    children: {
        primaryIndustry: {type: "InputItem", label: "主行业", value: "", readonly: true},
        secondaryIndustry: {type: "InputItem", label: "副行业", value: "", readonly: true},
        lessonTemplate: {type: "InputItem", label: "课表推送模板", value: "", readonly: true},
        lessonTemplateHTML: {type: "SlotItem", html: ""},
        scoreTemplate: {type: "InputItem", label: "成绩推送模板", value: "", readonly: true},
        scoreTemplateHTML: {type: "SlotItem", html: ""},
        templateBtn: {
            type: "ButtonItem", label: "添加课表/成绩推送模板", value: "", func: function (ctx) {
                var self = ctx("this")
                self.config.funcs.addTemplates(ctx)
            }
        },
    }
})
