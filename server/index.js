const http = require('http');
const url = require('url');
const API_ROOT = '/topMovies';
const DB_ROOT = 'http://localhost:3000';

const proxyServer = http.createServer((request, response) => {
  const parsedUrl = url.parse(request.url);

  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', '*');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.setHeader('Content-Type', 'text/plain;charset=utf-8');

  if (parsedUrl.pathname.startsWith(API_ROOT)) {
    http.get(`${DB_ROOT}${parsedUrl.pathname}`, res => {
      let body = '';
      res.on('data', data => {
        body += data;
      });
      res.on('end', () => {
        response.statusCode = res.statusCode;
        response.end(body);
      });
    }).on('error', error => {
      console.log('代理失败:' + error.message)
    });
  } else {
    response.statusCode = 404;
    response.end('请求正确的地址');
  }
});


proxyServer.listen(8888, () => {
  console.log('The proxyServer is running at http://localhost:8888');
});