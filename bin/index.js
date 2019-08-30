#!/usr/bin/env node
const program = require('commander')
var ProgressBar = require('progress')
var bar = new ProgressBar('downloading [:bar] :rate/bps :percent :etas', { total: 1024, width: 20 })
var timer = setInterval(function () {
  bar.tick(2)
  if (bar.complete) {
    console.log('\ncomplete\n');
    clearInterval(timer);
  }
}, 1000)
program
  // .version('0.0.1')
  .description('A cli application named talk-simple')
program
  .option('-d, --debug', 'output extra debugging')
  .option('-a, --abc', 'output extra abc')
  .option('-s, --small', 'small pizza size')
  .option('-p, --pizza-type <type>', 'flavour of pizza')
  .option('-V, --version', '版本', function() {
    console.log('当前版本')
  })
  .option('-f, --float <number>', 'float argument', function(value, dummyPrevious) {
    console.log('----->', value)
    console.log('----->', dummyPrevious)
    return parseFloat(value)
  })
  .option('--no-sauce', 'Remove sauce', function() {
    console.log('执行')
  })
program.parse(process.argv)
// if (program.float !== undefined) console.log(`float: ${program.float}`);
// if (program.small) console.log('- small pizza size');
// if (program.pizzaType) console.log(`- ${program.pizzaType}`)




// require('../talk-simple/index')