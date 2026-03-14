import { strict as assert } from 'node:assert';
import test from 'node:test';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const repoRoot = resolve(process.cwd());
const cliPath = resolve(repoRoot, 'src/cli.ts');

test('cli can load a request from --file', () => {
  const output = execFileSync(
    process.execPath,
    ['--import', 'tsx', cliPath, '--file', 'examples/research-local-only.json'],
    {
      cwd: repoRoot,
      encoding: 'utf8',
    },
  );

  const parsed = JSON.parse(output);
  assert.equal(parsed.selected.route_id, 'local-private');
});
