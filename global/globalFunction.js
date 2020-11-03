const convert = require('xml-js');


const convert_option = {
    compact: true,
    spaces: 4
}


// this function get xml data and return json
function convertXmlToJson(xml) {
    let jsonResponse = convert.xml2json(xml, convert_option);
    jsonResponse = JSON.parse(jsonResponse);


    return jsonResponse;
}

//this function get json and return xml
function convertJsonToXml(jsonResponse) {
    let xml = convert.js2xml(jsonResponse, convert_option);

    return xml;
}


function generateRand(length, onlyNumbers) {
    var result = "";
    var characters = !onlyNumbers
      ? "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz123456789"
      : "0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      let newChar = characters.charAt(
        Math.floor(Math.random() * charactersLength)
      );
      if (i == 0 && newChar == "0") i--;
      else result += newChar;
    }
    return result;
  }

module.exports.convertXmlToJson = convertXmlToJson;
module.exports.convertJsonToXml = convertJsonToXml;
module.exports.generateRand = generateRand;