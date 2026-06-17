import { copyFileSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const CONFIG_PATH = join(process.cwd(), 'wrangler.jsonc');
const TEMPLATE_PATH = join(process.cwd(), 'wrangler.jsonc.template');

function prepareConfigFile(): void {
  const dumpedConfig = process.env.WRANGLER_JSONC;
  if (dumpedConfig?.trim()) {
    writeFileSync(CONFIG_PATH, dumpedConfig.endsWith('\n') ? dumpedConfig : `${dumpedConfig}\n`);
    console.log('Wrote wrangler.jsonc from WRANGLER_JSONC repository variable.');
    return;
  }

  copyFileSync(TEMPLATE_PATH, CONFIG_PATH);
  console.log('WRANGLER_JSONC is empty; copied wrangler.jsonc.template to wrangler.jsonc.');
}

prepareConfigFile();
