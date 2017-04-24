'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (node) {
    let body, result;

    body = [];
    result = { body: [], header: [] };

    for (let item of node.parameters || []) {
        if (item && Object.keys(item).length) {
            result[item.in] = [...result[item.in], _ast2.default.property(_ast2.default.literal(item.name), type(item.value))];
        }
    }

    if (result.body.length) {
        body = [...defaults(result.body)];
    }

    body = [...body, returns(promise(method(node, property(node, result.header))))];

    return Object.assign({}, _exports(func(node, body)), comments(node));
};

var _ast = require('ast2');

var _ast2 = _interopRequireDefault(_ast);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function type(value) {
    if (isArray(value)) {
        return _ast2.default.expressions.array(value.map(item => type(item)));
    } else if (isObject(value)) {
        return _ast2.default.expressions.object(Object.keys(value).map(item => {
            return _ast2.default.property(_ast2.default.identifier(item), type(value[item]));
        }));
    } else {
        return _ast2.default.literal(value);
    }
}

function isArray(val) {
    return Array.isArray(val);
}

function isObject(val) {
    return typeof val === 'object' && !isArray(val);
}

function _exports(value) {
    return _ast2.default.declaration.exportNamed(value);
}

function returns(value) {
    return _ast2.default.statements.return(value);
}

function getFuncName(node) {
    return node.name ? _ast2.default.identifier(node.name) : null;
}

function getFuncParams() {
    return ['data', 'opts'].map(item => _ast2.default.patterns.assignment(_ast2.default.identifier(item), _ast2.default.expressions.object()));
}

function func(node, funcBody = []) {
    return Object.assign({}, _ast2.default.declaration.function(getFuncName(node), getFuncParams(), _ast2.default.statements.block(funcBody)), {
        async: node.async,
        generator: node.generator
    });
}

function method(node, property = []) {
    return _ast2.default.statements.expression(_ast2.default.expressions.call(node.handler ? _ast2.default.identifier(node.handler) : _ast2.default.identifier(''), property));
}

function promise(funcBody) {
    return _ast2.default.expressions.new(_ast2.default.identifier('Promise'), [_ast2.default.expressions.arrowfunction(null, [_ast2.default.identifier('resolve'), _ast2.default.identifier('reject')], _ast2.default.statements.block([funcBody]))]);
}

function defaults(body) {
    return [_ast2.default.statements.expression(_ast2.default.expressions.assignment('=', _ast2.default.identifier('data'), _ast2.default.expressions.call(_ast2.default.expressions.member(_ast2.default.identifier('Object'), _ast2.default.identifier('assign')), [_ast2.default.expressions.object(), _ast2.default.expressions.object(body), _ast2.default.identifier('data')]))), _ast2.default.identifier('')];
}

function property(node, header) {
    let propertys = [];

    if (node.method) {
        propertys.push(_ast2.default.property(_ast2.default.identifier('method'), _ast2.default.literal(node.method.toUpperCase())));
    }

    if (node.url) {
        propertys.push(_ast2.default.property(_ast2.default.identifier('url'), _ast2.default.literal(node.url)));
    }

    if (Object.keys(header).length) {
        propertys.push(_ast2.default.property(_ast2.default.identifier('headers'), _ast2.default.expressions.object(header)));
    }

    return [_ast2.default.expressions.call(_ast2.default.expressions.member(_ast2.default.identifier('Object'), _ast2.default.identifier('assign')), [_ast2.default.expressions.object(), _ast2.default.expressions.object([...propertys, _ast2.default.property(_ast2.default.identifier('data'), _ast2.default.identifier('data')), _ast2.default.property(_ast2.default.identifier('success'), _ast2.default.identifier('resolve')), _ast2.default.property(_ast2.default.identifier('fail'), _ast2.default.identifier('reject'))]), _ast2.default.identifier('opts')])];
}

function comments(node) {
    return node.comments ? _ast2.default.comments(node.comments.map(item => _ast2.default.commentsLine(item))) : {};
}