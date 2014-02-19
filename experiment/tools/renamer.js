// renames famous packages

var fs = require('fs');
var path = require('path');
var util = require('util');

var packages = _walkDir('../js');

function _walkDir(dirName, prefix, result) {
    if(!prefix) prefix = '';
    if(!result) result = [];
    var contents = fs.readdirSync(dirName);
    for(var i = 0; i < contents.length; i++) {
        if(fs.statSync(dirName + '/' + contents[i]).isDirectory()) {
            // more specific directories first to avoid conflicts later
            _walkDir(dirName + '/' + contents[i], prefix + contents[i] + '/', result);
            result.push(prefix + contents[i]);
        }
    }
    return result;
}

var modules = [];
for(var j = 0; j < packages.length; j++) {
    var pkgName = packages[j];
    var dirName = '../js/' + pkgName;
    var dirFiles = fs.readdirSync('../js/' + pkgName);
    for(var i = 0; i < dirFiles.length; i++) {
        modules.push(path.basename(dirFiles[i], '.js'));
    }
}

var result = fs.readFileSync(process.argv[2], 'utf8');
for(var i = 0; i < packages.length; i++) {
    result = result.replace(new RegExp('[\'"]' + packages[i] + '\\/([^\'",]+)[\'"]','g'), '\'' + i.toString(36) + '/$1\'');
}
for(var i = 0; i < modules.length; i++) {
    result = result.replace(new RegExp('[\'"]([^\'",\\/]+)\\/' + modules[i] + '(![^\'",]+)?[\'"]','g'), '\'$1/' + i.toString(36) + '$2\'');
}

util.puts(result);
