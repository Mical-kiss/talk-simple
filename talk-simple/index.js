const childProcess = require('child_process')
// const argv = require('yargs').alias('m', 'mr').alias('c', 'cr').boolean(['mr', 'cr']).argv
const argv = require('yargs')
  .option('mr', {
    alias : 'm',
    describe: '创建合并请求',
    boolean: true
  })
  .option('cr', {
    alias : 'c',
    describe: '解决冲突',
    boolean: true
  })
  .option('ta', {
    alias : 't',
    describe: '指定mr时默认的分支',
    type: 'string'
  })
  .example('bd --mr', '创建合并请求')
  .example('bd --cr', '解决冲突')
  .example('bd --ta release', '指定release为要merge request到的分支')
  .help('h')
  .alias('h', 'help')
  .epilog('copyright @ 2021 bd')
  .argv
const inquirer = require('inquirer')
const openDefaultBrowser = function (url) {
  var exec = childProcess.exec
  switch (process.platform) {
    case "darwin":
      exec('open ' + url)
      break;
    case "win32":
      exec('start ' + url)
      break;
    default:
      exec('xdg-open', [url])
  }
}
const workBranch = childProcess.execSync('git rev-parse --abbrev-ref HEAD').toString().replace(/\s+/, '')
const conflictTargetBranch = 'conflict-' + workBranch
let currentRe = childProcess.execSync('git remote -v').toString()
currentRe = currentRe.split('\n')[0].split(currentRe.includes('@') ? '@' : '//')[1].replace('.git (fetch)', '').replace(':', '/')
// return
// origin  git@github.com:Mical-kiss/talk-simple.git (fetch)
// origin  http://git.dev.biaodianyun.com/biaodianyun/ds_shopadmin_pc.git (fetch)
// origin  git@git.dev.biaodianyun.com:biaodianyun/ds_shopadmin_pc.git (fetch)
// http://git.dev.biaodianyun.com/biaodianyun/ds_shopadmin_pc/-/merge_requests/new?merge_request[source_branch]=backup/9cell&merge_request[target_branch]=master

if (argv.mr) {
  creatMR()
} else if (argv.cr) {
  fixConflict()
} else {
  inquirer.prompt([{
    type: 'list',
    name: 'actionName',
    message: '选择要进行的git操作',
    choices: [
      "解决冲突",
      "创建MR"
    ]
  }]).then(answers => {
    switch (answers.actionName) {
      case '解决冲突':
        fixConflict()
        break;
      case '创建MR':
        creatMR()
        break;
      default:
        break;
    }
  })
}
function fixConflict () {
  childProcess.execSync('git branch -D develop')
  childProcess.execSync('git checkout develop')
  childProcess.execSync('git checkout -b ' + conflictTargetBranch)
  childProcess.execSync('git push --set-upstream origin ' + conflictTargetBranch)
  try {
    childProcess.execSync('git merge ' + workBranch)
    creatMR()
  } catch (error) {
    creatMR()
  }
}

function creatMR () {
  if (argv.ta) {
    // console.log(`http://${currentRe}/-/merge_requests/new?merge_request[source_branch]=${workBranch}&merge_request[target_branch]=${argv.ta}`)
    openDefaultBrowser(encodeURI(`http://${currentRe}/-/merge_requests/new?merge_request[source_branch]=${workBranch}&merge_request[target_branch]=${argv.ta}`))
  } else {
    inquirer.prompt([{
      type: 'list',
      name: 'actionName',
      message: '选择要到合并的分支',
      choices: [
        "release",
        "release_payment",
        "master"
      ]
    }]).then(answers => {
      console.log(answers)
      console.log(`http://${currentRe}/-/merge_requests/new?` + (`merge_request[target_branch]=${answers.actionName}&merge_request[source_branch]=${workBranch}`))
      openDefaultBrowser(`http://${currentRe}/-/merge_requests/new?` + (`merge_request[target_branch]=${answers.actionName}&merge_request[source_branch]=${workBranch}`))
    })
  }
}
