<?php

// 1️⃣ CORS — erlaubt Vue auf Port 5173 das Backend anzusprechen
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// 2️⃣ Preflight Request abfangen
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// 3️⃣ dotenv laden
require 'vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$apiKey = $_ENV['ANTHROPIC_API_KEY'];
$apiUrl = "https://api.anthropic.com/v1/messages";

// 4️⃣ Nachricht von Vue empfangen
$body = json_decode(file_get_contents('php://input'), true);
$userMessage = $body['message'] ?? 'Hallo';

// 5️⃣ Claude API aufrufen
$messages = [
    ["role" => "user", "content" => $userMessage]
];

$data = [
    "model"      => "claude-sonnet-4-20250514",
    "max_tokens" => 1024,
    "messages"   => $messages
];

$curl = curl_init($apiUrl);
curl_setopt_array($curl, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_HTTPHEADER     => [
        "Content-Type: application/json",
        "x-api-key: " . $apiKey,
        "anthropic-version: 2023-06-01"
    ],
    CURLOPT_POSTFIELDS => json_encode($data)
]);

$response = curl_exec($curl);

// 6️⃣ Antwort an Vue zurückgeben
$result = json_decode($response, true);
echo json_encode(['reply' => $result["content"][0]["text"]]);