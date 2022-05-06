import * as path from 'path';
import * as fs from 'fs';

import typescript from 'rollup-plugin-typescript2';
import copy from 'rollup-plugin-copy';
import replace from '@rollup/plugin-replace';

async function packageBuildConfig(packageName, options = {}) {
  const dirname = path.resolve(__dirname, 'packages', packageName);

  const pkg = JSON.parse(
    await fs.promises.readFile(path.resolve(dirname, 'package.json'), {
      encoding: 'utf-8',
    }),
  );

  return [
    {
      input: path.resolve(dirname, 'index.ts'),
      external: [
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
        ...Object.keys(pkg.devDependencies || {}),
        ...(options.extraExternal || []),
      ],
      plugins: [
        typescript({
          tsconfig: path.resolve(dirname, 'tsconfig.json'),
        }),
        copy({
          targets: [
            {
              src: path.resolve(dirname, '..', '..', 'LICENSE'),
              dest: dirname,
            },
          ],
        }),
        declareBundleType(),
        replace({
          CORD_REACT_PACKAGE_VERSION: `"${pkg.version}"`,
          preventAssignment: true,
        }),
      ],
      output: [
        {
          file: path.resolve(dirname, pkg.main),
          format: 'cjs',
          sourcemap: true,
        },
        {
          file: path.resolve(dirname, pkg.module),
          format: 'es',
          sourcemap: true,
        },
      ],
    },
  ];
}

function declareBundleType() {
  return {
    generateBundle(options, bundle) {
      const type = { cjs: 'commonjs', es: 'module' }[options.format];
      if (type) {
        bundle['package.json'] = {
          fileName: 'package.json',
          type: 'asset',
          source: JSON.stringify({ type }, undefined, 2) + '\n',
        };
      }
    },
  };
}

async function rollupConfig() {
  const configs = await Promise.all([
    packageBuildConfig('types'),
    packageBuildConfig('components'),
    packageBuildConfig('jsx'),
    packageBuildConfig('react', { extraExternal: ['lodash/isEqual.js'] }),
    packageBuildConfig('server'),
  ]);

  return configs.flat();
}

export default rollupConfig();
