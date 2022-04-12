#!/usr/bin/env node

/*

This script builds all the packages in the packages folder.

It can be called with the `--watch` option to watch for changes in the source
files and rebuild.

*/

import { promises as fs } from 'fs';
import * as path from 'path';
import { promisify } from 'util';

import glob from 'glob';
import * as rollup from 'rollup';
import loadConfigFile from 'rollup/dist/loadConfigFile.js';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
  .option('watch', {
    type: 'boolean',
    description: 'watch files and rebuild on change',
  })
  .strict()
  .help()
  .alias('help', 'h').argv;

async function main() {
  const packageJsonFiles = await promisify(glob)('packages/*/package.json');
  const dependencyHelpers = {};
  const paths = {};

  for (const fn of packageJsonFiles) {
    const directory = /^(.*)\/package\.json$/.exec(fn)[1];

    const pkg = JSON.parse(await fs.readFile(fn));
    dependencyHelper(dependencyHelpers, pkg.name, [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.devDependencies || {}),
    ]);
    paths[pkg.name] = directory;
  }

  const sequence = Object.keys(dependencyHelpers)
    .map((key) => dependencyHelpers[key]())
    .flat();

  const allOptions = [];

  for (const pkgname of sequence) {
    const directory = paths[pkgname];

    const { options, warnings } = await loadConfigFile(
      path.resolve(directory, 'rollup.config.js'),
    );

    warnings.flush();
    allOptions.push(...options);
  }

  if (argv.watch) {
    const watcher = rollup.watch(allOptions);
    watcher.on('event', ({ code, input, duration }) => {
      switch (code) {
        case 'START':
          console.log('Starting cord-sdk build...');
          break;
        case 'BUNDLE_START':
          console.log(`Building '${inputPackage(input)}'...`);
          break;
        case 'BUNDLE_END':
          console.log(`Built '${inputPackage(input)}': ${duration / 1000}s`);
          break;
        case 'END':
          console.log('cord-sdk builds complete.');
          break;
      }
    });

    // Wait forever
    await new Promise(() => {});
  } else {
    for (const options of allOptions) {
      console.log(`Building '${inputPackage(options.input)}'...`);

      const label = `Built '${inputPackage(options.input)}'`;
      console.time(label);

      const bundle = await rollup.rollup(options);
      for (const output of options.output) {
        await bundle.write(output);
      }
      await bundle.close();

      console.timeEnd(label);
    }
  }
}

const dependencyHelper = (dependencies, name, deps) => {
  dependencies[name] = () => {
    dependencies[name] = () => {
      throw new Error(`Circular dependency involving ${name}`);
    };

    const result = [];

    for (const dep of deps) {
      const helper = dependencies[dep];
      if (helper) {
        result.push(...helper());
      }
    }

    result.push(name);
    dependencies[name] = () => [];

    return result;
  };
};

const inputPackage = (fn) => '@cord-sdk/' + /.*\/(.*)\/index\.ts$/.exec(fn)[1];

main().then(
  () => {
    process.exit(0);
  },
  (error) => {
    console.error(error);
    process.exit(1);
  },
);
