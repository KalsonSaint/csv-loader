/**
 * Custom CSV Loader
 * @codescript
 **/

 //import packages
const fs = require('fs');
const _ = require('lodash');
const shuffleSeed = require('shuffle-seed');

const extractColumns = (data, columnNames) => {
  const headers = _.first(data);
  const indexes = _.map(columnNames, column => headers.indexOf(column));
  const extracted = _.map(data, row => _.pullAt(row, indexes));

  return extracted; 
}

const loadCSV = (filename, { converters = {}, dataColumns = [], labelColumns = [], shuffle = true, splitTest = false }) => {
	let data = fs.readFileSync(filename, {encoding:'utf8'});
	data = data.split('\n').map(row => row.split(','));
	data = data.map(row => _.dropRightWhile(row, val => val === ''));
	const headers = _.first(data);

	data = data.map((row, index) => {
		if(index === 0){
			return row;
		}

		return row.map((element, index) => {
			if(converters[headers[index]]){
				const converted = converters[headers[index]](element);
				return _.isNaN(converted) ? element : converted;
			}
			const result = parseFloat(element);
			return _.isNaN(result) ? element : result;
		})
	})

	let labels = extractColumns(data, labelColumns);
	data = extractColumns(data, dataColumns);

	data.shift();
	labels.shift();

	// shuffle data
	if(shuffle){
		data = shuffleSeed.shuffle(data, 'phrase');
		labels = shuffleSeed.shuffle(labels, 'phrase');
	}

	//splitTest
	if(splitTest){
		const trainSize = _.isNumber(splitTest) ? splitTest : Math.floor(data.length/2);
		return {
			features: data.slice(0, trainSize),
			labels: labels.slice(0, trainSize),
			testFeatures: data.slice(trainSize),
			testLabels: labels.slice(trainSize),
		}
	} else {
		return { features: data, labels }
	}
}

/**
 * @params args
 * args 1: filename(.csv)
 * args 2: options(object)
 */
const { features, labels, testFeatures, testLabels } = loadCSV('data.csv', {
	dataColumns: ['height', 'value'],
	labelColumns: ['passed'],
	shuffle: true,
	splitTest: 1, // value can be boolean or number
	converters: {
		passed: val => val === 'TRUE'		// (val === 'TRUE' ? 1 : 0)
	}
});

console.log(`
	Features: ${features},
	Labels: ${labels},
	Test Features: ${testFeatures},
	Test Labels: ${testLabels}
`)