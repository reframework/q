import { defineConfig } from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const pkg = require('./package.json');

const extensions = ['.ts'];
const noDeclarationFiles = {
  compilerOptions: {
    declaration: false,
  },
  exclude: ['**/__tests__', '**/*.test.ts'],
};

const babelRuntimeVersion = pkg.dependencies['@babel/runtime'].replace(
  /^[^0-9]*/,
  '',
);

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
].map((name) => RegExp(`^${name}($|/)`));

export default defineConfig([
  {
    input: 'src/index.ts',
    output: { file: 'lib/index.js', format: 'cjs', indent: false },
    plugins: [
      resolve({
        extensions,
      }),
      typescript({ tsconfigOverride: noDeclarationFiles }),
      babel({
        extensions,
        exclude: 'node_modules/**',
        plugins: [],
        skipPreflightCheck: true,
        babelHelpers: 'bundled',
      }),
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
        },
      }),
    ],
  },
]);
