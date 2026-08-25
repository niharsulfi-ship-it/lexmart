<?php
// 1. OUTPUT BUFFERING
ob_start();

// 2. CORS HEADERS
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
    'http://wolfmagicacademy.brandmindz.com',
    'null'
];

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-Client-Fingerprint");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
} else {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    ob_end_clean();
    exit;
}

header('Content-Type: application/json');
ini_set('display_errors', 0);
error_reporting(E_ALL);

register_shutdown_function(function() {
    $error = error_get_last();
    if ($error && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        ob_end_clean(); 
        header('Content-Type: application/json');
        http_response_code(500); 
        echo json_encode([
            "success" => false, 
            "message" => "Server Configuration Error: " . $error['message']
        ]);
    }
});

function sendNativeEmail($to, $name, $otp) {
    $subject = "Verify Your Admin Account - Havona";
    
    $message = "
    <html>
    <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
        <div style='max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;'>
            <h2 style='color: #000;'>Welcome to Havona!</h2>
            <p>Hello $name,</p>
            <p>Your Admin registration was successful. Please use this OTP to verify your account:</p>
            <div style='background-color: #f4f4f4; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;'>
                <h1 style='color: #000; font-size: 32px; letter-spacing: 5px; margin: 0;'>$otp</h1>
            </div>
            <p>This code expires in 15 minutes.</p>
        </div>
    </body>
    </html>
    ";

    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= 'From: Havona Admin <no-reply@havona.brandmindz.com>' . "\r\n";
    
    return mail($to, $subject, $message, $headers);
}

try {
    require_once '../../config/db.php';

    if (!isset($conn) || $conn->connect_error) {
        throw new Exception("Database connection failed");
    }

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception("Invalid request method");
    }

    $name = trim($_POST['name'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if (!$name || !$phone || !$email || !$password) {
        throw new Exception("All fields are required");
    }

    // Check email
    $check_email = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $check_email->bind_param("s", $email);
    $check_email->execute();
    if ($check_email->get_result()->num_rows > 0) {
        throw new Exception("Email address already exists");
    }
    $check_email->close();

    // Check phone
    $check_phone = $conn->prepare("SELECT id FROM users WHERE phone = ?");
    $check_phone->bind_param("s", $phone);
    $check_phone->execute();
    if ($check_phone->get_result()->num_rows > 0) {
        throw new Exception("Phone number already exists");
    }
    $check_phone->close();

    $password_hash = password_hash($password, PASSWORD_BCRYPT);
    
    // Insert directly into users table
    $insert_stmt = $conn->prepare("INSERT INTO users (name, phone, whatsapp_number, email, role, password_hash, is_verified) VALUES (?, ?, ?, ?, 'admin', ?, 1)");
    if (!$insert_stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }
    
    // Using phone for whatsapp_number as well
    $insert_stmt->bind_param("sssss", $name, $phone, $phone, $email, $password_hash);
    
    if (!$insert_stmt->execute()) {
        throw new Exception("Failed to register admin: " . $insert_stmt->error);
    }
    $insert_stmt->close();

    ob_end_clean();
    echo json_encode([
        "success" => true,
        "message" => "Admin profile created successfully! You can now log in."
    ]);
    exit;

} catch (Exception $e) {
    ob_end_clean();
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
    exit;
} finally {
    if (isset($conn)) $conn->close();
}
