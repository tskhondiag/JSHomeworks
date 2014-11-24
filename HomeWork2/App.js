var router = require('./Router'),
    http   = require('http'),
    fs = require("fs");

router.add('/file/{fileName:s}', {
    get : function(request, response, params) {
        var extensions = {
            'html': 'text/html',
            'css': 'text/css',
            'js': 'text/js',
            'jpg': 'image/jpeg',
            jpeg: 'image/jpeg',
            'png': 'image/png'
        };

        var ext = params['fileName'].substr(params['fileName'].lastIndexOf('.') + 1);
        var fileName = 'files/' + params['fileName'];
        fs.exists(fileName, function(exists) {
            if (!exists) {
                response.writeHead(404, {"Content-Type": "text/plain"});
                response.write("404 Not Found\n");
                response.end();
            } else {
                fs.readFile(fileName, "binary", function(err, file) {
                    if (err) {
                        response.writeHead(500, {"Content-Type": "text/plain"});
                        response.write(err + "\n");
                        response.end();
                    } else {
                        response.writeHead(200, extensions[ext]);
                        response.write(file, "binary");
                        response.end();
                    }
                });
            }
        });
    },
    post : function(request, response, params) {

    },
    delete : function(request, response, params) {

    }
});


http.createServer(function(request, response) {
    router.handleRequest(request, response);
}).listen(8080);