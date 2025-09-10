  <?php 

  require "connection.php";

  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
  header("Access-Control-Allow-Headers: Content-Type");
  header("Content-Type: application/json");

  $method = $_SERVER["REQUEST_METHOD"];

  if($method !== "POST") {
    $sql = "SELECT * FROM message";
    $query = $pdo->query($sql);
    $results = $query->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($results);
  } else {
    $data = json_decode(file_get_contents("php://input"), true);
    $action = $data['action'] ?? null;
    $id = $data['id'] ?? null;
    $fullname = $data['fullname'] ?? null;
    $contact = $data['contact'] ?? null;
    $concern = $data['concern'] ?? null;
    $searchInput = $data['searchInput'] ?? null;

    switch($action) {
      case "insert":
        try {
          $sqlInsert = "INSERT INTO message (fullname, contact, concern) 
                        VALUES (:fullname, :contact, :concern)";
          $insert = $pdo->prepare($sqlInsert);
          $insert->execute([
            ":fullname" => $fullname,
            ":contact"  => $contact,
            ":concern"  => $concern
          ]);
          echo json_encode([
            "status" => "success",
            "message" => "Your message has been sent."
          ]);
        } catch (\Throwable $error) {
          echo json_encode([
            "status" => "failed",
            "message" => $error->getMessage()
          ]);
        }
      break;
      case "view":
        $sqlView = "SELECT * FROM message WHERE id = :id";
        $view = $pdo->prepare($sqlView);
        $view->execute([
          ":id" => $id,
        ]);
        $result = $view->fetch(PDO::FETCH_ASSOC);
        echo json_encode($result);
      break;
      case "search":
        $sqlSearch = "SELECT * FROM message WHERE 
                      fullname  LIKE :fullname  OR 
                      contact   LIKE :contact   OR 
                      concern   LIKE :concern";
        $search = $pdo->prepare($sqlSearch);
        $search->execute([
          ":fullname" => "%$searchInput%",
          ":contact"  => "%$searchInput%",
          ":concern"  => "%$searchInput%"
        ]);
        $results = $search->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($results);
      break;
      case "delete":
        $sqlDelete = "DELETE FROM message WHERE id = :id";
        $delete = $pdo->prepare($sqlDelete);
        $delete->execute([
          ":id" => $id
        ]);
        echo json_encode([
          "status" => "failed",
          "message" => "Message deleted."
        ]);
      break;
      default:
        echo json_encode([
          "status" => "failed",
          "message" => "Error"
        ]);
    }
  }