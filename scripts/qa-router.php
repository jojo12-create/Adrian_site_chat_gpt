<?php
// The PHP development server otherwise returns the root index.html (HTTP 200)
// for unknown paths. Match the production host's actual 404 during local QA.
$root = dirname(__DIR__) . '/dist';
$path = rawurldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
$file = $root . $path;
if (is_file($file) || (is_dir($file) && is_file($file . '/index.html'))) {
    return false;
}
http_response_code(404);
header('Content-Type: text/html; charset=utf-8');
readfile($root . '/404.html');
