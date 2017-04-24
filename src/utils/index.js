import ast from 'ast2'
import { join, extname } from 'path'
import { writeFile } from './fs'
import delegate from './delegate'
import obj2ast from './parse/obj2ast'
import yaml2obj from './parse/yaml2obj'
import swagger2obj from './parse/swagger2obj'

let handlers = {
    yaml(data) {
        return toArray(yaml2obj(data)).map((item) => {
            return {
                path: generatePath(item.info),
                code: ast.generate(obj2ast(item, delegate))
            }
        })
    },
    swagger(data) {
        return swagger2obj(data).map((item) => {
            return {
                path: generatePath(item.info),
                code: ast.generate(obj2ast(item, delegate))
            }
        })
    }
}

function generate(data, handler) {
    for (let item of generateCode(data, handler)) {
        if (extname(item.path)) {
            writeFile(item.path, item.code)   
        }
    }
}

function generatePath(info) {
    let filePath, fileName

    filePath = info.filePath || ''
    fileName = info.fileName || ''

    return join(filePath, fileName)
}

function generateCode(data, handler) {
    return handlers[handler](data)
}

function toArray(data) {
    return Array.isArray(data) ? data : [data]
}

export {
    generate
}