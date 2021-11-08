<?php

function _parse_layout() {

    $ts = array(
        "css" => "background-color: #f8f9fa;
            font-weight: bold;
            font-size: 3.2vmin;
            color: #343a40;
            border: 2px solid #343a40;"
    );

    $is = array(
        "css" => "font-weight: bold;
            font-size: 4.4vmin;
            color: #343a40;
            border: 2px solid #343a40;
            background-color: rgb(240,240,240);"
    );

    $trf_style = array(
        array($ts,$ts,$ts,$ts,$ts,$ts),
        array($ts,$is,$is,$is,$is,$is),
        array($ts,$is,$is,$is,$is,$is),
        array($ts,$is,$is,$is,$is,$is),
        array($ts,$is,$is,$is,$is,$is)
    );

    //CREATE ELEMENTS

    $el = array();
    $card = array();
    $row = array();

        $el[0] = array(
            "type" => "datatable",
            "addons" => array(),
            "data" => array(
                array(
                    "dataset" => "trf_maquinas_datatable",
                    "style" => $trf_style
                )
            )
        );

        $card[0] = array(
            "type" => "card",
            "name" => "Laminação a Frio",
            "header" => array(
                "color" => "#f8f9fa",
                "font" => array(
                    "color" => "#343a40",
                    "size" => 1.2
                ),
                "css" => "border: 2px solid #343a40; border-bottom: 0px;"
            ),
            "body" => array(
                "height" => 54,
                "color" => "#f8f9fa"
            ),
            "elements" => array($el[0])
        );

    $col[0] = array(
        "type" => "col",
        "grid" => 12,
        "content" => array($card[0])
    );
    $row[0] = array(
        "type" => "row",
        "content" => array($col[0])
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
                    "size" => 1.2
                )
            ),
            "content" => array($row[0])
        )
    );

    $page = array(
        "layout" => $layout
    );

    put_json("layout.json", $page);

    return 0;
};

?>