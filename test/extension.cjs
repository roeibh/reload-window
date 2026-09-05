const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

let iconOnly = false;
let onChange;
let reload;
let executed;
const item = { show() {} };
const disposable = { dispose() {} };
const vscode = {
  StatusBarAlignment: { Right: 2 },
  window: { createStatusBarItem: () => item },
  commands: {
    registerCommand(id, callback) {
      assert.equal(id, "reload-window");
      reload = callback;
      return disposable;
    },
    executeCommand(id) { executed = id; }
  },
  workspace: {
    getConfiguration(section) {
      assert.equal(section, "reload-window");
      return { get(key, fallback) {
        assert.equal(key, "iconOnly");
        assert.equal(fallback, false);
        return iconOnly;
      } };
    },
    onDidChangeConfiguration(callback) {
      onChange = callback;
      return disposable;
    }
  }
};
const context = { exports: {}, require: () => vscode };
vm.runInNewContext(fs.readFileSync(require.resolve("../out/extension.js"), "utf8"), context);
const subscriptions = [];
context.exports.activate({ subscriptions });
assert.equal(item.text, "$(extensions-refresh) Reload Window");
assert.equal(item.name, "Reload Window");
assert.equal(item.tooltip, "Reload the current VS Code window");
assert.equal(item.accessibilityInformation.label, "Reload Window");
assert.equal(item.command, "reload-window");
assert.equal(subscriptions.length, 3);
iconOnly = true;
onChange({ affectsConfiguration: () => false });
assert.equal(item.text, "$(extensions-refresh) Reload Window");
onChange({ affectsConfiguration: key => key === "reload-window.iconOnly" });
assert.equal(item.text, "$(extensions-refresh)");
iconOnly = false;
onChange({ affectsConfiguration: () => true });
assert.equal(item.text, "$(extensions-refresh) Reload Window");
reload();
assert.equal(executed, "workbench.action.reloadWindow");
console.log("Extension checks passed");
