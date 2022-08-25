const { build } = require('esbuild')
const copyStaticFiles = require('esbuild-copy-static-files')


build({
    entryPoints: ['src/content.ts'],
    outdir: 'dist',
    bundle: true,
    minify: true,
    plugins: [copyStaticFiles({ src: './static', dest: './dist' })],
})