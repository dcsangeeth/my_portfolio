#!/usr/bin/env python3
"""
Portfolio Dev Server
- Serves all static files from d:/Projects/Portfollio
- POST /save-data  → writes body JSON to data/portfolio-data.json directly
"""
import http.server, json, os, sys
from pathlib import Path

ROOT = Path(r"D:\My Portfolio\my_portfolio")
DATA_FILE = ROOT / "data" / "portfolio-data.json"
PORT = 5500

class PortfolioHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_OPTIONS(self):
        self.send_response(200)
        self._send_cors()
        self.end_headers()

    def do_POST(self):
        if self.path in ('/save-data', '/save-data/'):
            length = int(self.headers.get('Content-Length', 0))
            body   = self.rfile.read(length)
            try:
                data = json.loads(body)                   # validate JSON
                DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
                DATA_FILE.write_text(
                    json.dumps(data, ensure_ascii=False, indent=2),
                    encoding='utf-8'
                )
                self.send_response(200)
                self._send_cors()
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(b'{"ok":true}')
                print(f"[SAVED] portfolio-data.json updated ({len(body)} bytes)")
            except Exception as e:
                self.send_response(400)
                self._send_cors()
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"ok": False, "error": str(e)}).encode())
                print(f"[ERROR] {e}")
        else:
            self.send_response(404)
            self.end_headers()

    def _send_cors(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def log_message(self, fmt, *args):
        # Only log non-asset requests
        if not any(args[0].endswith(ext) for ext in ['.css','.js','.png','.jpg','.ico','.woff2']):
            super().log_message(fmt, *args)

if __name__ == '__main__':
    os.chdir(ROOT)
    port = PORT
    while True:
        try:
            httpd = http.server.HTTPServer(('', port), PortfolioHandler)
            break
        except OSError as e:
            if getattr(e, 'winerror', 0) in (10013, 10048) or "Address already in use" in str(e):
                port += 1
            else:
                raise

    print(f"[SERVER] Portfolio running at http://localhost:{port}")
    if port != PORT:
        print(f"   (Port {PORT} was in use, automatically switched to {port})")
    print(f"   POST /save-data  writes to: {DATA_FILE.name}")
    print("   Press Ctrl+C to stop.\n")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[STOPPED] Server stopped.")
