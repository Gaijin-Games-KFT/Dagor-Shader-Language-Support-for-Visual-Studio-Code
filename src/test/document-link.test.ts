import { activate, getDocumenLink, getDocumentUri, getRange } from './helper';

import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Document link', () => {
    const shadersFolder = 'include_test_game/prog/shaders';

    test('should find the include directives in .sh files', async () => {
        const uri = getDocumentUri(`${shadersFolder}/test.sh`);
        await openDocumentAndAssertLinks(uri, [
            getDocumenLink(getRange(3, 14, 3, 29)), // #include "test_inc_3.hlsl"
            getDocumenLink(getRange(4, 14, 4, 29)), // #include "test_inc_1.hlsl"
            getDocumenLink(getRange(5, 14, 5, 29)), // #include <test_inc_1.hlsl>
            getDocumenLink(getRange(6, 14, 6, 32)), // #include <../test_inc_1.hlsl>
            getDocumenLink(getRange(0, 9, 0, 22)), // include "test_inc_1.sh"
            getDocumenLink(getRange(1, 9, 1, 22)), // include "test_inc_3.sh"
        ]);
    });

    test('should find the include directives in .hlsl files', async () => {
        const uri = getDocumentUri(`${shadersFolder}/test.hlsl`);
        await openDocumentAndAssertLinks(uri, [
            getDocumenLink(getRange(0, 10, 0, 25)), // #include "test_inc_3.hlsl"
            getDocumenLink(getRange(1, 10, 1, 25)), // #include "test_inc_1.hlsl"
            getDocumenLink(getRange(2, 10, 2, 25)), // #include <test_inc_1.hlsl>
            getDocumenLink(getRange(3, 10, 3, 28)), // #include <../test_inc_1.hlsl>
        ]);
    });
});

async function openDocumentAndAssertLinks(
    uri: vscode.Uri,
    expectedLinks: vscode.DocumentLink[]
) {
    await activate(uri);
    const actualLinks: vscode.DocumentLink[] =
        await vscode.commands.executeCommand('vscode.executeLinkProvider', uri);

    assert.ok(actualLinks.length === expectedLinks.length);
    expectedLinks.forEach((expectedItem, i) => {
        const actualItem = actualLinks[i];
        assert.deepEqual(actualItem.range, expectedItem.range);
        assert.equal(actualItem.target, expectedItem.target);
        assert.equal(actualItem.tooltip, expectedItem.tooltip);
    });
}
