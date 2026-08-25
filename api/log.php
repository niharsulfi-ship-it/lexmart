<?php
header("Content-Type: application/json");
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    // Add a new system log
    $data = json_decode(file_get_contents("php://input"), true);
    
    $action = $data['action'] ?? $_POST['action'] ?? '';
    $details = $data['details'] ?? $_POST['details'] ?? '';
    
    // Basic validation
    if (empty($action)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Action is required"]);
        exit;
    }
    
    try {
        // Prepare statement (assuming table is called 'logs')
        $stmt = $conn->prepare("INSERT INTO logs (action, details) VALUES (:action, :details)");
        
        $success = $stmt->execute([
            'action' => $action, 
            'details' => $details
        ]);
        
        if ($success) {
            http_response_code(201);
            echo json_encode(["status" => "success", "message" => "Log created successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Failed to create log"]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Database error occurred"]);
    }
    
} elseif ($method === 'GET') {
    // Fetch all logs (usually requires auth token in production)
    try {
        $stmt = $conn->query("SELECT * FROM logs ORDER BY created_at DESC");
        $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode(["status" => "success", "data" => $logs]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Database error occurred"]);
    }
    
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
}
?>
