
async function build() {
    const entryPoints = getEntryPoints();
    const depTrees = entryPoints.map((entryPoint) => {
        buildDependencyTree(entryPoint);
    });
    const commomDependencies = findCommonDeps(depTrees);
    bundle(commomDependencies);
    entryPoints.forEach((entryPoint) => {
        rewrite(entryPoint, commomDependencies);
    });
}

build()
    .catch((err) => {
        console.error(err.stack);
    });
