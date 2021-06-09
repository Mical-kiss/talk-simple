/* var inquirer = require('inquirer')
function replaceStr (str) {
	str=str.replace("吗", "")
	str=str.replace("谁", "小可爱")
	str=str.replace("你", "我")
	str=str.replace("？", "!")
	str=str.replace("?", "!")
	return str
}
function talkBegin () {
	inquirer
		.prompt([
			{
				type: 'input',
				name: 'theme',
				message: '输入你的问题?'
			}
		])
		.then(answers => {
			console.log(replaceStr(answers.theme))
			talkBegin()
		})
}
talkBegin() */

/* (async function () {
  var Git = require("nodegit")
  // var path = require("path")
  let tmp = await Git.Repository.open('.')
  console.log(tmp)
  // let newBranch = await Git.Branch.create(tmp, 'develop')
  // console.log(newBranch)
  let tmp1 = await tmp.createBranch('develop', '测试1', 1)
  console.log(tmp1)
})() */

const childProcess = require('child_process')
const branch = childProcess.execSync('git rev-parse --abbrev-ref HEAD').toString().replace(/\s+/, '')

console.log(childProcess.execSync('git checkout develop'))
console.log(childProcess.execSync('git pull'))
console.log(childProcess.execSync('git checkout -b ' + branch + 'dev'))
console.log(childProcess.execSync('git merge ' + branch))
