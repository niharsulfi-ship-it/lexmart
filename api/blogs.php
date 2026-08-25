<?php
header("Content-Type: application/json");
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

// Handle Image Upload Helper
function handleImageUpload() {
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = __DIR__ . '/uploads/blogs/';
        
        // Create directory if it doesn't exist
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
        
        $fileInfo = pathinfo($_FILES['image']['name']);
        $ext = strtolower($fileInfo['extension']);
        $allowedExts = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
        
        if (in_array($ext, $allowedExts)) {
            $newFileName = uniqid('blog_') . '.' . $ext;
            $destination = $uploadDir . $newFileName;
            
            if (move_uploaded_file($_FILES['image']['tmp_name'], $destination)) {
                return $newFileName;
            }
        }
    }
    return null;
}


if ($method === 'GET') {
    // Fetch all blogs
    try {
        $stmt = $conn->query("SELECT * FROM blogs ORDER BY id DESC");
        $blogs = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Build full image URL for each blog
        $baseUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") 
                   . "://" . $_SERVER['HTTP_HOST'];
        $imageBasePath = $baseUrl . "/api/uploads/blogs/";
        
        foreach ($blogs as &$blog) {
            if (!empty($blog['image'])) {
                $blog['image_url'] = $imageBasePath . $blog['image'];
            } else {
                $blog['image_url'] = null;
            }
        }
        unset($blog); // break reference
        
        echo json_encode(["status" => "success", "data" => $blogs]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Database error occurred"]);
    }
    
} elseif ($method === 'POST') {
    // Add or Edit Blog (Using POST for both because of multipart/form-data for image)
    
    $id = $_POST['id'] ?? null;
    $title = $_POST['title'] ?? '';
    $category = $_POST['category'] ?? '';
    $short_description = $_POST['short_description'] ?? '';
    $content = $_POST['content'] ?? '';
    $slug = $_POST['slug'] ?? '';
    
    if (empty($title)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Title is required"]);
        exit;
    }
    
    $imageName = handleImageUpload();
    
    try {
        if ($id) {
            // Edit existing blog
            if ($imageName) {
                // Update with new image
                $stmt = $conn->prepare("UPDATE blogs SET title=:title, category=:category, short_description=:short_desc, content=:content, slug=:slug, image=:image WHERE id=:id");
                $params = ['title'=>$title, 'category'=>$category, 'short_desc'=>$short_description, 'content'=>$content, 'slug'=>$slug, 'image'=>$imageName, 'id'=>$id];
            } else {
                // Update without changing image
                $stmt = $conn->prepare("UPDATE blogs SET title=:title, category=:category, short_description=:short_desc, content=:content, slug=:slug WHERE id=:id");
                $params = ['title'=>$title, 'category'=>$category, 'short_desc'=>$short_description, 'content'=>$content, 'slug'=>$slug, 'id'=>$id];
            }
            
            $success = $stmt->execute($params);
            $msg = "Blog updated successfully";
            
        } else {
            // Insert new blog
            $stmt = $conn->prepare("INSERT INTO blogs (title, category, short_description, content, slug, image, status) VALUES (:title, :category, :short_desc, :content, :slug, :image, 'Draft')");
            $params = ['title'=>$title, 'category'=>$category, 'short_desc'=>$short_description, 'content'=>$content, 'slug'=>$slug, 'image'=>$imageName];
            
            $success = $stmt->execute($params);
            $msg = "Blog added successfully";
        }
        
        if ($success) {
            http_response_code($id ? 200 : 201);
            echo json_encode(["status" => "success", "message" => $msg]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Failed to save blog"]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Database error occurred: " . $e->getMessage()]);
    }
    
} elseif ($method === 'DELETE') {
    // Delete blog
    // For DELETE, data might come as JSON
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'] ?? $_GET['id'] ?? null;
    
    if (!$id) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Blog ID required"]);
        exit;
    }
    
    try {
        $stmt = $conn->prepare("DELETE FROM blogs WHERE id = :id");
        $success = $stmt->execute(['id' => $id]);
        
        if ($success) {
            echo json_encode(["status" => "success", "message" => "Blog deleted"]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Failed to delete blog"]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Database error occurred"]);
    }
    
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
}
?>
