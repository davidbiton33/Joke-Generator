const mathSupport = require('./math-support');

module.exports = function (value, sourceFormat, resultFormat, timeZone, sign) {
    if (!value || !sourceFormat || !resultFormat) return null;

    let middleFormat = null; // change all sourceFormat to datetime object

    switch (sourceFormat) {
        case 'Date': {
            middleFormat = value;
            break;
        }
        case 'dd/MM/yyyy HH:mm:ss':
        case 'dd-MM-yyyy HH:mm:ss': {
            let d = +(value.substring(0, 2));
            let M = +(value.substring(3, 5));
            let y = +(value.substring(6, 10));
            let h = +(value.substring(11, 13));
            let m = +(value.substring(14, 16));
            let s = +(value.substring(17, 19));

            middleFormat = new Date(y, M - 1, d, h, m, s);
            break;
        }
        case 'yyyy-MM-dd HH:mm:ss': {
            let y = +(value.substring(0, 4));
            let M = +(value.substring(5, 7));
            let d = +(value.substring(8, 10));
            let h = +(value.substring(11, 13));
            let m = +(value.substring(14, 16));
            let s = +(value.substring(17, 19));

            middleFormat = new Date(y, M - 1, d, h, m, s);
            break;
        }
        case 'yyyyMMddTHHmmss+0200': {
            let y = +(value.substring(0, 4));
            let M = +(value.substring(4, 6));
            let d = +(value.substring(6, 8));
            let h = +(value.substring(9, 11));
            let m = +(value.substring(11, 13));
            let s = +(value.substring(13, 15));

            middleFormat = new Date(y, M - 1, d, h, m, s);
            break;
        }
    }

    switch (resultFormat) {
        case 'Date': {
            return middleFormat;
        }
        case 'yyyy-MM-dd HH:mm:ss': {
            return middleFormat.getFullYear() + '-' +
                mathSupport.correctZero(middleFormat.getMonth() + 1) + '-' +
                mathSupport.correctZero(middleFormat.getDate()) + ' ' +
                mathSupport.correctZero(middleFormat.getHours()) + ':' +
                mathSupport.correctZero(middleFormat.getMinutes()) + ':' +
                mathSupport.correctZero(middleFormat.getSeconds());
        }
        case 'dd-MM-yyyy HH:mm:ss': {
            return mathSupport.correctZero(middleFormat.getDate()) + '-' +
                mathSupport.correctZero(middleFormat.getMonth() + 1) + '-' +
                middleFormat.getFullYear() + ' ' +
                mathSupport.correctZero(middleFormat.getHours()) + ':' +
                mathSupport.correctZero(middleFormat.getMinutes()) + ':' +
                mathSupport.correctZero(middleFormat.getSeconds());
        }
        case 'dd/MM/yyyy HH:mm:ss': {
            return mathSupport.correctZero(middleFormat.getDate()) + '/' +
                mathSupport.correctZero(middleFormat.getMonth() + 1) + '/' +
                middleFormat.getFullYear() + ' ' +
                mathSupport.correctZero(middleFormat.getHours()) + ':' +
                mathSupport.correctZero(middleFormat.getMinutes()) + ':' +
                mathSupport.correctZero(middleFormat.getSeconds());
        }
        case "yyyy-MM-ddThh:mm:ss+hh:mm": {
            timeZone = timeZone.substring(4, 5);

            return middleFormat.getFullYear() + '-' +
                mathSupport.correctZero(middleFormat.getMonth() + 1) + '-' +
                mathSupport.correctZero(middleFormat.getDate()) + 'T' +
                mathSupport.correctZero(middleFormat.getHours()) + ':' +
                mathSupport.correctZero(middleFormat.getMinutes()) + ':' +
                mathSupport.correctZero(middleFormat.getSeconds()) + '+' +
                mathSupport.correctZero(timeZone) + ':00';
        }
        case "yyyy-mm-ddThh:mm:ssZ": {
            if (sign == "+") {
                //clear the time zone
                middleFormat.setTime(middleFormat.getTime() + middleFormat.getTimezoneOffset() * 60 * 1000);
                //add 5 Minutes
                middleFormat.setMinutes(middleFormat.getMinutes() + 5);
                //in Summer need to add ome 1 more to the search
                middleFormat.setHours(middleFormat.getHours() + 1);

                return middleFormat.getFullYear() + '-' +
                    mathSupport.correctZero(middleFormat.getMonth() + 1) + '-' +
                    mathSupport.correctZero(middleFormat.getDate()) + 'T' +
                    mathSupport.correctZero(middleFormat.getHours()) + ':' +
                    mathSupport.correctZero(middleFormat.getMinutes()) + ':' +
                    mathSupport.correctZero(middleFormat.getSeconds()) + 'Z';
            } else if (sign == "-") {
                //clear the time zone
                middleFormat.setTime(middleFormat.getTime() + middleFormat.getTimezoneOffset() * 60 * 1000);
                //minus 5 Minutes
                middleFormat.setMinutes(middleFormat.getMinutes() - 5);
                //in Summer need to add ome 1 more to the search
                middleFormat.setHours(middleFormat.getHours() + 1);

                return middleFormat.getFullYear() + '-' +
                    mathSupport.correctZero(middleFormat.getMonth() + 1) + '-' +
                    mathSupport.correctZero(middleFormat.getDate()) + 'T' +
                    mathSupport.correctZero(middleFormat.getHours()) + ':' +
                    mathSupport.correctZero(middleFormat.getMinutes()) + ':' +
                    mathSupport.correctZero(middleFormat.getSeconds()) + 'Z';
            }
        }
    }
}