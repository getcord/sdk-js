import * as path from 'path';

import typescript from 'rollup-plugin-typescript2';
import * as pkg from './package.json';

export default [
  {
    input: path.resolve(__dirname, 'index.ts'),
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
      ...Object.keys(pkg.devDependencies || {}),
      'lodash/isEqual',
    ],
    plugins: [
      typescript({
        tsconfig: path.resolve(__dirname, 'tsconfig.json'),
      }),
    ],
    output: [
      {
        file: path.resolve(__dirname, pkg.main),
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: path.resolve(__dirname, pkg.module),
        format: 'es',
        sourcemap: true,
      },
    ],
  },
];
