#!/usr/bin/env python3
"""Static server for the uniworks brand repo, with insta_posts and
marketing_web kits blocked from being served (return 404)."""
import http.server
import socketserver

PORT = 8011
BLOCKED = ("/ui_kits/insta_posts", "/ui_kits/marketing_web")


class Handler(http.server.SimpleHTTPRequestHandler):
    def _blocked(self):
        path = self.path.split("?", 1)[0].rstrip("/")
        return any(path == b or path.startswith(b + "/") for b in BLOCKED)

    def do_GET(self):
        if self._blocked():
            self.send_error(404, "Not served")
            return
        super().do_GET()

    def do_HEAD(self):
        if self._blocked():
            self.send_error(404, "Not served")
            return
        super().do_HEAD()


socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving on http://localhost:{PORT} (insta_posts + marketing_web blocked)")
    httpd.serve_forever()
