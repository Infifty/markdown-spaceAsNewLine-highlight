import * as vscode from 'vscode';

// this method is called when vs code is activated
export function activate(context: vscode.ExtensionContext) {
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
        let match: RegExpExecArray | null;

        while (match = regEx_twoOrMore.exec(text)) {
            twoOrMore.push(getRange(match));
        }

        activeEditor.setDecorations(twoOrMoreDecorationType, twoOrMore);
    }

    function getRange(match: RegExpExecArray): any {
        if (!activeEditor) return;

        const startPos = activeEditor.document.positionAt(match.index + match[1].length);
        const endPos = activeEditor.document.positionAt(match.index + match[1].length + match[2].length);
        const range = new vscode.Range(startPos, endPos);
        return range;
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
        if (event.document.languageId !== md) return;

        let regExEndSpace = /([^\x20]+)(\x20{1,}$)/gm;
        let editor = vscode.window.activeTextEditor;
        if (!editor) return;

        let text = event.document.getText();
        let match: RegExpExecArray | null;
        let location: vscode.Range[] = [];
        while (match = regExEndSpace.exec(text)) {
            location.push(getRange(match));
        }

        editor.edit(editBuilder => {
            for (let i = 0; i < location.length; i++) {
            editBuilder.replace(location[i], "  ");
            }
        });
    });

    // fire when language mode is changed
    vscode.languages.onDidChangeDiagnostics(event => {
        if (!activeEditor) return;

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
