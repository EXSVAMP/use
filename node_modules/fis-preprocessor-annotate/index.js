/*
 * shengxinjing
 *
 */

'use strict';

var ngAnnotate = require("ng-annotate");
var semi = require('semi');

module.exports = function(content, file, conf) {
    if (file.isMod) {
        if (!conf.annotate || conf.annotate == 'add') {
            content = ngAnnotate(content, {
                add: true
            }).src;
        } else if (conf.annotate == 'remove') {
            content = ngAnnotate(content, {
                remove: true
            }).src;
        }
        if (!conf.semi || conf.semi == 'add') {
            content = semi.add(content);
        } else if (conf.semi == 'remove') {
            content = semi.remove(content);
        }
    };
    return content;
};
