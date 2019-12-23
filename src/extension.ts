import * as vscode from 'vscode';
import * as prettier from 'prettier/standalone';
import * as parser from 'prettier/parser-html';
import * as beautify from 'js-beautify';
import { Configuration } from './configuration';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('extension.formatSelectionAsHtml', formatSelectionAsHTML));
}

export function deactivate() { }

async function formatSelectionAsHTML() {
    if (!vscode.window.activeTextEditor) {
        return;
    }

    const configuration = vscode.workspace.getConfiguration()
        .get<Configuration>('formatSelectionAsHtml');

    if (!isConfigurationValid(configuration)) {
        vscode.window.showWarningMessage('Your "Format Selection As HTML" configuration is invalid.');
        return;
    }

    const document = vscode.window.activeTextEditor.document;
    const selection = vscode.window.activeTextEditor.selection;

    const tabSize = vscode.window.activeTextEditor.options.tabSize as number;
    const insertSpaces = vscode.window.activeTextEditor.options.insertSpaces as boolean;

    const selectedText = document.getText(selection);

    let formattedText: string;

    if (configuration.formatter === 'prettier') {
        formattedText = prettier.format(selectedText, {
            parser: 'html',
            plugins: [parser],
            htmlWhitespaceSensitivity: configuration.htmlWhitespaceSensitivity,
            tabWidth: tabSize,
            useTabs: !insertSpaces,
            printWidth: configuration.printWidth
        }).replace(/[\r\n]+$/, '');
    } else if (configuration.formatter === 'js-beautify') {
        formattedText = beautify.html(selectedText, {
            indent_size: tabSize,
            indent_with_tabs: !insertSpaces,
            preserve_newlines: configuration.preserveNewlines,
            max_preserve_newlines: configuration.maxPreserveNewlines || undefined,
            wrap_line_length: configuration.printWidth
        });
    }

    await vscode.window.activeTextEditor.edit(builder => builder.replace(selection, formattedText));
}

function isConfigurationValid(configuration?: Configuration): configuration is Configuration {
    return !!configuration
        && (configuration.formatter === 'prettier' || configuration.formatter === 'js-beautify')
        && (configuration.htmlWhitespaceSensitivity === 'css' || configuration.htmlWhitespaceSensitivity === 'strict' || configuration.htmlWhitespaceSensitivity === 'ignore')
        && typeof configuration.preserveNewlines === 'boolean'
        && ((typeof configuration.maxPreserveNewlines === 'number' && configuration.maxPreserveNewlines >= 1) || configuration.maxPreserveNewlines === null)
        && (typeof configuration.printWidth === 'number' && Number.isInteger(configuration.printWidth) && configuration.printWidth >= 0);
}