<?php
require_once '../../config/cors.php';
require_once '../../config/db_pdo.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

try {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (empty($data['id'])) {
        throw new Exception('Enquiry ID is required');
    }

    $id = $data['id'];
    $is_read = isset($data['is_read']) ? $data['is_read'] : 1;

    $sql = "UPDATE enquiries SET is_read = :is_read WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':is_read' => $is_read,
        ':id' => $id
    ]);

    echo json_encode(['success' => true, 'message' => 'Enquiry status updated']);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
