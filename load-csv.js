const fs = require('fs')
const _ = require('lodash')

const loadCSV = (filename, options) => {
	let data = fs.readFileSync(filename, {encoding:'utf8'});
	data = data.split('\n').map(row => row.split(','));
	data.map(row => _.dropRightWhile(row, val => val === ''))
	console.log(data)
}

loadCSV('data.csv')