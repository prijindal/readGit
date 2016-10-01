var static = require('node-static');
var file = new static.Server(__dirname + '/platforms/browser/www', { gzip: true });
require('http').createServer(function(request, response) {
  request.addListener('end', function() {
    file.serve(request, response);
  }).resume();
}).listen(process.env.PORT || 3000);
