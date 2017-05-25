var express = require('express'),
    app = express();

var port = 8000;

app.use(express.static('public'));

app.get('*', function(req, res){
	res.redirect('/');  //redirect back to index route
});

app.listen(port, function() {
  console.log("Front end running ", port);
});
