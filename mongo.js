var mongo = require('mongoose');
const process = require('process');

var url = "mongodb://localhost:27017/test";


var test_a = mongo.Schema({
    id: Number,
    value_1: Number,
    value_2: Number,
    value_3: Number,
    value_4: Number,
    seq: Number,
    created: {
        type: Date,
        default: Date.now
    }
});


var Data_A = mongo.model('Data_A', test_a, 'test_a');


var dv = 1000000000; //default value
var ev = dv; //end value
var nv = 9182506147; //update value


const MAX_TIME_MS = 999000000;


let insert = async (seconds) => {

    var iterations = 1;
    var count = 0;
    var value = dv;
    var total_count = 0;
    var start = process.hrtime()

    while (true) {

        var new_obj = new Data_A({
            value_1: value,
            value_2: value,
            value_3: value,
            value_4: value
        });

        var result = await new_obj.save();

        value++;
        count++;


        var end = process.hrtime(start);
        if (end[1] > MAX_TIME_MS || end[0] > 0) {
            iterations++;
            console.info('Rows :\t %d \tExecution time: %ds %dms', count, end[0], end[1] / 1000000);
            total_count += count;
            count = 0;
            if (iterations > seconds) {
                ev += total_count;
                return total_count;
            }
            start = process.hrtime();
        }
    }
};

let select = async (seconds) => {

    var iterations = 1;
    var count = 0;
    var total_count = 0;
    var value = dv;
    var start = process.hrtime()

    while (true) {
        var result = await Data_A.find({
            value_1: value
        });

        if (result.length == 0) console.info('Error at value:', value);

        value++;
        if (value == ev) value = dv;
        count++;

        var end = process.hrtime(start);
        if (end[1] > MAX_TIME_MS || end[0] > 0) {

            iterations++;
            console.info('Rows :\t %d \tExecution time: %ds %dms', count, end[0], end[1] / 1000000);

            total_count += count;
            count = 0;
            if (iterations > seconds) {
                return total_count;
            }
            start = process.hrtime();
        }
    }
};


let update = async (seconds) => {

    var iterations = 1;
    var count = 0;
    var total_count = 0;
    var value = dv;
    var start = process.hrtime()

    while (true) {
        var result = await Data_A.updateOne({
            value_1: value
        }, {
            value_4: nv
        });

        if (result.length == 0) console.info('Error at value:', value);

        value++;
        if (value == ev) value = dv;
        count++;

        var end = process.hrtime(start);
        if (end[1] > MAX_TIME_MS || end[0] > 0) {

            iterations++;
            console.info('Rows :\t %d \tExecution time: %ds %dms', count, end[0], end[1] / 1000000);
            total_count += count;
            count = 0;
            if (iterations > seconds) {
                return total_count;
            }
            start = process.hrtime();
        }
    }
};

let mdelete = async (seconds) => {

    var iterations = 1;
    var count = 0;
    var total_count = 0;
    var value = dv;
    var start = process.hrtime()

    while (true) {
        if (value < ev) {
            var result = await Data_A.deleteOne({
                value_1: value
            });

            //if (result.deletedCount == 0) console.info('Error at value:', value);
            count++;
            value++;
        } else {
            total_count += count;
            var end = process.hrtime(start);
            console.info('Rows :\t %d \tExecution time: %ds %dms', count, end[0], end[1] / 1000000);
            return total_count;
        }

        var end = process.hrtime(start);
        if (end[1] > MAX_TIME_MS || end[0] > 0) {
            iterations++;
            console.info('Rows :\t %d \tExecution time: %ds %dms', count, end[0], end[1] / 1000000);
            total_count += count;
            count = 0;
            if (iterations > seconds) {
                return total_count;
            }
            start = process.hrtime();
        }
    }
};


let runBechmark = async (seconds) => {


    //Connect initialization with await to solve mongo init/connect delay
    var connect = await mongo.connect(url, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    });


    var inserts = await insert(seconds);

    if (inserts) {
        console.info('Rows :\t %d Inserted \n', inserts);
        var selects = await select(seconds);
    }


    if (selects) {
        console.info('Rows :\t %d Selected \n', selects);
        var updates = await update(seconds);
    }

    if (updates) {
        console.info('Rows :\t %d Updated \n', updates);
        var deletes = await mdelete(seconds);
    }

    if (deletes) {
        console.info('Rows :\t %d Deleted \n', deletes);
    }

    connect.disconnect();
    return 0;
}


module.exports = {
    runBechmark
}