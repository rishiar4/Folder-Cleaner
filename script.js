let fs = require("fs");
let fse = require("fs-extra");
let path = require("path");

let src = process.argv[2];
let dest = process.argv[3];
console.log(src);
console.log(dest);

function getExtension(fileName) {
    return fileName.split('.').pop();
}

function getFolder(extension) {
    let folders = ["Media", "Documents", "Packages", "Codes", "Zip", "Other"];
    if (extension.localeCompare("exe") == 0 || extension.localeCompare("deb") == 0) {
        return folders[2];
    }
    else if (extension.localeCompare("jpeg") == 0 || extension.localeCompare("png") == 0 || extension.localeCompare("jpg") == 0 || extension.localeCompare("gif") == 0 || extension.localeCompare("webm") == 0 || extension.localeCompare("mp4") == 0 || extension.localeCompare("mpv") == 0) {
        return folders[0];
    }
    else if (extension.localeCompare("doc") == 0 || extension.localeCompare("odt") == 0 || extension.localeCompare("pdf") == 0 || extension.localeCompare("pptx") == 0 || extension.localeCompare("txt") == 0 || extension.localeCompare("csv") == 0 || extension.localeCompare("xlsx") == 0) {
        return folders[1];
    }
    else if (extension.localeCompare("java") == 0 || extension.localeCompare("py") == 0 || extension.localeCompare("ipynb") == 0 || extension.localeCompare("cpp") == 0 || extension.localeCompare("c") == 0) {
        return folders[3];
    }
    else if (extension.localeCompare("zip") == 0) {
        return folders[4];
    }
    else {
        return folders[5];
    }
}

function Month(filePath) {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let { mtime } = fs.statSync(filePath);
    console.log(mtime);
    console.log(mtime.getMonth());
    return months[mtime.getMonth()];

}

function Year(filePath){

    let {mtime} = fs.statSync(filePath);
    console.log(mtime);
    console.log(mtime.getFullYear());
    return mtime.getFullYear() + "";
}

function moveFile(src, dest)
{
    fse.move(src, dest, function (err) {
        if (err) return console.error(err)
        console.log("success!")
        console.log(`Moved from ${src} to ${dest}`);
       })
}

function cleanup() {
    let src = arguments[0], dest = arguments[1];

    let list = fs.readdirSync(src);
    for (let i = 0; i < list.length; i++) {
        let fileName = list[i];
        let extension = getExtension(list[i]);
        let folderName = getFolder(extension);
        let filePath = path.join(src, fileName);
        let year = Year(filePath);
        let dirPath = path.join(dest, year);

        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath)
        }

        dirPath = path.join(dirPath, folderName);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath)
        }

        let month = Month(filePath);
        
        dirPath = path.join(dirPath, month);

        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath)
        }
        console.log("*********************")
        let srcPath = path.join(src, fileName );
        let destPath = path.join(dirPath,fileName);
        console.log(srcPath);
        console.log(destPath);
        moveFile(srcPath, destPath);
        
    }

}

cleanup(src, dest);
