var ctx = document.getElementById('chart').getContext('2d');
ctx.canvas.width = window.innerWidth / 2;
ctx.canvas.height = window.innerHeight / 2;
var chart = new Chart(ctx, {
	type: 'candlestick',
	data: {
		datasets: [{
			data: [{}]
		}]
	}
});

function getDataGrd(period, start, end, token, addressUrl, token2, oswap, callback) {

	if (oswap === "oswap") {
		console.log(token);
		console.log(token2);
		return fetch(`https://data.oswap.io/api/v1/candles/${token.toUpperCase()}-${token2.toUpperCase()}?period=${period}&start=${start}&end=${end}`)
			.then(response => {
				return response.json()
			})
			.then(json => {
				return json.map(item => {
					return {
						t: parseFloat(moment(item.start_timestamp).format('x')),
						o: item.open_price,
						h: item.highest_price,
						l: item.lowest_price,
						c: item.close_price
					}
				});
			})
			.then(callback)
	} else {
		return fetch(`https://data.ostable.org/api/v1/candles/${token.toUpperCase()}-GBYTE/?period=${period}&start=${start}&end=${end}`)
			.then(response => {
				return response.json()
			})
			.then(json => {
				return json.map(item => {
					return {
						t: parseFloat(moment(item.start_timestamp).format('x')),
						o: item.open_price,
						h: item.highest_price,
						l: item.lowest_price,
						c: item.close_price
					}
				});
			})
			.then(callback)
	}


}

var update = function () {
	var dataset = chart.config.data.datasets[0];
	if (dataset.data.length == 1) dataset.data.pop();

	// candlestick vs ohlc
	var type = document.getElementById('type').value;
	dataset.type = type;

	// linear vs log
	var scaleType = document.getElementById('scale-type').value;
	chart.config.options.scales.y.type = scaleType;

	// color
	var colorScheme = document.getElementById('color-scheme').value;
	if (colorScheme === 'neon') {
		dataset.color = {
			up: '#01ff01',
			down: '#fe0000',
			unchanged: '#999',
		};
	} else {
		delete dataset.color;
	}

	// border
	var border = document.getElementById('border').value;
	var defaultOpts = Chart.defaults.elements[type];
	if (border === 'true') {
		dataset.borderColor = defaultOpts.borderColor;
	} else {
		dataset.borderColor = {
			up: defaultOpts.color.up,
			down: defaultOpts.color.down,
			unchanged: defaultOpts.color.up
		};
	}

	// from date
	var fromDate = document.getElementById('fromDate').value;
	// to date
	var toDate = document.getElementById('toDate').value;
	// period
	var period = document.getElementById('period').value;
	// token
	var token = document.getElementById('token').value.split(',')[0];

	var addressUrl = document.getElementById('token').value.split(',')[1];

	var token2 = document.getElementById('token').value.split(',')[2];

	var oswap = document.getElementById('token').value.split(',')[3];

	if (!!token2) {
		getDataGrd(period, fromDate, toDate, token, addressUrl, token2, oswap, function (json) {
			if (Object.keys(json).length < 2) {
				json = [{}];
				alert('not enough data available');
			}
			dataset.label = `${token.toUpperCase()} Price in ${token2.toUpperCase()}`;
			dataset.data = json;
			chart.update();
			document.getElementById("actions").innerHTML = `
                <a href="https://oswap.io/#/swap/${addressUrl}" target="_blank">
				<button class="btn btn-primary">Trade ${token.toUpperCase()}-${token2.toUpperCase()}</button>
                </a>`;
		});
	} else {
		getDataGrd(period, fromDate, toDate, token, addressUrl, token2, oswap, function (json) {
			if (Object.keys(json).length < 2) {
				json = [{}];
				alert('not enough data available');
			}
			dataset.label = `${token.toUpperCase()} Price [GBYTE]`;
			dataset.data = json;
			chart.update();
			document.getElementById("actions").innerHTML = `
                <a href="https://ostable.org/trade/${addressUrl}#buy" target="_blank">
                    <button class="btn btn-primary">Buy or Sell ${token.toUpperCase()}</button>
                </a>`;
		});
	}


};

var period = function () {
	// period
	var period = document.getElementById('period').value;
	if (period === 'daily') {
		document.getElementById('fromDate').value = moment().subtract(30, 'days').format('YYYY-MM-DD');
		document.getElementById('toDate').value = moment().add(1, 'days').format('YYYY-MM-DD');
	}
	else if (period === 'hourly') {
		document.getElementById('fromDate').value = moment().subtract(2, 'days').format('YYYY-MM-DD');
		document.getElementById('toDate').value = moment().add(1, 'days').format('YYYY-MM-DD');
	}
};


$('#period,#token,#fromDate,#toDate,#type,#scale-type,#color-scheme,#border').on('change', function () {
	var dataset = chart.config.data.datasets[0];
	if (dataset.data.length == 1) dataset.data.pop();

	// candlestick vs ohlc
	var type = document.getElementById('type').value;
	dataset.type = type;

	// linear vs log
	var scaleType = document.getElementById('scale-type').value;
	chart.config.options.scales.y.type = scaleType;

	// color
	var colorScheme = document.getElementById('color-scheme').value;
	if (colorScheme === 'neon') {
		dataset.color = {
			up: '#01ff01',
			down: '#fe0000',
			unchanged: '#999',
		};
	} else {
		delete dataset.color;
	}

	// border
	var border = document.getElementById('border').value;
	var defaultOpts = Chart.defaults.elements[type];
	if (border === 'true') {
		dataset.borderColor = defaultOpts.borderColor;
	} else {
		dataset.borderColor = {
			up: defaultOpts.color.up,
			down: defaultOpts.color.down,
			unchanged: defaultOpts.color.up
		};
	}

	// from date
	var fromDate = document.getElementById('fromDate').value;
	// to date
	var toDate = document.getElementById('toDate').value;
	// period
	var period = document.getElementById('period').value;
	// token
	var token = document.getElementById('token').value.split(',')[0];

	var addressUrl = document.getElementById('token').value.split(',')[1];

	var token2 = document.getElementById('token').value.split(',')[2];

	var oswap = document.getElementById('token').value.split(',')[3];

	if (!!token2) {
		getDataGrd(period, fromDate, toDate, token, addressUrl, token2, oswap, function (json) {
			if (Object.keys(json).length < 2) {
				json = [{}];
				alert('not enough data available');
			}
			dataset.label = `${token.toUpperCase()} Price in ${token2.toUpperCase()}`;
			dataset.data = json;
			chart.update();
			document.getElementById("actions").innerHTML = `
                <a href="https://oswap.io/#/swap/${addressUrl}" target="_blank">
                    <button class="btn btn-primary">Trade ${token.toUpperCase()}-${token2.toUpperCase()}</button>
                </a>`;
		});
	} else {
		if (!!fromDate || !!toDate || !!period || !!token) {
			getDataGrd(period, fromDate, toDate, token, addressUrl, token2, oswap, function (json) {
				if (Object.keys(json).length < 2) {
					json = [{}];
					alert('not enough data available');
				}
				dataset.label = `${token.toUpperCase()} Price [GBYTE]`;
				dataset.data = json;
				chart.update();
				document.getElementById("actions").innerHTML = `
                <a href="https://ostable.org/trade/${addressUrl}#buy" target="_blank">
                    <button class="btn btn-primary">Buy or Sell ${token.toUpperCase()}</button>
                </a>`;
			});
		}
	}
});

$(document).ready(function () {
	period();
	update();
});


