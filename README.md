# VSCode Extension to Fix Checksums

An extension to to adjust checksums after changes to VSCode core files. Once the checksum changes are applied and VSCode is restarted, all warning about core file modifications will disappear, such as the display of `[Unsupported]` in the title-bar, or the following dialog on start-up:

<p align="center">
  <img src="https://raw.githubusercontent.com/iewnfod/vscode-fix-checksums/master/resources/corrupt.png" alt="Corrupt">
</p>

## Installation

Follow the instructions in the
[Marketplace](https://marketplace.visualstudio.com/items?itemName=iewnfod.vscode-fix-checksums-next-next),
or run the following in the command palette:

```shell
code --install-extension iewnfod.vscode-fix-checksums-next-next
```

## Usage

The extension adds 2 new commands to the command palette:

```js
Fix Checksums: Apply // Checks core files for changes and applies new checksums.
Fix Checksums: Restore // Restores original state of VSCode checkums.
```

After executing either of these commands, you need to fully restart VSCode in order to see the extension's effect. Simply reloading the window is not enough.

## Disclaimer / A Word of Caution

This extension modifies files that are part of the core of VSCode, so use it at your own risk.

This extension creates backup files before modifying the core files, and these can be restored at any time using the `Fix Checksums: Restore` command.

If anything goes wrong, you can always reinstall VSCode from [code.visualstudio.com](https://code.visualstudio.com/download) without loosing any settings or installed extensions.
