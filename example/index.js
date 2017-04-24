import { join } from 'path'
import doc2api from '../dist'
import { readFileSync } from 'fs'

doc2api.generate(readFileSync(join(__dirname, 'doc.yml'), 'utf8'), 'yaml')
doc2api.generate(readFileSync(join(__dirname, 'swagger.json'), 'utf8'), 'swagger')