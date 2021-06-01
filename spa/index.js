var express = require("express");
var app = express();
app.use('/static',express.static(__dirname + '/static'))
app.listen(4000, () => {
 console.log("Server running on port 4000");
});
