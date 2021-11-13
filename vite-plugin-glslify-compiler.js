import { createFilter } from '@rollup/pluginutils'
import { compile } from 'glslify'
import { walk } from 'estree-walker'
import MagicString from 'magic-string'

module.exports = function compileGlslify (options = {}) {
  const filter = createFilter(
    options.include || [/\.ts$/, /\.js$/],
    options.exclude || ['node_modules/**']
  )

  return {
    name: 'vite-plugin-glslify-compiler',
    transform (code, id) {
      if (!filter(id)) return

      if (code && code.includes('glsl')) {
        const ast = this.parse(code)
        const s = new MagicString(code)

        walk(ast, {
          enter (node) {
            const { value } = node
            if (value && value.type === 'TaggedTemplateExpression') {
              const { start, end } = value
              const target = value.quasi.quasis[0]
              const raw = target.value.raw
              const compiled = compile(raw)
              s.overwrite(start, end, `\`${compiled}\``)
            }
          }
        })

        return {
          code: s.toString()
        }
      }
    }
  }
}
