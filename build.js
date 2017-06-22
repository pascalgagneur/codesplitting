/* jshint node: true */
const fs = require('fs');
const { promisify } = require('util');
const xml2js = require('xml2js');
const { URL } = require('url');
const path =  require('path');

const parseXml = promisify(xml2js.parseString);
const readFile = promisify(fs.readFile);

async function build() {
    const entryPoints = await extractEntryPoints();
    const sections =
        entryPoints
            .map((entryPoint) => path.basename(entryPoint, path.extname(entryPoint)))
            .map((entryPoint) => entryPoint === '' ? 'index' : entryPoint)

    const depTrees = sections.map((section) => {
        buildDependencyTree(section);
    });
    console.log(sections);
    const commomDependencies = findCommonDeps(depTrees);
    bundle(commomDependencies);
    sections.forEach((entryPoint) => {
        rewrite(entryPoint, commomDependencies);
    });
}
async function buildDependencyTree() {
    let code = await readFile(`./app/static/${section}.js`);
    code = code.toString('utf-8');
}

async function extractEntryPoints() {
    let siteMapString = await readFile('./app/sitemap.xml')
    siteMapString = siteMapString.toString('utf-8');
    const siteMap = await parseXml(siteMapString);
    return siteMap.urlset.url
    .map((url) => url.loc[0])
    .map((url) => new URL(url).pathname);
}

build()
    .catch((err) => {
        console.error(err.stack);
    });
