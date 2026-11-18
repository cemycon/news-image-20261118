import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const maxPosterBytes = 1048576;

try {
  const poster = await readFile(new URL('./poster.png', import.meta.url));
  if (poster.length > maxPosterBytes) {
    throw new Error(`poster.png is ${poster.length} bytes and exceeds the ${maxPosterBytes}-byte limit`);
  }
  if (poster.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') {
    throw new Error('poster.png has an invalid PNG signature');
  }

  const outputDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
  const outputPath = join(outputDir, 'entry.png');
  await mkdir(outputDir, { recursive: true });
  await writeFile(outputPath, poster);
  console.log(`Wrote ${poster.length} bytes to ${outputPath}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
