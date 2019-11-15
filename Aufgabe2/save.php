<?php
include 'world_data_parser.php';
$parser = new WorldDataParser();
$data = $parser->parseCSV(__DIR__ . "/world_data.csv");

echo '<pre>';
echo ($parser->saveXML($data) ? "Your file has been succefully parsed" : "Error occured");
echo '</pre>';
?>