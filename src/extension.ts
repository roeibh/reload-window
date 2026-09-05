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
  myStatusBarItem.name = "Reload Window";
  myStatusBarItem.tooltip = "Reload the current VS Code window";
  myStatusBarItem.accessibilityInformation = { label: "Reload Window" };
  myStatusBarItem.command = myCommandId;
  subscriptions.push(myStatusBarItem);
  subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration("reload-window.iconOnly")) {
        createStatusBarItem();
      }
    })
  );
  createStatusBarItem();
}

function createStatusBarItem(): void {
    const iconOnly = vscode.workspace.getConfiguration("reload-window").get<boolean>("iconOnly", false);
    myStatusBarItem.text = iconOnly ? "$(extensions-refresh)" : "$(extensions-refresh) Reload Window";
    myStatusBarItem.show();
}

