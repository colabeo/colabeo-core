({
    baseUrl: '../js/',
    name: 'lib/almond',
    include: ['main'],
    insertRequire: ['main'],
    findNestedDependencies: true,
    optimize: 'none',
    wrap: true,
    normalizeDirDefines: 'all',
    stubModules: ['plugin/js-yaml.min', 'plugin/text', 'plugin/yaml', 'plugin/scene']
})
