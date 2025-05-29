<?php
// Simple test script to verify GraphQL is working
require_once __DIR__ . '/vendor/autoload.php';

// Test GraphQL endpoint - try both URLs
$urls = [
    'http://localhost/scandiFinal/NewBackend/fullstack-test-starter/public/graphql',
    'http://localhost/scandiFinal/NewBackend/fullstack-test-starter/public/index.php'
];

// Simple test query
$query = '
{
  products {
    id
    name
    inStock
  }
}
';

function testGraphQL($url, $query, $testName)
{
    echo "=== $testName ===\n";
    echo "Testing URL: $url\n";

    $data = json_encode(['query' => $query]);

    $options = [
        'http' => [
            'header' => "Content-type: application/json\r\n",
            'method' => 'POST',
            'content' => $data,
            'ignore_errors' => true
        ],
    ];

    $context = stream_context_create($options);
    $result = @file_get_contents($url, false, $context);

    if ($result === false) {
        echo "❌ Failed to connect to $url\n";
        $error = error_get_last();
        echo "Error: " . ($error['message'] ?? 'Unknown error') . "\n";
    } else {
        echo "✅ Response received\n";
        echo "Response: " . $result . "\n";
    }
    echo "\n";
}

echo "Testing GraphQL Endpoint\n";
echo "========================\n\n";

foreach ($urls as $index => $url) {
    testGraphQL($url, $query, "Test " . ($index + 1) . " - " . basename($url));
}

echo "Testing complete!\n";

// Also test direct inclusion
echo "=== Direct Test ===\n";
try {
    $_SERVER['REQUEST_METHOD'] = 'POST';
    $_SERVER['REQUEST_URI'] = '/graphql';

    // Simulate POST data
    $input = json_encode(['query' => $query]);
    file_put_contents('php://temp', $input);

    require_once __DIR__ . '/src/Controller/GraphQL.php';
    $result = App\Controller\GraphQL::handle();
    echo "Direct inclusion result: " . $result . "\n";
} catch (Exception $e) {
    echo "Direct test error: " . $e->getMessage() . "\n";
}
?>