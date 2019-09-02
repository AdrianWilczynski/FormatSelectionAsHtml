import * as vscode from "vscode";
import * as prettier from "prettier";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(vscode.commands.registerCommand("extension.formatSelectionAsHtml", formatSelectionAsHTML));
}

export function deactivate() { }

async function formatSelectionAsHTML() {
  if (!vscode.window.activeTextEditor) {
    return;
  }

  const configuration = vscode.workspace.getConfiguration();

  const htmlWhitespaceSensitivity = configuration.get("formatSelectionAsHtml.htmlWhitespaceSensitivity");
  if (!htmlWhitespaceSensitivity
    || typeof htmlWhitespaceSensitivity !== "string"
    || !(htmlWhitespaceSensitivity === "css" || htmlWhitespaceSensitivity === "strict" || htmlWhitespaceSensitivity === "ignore")) {
    return;
  }

  const printWidth = configuration.get("formatSelectionAsHtml.printWidth");
  if (!printWidth
    || typeof printWidth !== "number"
    || !Number.isInteger(printWidth)
    || printWidth <= 0) {
    return;
  }

  const document = vscode.window.activeTextEditor.document;
  const selection = vscode.window.activeTextEditor.selection;

  const tabSize = vscode.window.activeTextEditor.options.tabSize;
  const insertSpaces = vscode.window.activeTextEditor.options.insertSpaces;

  const selectedText = document.getText(selection);

  const formattedText = prettier
    .format(selectedText, {
      parser: "html",
      htmlWhitespaceSensitivity: htmlWhitespaceSensitivity,
      tabWidth: typeof tabSize === "number" ? tabSize : 4,
      useTabs: typeof insertSpaces === "boolean" ? !insertSpaces : false,
      printWidth: printWidth
    })
    .replace(/[\r\n]+$/, "");

  await vscode.window.activeTextEditor.edit(builder => builder.replace(selection, formattedText));
}
