function getDataGrd(period, start, end) {
	
	return fetch(`https://data.ostable.org/api/v1/candles/GRD-GBYTE/?period=${period}&start=${start}&end=${end}`)
		.then(response => {
			return response.json()
		})
		.then(json => {
			console.log(json);
			return json.map(item => {
				return {
					t: parseFloat(moment(item.start_timestamp).format('x')),
					o: item.open_price,
					h: item.highest_price,
					l: item.lowest_price,
					c: item.close_price
				}
			})
		})
		.then(json => {
			console.log(json);
			var ctx = document.getElementById('chartgrd').getContext('2d');
			ctx.canvas.width = 1000;
			ctx.canvas.height = 250;
			var chart = new Chart(ctx, {
				type: 'candlestick',
				data: {
					datasets: [{
						label: 'GRD Price [GBYTE]',
						data: json
					}]
				}
			});
			var update = function () {
				var dataset = chart.config.data.datasets[0];

				// from date
				var fromDate = document.getElementById('fromDate').value;

				// to date
				var toDate = document.getElementById('toDate').value;

				// period
				var period = document.getElementById('period').value;

				if(!!fromDate || !!toDate || !!period){
					console.log('###');
					console.log(period);
					console.log(fromDate);
					console.log(toDate);
					if(!toDate) {
						console.log('!toDate');
						getDataGrd(period, fromDate, moment().format('YYYY-MM-DD'));
					} else {
						getDataGrd(period, fromDate, toDate);
					} 
					
				}
				

			
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
			
				chart.update();
			};
			document.getElementById('update').addEventListener('click', update);
			return json;
		})
}

getDataGrd('daily', '2020-09-22', moment().format('YYYY-MM-DD'));


// function getDataGrb() {
// 	return fetch('https://data.ostable.org/api/v1/candles/GRB-GBYTE/?period=daily&start=2020-09-22&end=2020-10-09')
// 		.then(response => {
// 			return response.json()
// 		})
// 		.then(json => {
// 			console.log(json);
// 			return json.map(item => {
// 				return {
// 					t: parseFloat(moment(item.start_timestamp).format('x')),
// 					o: item.open_price,
// 					h: item.highest_price,
// 					l: item.lowest_price,
// 					c: item.close_price
// 				}
// 			})
// 		})
// 		.then(json => {
// 			console.log(json);
// 			var ctx = document.getElementById('chartgrb').getContext('2d');
// 			ctx.canvas.width = 1000;
// 			ctx.canvas.height = 250;
// 			var chart = new Chart(ctx, {
// 				type: 'candlestick',
// 				data: {
// 					datasets: [{
// 						label: 'GRB Price [GBYTE]',
// 						data: json
// 					}]
// 				}
// 			});
// 			return json;
// 		})
// }

// getDataGrb();


// function getDataGrau() {
// 	return fetch('https://data.ostable.org/api/v1/candles/GRAU-GBYTE/?period=daily&start=2020-09-22&end=2020-10-09')
// 		.then(response => {
// 			return response.json()
// 		})
// 		.then(json => {
// 			console.log(json);
// 			return json.map(item => {
// 				return {
// 					t: parseFloat(moment(item.start_timestamp).format('x')),
// 					o: item.open_price,
// 					h: item.highest_price,
// 					l: item.lowest_price,
// 					c: item.close_price
// 				}
// 			})
// 		})
// 		.then(json => {
// 			console.log(json);
// 			var ctx = document.getElementById('chartgrau').getContext('2d');
// 			ctx.canvas.width = 1000;
// 			ctx.canvas.height = 250;
// 			var chart = new Chart(ctx, {
// 				type: 'candlestick',
// 				data: {
// 					datasets: [{
// 						label: 'GRAU Price [GBYTE]',
// 						data: json
// 					}]
// 				}
// 			});
// 			return json;
// 		})
// }

// getDataGrau();
