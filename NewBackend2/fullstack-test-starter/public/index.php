<?php

// Устанавливаем CORS заголовки
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin');
header('Access-Control-Max-Age: 86400');
header('Content-Type: application/json; charset=utf-8');

// Обработка preflight запросов
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}


require_once __DIR__ . '/../vendor/autoload.php';


// Временная диагностика
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode([
        'status' => 'GraphQL endpoint is working',
        'method' => $_SERVER['REQUEST_METHOD'],
        'uri' => $_SERVER['REQUEST_URI'],
        'time' => date('Y-m-d H:i:s')
    ]);
    exit;
}

$dispatcher = FastRoute\simpleDispatcher(function (FastRoute\RouteCollector $r) {
    $r->post('/', [App\Controller\GraphQL::class, 'handle']);
    $r->post('/graphql', [App\Controller\GraphQL::class, 'handle']);
});

// Извлекаем относительный путь от базового пути проекта
$basePath = '/scandiFinal/NewBackend2/fullstack-test-starter/public';
$requestUri = $_SERVER['REQUEST_URI'];

// Убираем базовый путь из URI
if (strpos($requestUri, $basePath) === 0) {
    $relativePath = substr($requestUri, strlen($basePath));
    if ($relativePath === '') {
        $relativePath = '/';
    }
} else {
    $relativePath = $requestUri;
}

$routeInfo = $dispatcher->dispatch(
    $_SERVER['REQUEST_METHOD'],
    $relativePath
);

switch ($routeInfo[0]) {
    case FastRoute\Dispatcher::NOT_FOUND:
        http_response_code(404);
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode(['error' => 'Endpoint not found']);
        break;
    case FastRoute\Dispatcher::METHOD_NOT_ALLOWED:
        $allowedMethods = $routeInfo[1];
        http_response_code(405);
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode(['error' => 'Method not allowed', 'allowed' => $allowedMethods]);
        break;
    case FastRoute\Dispatcher::FOUND:
        $handler = $routeInfo[1];
        $vars = $routeInfo[2];

        // Правильный вызов статического метода
        if (is_array($handler) && count($handler) == 2) {
            $className = $handler[0];
            $methodName = $handler[1];
            echo call_user_func([$className, $methodName], $vars);
        }
        break;
}