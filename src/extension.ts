// The module 'vscode' contains the VS Code extensibility API
import * as vscode from 'vscode';

// Base64-encoded SVG images for the judging logic.
const starImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzc0NzQ3NCIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXN0YXIiPgoKICAgIDxwb2x5Z29uIHBvaW50cz0iMTIgMiAxNSAyIDE4IDcgMTUgOSAxNyAxMiA5IDE1IDkgMTEgMTQgMTMgOCAxNyA3IDE5IDQgMTcgNCAxMyA4IDIxIDExIDkiLz4KPC9zdmc+';
const happyFaceImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzc0NzQ3NCIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWhhcHB5LWZhY2UiPgogICAgPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IjQwIDUiIC8+CgogICAgPHBhdGggZD0iTTE2IDhoLTRINlYxNEg4LjVcIi8+CiAgICA8cGF0aCBkPSJNMTEuNSA1VjhoLTQuNSI+PC9wYXRoPgoKICAgIDxwYXRoIGQ9Ik04IDE2aDgiLz4KPC9zdmc+';
const disappointedFaceImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzc0NzQ3NCIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWRpc2FwcG9pbnRlZC1mYWNlIj4KICAgIDxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjEwIiBzdHJva2UtZGFzaGFycmF5PSI0MCA1IiAvPgoKICAgIDxwYXRoIGQ9Ik04IDE2aDgiLz4KPC9zdmc+';
const cryingFaceImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzc0NzQ3NCIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNyeWluZy1mYWNlIj4KICAgIDxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjEwIiBzdHJva2UtZGFzaGFycmF5PSI0MCA1IiAvPgoKICAgIDxwYXRoIGQ9Ik05LjUgOWE2IDYgMCAwIDEgMCA2IiAvPgo8L3N2Zz4=';


export function activate(context: vscode.ExtensionContext) {
  // Register the manual command 'judgy-linter.showMeme'
  let disposableCommand = vscode.commands.registerCommand('judgy-linter.showMeme', () => {
    // Get the active document
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
      // Pass the active document to the linter function
      runLinterAndShowMeme(activeEditor.document);
    } else {
      // Show an information message if no document is open
      vscode.window.showInformationMessage('No active document to lint.');
    }
  });

  // Listen for the onDidSaveTextDocument event
  let disposableSave = vscode.workspace.onDidSaveTextDocument((document) => {
    // Pass the saved document to the linter function
    runLinterAndShowMeme(document);
  });

  // Add both disposables to the subscriptions list
  context.subscriptions.push(disposableCommand, disposableSave);
}

/**
 * Lints the provided document and displays a meme in a Webview panel.
 * @param document The text document to be linted.
 */
function runLinterAndShowMeme(document: vscode.TextDocument) {
  // Get diagnostics for the current document
  const diagnostics = vscode.languages.getDiagnostics(document.uri);
  const errorCount = diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Error).length;

  let message = '';
  let memeImage = '';

  if (errorCount === 0) {
    message = "No errors. Did you copy this from Stack Overflow?";
    memeImage = starImage;
  } else if (errorCount <= 2) {
    message = `Just ${errorCount} error(s)? Not bad for a beginner.`;
    memeImage = happyFaceImage;
  } else if (errorCount <= 5) {
    message = `That's ${errorCount} errors. You're trying to get a bug bounty, aren't you?`;
    memeImage = disappointedFaceImage;
  } else if (errorCount <= 10) {
    message = `You have ${errorCount} errors. The codebase is crying.`;
    memeImage = cryingFaceImage;
  } else if (errorCount <= 15) {
    message = `${errorCount} errors. Your commit message should be "I'm sorry."`;
    memeImage = cryingFaceImage;
  } else if (errorCount <= 20) {
    message = `Over ${errorCount} errors. You're a professional at breaking things.`;
    memeImage = cryingFaceImage;
  } else if (errorCount <= 25) {
    message = `Wow, ${errorCount} errors. The compiler just uninstalled itself.`;
    memeImage = cryingFaceImage;
  } else if (errorCount <= 30) {
    message = `You're at ${errorCount} errors. This isn't a game. Oh wait, yes it is. And you're losing.`;
    memeImage = cryingFaceImage;
  } else if (errorCount <= 40) {
    message = `${errorCount} errors. At this point, you're just writing code for the memes.`;
    memeImage = cryingFaceImage;
  } else if (errorCount <= 50) {
    message = `${errorCount} errors. We have an issue on our hands, a big one.`;
    memeImage = cryingFaceImage;
  } else {
    message = `Over ${errorCount} errors. The judges have given up. Please seek help.`;
    memeImage = cryingFaceImage;
  }

  // Create and show WebView panel
  const panel = vscode.window.createWebviewPanel(
    'judgyMeme',
    'Judgy Linter',
    vscode.ViewColumn.One,
    {
      enableScripts: true,
    }
  );

  panel.webview.html = getWebviewContent(message, memeImage);
}

function getWebviewContent(message: string, memeUrl: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: sans-serif;
          background: #1e1e1e;
          color: white;
          padding: 20px;
          text-align: center;
        }
        img {
          max-width: 400px;
          margin-top: 20px;
          border-radius: 12px;
          box-shadow: 0 0 20px rgba(0,0,0,0.5);
        }
      </style>
    </head>
    <body>
      <h1>${message}</h1>
      <img src="${memeUrl}" />
    </body>
    </html>
  `;
}

export function deactivate() {}
