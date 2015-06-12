var exports = module.exports = {};

exports.isEmptyJSON = function(obj) {
	var name;

 	for(name in obj) {
 		return false; 
 	}

  	return true;
};

exports.isJsonString = function(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}