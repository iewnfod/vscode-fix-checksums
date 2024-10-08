const vscode = require('vscode')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

let appDir = path.join(path.dirname(process.execPath), "resources/app/out")
let rootDir = path.join(appDir, '..')

let productFile = path.join(rootDir, 'product.json')
let origFile = `${productFile}.orig.${vscode.version}`

exports.activate = function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand('fixChecksums.apply', apply),
    vscode.commands.registerCommand('fixChecksums.restore', restore)
  )

  appDir = path.join(path.dirname(vscode.env.appRoot), "app/out")
  rootDir = path.join(appDir, "..")
  productFile = path.join(rootDir, 'product.json')
  origFile = `${productFile}.orig.${vscode.version}`

  cleanupOrigFiles()

  const auto = vscode.workspace.getConfiguration().get("checksums.autoFix")
  apply(auto)
}

const messages = {
  changed: verb => `Checksums ${verb}. Please restart VSCode to see effect.`,
  unchanged: 'No changes to checksums were necessary.',
  error: `An error occurred during execution.`,
}

function apply(hidden) {
  const product = require(productFile)
  let changed = false
  let message = messages.unchanged
  for (const [filePath, curChecksum] of Object.entries(product.checksums)) {
    const checksum = computeChecksum(path.join(appDir, ...filePath.split('/')))
    if (checksum !== curChecksum) {
      product.checksums[filePath] = checksum
      changed = true
    }
  }
  if (changed) {
    const json = JSON.stringify(product, null, '\t')
    try {
      if (!fs.existsSync(origFile)) {
        fs.renameSync(productFile, origFile)
      }
      fs.writeFileSync(productFile, json, { encoding: 'utf8' })
      message = messages.changed('applied')
    } catch (err) {
      console.error(err)
      message = messages.error
    }
  }
  if (hidden !== true) {
    vscode.window.showInformationMessage(message)
  }
}

function restore() {
  let message = messages.unchanged
  try {
    if (fs.existsSync(origFile)) {
      fs.unlinkSync(productFile)
      fs.renameSync(origFile, productFile)
      message = messages.changed('restored')
    }
  } catch (err) {
    console.error(err)
    message = messages.error
  }
  vscode.window.showInformationMessage(message)
}

function computeChecksum(file) {
  var contents = fs.readFileSync(file)
  return crypto
    .createHash('sha256')
    .update(contents)
    .digest('base64')
    .replace(/=+$/, '')
}

function cleanupOrigFiles() {
  // Remove all old backup files that aren't related to the current version
  // of VSCode anymore.
  const oldOrigFiles = fs.readdirSync(rootDir)
    .filter(file => /\.orig\./.test(file))
    .filter(file => !file.endsWith(vscode.version))
  for (const file of oldOrigFiles) {
    fs.unlinkSync(path.join(rootDir, file))
  }
}
