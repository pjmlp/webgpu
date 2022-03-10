# Basic HTTP server, in case none is available for testing purposes

import http.server
import socketserver

PORT = 8080

Handler = http.server.SimpleHTTPRequestHandler
Handler.extensions_map.update({
      ".js": "text/javascript",
      ".wgsl": "text/plain",
});

httpd = socketserver.TCPServer(("", PORT), Handler)
httpd.serve_forever()