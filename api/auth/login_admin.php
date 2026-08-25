<?php
require_once '../../config/db.php';

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed_origins = [
    'http://localhost:8080',
    'http://127.0.0.1:8080',
    'http://localhost:8081',
    'http://127.0.0.1:5500',
    'http://localhost:5500',
    'http://127.0.0.1:5501',
    'http://localhost:5501',
    'http://localhost',
    'https://wolfmagicacademy.brandmindz.com',
    'http://wolfmagic.brandmindz.com',
    'null'  // For file:// protocol
];

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-Client-Fingerprint");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
} else {
    // Fallback for tools without origin header or unknown origins
    header('Access-Control-Allow-Origin: *'); 
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
}

header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {


    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(["success" => false, "message" => "Invalid request method"]);
        exit;
    }

    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    // Validate input
    if (empty($email) || empty($password)) {
        echo json_encode(["success" => false, "message" => "Email and password are required"]);
        exit;
    }

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["success" => false, "message" => "Please enter a valid email address"]);
        exit;
    }

    // Find user with prepared statement (check for admin role)
    $stmt = $conn->prepare("SELECT id, name, email, password_hash, is_verified, role FROM users WHERE email = ? AND role = 'admin'");
    if (!$stmt) {
        throw new Exception("Database prepare failed: " . $conn->error);
    }

    $stmt->bind_param("s", $email);

    if (!$stmt->execute()) {
        throw new Exception("Database execute failed: " . $stmt->error);
    }

    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        // Log failed login attempt (for security monitoring)
        error_log("Failed login attempt for email: " . $email . " - User not found");
        echo json_encode(["success" => false, "message" => "Invalid email or password"]);
        exit;
    }

    $user = $result->fetch_assoc();
    $stmt->close();

    // Verify password
    if (!password_verify($password, $user['password_hash'])) {
        // Log failed login attempt (for security monitoring)
        error_log("Failed login attempt for email: " . $email . " - Invalid password");
        echo json_encode(["success" => false, "message" => "Invalid email or password"]);
        exit;
    }

    // Check if user is verified (optional security check)
    if (!$user['is_verified']) {
        echo json_encode(["success" => false, "message" => "Account not verified. Please verify your email first."]);
        exit;
    }

    // Log successful login (for security monitoring)
    error_log("Successful login for user: " . $user['email'] . " (ID: " . $user['id'] . ")");

    // Return success response
    echo json_encode([
        "success" => true,
        "message" => "Login successful",
        "user" => [
            "id" => (int)$user['id'],
            "name" => $user['name'],
            "email" => $user['email'],
            "role" => $user['role']
        ]
    ]);
    exit;
} catch (Exception $e) {
    // Log the error for debugging
    error_log("Login error: " . $e->getMessage());

    // Return generic error message (don't expose internal errors)
    echo json_encode([
        "success" => false,
        "message" => "Login failed. Please try again later."
    ]);
} finally {
    if (isset($conn)) {
        $conn->close();
    }
}
