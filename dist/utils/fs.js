'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.writeFile = writeFile;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _path = require('path');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function writeFile(path, content) {
    mkdir((0, _path.dirname)(path = toAbsolutePath(path)));

    _fs2.default.writeFile(path, content, {
        encoding: 'utf8'
    });
}

function mkdir(dirPath) {
    if (!_fs2.default.existsSync(dirPath)) {
        _mkdirp2.default.sync(dirPath);
    }
}

function toAbsolutePath(path) {
    return (0, _path.isAbsolute)(path) ? path : (0, _path.resolve)(process.cwd(), path);
}