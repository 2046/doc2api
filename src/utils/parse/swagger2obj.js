import { normalize } from 'path'

export default function(data) {
    return toArray(JSON.parse(data)).map((item) => {
        return {
            data: generateDataProperty(item),
            info: generateInfoProperty(item.info, item.dependencies)
        }
    })
}

function generateInfoProperty(data = {}, dependencies = {}) {
    let comments, deps
    
    deps = []
    comments = []

    if (data.title) {
        comments.push(`@title: ${data.title}`)
    }

    if (data.description) {
        comments.push(`@description: ${data.description}`)
    }

    if (data.contact && data.contact.name) {
        comments.push(`@author: ${data.contact.name}`)
    }

    if (data.contact && data.contact.email) {
        comments.push(`@email: ${data.contact.email}`)
    }

    deps = Object.keys(dependencies).map((item) => {
        return {
            source: item,
            local: dependencies[item]
        }
    })

    return {
        deps,
        comments,
        filePath: data.filePath,
        fileName: data.fileName
    }
}

function generateDataProperty(data) {
    let url = generateUrl(data.schemes, data.host, data.basePath)
    
    if (!checkPathsKeyInObjProperty(data)) {
        return []
    }

    return Object.keys(data.paths).reduce((total, key) => {
        let value = data.paths[key]

        return [...total, ...Object.keys(value).map((item) => {
            let obj, options

            obj = value[item]
            options = {
                comments: obj.summary ? [obj.summary] : []
            }

            options = Object.assign({}, {
                method: item,
                async: obj.async,
                handler: obj.handler,
                name: obj.operationId,
                generator: obj.generator,
                url: adjustUrl(normalize(`${url}/${key}`)),
                parameters: generateParametersProperty(obj.parameters, options.comments, data)
            }, options)

            return options
        })]
    }, [])
}

function generateParametersProperty(parameters = [], comments, data) {
    return parameters.map((item) => {
        let schema = getParametersSchema(item.schema, comments, data)

        return item.required ? {
            in: item.in,
            name: item.name,
            value: schema ? schema : item.value
        } : {}
    })
}

function getParametersSchema(schema, comments, ctx) {
    let obj, props

    obj = {}

    if (!schema) {
        return
    }

    for (let ref of getRefs(schema.$ref)) {
        ctx = ctx[ref]
        props = ctx.properties
    }

    if (!ctx.required) {
        return
    }

    for(let item of ctx.required) {
        obj[item] = ''
        comments.push(`@${item} {${props[item].type}} ${props[item].description}`)
    }
    
    return obj
}

function getRefs(str) {
    return str.slice(2).split('/')
}

function adjustUrl(str) {
    return str.replace(':/', '://')
}

function toArray(data) {
    return Array.isArray(data) ? data : [data]
}

function generateUrl(schemes = 'http', host, basePath) {
    if (!host && basePath) {
        return basePath
    }

    if (!host) {
        return ''
    }

    return normalize(`${schemes}://${host}/${basePath}`)
}

function checkPathsKeyInObjProperty(data) {
    return data.paths && Object.keys(data.paths).length
}