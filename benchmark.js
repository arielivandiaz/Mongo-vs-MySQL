var mongo = require('./mongo');
var mysql = require('./mysql');

var seconds= 10;

let main = () =>{

console.log("Start Mongo Test #1");
mongo.runBechmark(seconds).then((resolve) => {
    console.log(resolve);
    console.log("Start MySQL Test #1");
    mysql.runBechmark(seconds, 1).then((resolve) => {
        console.log(resolve);
        console.log("Start MySQL Test #2");
        mysql.runBechmark(seconds, 2).then((resolve) => {
            console.log(resolve);
            return;
        });
    });
});

};

main();