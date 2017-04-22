eval({
    label: "微信小程序",
    funcs: {
        doGET: function (ctx, api, cb) {
            var self = ctx("this")
            ctx("http")("get", "/api/mp/dynamic/cgi", {
                params: {
                    mpId: ctx("mp").id,
                    method: "GET",
                    api: api,
                }
            }).then(function (resp) {
                cb(resp.json().data)

            })
        },
        commit: function (ctx, api, json, cb) {
            var self = ctx("this")
            ctx("http")("get", "/api/mp/dynamic/cgi", {
                params: {
                    mpId: ctx("mp").id,
                    api: api,
                    data: json ? JSON.stringify(json) : null,
                }
            }).then(function (resp) {
                cb(JSON.parse(resp.json().data))

            })
        }
    },
    children: {
        commitAPI: {
            name: "api",
            type: "ButtonItem",
            label: "第一步.修改后端",
            func: function (ctx) {
                var self = ctx("this")
                self.config.funcs.commit(ctx, "wxa/modify_domain", {
                    "action": "set",
                    "requestdomain": ["https://v2m.mengxiaozhu.cn"],
                    "wsrequestdomain": ["wss://v2m.mengxiaozhu.cn"],
                    "uploaddomain": ["https://v2m.mengxiaozhu.cn"],
                    "downloaddomain": ["https://v2m.mengxiaozhu.cn"],
                }, function (r) {
                    console.log(r);
                })
            }
        },
        injectButton: {
            name: "inject",
            type: "ButtonItem",
            label: "第二步.上传小程序代码",
            func: function (ctx) {
                var self = ctx("this")
                ctx("http")("get", "/api/mp/applet/inject", {
                    params: {
                        mpId: ctx("mp").id,
                        templateID: 2,
                    }
                }).then(function (resp) {
                    self.config.children.previewButton.func(ctx)
                })
            }
        },
        previewButton: {
            name: "preview",
            type: "ButtonItem",
            label: "第三步.预览",
            func: function (ctx) {
                var self = ctx("this")
                self.config.funcs.doGET(ctx, "wxa/get_qrcode", function (r) {
                    console.log(r);
                    if (r.indexOf("{") != -1) {
                        return
                    }
                    self.config.children.previewHTML.html = '<div><figure class="image is-128x128"><img src="data:image/png;base64,' + r + '"/></figure></div>'

                })
            }
        },
        previewHTML: {type: "SlotItem", html: ""},
        reviewButton: {
            name: "review",
            type: "ButtonItem",
            label: "第四步.提审",
            func: function (ctx) {
                var self = ctx("this")
                ctx("http")("get", "/api/mp/applet/review/submit", {
                    params: {
                        mpId: ctx("mp").id,
                    }
                }).then(function (resp) {
                    alert(JSON.stringify(resp.json().data))
                })
            }
        },

        auditStatusButton: {
            name: "auditStatus",
            type: "ButtonItem",
            label: "第五步.审核状态",
            func: function (ctx) {
                var self = ctx("this")
                var self = ctx("this")
                ctx("http")("get", "/api/mp/applet/review/status", {
                    params: {
                        mpId: ctx("mp").id,
                    }
                }).then(function (resp) {
                    alert(JSON.stringify(resp.json().data))
                })
            }
        },
        releaseButton: {
            name: "release",
            type: "ButtonItem",
            label: "第六步.发布",
            func: function (ctx) {
                var self = ctx("this")
                ctx("http")("get", "/api/mp/applet/release", {
                    params: {
                        mpId: ctx("mp").id,
                    }
                }).then(function (resp) {
                    alert(JSON.stringify(resp.json().data))
                })
            }
        },
    }
})
