import { buildMacros } from '@embroider/macros/babel';
import { createRequire } from 'node:module';
import {
  setDefaultBuildConfig,
  tempStripDebug,
} from '@workspace/shared-data/build-config';

const require = createRequire(import.meta.url);

const macros = buildMacros({
  configure: setDefaultBuildConfig,
});

export default {
  plugins: [
    [
      '@babel/plugin-transform-typescript',
      {
        allExtensions: true,
        onlyRemoveTypeImports: true,
        allowDeclareFields: true,
      },
    ],
    [
      'babel-plugin-ember-template-compilation',
      {
        compilerPath: 'ember-source/dist/ember-template-compiler.js',
        enableLegacyModules: [
          'ember-cli-htmlbars',
          'ember-cli-htmlbars-inline-precompile',
          'htmlbars-inline-precompile',
        ],
        transforms: [...macros.templateMacros],
      },
    ],
    [
      'module:decorator-transforms',
      {
        runtime: {
          import: require.resolve('decorator-transforms/runtime-esm'),
        },
      },
    ],
    [
      '@babel/plugin-transform-runtime',
      {
        absoluteRuntime: import.meta.dirname,
        useESModules: true,
        regenerator: false,
      },
    ],
    tempStripDebug,
    ...macros.babelMacros,
  ],

  generatorOpts: {
    compact: false,
  },
};
