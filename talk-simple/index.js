var inquirer = require('inquirer')
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
talkBegin()