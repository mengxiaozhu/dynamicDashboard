eval({
    label: "自检程序",
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
            var invalidURL = function (url) {
                return url.indexOf("wechat.mengxiaozhu.cn") !== -1 && url.indexOf("wx/create") === -1
            }
            // 检查菜单
            self.config.funcs.get(ctx, "cgi-bin/menu/get", {}, function (data) {
                var menuError = "正常"
                menuError = data.menu.button.map(function (button) {
                    if (!button && button.url && invalidURL(button.url)) {
                        return "菜单[" + button.name + "]含有非法链接,回导致串号等问题!"
                    }
                    return button.sub_button.map(function (sub_button) {
                        if (sub_button.url && invalidURL(sub_button.url)) {
                            return "菜单[" + button.name + "/" + sub_button.name + "]含有非法链接,回导致串号等问题!"
                        } else {
                            return "";
                        }
                    }).join("")
                }).join("")
                self.config.children.errorPage.children.menuError.value = menuError || "正常"
            })
            // 检查模板消息
            self.config.funcs.get(ctx, "cgi-bin/template/get_industry", {}, function (data) {
                var templateError = "无"
                if (!data.primary_industry && !data.secondary_industry) {
                    templateError = data.errmsg
                }
                if (data.primary_industry && data.primary_industry.first_class != "教育" && data.secondary_industry && data.secondary_industry.first_class != "教育") {
                    templateError = "模板行业选择有误,无法开启推送模板"
                }
                self.config.children.errorPage.children.templateError.value = templateError || "正常"
            })
        }
    },
    children: {
        errorPage: {
            type: "PageItem",
            label: "检测结果",
            children: {
                menuError: {type: "InputItem", label: "菜单", value: "检测中"},
                templateError: {type: "InputItem", label: "模板", value: "检测中"}
            },
        },
    }
})
