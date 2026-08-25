<?php
header("Content-Type: application/json");
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    // Add new enquiry
    $data = json_decode(file_get_contents("php://input"), true);
    
    $name = $data['name'] ?? $_POST['name'] ?? '';
    $email = $data['email'] ?? $_POST['email'] ?? '';
    $phone = $data['phone'] ?? $_POST['phone'] ?? '';
    $subject = $data['subject'] ?? $_POST['subject'] ?? '';
    $message = $data['message'] ?? $_POST['message'] ?? '';
    
    // Basic validation
    if (empty($name) || empty($email)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Name and email are required fields"]);
        exit;
    }
    
    try {
        // Prepare statement (assuming table is called 'enquiries')
        $stmt = $conn->prepare("INSERT INTO enquiries (name, email, phone, subject, message) VALUES (:name, :email, :phone, :subject, :message)");
        
        $success = $stmt->execute([
            'name' => $name, 
            'email' => $email, 
            'phone' => $phone, 
            'subject' => $subject, 
            'message' => $message
        ]);
        
        if ($success) {
            http_response_code(201);
            echo json_encode(["status" => "success", "message" => "Enquiry submitted successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Failed to submit enquiry"]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Database error occurred"]);
    }
    
} elseif ($method === 'GET') {
    // Fetch all enquiries (usually requires auth token in production)
    try {
        $stmt = $conn->query("SELECT * FROM enquiries ORDER BY id DESC");
        $enquiries = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode(["status" => "success", "data" => $enquiries]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Database error occurred"]);
    }
    
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
}
?>
