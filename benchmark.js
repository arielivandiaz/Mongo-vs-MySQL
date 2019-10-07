var mongo = require('./mongo');
var mysql = require('./mysql');

mongo.runBechmark(4);
mysql.runBechmark(4,1);

return ;