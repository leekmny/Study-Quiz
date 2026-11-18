const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const root = require("./build.cjs")();
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
};
const port = Number(process.env.PORT || 4173);
const server = http.createServer((request, response) => {
  let file;
  try {
    const name = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
    file = path.resolve(root, "." + (name === "/" ? "/index.html" : name));
    if (!file.startsWith(root + path.sep) || !fs.statSync(file).isFile())
      throw Error();
  } catch {
    response.writeHead(404);
    response.end("Not found");
    return;
  }
  response.writeHead(200, {
    "Content-Type": types[path.extname(file)] || "application/octet-stream",
    "X-Content-Type-Options": "nosniff",
  });
  if (request.method === "HEAD") response.end();
  else fs.createReadStream(file).pipe(response);
});
server.on("error", (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
server.listen(port, "127.0.0.1", () =>
  console.log(`QUIZ LAB: http://localhost:${port}`),
);
