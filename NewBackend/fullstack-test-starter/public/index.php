<?php

// Handle CORS headers first, before any other processing
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Max-Age: 86400');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 0); // Don't display errors in output
ini_set('log_errors', 1);

try {
    require_once __DIR__ . '/../vendor/autoload.php';

    // Parse the request URI to remove the base path
    $requestUri = $_SERVER['REQUEST_URI'];
    $basePath = '/scandiFinal/NewBackend/fullstack-test-starter/public';
    $path = str_replace($basePath, '', $requestUri);

    // Remove query string if present
    if (($pos = strpos($path, '?')) !== false) {
        $path = substr($path, 0, $pos);
    }

    // Ensure path starts with /
    if (empty($path) || $path[0] !== '/') {
        $path = '/' . $path;
    }

    // If no specific path, default to /graphql
    if ($path === '/' || $path === '/index.php') {
        $path = '/graphql';
    }

    $dispatcher = FastRoute\simpleDispatcher(function (FastRoute\RouteCollector $r) {
        $r->post('/graphql', function () {
            try {
                require_once __DIR__ . '/../src/Controller/GraphQL.php';
                return App\Controller\GraphQL::handle();
            } catch (Exception $e) {
                header('Content-Type: application/json');
                return json_encode([
                    'errors' => [
                        [
                            'message' => $e->getMessage(),
                            'file' => $e->getFile(),
                            'line' => $e->getLine()
                        ]
                    ]
                ]);
            }
        });
        $r->get('/graphql', function () {
            header('Content-Type: application/json');
            return json_encode(['message' => 'GraphQL endpoint ready. Use POST method.']);
        });
        $r->options('/graphql', function () {
            return json_encode(['message' => 'CORS OK']);
        });
    });

    $routeInfo = $dispatcher->dispatch(
        $_SERVER['REQUEST_METHOD'],
        $path
    );

    switch ($routeInfo[0]) {
        case FastRoute\Dispatcher::NOT_FOUND:
            header('HTTP/1.0 404 Not Found');
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Endpoint not found. Try POST to /graphql', 'path' => $path]);
            break;
        case FastRoute\Dispatcher::METHOD_NOT_ALLOWED:
            $allowedMethods = $routeInfo[1];
            header('HTTP/1.0 405 Method Not Allowed');
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Method not allowed. Allowed methods: ' . implode(', ', $allowedMethods)]);
            break;
        case FastRoute\Dispatcher::FOUND:
            $handler = $routeInfo[1];
            $vars = $routeInfo[2];

            if (is_callable($handler)) {
                echo $handler($vars);
            } else {
                echo $handler($vars);
            }
            break;
    }
} catch (Exception $e) {
    header('Content-Type: application/json');
    echo json_encode([
        'errors' => [
            [
                'message' => 'Server error: ' . $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]
        ]
    ]);
}


