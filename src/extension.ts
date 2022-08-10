import * as vscode from "vscode";

let myStatusBarItem: vscode.StatusBarItem;

export function activate({ subscriptions }: vscode.ExtensionContext) {
  // register a command that is invoked when the status bar
  // item is selected
  const myCommandId = "reload-window";
  subscriptions.push(
    vscode.commands.registerCommand(myCommandId, () => {
      vscode.commands.executeCommand("workbench.action.reloadWindow");
    })
  );

  // create a new status bar item that we can now manage
  myStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  myStatusBarItem.command = myCommandId;
  subscriptions.push(myStatusBarItem);
  // update status bar item once at start
  createStatusBarItem();
}

function createStatusBarItem(): void {
    myStatusBarItem.text = `$(extensions-refresh) Reload Window`;
    myStatusBarItem.show();
}

