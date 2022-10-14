import path from 'path';
import fs from 'fs';
import * as TJS from 'typescript-json-schema';
import ts from 'typescript';
import prettier from 'prettier';

/**
 * Used to generate schema.json and types.ts from typeDefinitions.ts.
 * To re-generate run "node  generate.mjs" in sdk-js/packages/api-types
 */
async function main() {
  const schemaFile = path.resolve('generate/schema.json');
  const typesFile = path.resolve('generate/types.ts');
  const typeDefinitionsFile = path.resolve('src/typeDefinitions.ts');

  const tsCompilerHost = {
    ...ts.createCompilerHost({}),

    // make sure we don't write files
    writeFile: () => {},

    // don't give it access to any directories
    getDirectories: () => [],
  };

  // settings for the typescript-json-schema generator,
  // see docs here -> https://www.npmjs.com/package/typescript-json-schema
  const settings = {
    noExtraProps: true, // Disable additional properties in objects by default
    titles: true, // Creates titles in the output schema
    required: true, // Create required array for non-optional properties in schema
  };

  const tsProgram = ts.createProgram([typeDefinitionsFile], {}, tsCompilerHost);

  const tjsGenerator = TJS.buildGenerator(
    tsProgram,
    settings,
    typeDefinitionsFile,
  );

  const jsonSchema = Object.fromEntries(
    tjsGenerator
      .getUserSymbols()
      .map((s) => [s, tjsGenerator.getSchemaForSymbol(s)]),
  );

  // write schema to schema.json
  const stringifyJsonSchema = prettier.format(JSON.stringify(jsonSchema), {
    filepath: schemaFile,
  });
  await fs.promises.writeFile(schemaFile, stringifyJsonSchema);

  // write types to types.js
  const typeNames = tjsGenerator.getUserSymbols();
  const typesFileCode = prettier.format(printTypesFile(typeNames), {
    filepath: typesFile,
    singleQuote: true, // without this imports file path with double quotes
  });
  await fs.promises.writeFile(typesFile, typesFileCode);
}

function printTypesFile(typeNames) {
  const types = typeNames.map((t) => `${t}: ${t};`).join('\n');
  return `// @generated
// update typeDefinitions.ts and to re-generate run "node  generate.mjs" in sdk-js/packages/api-types

import type {${typeNames.join(', ')}} from '../src/typeDefinitions';
  
export type Types = {${types}};
`;
}

main().then(
  () => {
    process.exit(0);
  },
  (error) => {
    console.error(error);
    process.exit(1);
  },
);
