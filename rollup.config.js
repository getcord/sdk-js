import * as path from 'path';
import * as fs from 'fs';

import typescript from 'rollup-plugin-typescript2';

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

async function rollupConfig() {
  const configs = await Promise.all([
    packageBuildConfig('types'),
    packageBuildConfig('components'),
    packageBuildConfig('jsx'),
    packageBuildConfig('react', { extraExternal: ['lodash/isEqual'] }),
    packageBuildConfig('server'),
  ]);

  return configs.flat();
}

export default rollupConfig();