import * as vscode from 'vscode';

// this method is called when vs code is activated
export function activate(context: vscode.ExtensionContext) {

    console.log('decorator sample is activated');

    let timeout: NodeJS.Timer | undefined = undefined;
    let activeEditor = vscode.window.activeTextEditor;
    let md: string = 'markdown';

    const twoOrMoreDecorationType = vscode.window.createTextEditorDecorationType({
        borderWidth: '1px',
        borderStyle: 'solid',
        overviewRulerLane: vscode.OverviewRulerLane.Left,
        borderColor: { id: 'myextension.twoOrMoreSpaceHighlight' }
    });

    if (activeEditor) {
        triggerUpdateDecorations();
    }

    function updateDecorations() {
        if (!activeEditor) return;

        const text = activeEditor.document.getText();
        const regEx_twoOrMore = /([^\x20]+)(\x20{2,}$)/gm; // x20 is character encoding for half-width space
        const twoOrMore: vscode.DecorationOptions[] = [];
        let match;

        while (match = regEx_twoOrMore.exec(text)) {
            twoOrMore.push(getDecorationOption(match));
        }

        activeEditor.setDecorations(twoOrMoreDecorationType, twoOrMore);
    }

    function getDecorationOption(match: any): any {
        if (!activeEditor) return;

        const startPos = activeEditor.document.positionAt(match.index + match[1].length);
        const endPos = activeEditor.document.positionAt(match.index + match[1].length + match[2].length);
        const decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: 'space' };

        return decoration;
    }

    function triggerUpdateDecorations() {
        if (timeout) {
            clearTimeout(timeout);
            timeout = undefined;
        }
        timeout = setTimeout(updateDecorations, 500);
    }

    // fire when a document is changed
    vscode.window.onDidChangeActiveTextEditor(editor => {
        activeEditor = editor;
        if (editor) {
            triggerUpdateDecorations();

            let activeDocsLang = editor.document.languageId;
            if (md === activeDocsLang) {
                triggerUpdateDecorations();
            } else {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = undefined;
                }
            }
        }
    }, null, context.subscriptions);

    // fire every time a character is entered.
    vscode.workspace.onDidChangeTextDocument(event => {
        if (activeEditor && event.document === activeEditor.document) {
            if (md === event.document.languageId) {
                triggerUpdateDecorations();
            }
        }
    }, null, context.subscriptions);

    // fire when document will saved
    vscode.workspace.onWillSaveTextDocument(event => {
        console.log(event.document.languageId);

        let regExEndSpace = /([^\x20]+)(\x20{1,}$)/gm;
        let editor = vscode.window.activeTextEditor;
        let document = event.document;
        let text = event.document.getText();
        let docsTextList = text.split(/\n/);
        let replacedDocsList = [];
        if (!editor) return;

        for (let i in docsTextList) {
            if (docsTextList[i].match(regExEndSpace)) {
                console.log('space on end line matches : ' + docsTextList[i]);
                replacedDocsList.push(docsTextList[i].replace(regExEndSpace, '$1  '));
            } else {
                replacedDocsList.push(docsTextList[i]);
            }
        }
        console.log(replacedDocsList);

        let replacedDocs = replacedDocsList.join('\n');

        let docsStartLineAt = document.lineAt(0);
        let docsEndLineAt = document.lineAt(document.lineCount - 1);
        let ranges = new vscode.Range(0, docsStartLineAt.range.start.character, document.lineCount - 1, docsEndLineAt.range.end.character);

        editor.edit(editBuilder => {
                editBuilder.replace(ranges, replacedDocs);
        });
    });

    // fire when language mode is changed
    vscode.languages.onDidChangeDiagnostics(event => {
        if (!activeEditor) return;
        console.log(activeEditor.document.languageId);

        if (md === activeEditor.document.languageId) {
            triggerUpdateDecorations();
        } else {
            if (timeout) {
                clearTimeout(timeout);
                timeout = undefined;
            }
        }
    }, null, context.subscriptions);
}
