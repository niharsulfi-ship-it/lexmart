<?php
require_once '../../config/cors.php';
require_once '../../config/db_pdo.php';
header('Content-Type: application/json');

try {
    // Check if table exists, if not create it (auto-setup)
    $tableCheck = $pdo->query("SHOW TABLES LIKE 'blog_categories'");
    if ($tableCheck->rowCount() == 0) {
        $pdo->exec("CREATE TABLE blog_categories (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            slug VARCHAR(255) NOT NULL UNIQUE
        )");
    }

    $stmt = $pdo->query("SELECT * FROM blog_categories ORDER BY name ASC");
    $categories = $stmt->fetchAll();

    echo json_encode(['success' => true, 'data' => $categories]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
