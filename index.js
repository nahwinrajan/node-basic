const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

const mimeTypes = {
  'html':'text/html',
  'jpeg': 'image/jepg',
  'jpg': 'image/jpg',
  'png': 'image/png',
  'js': 'text/javascript',
  'css': 'text/css'
}

http.createServer(function(req, res){
  let uri = url.parse(req.url).pathname;
  let fileName = path.join(process.cwd(), unescape(uri));
  console.log('Loading: ' + uri);
  console.log('file name: ' + fileName);
  let stats;

  try {
    stats = fs.lstatSync(fileName);
  } catch(e) {
    res.writeHead(404, { 'Content-type': 'text/plain' });
    res.write('Content not found.... \n');
    res.end();
    return;
  }

  //if requested file exist
  if (stats.isFile()){
    //get the extension of the file
    let mimeType = mimeTypes[path.extname(fileName).split(".").reverse()[0]];
    res.writeHead(200, { 'Content-type': mimeType });

    let filesStream = fs.createReadStream(fileName);
    filesStream.pipe(res);
  } else if (stats.isDirectory()) {
    res.writeHead(302, { 'Location': 'index.html' });
    res.end();
  } else {
    res.writeHead(500, { 'Content-type': 'text/plain' });
    res.write('Internal server error.... :( ');
    res.end();
  }

}).listen(1337);
