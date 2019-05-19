import * as vscode from "vscode";
import * as prettier from "prettier";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(vscode.commands.registerCommand("extension.formatSelectionAsHtml", formatSelectionAsHTML));
}

export function deactivate() {}

async function formatSelectionAsHTML() {
  if (!vscode.window.activeTextEditor) {
    return;
  }

  const htmlWhitespaceSensitivity = vscode.workspace
    .getConfiguration()
    .get("formatSelectionAsHtml.htmlWhitespaceSensitivity");

  if (
    !htmlWhitespaceSensitivity ||
    typeof htmlWhitespaceSensitivity !== "string" ||
    !(
      htmlWhitespaceSensitivity === "css" ||
      htmlWhitespaceSensitivity === "strict" ||
      htmlWhitespaceSensitivity === "ignore"
    )
  ) {
    return;
  }

  const document = vscode.window.activeTextEditor.document;
  const selection = vscode.window.activeTextEditor.selection;

  const selectedText = document.getText(selection);

  const formattedText = prettier
    .format(selectedText, {
      parser: "html",
      htmlWhitespaceSensitivity: htmlWhitespaceSensitivity
    })
    .replace(/[\r\n]+$/, "");

  await vscode.window.activeTextEditor.edit(builder => builder.replace(selection, formattedText));
}
