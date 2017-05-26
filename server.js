var express = require('express'),
    app = express();

var port = process.env.PORT || 8000;



app.get('*', function(req, res){
	res.redirect('/');  //redirect back to index route
});

app.use(express.static('public'));

app.listen(port, function() {
  console.log("Front end running ", port);
});
