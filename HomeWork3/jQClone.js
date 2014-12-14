(function(window, document) {

    var jQClone = function(selector, context) {
        return new jQCobj(selector, context);
    };

    var jQCobj = function(selector, context) {
        if (selector) {

            var context = context || document;

            var nodes = context.querySelectorAll(selector);
            for (var i = 0; i < nodes.length; i++)
                this.push(nodes[i]);
        }
    };

    jQCobj.prototype = Array.prototype;

    jQCobj.prototype.first = function() {
        var newObj = new jQCobj();
        if (this.length > 0)
            newObj.push(this[0]);
        return newObj;
    };

    jQCobj.prototype.last = function() {
        var newObj = new jQCobj();
        if (this.length > 0)
            newObj.push(this[this.length - 1]);
        return newObj;
    };

    jQCobj.prototype.each = function(callback) {
        this.forEach(function(element, index) {
            callback.call(element, element, index);
        });
        return this;
    };

    jQCobj.prototype.find = function(selector) {
        var newObj = new jQCobj();
        if (selector) {
            this.each(function() {
                var found = this.querySelectorAll(selector);
                for (var i = 0; i < found.length; i++)
                    newObj.push(found[i]);
            });
        }
        return newObj;
    };

    jQCobj.prototype.hasClass = function(className) {
        if (className && this.length > 0) {
            if (document.body.classList) {
                return this[0].classList.contains(className);
            } else {
                return ' ' + this[0].className + ' '.indexOf(' ' + className + ' ') > -1;
            }
        }
        return false;
    };

    jQCobj.prototype.addClass = function(className) {
        if (className && this.length > 0) {
            if (document.body.classList) {
                this.each(function() {
                    this.classList.add(className);
                });
            } else {
                this.each(function() {
                    if (' ' + this[0].className + ' '.indexOf(' ' + className + ' ') === -1)
                        this.className += ' ' + className;
                });
            }
        }
        return this;
    };

    jQCobj.prototype.removeClass = function(className) {
        if (className && this.length > 0) {
            if (document.body.classList) {
                this.each(function() {
                    this.classList.remove(className);
                });
            } else {
                // TODO
            }
        }
        return this;
    };

    jQCobj.prototype.toggleClass = function(className, addOrRemove) {
        if (className && this.length > 0) {
            if (document.body.classList) {
                var classList = className.split(' ');
                this.each(function(element) {
                    [].forEach.call(classList, function(c) {
                        if (typeof addOrRemove === 'boolean') {
                            if (addOrRemove)
                                element.classList.add(c);
                            else
                                element.classList.remove(c);
                        } else {
                            if (element.classList.contains(c))
                                element.classList.remove(c);
                            else
                                element.classList.add(c);
                        }
                    });
                });
            } else {
                // TODO
            }
        }
        return this;
    };

    jQCobj.prototype.attr = function(attribute, value) {
        if (attribute && this.length > 0) {
            if (value) {
                if (typeof attribute === 'string') {
                    if (typeof value === 'string') {
                        this.each(function() {
                            this.setAttribute(attribute, value);
                        });
                    } else {
                        this.each(function(element, index) {
                            var newValue = value.call(element, index, element.getAttribute(attribute));
                            this.setAttribute(attribute, newValue);
                        });
                    }
                }
            } else {
                if (typeof attribute === 'string')
                    return this[0].getAttribute(attribute);
                else if(attribute.constructor.toString().indexOf("Object") != -1) {
                    this.each(function(element) {
                        for (key in attribute)
                            element.setAttribute(key, attribute[key]);
                    });
                }
            }
        }
        return this;
    };

    jQCobj.prototype.css = function(property, value) {
        if (property && this.length > 0) {
            if (value) {
                if (typeof property === 'string') {
                    if (typeof value === 'string') {
                        this.each(function () {
                            this.style[property] = value;
                        });
                        return this;
                    } else if (value.constructor.toString().indexOf("Function") != -1) {
                        this.each(function(element, index) {
                            var oldValue = element.style[property] || getComputedStyle(element)[property];
                            var newValue = value.call(element, index, oldValue);
                            element.style[property] = newValue;
                        });
                        return this;
                    }
                }
            } else {
                if (typeof property === 'string') {
                    var val = this[0].style[property] || getComputedStyle(this[0])[property];
                    if (val)
                        return val;
                } else if(property.constructor.toString().indexOf("Array") != -1) {
                    var result = [];
                    for (var i = 0; i < property.length; i++)
                        result.push(this.css(property[i]));
                    return result;
                } else if (property.constructor.toString().indexOf("Object") != -1) {
                    for (var key in property)
                        this.css(key, property[key]);
                }
            }
        } else
            return undefined;
    };

    jQCobj.prototype.data = function(key, value) {
        if (key && this.length > 0) {
            if (value) {
                if (typeof key === 'string') {
                    if (typeof value === 'string') {
                        if (document.body.dataset) {
                            this.each(function() {
                                this.dataset[key] = value;
                            });
                        } else {
                            this.each(function() {
                                this.attr('data-' + key, value);
                            });
                        }
                        return this;
                    }
                }
            } else {
                if (typeof key === 'string') {
                    if (document.body.dataset) {
                        return this[0].dataset[key];
                    } else {
                        return this[0].attr('data-' + key);
                    }
                } else if (key.constructor.toString().indexOf("Object") != -1) {
                    for (k in key)
                        this.data(k, key[k]);
                    return this;
                }
            }
        } else if (this.length > 0) {
            if (document.body.dataset)
                return this[0].dataset;
            else {
                // TODO
            }
        } else
            return undefined;
    };

    jQCobj.prototype.on = function(event, handler) {
        if (event && this.length > 0) {
            if (handler) {
                if (typeof event === 'string') {
                    if (handler.constructor.toString().indexOf("Function") != -1) {
                        this.each(function() {
                            this.addEventListener(event, handler);
                        });
                    }
                }
            } else {
                if (typeof event === 'string')
                    this[0][event]();
            }
        }
        return this;
    };

    jQCobj.prototype.html = function(htmlString) {
        if (this.length > 0) {
            if (typeof htmlString === 'string') {
                this.each(function() {
                    this.innerHTML = htmlString;
                });
            } else {
                return this[0].innerHTML;
            }
        } else
            return undefined;
    };

    jQCobj.prototype.append = function(content) {
        if (this.length > 0) {
            if (typeof content === 'string') {
                this.each(function() {
                    this.innerHTML += content;
                });
                return this;
            } else if (content.constructor.toString().indexOf("HTML") != -1) {
                this.each(function() {
                    this.appendChild(content.cloneNode(true));
                });
                return this;
            }
        } else
            return undefined;
    };

    jQCobj.prototype.prepend = function(content) {
        if (this.length > 0) {
            if (typeof content === 'string') {
                this.each(function() {
                    this.innerHTML = content + this.innerHTML;
                });
                return this;
            } else if (content.constructor.toString().indexOf("HTML") != -1) {
                this.each(function(element) {
                    this.insertBefore(content.cloneNode(true), element.firstChild);
                });
                return this;
            }
        } else
            return undefined;
    };

    jQCobj.prototype.empty = function() {
        if (this.length > 0) {
            this.each(function() {
                while (this.firstChild)
                    this.removeChild(this.firstChild);
            });
        }
        return this;
    };


    var ajax = function(settings) {
        this.request = undefined;
        if (settings) {
            if (typeof settings === 'string') {
                this.request = new XMLHttpRequest();
                this.request.open('GET', settings, true);
                this.request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                this.request.send();
            } else if (settings.constructor.toString().indexOf("Object") != -1) {
                if (settings.url) {
                    var url = settings.url;
                    var type = settings.type || 'GET';
                    var data = settings.data || undefined;
                    var dataString = undefined;
                    if (data) {
                        for (var key in data) {
                            if (dataString !== undefined)
                                dataString += '&';
                            else
                                dataString = '';
                            dataString += key + '=' + encodeURIComponent(data[key]);
                        }
                    }

                    this.request = new XMLHttpRequest();
                    this.request.open(type, url, true);
                    this.request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                    this.request.send(dataString);
                }
            }
        }


        this.done = function(callback) {
            this.request.addEventListener('load', function(evt) {
                callback(evt.target.response);
            }, true);
            return this;
        };

        this.error = function(callback) {
            this.request.addEventListener('fail', function(evt) {
                callback(evt.target.response);
            }, true);
            return this;
        };
    };


    window.jQClone = jQClone;
    window.$ = window.jQClone;
    window.$.ajax = function(params) {
        return new ajax(params);
    };

})(window, document);
