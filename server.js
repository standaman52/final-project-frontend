var express = require('express'),
    app = express();

var port = 8000;

app.use(express.static('public'));

app.listen(port, function() {
  console.log("Front end running ", port);
});
