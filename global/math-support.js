function correctZero(num) {
    return num >= 10 ? num : '0' + num;
}

module.exports.correctZero = correctZero;