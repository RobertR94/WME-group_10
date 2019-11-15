<?php

class WorldDataParser{

    function __construct() {
      }

    function parseCSV($path){
        $file = fopen($path, 'r');
    
        $headers = fgetcsv($file);
        $headers = array_map('trim', $headers);
        $headers=str_replace(" ", "_", $headers);
        $data = [];
        
        while (($row = fgetcsv($file)) !== false)
        {
            $item = [];
            foreach ($row as $key => $value)
            $item[$headers[$key]] = trim($value) ?: null;
            $data[] = $item;
        }
        
        fclose($file);
        return $data;

    }

    function saveXML($data){

        $xml_data = new SimpleXMLElement('<?xml version="1.0"?><Countries></Countries>');

        try{
            $this->array_to_xml($data,$xml_data);
            $result = $xml_data->asXML(__DIR__ . "/world_data.xml");
        } catch (Exception $e) {
        return false;
        }
        
        return true;
    }

    function array_to_xml( $data, &$xml_data ) {
        foreach( $data as $key => $value ) {
            if( is_numeric($key) ){
                $key = 'Country'; //dealing with <0/>..<n/> issues
            }
            if( is_array($value) ) {
                $subnode = $xml_data->addChild($key);
                $this->array_to_xml($value, $subnode);
            } else {
                $xml_data->addChild("$key",htmlspecialchars("$value"));
            }
         }
    }

}
?>