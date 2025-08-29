const { setConfig } = require('@warp-drive/core/build-config');
const { buildMacros } = require('@embroider/macros/babel');

const Macros = buildMacros({
  configure: (config) => {
    setConfig(config, {
      // this should be the most recent <major>.<minor> version for
      // which all deprecations have been fully resolved
      // and should be updated when that changes
      // for new apps it should be the version you installed
      // for universal apps this MUST be at least 5.6
      compatWith: '5.7',
    });
  },
});

/**
 * This babel.config is only used for publishing.
 *
 * For local dev experience, see the babel.config
 */
module.exports = {
  plugins: [
    [
      '@babel/plugin-transform-typescript',
      {
        allExtensions: true,
        allowDeclareFields: true,
        onlyRemoveTypeImports: true,
      },
    ],
    [
      'babel-plugin-ember-template-compilation',
      {
        targetFormat: 'hbs',
        transforms: [],
      },
    ],
    [
      'module:decorator-transforms',
      {
        runtime: {
          import: 'decorator-transforms/runtime-esm',
        },
      },
    ],
    // babel-plugin-debug-macros is temporarily needed
    // to convert deprecation/warn calls into console.warn
    [
      'babel-plugin-debug-macros',
      {
        flags: [],

        debugTools: {
          isDebug: true,
          source: '@ember/debug',
          assertPredicateIndex: 1,
        },
      },
      'ember-data-specific-macros-stripping-test',
    ],
    ...Macros.babelMacros,
  ],

  generatorOpts: {
    compact: false,
  },
};
