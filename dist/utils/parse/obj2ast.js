'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (obj, delegate = noop) {
    let data, depsAST, commentsAST, programAST;

    obj = defaults(obj);
    data = toArray(obj.data);
    depsAST = generateDepsAST(obj.info.deps);
    commentsAST = generateCommentsAST(obj.info.comments);
    programAST = generateProgramAST(data, depsAST, delegate);

    return Object.assign({}, isCommentsAST(commentsAST, programAST), commentsAST);
};

var _ast = require('ast2');

var _ast2 = _interopRequireDefault(_ast);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DEFAULT = {
    info: {
        deps: null,
        comments: null
    },
    data: []
};

function noop() {}

function defaults(obj) {
    return Object.assign({}, DEFAULT, obj);
}

function toArray(data) {
    return Array.isArray(data) ? data : [data];
}

function isCommentsAST(comments, programAST) {
    if (comments) {
        programAST.body.unshift(_ast2.default.identifier(''));
    }

    return programAST;
}

function getReduceInitValue(deps) {
    return deps ? [...deps, _ast2.default.identifier('')] : [];
}

function generateDepsAST(deps) {
    if (!deps) {
        return deps;
    }

    return deps.map(item => {
        let local, action;

        if (Array.isArray(item.local)) {
            action = 'import';
            local = item.local.map(key => _ast2.default.identifier(key));
        } else {
            action = 'importDefault';
            local = _ast2.default.identifier(item.local);
        }

        return _ast2.default.declaration[action](local, _ast2.default.literal(item.source));
    });
}

function generateProgramAST(data, deps, delegate) {
    return _ast2.default.program(data.reduce((nodes, node, index) => {
        return [...nodes, delegate(node), _ast2.default.identifier('')];
    }, getReduceInitValue(deps)).slice(0, -1), 'module');
}

function generateCommentsAST(comments) {
    return comments ? _ast2.default.comments(comments.map(item => _ast2.default.commentsLine(item))) : null;
}