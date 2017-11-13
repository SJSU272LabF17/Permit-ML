var path = require('path');
var fs = require('fs');


exports.getFiles = function(username, filepath) {
    var userpath = this.getUserPath(username);
    var absolutePath = userpath + filepath;
    console.log('load file absolutePath: ' + absolutePath);

    if (filepath === '/') {
        if (!fs.existsSync(absolutePath)) {
            fs.mkdirSync(absolutePath, 0744);
        }
    }

    if (!fs.existsSync(absolutePath)) {
        return [];
        // _res.status(400).send({status_code: 400, message: 'path does not exist'});
    } else {
        var files = [];
        fs.readdirSync(absolutePath).forEach(file => {
            if(file.charAt(0) === '.')
                return;

            var filepath = absolutePath + file;
            // console.log("filepath = " + filepath);
            var stats = fs.lstatSync(filepath);

            if (stats) {
                // console.log('file ' + file + ' exists, stat = ' + JSON.stringify(stats) + ", isDir = " + stats.isDirectory() + ", isFile = " + stats.isFile() + ", isDir = " + stats.isDirectory());
                files.push({
                    "folder": stats.isDirectory(),
                    "size": stats.size,
                    "mtime": stats.mtime,
                    "name": file + (stats.isDirectory() ? '/' : ''),
                });
            } else {
                console.log('file ' + file + ' does not exist');
            }
        });

        var files = this.getFilesHumanReadable(files);
        return files;
    }
};

exports.getUserPath = function(username){
    var userpath = appRootDir+'/uploads/u/'+username;
    return userpath;
}

exports.getFilesHumanReadable = function(files) {
    files.map(function (file, index) {
        files[index].size = getHumanSize(file.size);
        files[index].mtime = getHumanTime(file.mtime);
        return files[index];
    });
    return files;
}

function getHumanSize(size) {
    var hz;
    if (size < 1024) hz = size + ' B';
    else if (size < 1024*1024) hz = (size/1024).toFixed(2) + ' KB';
    else if (size < 1024*1024*1024) hz = (size/1024/1024).toFixed(2) + ' MB';
    else hz = (size/1024/1024/1024).toFixed(2) + ' GB';
    return hz;
}

function getHumanTime(timestamp) {
    var t = new Date(timestamp);
    return getNumWithLeadingZero(t.getMonth()+1) + '/' + getNumWithLeadingZero(t.getDate()) + '/' + t.getFullYear() + ' ' + getNumWithLeadingZero(t.getHours()) + ':' + getNumWithLeadingZero(t.getMinutes()) + ':' + getNumWithLeadingZero(t.getSeconds());
}

function getNumWithLeadingZero(num){
    var newNum = ('0'+num).slice(-2);
    return newNum;
}