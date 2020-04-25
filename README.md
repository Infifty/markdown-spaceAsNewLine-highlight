# Markdown SpaceAsNewLine Highlight
Highlight the space at the end of each line. It is convenient to use spaces as new line in markdown notation. (I've never seen a markdown file with spaces as new line except me)

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

# Commands
This extension provides the following commands. Please write in settings.json.
``` json
{
    "workbench.colorCustomizations": {
        "onlyOneSpaceHighlight": "#FF000055",
        "twoOrMoreSpaceHighlight": "#FFFFFF"
    }
}
```

# Note
- If you're opening a markdown file but doesn't work, make sure the Language Mode in the bottom right corner of the editor is "Markdown".

- If all the spaces at the end of each line are removed, you can avoid it by setting the following.
``` json
{
    "[markdown]": {
        "files.trimTrailingWhitespace": false,
    }
}
```


# Credit
This extension was created with reference to [vscode-extension-samples](https://github.com/Microsoft/vscode-extension-samples/tree/master/helloworld-sample, "https://github.com/Microsoft/vscode-extension-samples/tree/master/helloworld-sample").
