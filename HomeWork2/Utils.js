module.exports = {

    trimTrailingSlash : function(url) {
        return url.replace(/\/?$/, '');
    },

    extractParamKeys : function(url) {
        var paramKeys = [];
        var extracted = url.match(/\{[^}]*\}/g);
        for (var i in extracted)
            paramKeys.push(extracted[i].substring(1, extracted[i].indexOf(':')));
        return paramKeys;
    },

    generateRegExp : function(url) {
        return '^' + url.replace(/\//g, '\\/').replace(/\{[^(:n})]*\:n}/g, '(\\d+)').replace(/\{[^(:s})]*\:s}/g, '([a-zA-Z.]+)') + '$';
    }
};