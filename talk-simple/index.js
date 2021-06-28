const childProcess = require('child_process')
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
const open = require('open')
const ProgressBar = require('progress')
const workBranch = childProcess.execSync('git rev-parse --abbrev-ref HEAD').toString().replace(/\s+/, '')
const conflictTargetBranch = 'conflict-' + workBranch
let currentRe = childProcess.execSync('git remote -v').toString()
currentRe = currentRe.split('\n')[0].split(currentRe.includes('@') ? '@' : '//')[1].replace('.git (fetch)', '').replace(':', '/')

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
      '解决冲突',
      '创建MR'
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
  var bar = new ProgressBar('progress: [:bar]', { total: 10 })
  childProcess.execSync('git branch -D develop')
  bar.tick(2)
  childProcess.execSync('git checkout develop')
  bar.tick(2)
  childProcess.execSync('git checkout -b ' + conflictTargetBranch)
  bar.tick(3)
  childProcess.execSync('git push --set-upstream origin ' + conflictTargetBranch)
  try {
    childProcess.execSync('git merge ' + workBranch)
    bar.tick(3)
    open(getMrUrl(conflictTargetBranch, 'develop'))
  } catch (error) {
    bar.tick(3)
    open(getMrUrl(conflictTargetBranch, 'develop'))
  }
}

function creatMR () {
  if (argv.ta) {
    open(getMrUrl(workBranch, argv.ta))
  } else {
    inquirer.prompt([{
      type: 'list',
      name: 'actionName',
      message: '选择要到合并的分支',
      choices: [
        'release',
        'release_payment',
        'master'
      ]
    }]).then(answers => {
      open(getMrUrl(workBranch, answers.actionName))
    })
  }
}

function getMrUrl(sB, tB) {
  return `http://${currentRe}/-/merge_requests/new?merge_request[source_branch]=${sB}&merge_request[target_branch]=${tB}`
}
