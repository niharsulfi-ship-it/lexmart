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
    $id = $data['id'] ?? $_POST['id'] ?? null;
    $name = $data['name'] ?? $_POST['name'] ?? null;
    $slug = $data['slug'] ?? $_POST['slug'] ?? null;

    if (!$id || !$name || !$slug) {
        throw new Exception('ID, Name and Slug are required');
    }

    $stmt = $pdo->prepare("UPDATE blog_categories SET name = ?, slug = ? WHERE id = ?");
    $stmt->execute([$name, $slug, $id]);

    echo json_encode(['success' => true, 'message' => 'Category updated successfully']);

} catch (Exception $e) {
    if ($e->getCode() == 23000) { // Duplicate entry
         echo json_encode(['success' => false, 'message' => 'Slug already exists']);
    } else {
         echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}
?>
