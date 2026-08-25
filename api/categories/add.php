<?php
require_once '../../config/cors.php';
require_once '../../config/db_pdo.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

try {
    $data = json_decode(file_get_contents('php://input'), true);
    $name = $data['name'] ?? $_POST['name'] ?? null;
    $slug = $data['slug'] ?? $_POST['slug'] ?? null;

    if (!$name || !$slug) {
        throw new Exception('Name and Slug are required');
    }

    $stmt = $pdo->prepare("INSERT INTO blog_categories (name, slug) VALUES (?, ?)");
    $stmt->execute([$name, $slug]);

    echo json_encode(['success' => true, 'message' => 'Category added successfully', 'id' => $pdo->lastInsertId()]);

} catch (Exception $e) {
    if ($e->getCode() == 23000) { // Duplicate entry
         echo json_encode(['success' => false, 'message' => 'Slug already exists']);
    } else {
         echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}
?>
