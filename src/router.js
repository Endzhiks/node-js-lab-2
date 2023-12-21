import { readdir } from 'node:fs/promises';
import * as path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'url';

const READ_DIR_OPTIONS = {
    withFileTypes: true
};

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const router = new Map();

const baseDirectory = path.join(__dirname, '/routes');

async function loadRoutesDirectories(directoryName, baseName) {
    const relativePath = path.join(baseName, directoryName);
    const workDirectory = path.join(baseDirectory, relativePath);

    const directory = await readdir(workDirectory, READ_DIR_OPTIONS);

    for (const node of directory) {
        if (node.isDirectory()) {
            await loadRoutesDirectories(node.name, relativePath);
        } else {
            const modulePath = pathToFileURL(path.join(workDirectory, node.name));
            const module = await import(modulePath);

            router.set(relativePath.replaceAll(path.sep, '/'), { ...module });
        }
    }
}

await loadRoutesDirectories('/', path.sep);

export default router;
