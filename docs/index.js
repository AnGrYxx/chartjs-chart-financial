var ctx = document.getElementById('chart').getContext('2d');
ctx.canvas.width = window.innerWidth/2;
ctx.canvas.height = window.innerHeight/2;

function getDataGrd(period, start, end, token, callback) {
	
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

var update = function () {
	// from date
	var fromDate = document.getElementById('fromDate').value;
	// to date
	var toDate = document.getElementById('toDate').value || moment().format('YYYY-MM-DD');
	// period
	var period = document.getElementById('period').value;
	// token
	var token = document.getElementById('token').value;

	if(!!fromDate || !!toDate || !!period || !!token){
		getDataGrd(period, fromDate, toDate, token, function(json) {
			dataset = {
				label: `${token.toUpperCase()} Price [GBYTE]`,
				data: json
			};

			// candlestick vs ohlc
			var type = document.getElementById('type').value;

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

			var chart = new Chart(ctx, {
				type: type,
				data: {
					datasets: [dataset]
				}
			});

			chart.update();
		});
	}
};

document.getElementById('update').addEventListener('click', update);

(function() {
	update();
})();