<?php

function _parse_layout($in) {

    if($in == -1){ return -1; };

    $el = array();
    $card = array();
    $col = array();
    $row = array();

    if( $in === null || gettype($in) != "array" || count($in) < 1){ return -1; };
    $dts = array_keys($in);

    //CREATE ELEMENTS
    for($i = 0; $i < count($dts); $i++){

        $name = $in[$dts[$i]];
        $dataset = $dts[$i];

        $el = array(
            "type" => "display",
            "addons" => array(),
            "data" => array(
                array(
                    "dataset" => $dataset,
                    "size" => 4.2
                )
            )
        );

        $card = array(
            "type" => "card",
            "name" => $name,
            "header" => array(
                "color" => "#f8f9fa",
                "font" => array(
                    "color" => "#343a40",
                    "size" => 1.6
                ),
                "css" => "border: 2px solid #343a40; border-bottom: 0px;"
            ),
            "body" => array(
                "height" => 18,
                "color" => "#f8f9fa",
                "css" => "border: 2px solid #343a40; border-top: 0px;"
            ),
            "elements" => array($el)
        );

        $col[$i] = array(
            "type" => "col",
            "grid" => 3,
            "content" => array($card)
        );
    };

    $row[0] = array(
        "type" => "row",
        "content" => array($col[0],$col[1],$col[2],$col[3])
    );
    $row[1] = array(
        "type" => "row",
        "content" => array($col[4],$col[5],$col[6],$col[7])
    );
    $row[2] = array(
        "type" => "row",
        "content" => array($col[11],$col[12],$col[13])
    );

    $layout = array(
        array(
            "type" => "layout",
            "sidenav" => array( "display" => false ),
            "topnav" => array(),
            "body" => array(
                "color" => "#f8f9fa",
                "font" => array(
                    "color" => "#343a40",
                    "size" => 1.4
                )
            ),
            "content" => array($row[0],$row[1],$row[2])
        )
    );

    $page = array(
        "layout" => $layout
    );

    put_json("layout.json", $page);

    return 0;
};

?>