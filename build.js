const { build } = require('esbuild')
const AdmZip = require('adm-zip')

const pjson = require('./package.json');


build({
    entryPoints: ['src/content.ts'],
    outdir: 'dist',
    bundle: true,
    minify: true,
})


// Package extension

let extensionZip = new AdmZip();
extensionZip.addLocalFile('./dist/content.js');
extensionZip.addFile("manifest.json", Buffer.from(JSON.stringify({
    "manifest_version": 3,
    "browser_specific_settings": {
        "gecko": {
            "id": "{045b22a5-2fc9-42d4-8c51-5c39593615c0}"
        }
    },
    "name": "WPI Schedule Exporter",
    "version": pjson["version"],
    "description": "Converts a WPI workday schedule to an ICS file.",
    "content_scripts": [
        {
            "matches": ["*://wd5.myworkday.com/wpi/*"],
            "js": ["content.js"]
        }
    ]
})))

extensionZip.writeZip("dist/extension.zip")

// Package source

let sourceZip = new AdmZip()

sourceZip.addLocalFolder('./src', 'src')
sourceZip.addLocalFile('BUILDING.md')
sourceZip.addLocalFile('package.json')
sourceZip.addLocalFile('build.js')
sourceZip.addLocalFile("tsconfig.json")
sourceZip.addLocalFile("pnpm-lock.yaml")

sourceZip.writeZip("dist/source.zip")