<?php
header("Content-Type: application/json");
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST' && ($_GET['action'] ?? '') === 'mark-read') {
    $data = json_decode(file_get_contents("php://input"), true) ?: [];
    $id = filter_var($data['id'] ?? null, FILTER_VALIDATE_INT);

    if (!$id) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "A valid enquiry ID is required"]);
        exit;
    }

    try {
        $columns = $conn->query("SHOW COLUMNS FROM enquiries")->fetchAll(PDO::FETCH_COLUMN);
        if (!in_array('is_read', $columns, true)) {
            $conn->exec("ALTER TABLE enquiries ADD COLUMN is_read TINYINT(1) NOT NULL DEFAULT 0");
        }

        $stmt = $conn->prepare("UPDATE enquiries SET is_read = 1 WHERE id = :id");
        $stmt->execute(['id' => $id]);
        echo json_encode(["status" => "success", "message" => "Enquiry marked as viewed"]);
    } catch (PDOException $e) {
        error_log('Unable to mark enquiry as viewed: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Unable to update enquiry status"]);
    }

} elseif ($method === 'POST') {
    // Add new enquiry
    $data = json_decode(file_get_contents("php://input"), true);
    
    $name = $data['name'] ?? $_POST['name'] ?? '';
    $email = $data['email'] ?? $_POST['email'] ?? '';
    $phone = $data['phone'] ?? $_POST['phone'] ?? '';
    $subject = $data['subject'] ?? $data['service'] ?? $_POST['subject'] ?? $_POST['service'] ?? '';
    $message = $data['message'] ?? $_POST['message'] ?? '';
    
    // Basic validation
    if (empty($name) || empty($email) || empty($message)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Name, email and message are required fields"]);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Please provide a valid email address"]);
        exit;
    }
    
    try {
        // The live database may use either `service` or the legacy `subject` column.
        $columns = $conn->query("SHOW COLUMNS FROM enquiries")->fetchAll(PDO::FETCH_COLUMN);
        $serviceColumn = in_array('service', $columns, true) ? 'service' : 'subject';

        if (!in_array($serviceColumn, $columns, true)) {
            throw new PDOException('Enquiries service column is missing');
        }

        $fields = ['name', 'email', 'phone', $serviceColumn, 'message'];
        $placeholders = [':name', ':email', ':phone', ':service', ':message'];
        $params = [
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'service' => $subject,
            'message' => $message
        ];

        if (in_array('last_name', $columns, true)) {
            $fields[] = 'last_name';
            $placeholders[] = ':last_name';
            $params['last_name'] = '';
        }

        $stmt = $conn->prepare(
            "INSERT INTO enquiries (" . implode(', ', $fields) . ") VALUES (" . implode(', ', $placeholders) . ")"
        );
        $success = $stmt->execute($params);
        
        if ($success) {
            http_response_code(201);
            echo json_encode(["status" => "success", "message" => "Enquiry submitted successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Failed to submit enquiry"]);
        }
    } catch (PDOException $e) {
        error_log('Enquiry insert failed: ' . $e->getMessage());
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
