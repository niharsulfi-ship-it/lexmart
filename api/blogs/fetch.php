<?php
require_once '../../config/cors.php';
require_once '../../config/db_pdo.php';
header('Content-Type: application/json');

try {
    $sql = "SELECT * FROM blogs";
    $params = [];
    $conditions = [];

    if (isset($_GET['id'])) {
        $conditions[] = "id = ?";
        $params[] = $_GET['id'];
    }

    if (isset($_GET['slug'])) {
        $conditions[] = "slug = ?";
        $params[] = $_GET['slug'];
    }

    if (isset($_GET['category'])) {
        $conditions[] = "category = ?";
        $params[] = $_GET['category'];
    }

    if (isset($_GET['status'])) {
        $conditions[] = "status = ?";
        $params[] = $_GET['status'];
    }

    if (!empty($conditions)) {
        $sql .= " WHERE " . implode(" AND ", $conditions);
    }

    $sql .= " ORDER BY created_at DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $blogs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Parse schema as JSON if present
    foreach ($blogs as &$blog) {
        if (!empty($blog['schema'])) {
            $decoded = json_decode($blog['schema']);
            if (json_last_error() === JSON_ERROR_NONE) {
                $blog['schema'] = $decoded;
            }
        }
    }

    echo json_encode(['success' => true, 'data' => $blogs]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
