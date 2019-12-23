# Format Selection As HTML

Format selected text as HTML using js-beautify or Prettier. Useful for code embedded in strings or templating languages without formatting support (like Razor).

## Instruction

Use `Format Selection As HTML` command from context menu or Command Palette.

## Presentation

![Example](img/example.gif)

## Configuration

- `formatSelectionAsHtml.formatter` - formatter to use: `prettier` or `js-beautify`;
- `formatSelectionAsHtml.htmlWhitespaceSensitivity` - Prettier Whitespace Sensitivity setting.
- `formatSelectionAsHtml.preserveNewlines` - Beautify Preserve Newlines setting.
- `formatSelectionAsHtml.maxPreserveNewlines` - Beautify Max Preserve Newlines setting.
- `formatSelectionAsHtml.printWidth` - maximum amount of characters per line.