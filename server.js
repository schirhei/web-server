const express = require('express');

var app = express();

app.use(express.static(__dirname + '/public'));



app.get('/', (request, response) => {
	response.send({
		name:'dont ask',
		school:[
			"hogwarts",
			'big boi school'
		]
	})
});

app.get('/info', (request, response) => {
	response.send('welcome to my crib');
});

app.get('/404', (request, response) => {
	response.send('u wrong bro');
});

app.listen(8080, () => {
	console.log('server is up on port 8080')
});