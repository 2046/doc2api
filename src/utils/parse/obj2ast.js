import ast from 'ast2'

const DEFAULT = {
    info: {
        deps: null,
        comments: null
    },
    data: []
}

export default function(obj, delegate = noop) {
    let data, depsAST, commentsAST, programAST

    obj = defaults(obj)
    data = toArray(obj.data)
    depsAST = generateDepsAST(obj.info.deps)
    commentsAST = generateCommentsAST(obj.info.comments)
    programAST = generateProgramAST(data, depsAST, delegate)
    
    return Object.assign({}, isCommentsAST(commentsAST, programAST), commentsAST)
}

function noop() {}

function defaults(obj) {
    return Object.assign({}, DEFAULT, obj)
}

function toArray(data) {
    return Array.isArray(data) ? data : [data]
}

function isCommentsAST(comments, programAST) {
    if (comments) {
        programAST.body.unshift(ast.identifier(''))
    }

    return programAST
}

function getReduceInitValue(deps) {
    return deps ? [...deps, ast.identifier('')] : []
}

function generateDepsAST(deps) {
    if (!deps) {
        return deps
    }

    return deps.map((item) => {
        let local, action

        if (Array.isArray(item.local)) {
            action = 'import'
            local = item.local.map((key) => ast.identifier(key))
        } else {
            action = 'importDefault'
            local = ast.identifier(item.local)
        }

        return ast.declaration[action](local, ast.literal(item.source))
    })
}

function generateProgramAST(data, deps, delegate) {
    return ast.program(data.reduce((nodes, node, index) => {
        return [...nodes, delegate(node), ast.identifier('')]
    }, getReduceInitValue(deps)).slice(0, -1), 'module')
}

function generateCommentsAST(comments) {
    return comments ? ast.comments(comments.map((item) => ast.commentsLine(item))) : null
}