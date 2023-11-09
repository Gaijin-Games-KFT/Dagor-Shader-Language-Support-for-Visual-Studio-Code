import { runTests } from '@vscode/test-electron';

import * as path from 'path';

async function main(): Promise<void> {
    try {
        const extensionDevelopmentPath = path.resolve(__dirname, '../../../');
        const extensionTestsPath = path.resolve(__dirname, './index');
        await runTests({ extensionDevelopmentPath, extensionTestsPath });
    } catch (err) {
        console.error('Failed to run tests');
        process.exit(1);
    }
}

main();
