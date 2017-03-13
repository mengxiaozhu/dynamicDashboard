eval({
    init: function (ctx) {
        return {
            base: function (table, method, params, handler) {
                var context = ctx();
                var mp = context.mp;
                var $ = context.$;
                params = params || {}
                params["mpId"] = mp.id;
                $.getJSON("/api/mp/dynamic/db/" + table + "/" + method, params, function (resp) {
                    handler(resp);
                });
            }
        }
    }
})