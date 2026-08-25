<?php
require_once '../../config/cors.php';
require_once '../../config/db_pdo.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

try {
    if (empty($_POST['id']) || empty($_POST['title']) || empty($_POST['slug']) || empty($_POST['content'])) {
        throw new Exception('Required fields are missing');
    }

    $id = $_POST['id'];
    $title = $_POST['title'];
    $slug = $_POST['slug'];
    $short_description = $_POST['short_description'] ?? '';
    $content = $_POST['content'];
    $category = $_POST['category'] ?? '';
    $tags = $_POST['tags'] ?? '';
    $meta_title = $_POST['meta_title'] ?? '';
    $meta_description = $_POST['meta_description'] ?? '';
    $status = $_POST['status'] ?? 'Published';
    $schema = $_POST['schema'] ?? '';

    // Lenient Schema JSON handling
    if (!empty($schema)) {
        $decoded = json_decode($schema);
        if (json_last_error() !== JSON_ERROR_NONE) {
            // Not valid JSON, so treat as a plain string and encode it
            $schema = json_encode($schema);
        } else {
            // Valid JSON, minify/normalize it
            $schema = json_encode($decoded);
        }
    }

    $imageUpdateSql = "";
    $params = [
        ':title' => $title,
        ':slug' => $slug,
        ':short_description' => $short_description,
        ':content' => $content,
        ':category' => $category,
        ':tags' => $tags,
        ':meta_title' => $meta_title,
        ':meta_description' => $meta_description,
        ':status' => $status,
        ':schema' => $schema,
        ':id' => $id
    ];

    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = '../../uploads/blogs/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
        
        $fileName = time() . '_' . basename($_FILES['image']['name']);
        $targetPath = $uploadDir . $fileName;
        
        if (move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
             $image_filename = $fileName;
             $imageUpdateSql = ", image = :image";
             $params[':image'] = $image_filename;
        } else {
            throw new Exception('Failed to upload image');
        }
    }

    $sql = "UPDATE blogs SET 
            title = :title, 
            slug = :slug, 
            short_description = :short_description, 
            content = :content, 
            category = :category, 
            tags = :tags, 
            meta_title = :meta_title, 
            meta_description = :meta_description, 
            status = :status,
            schema = :schema
            $imageUpdateSql
            WHERE id = :id";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    echo json_encode(['success' => true, 'message' => 'Blog updated successfully']);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
