import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

try {
  const poster = await readFile(new URL('./poster.png', import.meta.url));
  if (poster.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') {
    throw new Error('poster.png has an invalid PNG signature');
  }

  const outputDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
  await mkdir(outputDir, { recursive: true });
  await writeFile(join(outputDir, 'entry.png'), poster);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
