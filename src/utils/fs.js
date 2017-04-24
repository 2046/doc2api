import fs from 'fs'
import mkdirp from 'mkdirp'
import { resolve, dirname, isAbsolute } from 'path'

export function writeFile(path, content) {
    mkdir(dirname(path = toAbsolutePath(path)))

    fs.writeFile(path, content, {
        encoding: 'utf8'
    })
}

function mkdir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        mkdirp.sync(dirPath)
    }
}

function toAbsolutePath(path) {
    return isAbsolute(path) ? path : resolve(process.cwd(), path)
}