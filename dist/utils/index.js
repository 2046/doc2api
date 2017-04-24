'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.generate = undefined;

var _ast = require('ast2');

var _ast2 = _interopRequireDefault(_ast);

var _path = require('path');

var _fs = require('./fs');

var _delegate = require('./delegate');

var _delegate2 = _interopRequireDefault(_delegate);

var _obj2ast = require('./parse/obj2ast');

var _obj2ast2 = _interopRequireDefault(_obj2ast);

var _yaml2obj = require('./parse/yaml2obj');

var _yaml2obj2 = _interopRequireDefault(_yaml2obj);

var _swagger2obj = require('./parse/swagger2obj');

var _swagger2obj2 = _interopRequireDefault(_swagger2obj);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let handlers = {
    yaml(data) {
        return toArray((0, _yaml2obj2.default)(data)).map(item => {
            return {
                path: generatePath(item.info),
                code: _ast2.default.generate((0, _obj2ast2.default)(item, _delegate2.default))
            };
        });
    },
    swagger(data) {
        return (0, _swagger2obj2.default)(data).map(item => {
            return {
                path: generatePath(item.info),
                code: _ast2.default.generate((0, _obj2ast2.default)(item, _delegate2.default))
            };
        });
    }
};

function generate(data, handler) {
    for (let item of generateCode(data, handler)) {
        if ((0, _path.extname)(item.path)) {
            (0, _fs.writeFile)(item.path, item.code);
        }
    }
}

function generatePath(info) {
    let filePath, fileName;

    filePath = info.filePath || '';
    fileName = info.fileName || '';

    return (0, _path.join)(filePath, fileName);
}

function generateCode(data, handler) {
    return handlers[handler](data);
}

function toArray(data) {
    return Array.isArray(data) ? data : [data];
}

exports.generate = generate;