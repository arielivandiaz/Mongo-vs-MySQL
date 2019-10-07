var mongo = require('./mongo');
var mysql = require('./mysql');

mongo.runBechmark(10);
mysql.runBechmark(10,1);
mysql.runBechmark(10,2);

return ;