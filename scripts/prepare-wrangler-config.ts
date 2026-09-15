import { copyFileSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const API_DIR = join(process.cwd(), 'apps', 'api');
const CONFIG_PATH = join(API_DIR, 'wrangler.jsonc');
const TEMPLATE_PATH = join(API_DIR, 'wrangler.jsonc.template');

function prepareConfigFile(): void {
  const dumpedConfig = process.env.WRANGLER_JSONC;
  if (dumpedConfig?.trim()) {
    writeFileSync(CONFIG_PATH, dumpedConfig.endsWith('\n') ? dumpedConfig : `${dumpedConfig}\n`);
    console.log('Wrote apps/api/wrangler.jsonc from WRANGLER_JSONC repository variable.');
    return;
  }

  copyFileSync(TEMPLATE_PATH, CONFIG_PATH);
  console.log('WRANGLER_JSONC is empty; copied apps/api/wrangler.jsonc.template to apps/api/wrangler.jsonc.');
}

prepareConfigFile();
