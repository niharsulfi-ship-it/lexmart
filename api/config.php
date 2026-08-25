<?php
// Handle CORS and preflight requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle OPTIONS requests (preflight)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Database Credentials
$host = "localhost"; // Localhost is standard for shared hosting environments
$dbname = "u761928665_lexmart_db";
$username = "u761928665_lexmart";
$password = "2Kfia:d+N5F/";

try {
    // Create PDO instance
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    // Set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    http_response_code(500);
    die(json_encode([
        "status" => "error", 
        "message" => "Database Connection Failed. Please check your credentials.",
        // "error" => $e->getMessage() // Uncomment for debugging
    ]));
}
?>
