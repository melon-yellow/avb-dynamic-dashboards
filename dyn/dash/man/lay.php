<?php

function _process_layout($datasets) {
    $content = array();
    $row = array(
        "type" => "row",
        "content" => array()
    );
    $count_cols = 0;
    for($s = 0; $s < count($datasets); $s++){
        $key = str_remove($datasets[$s], array(" ","\"","'","-","/","=","+",".","|"));
        //CREATE ELEMENTS
        $el = array(
            "type" => "linebarchart",
            "addons" => array(
                "ticks" => array(
                    "x" => array(
                        "display" => true,
                        "fontStyle" => "",
                        "fontSize" => 10
                    ),
                    "y" => array(
                        "display" => true,
                        "fontStyle" => "",
                        "fontSize" => 10,
                        "min" => 0
                    )
                ),
                "grid" => array(
                    "x" => false,
                    "y" => true
                ),
                "legend" => array(
                    "display" => false,
                    "position" => "right"
                ),
                "type" => "time"
            ),
            "update" => array(
                "type" => "default",
                "duration" => 1000
            ),
            "data" => array(
                array(
                    "dataset" => $key."_linechart",
                    "type" => "line",
                    "display" => true,
                    "color" => "rgb(24,64,72)",
                    "datalabels" => array(
                        "display" => false
                    )
                ),
                array(
                    "dataset" => $key."_max_linechart",
                    "type" => "limit",
                    "display" => true,
                    "color" => "rgb(255,48,48)",
                    "dash" => array(
                        "dashlength" => 15,
                        "space" => 10
                    )
                ),
                array(
                    "dataset" => $key."_min_linechart",
                    "type" => "limit",
                    "display" => true,
                    "color" => "rgb(64,64,255)",
                    "dash" => array(
                        "dashlength" => 15,
                        "space" => 10
                    )
                )
            )
        );
        //CREATE CARDS
        $card = array(
            "type" => "card",
            "name" => $datasets[$s],
            "header" => array(
                "color" => "#f8f9fa",
                "font" => array(
                    "color" => "#343a40",
                    "size" => 1.2
                )
            ),
            "body" => array(
                "height" => 40,
                "color" => "#f8f9fa"
            ),
            "elements" => array($el)
        );
        //CREATE COLUMNS
        $row["content"] = array_merge(
            $row["content"],
            array(
                array(
                    "type" => "col",
                    "grid" => 6,
                    "content" => array($card)
                )
            )
        );
        if($count_cols < 1) {
            $count_cols += 1;
        } else {
            $content = array_merge($content, array($row));
            $row["content"] = array();
            $count_cols = 0;
        };
    };
    $content = array_merge($content, array($row));
    $row["content"] = array();
    $layout = array(
        array(
            "type" => "layout",
            "sidenav" => array( "display" => true ),
            "topnav" => array(),
            "body" => array(
                "color" => "#f8f9fa",
                "font" => array(
                    "color" => "#343a40",
                    "size" => 1.2
                )
            ),
            "content" => $content
        )
    );
    $page = array(
        "layout" => $layout,
    );

    //json encode
    put_json("layout.json", $page);

    return 0;
};

?>