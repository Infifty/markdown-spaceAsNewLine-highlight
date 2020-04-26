# Markdown SpaceAsNewLine Highlight
Highlight the space at the end of each line. It is convenient to use spaces as new line in markdown notation. (I've never seen a markdown file with spaces as new line except me)
![Markdown SpaceAsNewLine Highlight](https://raw.githubusercontent.com/Infifty/markdown-spaceAsNewLine-highlight/master/img/space-highlight.gif)

# Feature
- Highlight the space at the end of each line
- You can change the highlight color
- When you save a document, save one space or three or more spaces as two spaces
- Only works if the current document's Language Mode is Markdown

# Usage
1. Install this extension from vscode
2. Open a markdown file
3. Edit the document and make sure spaces are highlighted
4. Change the highlight color to your liking
5. Enjoy!

# Command
This extension provides the following command. Let's write in settings.json.
``` json
{
    "workbench.colorCustomizations": {
        "twoOrMoreSpaceHighlight": "#FFFFFF"
    }
}
```

# Note
- If you're opening a markdown file but doesn't work, make sure the Language Mode in the bottom right corner of the editor is "Markdown".

- If all the spaces in each line have removed when you save a document, you can avoid it by the following setting.
``` json
{
    "[markdown]": {
        "files.trimTrailingWhitespace": false,
    }
}
```

# Change Log
[here](https://github.com/Infifty/markdown-spaceAsNewLine-highlight/blob/master/CHANGELOG.md, "https://github.com/Infifty/markdown-spaceAsNewLine-highlight/blob/master/CHANGELOG.md")

# Credit
This extension was created with reference to [vscode-extension-samples](https://github.com/Microsoft/vscode-extension-samples/tree/master/helloworld-sample, "https://github.com/Microsoft/vscode-extension-samples/tree/master/helloworld-sample").
