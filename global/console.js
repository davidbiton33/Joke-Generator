const convertDateFormat = require('./date');

// white
function normal(msg){
    let date = convertDateFormat(new Date(), 'Date', 'yyyy-MM-dd HH:mm:ss');
    console.log(`${date} - ${msg}`);
}

// yellow msg
function alert(msg) {
    let date = convertDateFormat(new Date(), 'Date', 'yyyy-MM-dd HH:mm:ss');
    console.log('\x1b[33m\x1b[1m%s\x1b[0m', `${date} - ${msg}`);
}

// red msg
function error(msg) {
    let date = convertDateFormat(new Date(), 'Date', 'yyyy-MM-dd HH:mm:ss');
    console.log('\x1b[31m\x1b[1m%s\x1b[0m', `${date} - ${msg}`);
}

// green
function msg(msg) {
    let date = convertDateFormat(new Date(), 'Date', 'yyyy-MM-dd HH:mm:ss');
    console.log('\x1b[32m\x1b[1m%s\x1b[0m', `${date} - ${msg}`);
}

// purple
function specialMsg(msg) {
    let date = convertDateFormat(new Date(), 'Date', 'yyyy-MM-dd HH:mm:ss');
    console.log('\u001b[35m\x1b[1m%s\x1b[0m', `${date} - ${msg}`);
}

// blue
function info(msg) {
    let date = convertDateFormat(new Date(), 'Date', 'yyyy-MM-dd HH:mm:ss');
    console.log('\u001b[36m\x1b[1m%s\x1b[0m', `${date} - ${msg}`);
}

var counter = 0;
module.exports.counter = counter;

module.exports.normal = normal;
module.exports.alert = alert;
module.exports.error = error;
module.exports.specialMsg = specialMsg;
module.exports.info = info;
module.exports.msg = msg;