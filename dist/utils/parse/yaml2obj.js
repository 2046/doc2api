'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (doc = '') {
    return charHandlerAfter(_jsYaml2.default.safeLoad(charHandlerBefore(doc)));
};

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function charHandlerBefore(str) {
    return str.replace(/@/g, '__at__');
}

function charHandlerAfter(str) {
    return JSON.parse(JSON.stringify(str).replace(/__at__/g, '@'));
}