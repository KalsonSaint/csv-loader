const fs = require('fs')

const loadCSV = (filename, options) => {
	const data = fs.readFileSync(filename, {encoding:'utf8'});
	data.split('\n').map(row => row.split(','))
}

loadCSV('data.csv')