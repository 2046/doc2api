import ast from 'ast2'

export default function(node) {
    let body, result
    
    body = []
    result = { body: [], header: [] }

    for (let item of (node.parameters || [])) {
        if (item && Object.keys(item).length) {
            result[item.in] = [...result[item.in], ast.property(ast.literal(item.name), type(item.value))]
        }
    }

    if (result.body.length) {
        body = [...defaults(result.body)]
    }

    body = [...body, returns(promise(method(node, property(node, result.header))))]

    return Object.assign({}, exports(func(node, body)), comments(node))
}

function type(value) {
    if (isArray(value)) {
        return ast.expressions.array(value.map((item) => type(item)))
    } else if (isObject(value)) {
        return ast.expressions.object(Object.keys(value).map((item) => {
            return ast.property(ast.identifier(item), type(value[item]))
        }))
    } else {
        return ast.literal(value)
    }
}

function isArray(val) {
    return Array.isArray(val)
}

function isObject(val) {
    return typeof val === 'object' && !isArray(val)
}

function exports(value) {
    return ast.declaration.exportNamed(value)
}

function returns(value) {
    return ast.statements.return(value)
}

function getFuncName(node) {
    return node.name ? ast.identifier(node.name) : null
}

function getFuncParams() {
    return ['data', 'opts'].map((item) => ast.patterns.assignment(ast.identifier(item), ast.expressions.object()))
}

function func(node, funcBody = []) {
    return Object.assign({}, ast.declaration.function(getFuncName(node), getFuncParams(), ast.statements.block(funcBody)), {
        async: node.async,
        generator: node.generator
    })
}

function method(node, property = []) {
    return ast.statements.expression(ast.expressions.call(node.handler ? ast.identifier(node.handler) : ast.identifier(''), property))
}

function promise(funcBody) {
    return ast.expressions.new(ast.identifier('Promise'), [
        ast.expressions.arrowfunction(null, [
            ast.identifier('resolve'), ast.identifier('reject')
        ], ast.statements.block([funcBody]))
    ])
}

function defaults(body) {
    return [
        ast.statements.expression(
            ast.expressions.assignment('=', ast.identifier('data'), ast.expressions.call(
                ast.expressions.member(ast.identifier('Object'), ast.identifier('assign')), [
                    ast.expressions.object(),
                    ast.expressions.object(body),
                    ast.identifier('data')
                ]
            ))
        ),
        ast.identifier('')
    ]
}

function property(node, header) {
    let propertys = []

    if (node.method) {
        propertys.push(ast.property(ast.identifier('method'), ast.literal(node.method.toUpperCase())))
    }

    if (node.url) {
        propertys.push(ast.property(ast.identifier('url'), ast.literal(node.url)))
    }

    if (Object.keys(header).length) {
        propertys.push(ast.property(ast.identifier('headers'), ast.expressions.object(header)))
    }

    return [
        ast.expressions.call(ast.expressions.member(ast.identifier('Object'), ast.identifier('assign')), [
            ast.expressions.object(),
            ast.expressions.object([
                ...propertys,
                ast.property(ast.identifier('data'), ast.identifier('data')),
                ast.property(ast.identifier('success'), ast.identifier('resolve')),
                ast.property(ast.identifier('fail'), ast.identifier('reject'))
            ]),
            ast.identifier('opts')
        ])
    ]
}

function comments(node) {
    return node.comments ? ast.comments(node.comments.map((item) => ast.commentsLine(item))) : {}
}