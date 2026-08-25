<?php
header("Content-Type: application/json");
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    // Read JSON payload or Form data
    $data = json_decode(file_get_contents("php://input"), true);
    $email = $data['email'] ?? $_POST['email'] ?? '';
    $password = $data['password'] ?? $_POST['password'] ?? '';

    if (empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Email and password are required"]);
        exit;
    }

    try {
        // Query the 'users' table based on the provided DB structure
        $stmt = $conn->prepare("SELECT id, name, email, role, password FROM users WHERE email = :email AND role = 'admin' LIMIT 1");
        $stmt->execute(['email' => $email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // Verify password
        if ($user && $user['password'] === $password) {
            
            // Create a simple token or handle session
            $token = base64_encode(bin2hex(random_bytes(16)));
            
            echo json_encode([
                "status" => "success",
                "message" => "Login successful",
                "token" => $token,
                "data" => [
                    "id" => $user['id'],
                    "name" => $user['name'],
                    "email" => $user['email'],
                    "role" => $user['role']
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Invalid credentials"]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Database error occurred"]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
}
?>
