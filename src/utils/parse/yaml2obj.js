import yaml from 'js-yaml'

export default function(doc = '') {
    return charHandlerAfter(yaml.safeLoad(charHandlerBefore(doc)))
}

function charHandlerBefore(str) {
    return str.replace(/@/g, '__at__')
}

function charHandlerAfter(str) {
    return JSON.parse(JSON.stringify(str).replace(/__at__/g, '@'))
}