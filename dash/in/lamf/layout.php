<?php

function _parse_layout($in) {

    $datatable = $in["datatable"];
    $count = $in["count"];

    $ts = array(
        "css" => "background-color: #f8f9fa;
            font-weight: bold;
            font-size: 2vmin;
            color: #343a40;
            border: 2px solid #343a40;"
    );
    $ms = array(
        "css" => "font-weight: bold;
            font-size: 2vmin;
            color: #343a40;
            border: 2px solid #343a40;"
    );
    $sizea = 350;
    $number_of_metas = 3;

    $e = get_json("data.json");
    $datatable = $e["lam_frio_metas_datatable"]["data"];

    $metas_style = array(
        array(
            array_merge($ts, array("rowspan" => 2, "width" => $sizea)),
            array_merge($ts, array("colspan" => 3)),
            array_merge($ts, array("colspan" => 3)),
            array_merge($ts, array("colspan" => 3))
        ),
        array($ts, $ts, $ts, $ts, $ts, $ts, $ts, $ts, $ts)
    );
    for($w = 0; $w < $number_of_metas; $w++){
        $metas_style = array_merge(
            $metas_style,
            array(
                array(array_merge($ts, array("width" => $sizea)), $ms, $ms, $ms, $ms, $ms, $ms, $ms, $ms, $ms)
            )
        );
    };

    function _get_style($metas_style, $datatable, $valor, $meta){
        $e = array(
            ">",
            ">",
            ">"
        );
        $success = "color: rgb(48,112,48); background-color: rgba(84,224,64,0.6);";
        $danger = "color: rgb(112,48,48); background-color: rgba(224,64,84,0.6);";
        for($i = 2; $i < count($datatable); $i++){
            if($e[$i - 2] == ">"){
                if($datatable[$i][$valor] >= $datatable[$i][$meta]){
                    $metas_style[$i][$valor]["css"] .= $success;
                }else{
                    $metas_style[$i][$valor]["css"] .= $danger;
                };
            };
            if($e[$i - 2] == "<"){
                if($datatable[$i][$valor] <= $datatable[$i][$meta]){
                    $metas_style[$i][$valor]["css"] .= $success;
                }else{
                    $metas_style[$i][$valor]["css"] .= $danger;
                };
            };
        };
        return $metas_style;
    };

    function _style_gray($metas_style, $datatable, $column){
        for($i = 2; $i < count($datatable); $i++){
            $metas_style[$i][$column]["css"] .= " background-color: rgb(230,230,230);";
        };
        return $metas_style;
    };

    $metas_style = _get_style($metas_style, $datatable, 2, 1);
    $metas_style = _get_style($metas_style, $datatable, 5, 4);
    $month = 6;
    if($datatable[2][8] !== null && $datatable[2][8] !== "--"){
        $metas_style = _get_style($metas_style, $datatable, 7, 4);
        $month = 7;
    } else {
        $metas_style = _style_gray($metas_style, $datatable, 8);
    };
    if($datatable[2][9] !== null && $datatable[2][9] !== "--"){
        $metas_style = _get_style($metas_style, $datatable, 8, 4);
        $month = 8;
    } else {
        $metas_style = _style_gray($metas_style, $datatable, 9);
    };
    $mes = $datatable[1][$month];

    if($count > 1){
        $metas_style = _get_style($metas_style, $datatable, 7, 4);
    };
    if($count > 2){
        $metas_style = _get_style($metas_style, $datatable, 8, 4);
    };

    //CREATE ELEMENTS

        $el1 = array(
            "type" => "datatable",
            "addons" => array(),
            "data" => array(
                array(
                    "dataset" => "lam_frio_metas_datatable",
                    "style" => $metas_style
                )
            )
        );

        $max_line = null;
        $line = array_merge(
            $e["lam_frio_prod_linechart"]["data"],
            $e["lam_frio_prod_rit_linechart"]["data"],
            $e["lam_frio_prod_meta_linechart"]["data"]
        );
        for($l = 0; $l < count($line); $l++){
            $line[$l] = $line[$l][1];
        };
        $larg = (max($line) * 1.2);
        if ($larg > 200) { $max_line = 200; };

        $el2 = array(
            "type" => "linebarchart",
            "addons" => array(
                "ticks" => array(
                    "x" => array(
                        "display" => true,
                        "fontStyle" => "bold",
                        "fontSize" => 16
                    ),
                    "y" => array(
                        "display" => false,
                        "min" => 0,
                        "max" => $max_line
                    ),
                ),
                "grid" => array(
                    "x" => false,
                    "y" => false
                ),
                "legend" => array(
                    "display" => false,
                    "position" => "right"
                )
            ),
            "update" => array(
                "type" => "individual",
                "duration" => 500
            ),
            "data" => array(
                array(
                    "dataset" => "lam_frio_prod_linechart",
                    "type" => "bar",
                    "display" => true,
                    "color" => "rgb(64,104,255)",
                    "datalabels" => array(
                        "display" => true,
                        "dataset" => "lam_frio_prod_linechart",
                        "column" => 1,
                        "font" => array(
                            "color" => "rgb(64,104,255)",
                            "size" => 1.2
                        ),
                    )
                ),
                array(
                    "dataset" => "lam_frio_prod_rit_linechart",
                    "type" => "bar",
                    "display" => true,
                    "color" => "rgb(184,204,255)",
                    "datalabels" => array(
                        "display" => true,
                        "dataset" => "lam_frio_prod_rit_linechart",
                        "column" => 1,
                        "font" => array(
                            "color" => "rgb(144,174,255)",
                            "size" => 1.2
                        ),
                    )
                ),
                array(
                    "dataset" => "lam_frio_prod_meta_linechart",
                    "type" => "limit",
                    "display" => true,
                    "color" => "rgb(255,104,64)",
                    "dash" => array(
                        "dashlength" => 15,
                        "space" => 10
                    )
                )
            )
        );

        $el3 = array(
            "type" => "piechart",
            "addons" => array(
                "legend" => array(
                    "display" => true,
                    "position" => "left"
                ),
                "canvas" => array(
                    "posx" => 2,
                    "posy" => 90,
                    "data" => "lam_frio_rit_prod_mes_text",
                    "fontsize" => 7.5,
                    "font" => "Arial",
                    "fillstyle" => "#343a40",
                    "background" => "#f8f9fa"
                )
            ),
            "data" => array(
                array(
                    "dataset" => "lam_frio_prod_meta_piechart",
                    "colors" => array(
                        "rgb(224,64,84)",
                        "rgb(144,174,255)",
                        "rgb(64,104,255)"
                    ),
                    "datalabels" => array(
                        "display" => true,
                        "font" => array(
                            "size" => 2.2
                        ),
                    )
                )
            )
        );

        //CREATE CARDS

        $card1 = array(
            "type" => "card",
            "name" => "Relatorio Gerencial Laminação a Frio",
            "header" => array(
                "color" => "#f8f9fa",
                "font" => array(
                    "color" => "#343a40",
                    "size" => 1.2
                ),
                "css" => "border: 2px solid #343a40; border-bottom: 0px;"
            ),
            "body" => array(
                "height" => 38,
                "color" => "#f8f9fa"
            ),
            "elements" => array($el1)
        );

        $card2 = array(
            "type" => "card",
            "name" => "Produção Diaria Laminação a Frio (".$mes.")",
            "header" => array(
                "color" => "#f8f9fa",
                "font" => array(
                    "color" => "#343a40",
                    "size" => 1.2
                ),
                "css" => "border: 2px solid #343a40; border-bottom: 0px;"
            ),
            "body" => array(
                "height" => 38,
                "color" => "#f8f9fa",
                "css" => "border: 2px solid #343a40; border-top: 0px;"
            ),
            "elements" => array($el2)
        );

        $card3 = array(
            "type" => "card",
            "name" => "Produção/Meta Laminação a Frio (".$mes.")",
            "header" => array(
                "color" => "#f8f9fa",
                "font" => array(
                    "color" => "#343a40",
                    "size" => 1.2
                ),
                "css" => "border: 2px solid #343a40; border-bottom: 0px;"
            ),
            "body" => array(
                "height" => 38,
                "color" => "#f8f9fa",
                "css" => "border: 2px solid #343a40; border-top: 0px;"
            ),
            "elements" => array($el3)
        );

        //CREATE STRUCTURE
        $col1 = array(
        "type" => "col",
        "grid" => 12,
        "content" => array($card1)
        );
        $row1 = array(
        "type" => "row",
        "content" => array($col1)
        );
        $col2 = array(
            "type" => "col",
            "grid" => 8,
            "content" => array($card2)
        );
        $col3 = array(
            "type" => "col",
            "grid" => 4,
            "content" => array($card3)
        );
        $row2 = array(
            "type" => "row",
            "content" => array($col2, $col3)
        );

        $layout = array(
            array(
                "type" => "layout",
                "sidenav" => array("display" => false),
                "topnav" => array(),
                "body" => array(
                    "color" => "#f8f9fa",
                    "font" => array(
                        "color" => "#343a40",
                        "size" => 1.2
                    )
                ),
                "content" => array($row1, $row2)
            )
        );

        $page = array(
        "layout" => $layout,
        );

        //JSON ENCODE
        put_json("layout.json", $page);

    return 0;

};

?>