var express = require('express'),
	app = express();

app.use(require('./controller'));

app.listen(3000, function() {
  console.log('Mixer Listening on port 3000...')
})
