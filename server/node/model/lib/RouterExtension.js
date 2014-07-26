module.exports = {

    extendRouterParam: function (router) {
        router.param(function (name, fn) {
            if (fn instanceof RegExp) {
                return function (req, res, next, val) {
                    var captures;
                    if (captures = fn.exec(String(val))) {
                        req.params[name] = captures;
                        next();
                    } else {
                        next('route');
                    }
                }
            }
        });
    }
}