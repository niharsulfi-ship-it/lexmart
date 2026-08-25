<?php
require_once '../../config/cors.php';
require_once '../../config/db_pdo.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

try {
    // Get JSON input if sent as raw body
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    // If not JSON, try $_POST (for form-data)
    if (!$data) {
        $data = $_POST;
    }

    if (empty($data['name']) || empty($data['email']) || empty($data['message'])) {
        throw new Exception('Required fields are missing');
    }

    $name = $data['name'];
    $last_name = $data['last_name'] ?? '';
    $email = $data['email'];
    $phone = $data['phone'] ?? '';
    $service = $data['service'] ?? ''; // Mapped from 'subject' in frontend
    $message = $data['message'];

    $sql = "INSERT INTO enquiries (name, last_name, email, phone, service, message, created_at) 
            VALUES (:name, :last_name, :email, :phone, :service, :message, NOW())";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':name' => $name,
        ':last_name' => $last_name,
        ':email' => $email,
        ':phone' => $phone,
        ':service' => $service,
        ':message' => $message
    ]);

    echo json_encode(['success' => true, 'message' => 'Enquiry submitted successfully']);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
