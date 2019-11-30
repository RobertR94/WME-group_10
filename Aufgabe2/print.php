<?php

    include 'world_data_parser.php';

    $index_doc = new DOMDocument();
    //load the index.gtml file 
    @$index_doc->loadHTMLFile("index.html");

    $parser = new WorldDataParser();
    $data = $parser->parseCSV(__DIR__ . "/world_data.csv");

    
    //get the textcontent of the index.html as a string
    $index_html = $index_doc->saveHTML();
    $to_find = "<tbody id=\"table_body\">";

    //get the postion in the string where to insert the table_content
    $position = strpos($index_html, $to_find) + strlen($to_find);

    if ($parser->saveXML($data)){
        $table =  $parser->printXML(__DIR__ . "/world_data.xml", __DIR__ . "/table_style.xsl");
        //get the textcontent of the DOMDocument table_content as a String
        $table_html_str = $table->saveHTML();

        //insert the table content in to the index.html string
        echo substr_replace($index_html, $table_html_str, $position, 0 );
    

    }
    else{

        echo $index_html;
    }
        
    
    

?>