<?php
require_once '../../config/cors.php';
require_once '../../config/db_pdo.php';
header('Content-Type: application/json');

try {
    // Check if is_read column exists, if not add it
    try {
        $pdo->query("SELECT is_read FROM enquiries LIMIT 1");
    } catch (Exception $e) {
        $pdo->exec("ALTER TABLE enquiries ADD COLUMN is_read TINYINT(1) DEFAULT 0");
    }
    
    $sql = "SELECT * FROM enquiries ORDER BY created_at DESC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $enquiries = $stmt->fetchAll();

    echo json_encode(['success' => true, 'data' => $enquiries]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
