eval({
  label: "标签管理",
  funcs: {
      datacube: function (ctx, api, mapper) {
          var self = ctx("this")
          ctx("http")("get", "/api/mp/dynamic/cgi", {
              params: {
                  mpId: ctx("mp").id,
                  api: api,
                  data: JSON.stringify({
                      "begin_date": self.config.children.beginDate.value,
                      "end_date": self.config.children.endDate.value
                  })
              }
          }).then(function (resp) {
              var list = (JSON.parse(resp.json().data)).list
              ctx("this").config.children.resultList.items = list.map(mapper)

          })
      }
  },
  children: {
      beginDate: {
          type: "InputItem",
          label: "开始时间",
          value: "2017-03-01",
      },
      endDate: {
          type: "InputItem",
          label: "结束时间",
          value: "2017-03-02",
      },
      resultList: {
          type: "ListItem",
          label: "列表",
          items: [],
      },

      userSummaryButton: {
          name: "test",
          type: "ButtonItem",
          label: "用户增长",
          func: function (ctx) {
              var self = ctx("this")
              self.config.funcs.datacube(ctx, "datacube/getusersummary", function (item) {
                  return JSON.stringify(item)
              })
          }
      },

      userCumulateButton: {
          name: "test",
          type: "ButtonItem",
          label: "用户总数",
          func: function (ctx) {
              var self = ctx("this")
              self.config.funcs.datacube(ctx, "datacube/getusercumulate", function (item) {
                  return JSON.stringify(item)
              })
          }
      }
  }
})
