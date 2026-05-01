import { spawnSync } from 'child_process';
import { globSync } from 'glob';

// Using double quotes around glob patterns when executing via bash so it expands correctly,
// but inside the node script we want to actually execute what the user passed or default to src/**/*.test.ts
const args = process.argv.slice(2);
const tsPattern = args.length > 0 ? args : ['src/**/*.test.ts'];

const tsResult = spawnSync('node', ['--test', '--experimental-strip-types', ...tsPattern], { stdio: 'inherit' });

const tsxFiles = globSync('src/**/*.test.tsx');

let tsxStatus = 0;
if (tsxFiles.length > 0) {
  console.log('\nRunning .tsx tests...');
  const npxExecutable = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const tsxResult = spawnSync(npxExecutable, ['--no-install', 'tsx', '--test', ...tsxFiles], { stdio: 'inherit' });
  tsxStatus = tsxResult.status;
}

if (tsResult.status !== 0 || tsxStatus !== 0) {
  process.exit(tsResult.status !== 0 ? tsResult.status : tsxStatus);
}
