<!DOCTYPE html>
<html>
<body>
<?php
include 'world_data_parser.php';

$parser = new WorldDataParser();
$array = $parser->parseCSV(__DIR__ . "/world_data.csv");
echo "<pre>";
print_r($array);
echo "</pre>";
?>
</body>
</html>