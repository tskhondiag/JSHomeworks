var Router = function() {
    this.utils = require('./Utils');

    this.routes = {};
};

Router.prototype = {
    add : function(route, callbacks, errorHandler) {
        this.routes[this.utils.generateRegExp(this.utils.trimTrailingSlash(route))] = {
            'route' : route,
            'callbacks' : callbacks,
            'errorHandler' : errorHandler,
            'paramKeys': this.utils.extractParamKeys(route)
        };
    },

    remove : function(route) {
        delete this.routes[this.utils.generateRegExp(this.utils.trimTrailingSlash(route))];
    },

    handleRequest : function(request, response) {
        var url = this.utils.trimTrailingSlash(request.url);
        var route = undefined;
        var match = undefined;

        for (var regex in this.routes) {
            if (match = url.match(new RegExp(regex))) {
                route = this.routes[regex];
                break;
            }
        }

        if (route !== undefined) {
            var method = (request.method in route.callbacks ? request.method : ( request.method.toLowerCase() in route.callbacks ? request.method.toLowerCase() : undefined ));
            if (method === undefined) {
                response.writeHead(405, {"Content-Type": "text/plain"});
                response.write("405 Method Not Allowed\n");
                response.end();
            } else {
                var params = {};
                for (var i = 0; i < route.paramKeys.length; i++)
                    params[route.paramKeys[i]] = match[i + 1];
                route.callbacks[method](request, response, params);
            }
        } else {
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write("404 Not Found\n");
            response.end();
        }
    }
};

module.exports = new Router();