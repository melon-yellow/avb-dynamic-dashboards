<?php

function _parse_layout() {

    //CREATE ELEMENTS
    $el = array(
        "type" => "linebarchart",
        "height" => "750",
        "addons" => array(
            "ticks" => array(
                "x" => array(
                    "display" => true,
                    "fontStyle" => "bold",
                    "fontSize" => 24
                ),
                "y" => array(
                    "display" => false,
                    "fontStyle" => "bold",
                    "fontSize" => 10,
                    "max" => (115),
                    "min" => (-115)
                ),
            ),
            "grid" => array(
                "x" => true,
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
                "dataset" => "rfa_rel_v_linechart",
                "type" => "point",
                "display" => true,
                "pointradius" => 7,
                "color" => "rgb(53,53,53)",
                "datalabels" => array(
                    "display" => true,
                    "dataset" => "rfa_abs_v_linechart",
                    "column" => 1,
                    "font" => array(
                        "color" => "rgb(255,255,255)",
                        "size" => 1.2
                    ),
                    "background" => array(
                        "color" => "rgba(53,53,53,0.8)"
                    ),
                    "border" => array(
                        "color" => "rgba(255,255,255.0.8)",
                        "radius" => 6,
                        "width" => 1
                    )
                )
            ),
            array(
                "dataset" => "rfa_rel_sup_linechart",
                "type" => "limit",
                "display" => true,
                "color" => "rgb(245,73,43)",
                "datalabels" => array(
                    "display" => true,
                    "dataset" => "rfa_abs_sup_linechart",
                    "column" => 1,
                    "font" => array(
                        "color" => "rgb(245,73,43)",
                        "size" => 1.2
                    ),
                )
            ),
            array(
                "dataset" => "rfa_rel_sp_linechart",
                "type" => "limit",
                "display" => true,
                "color" => "rgb(24,173,43)",
                "datalabels" => array(
                    "display" => true,
                    "dataset" => "rfa_abs_sp_linechart",
                    "column" => 1,
                    "font" => array(
                        "color" => "rgb(24,173,43)",
                        "size" => 1.2
                    ),
                )
            ),
            array(
                "dataset" => "rfa_rel_inf_linechart",
                "type" => "limit",
                "display" => true,
                "color" => "rgb(42,53,243)",
                "datalabels" => array(
                    "display" => true,
                    "dataset" => "rfa_abs_inf_linechart",
                    "column" => 1,
                    "font" => array(
                        "color" => "rgb(42,53,243)",
                        "size" => 1.2
                    ),
                )
            )
        )
    );
    //CREATE CARDS
    $e = get_json("data.json");
    $receita = str_replace(" ", "", $e["rfa_receita_datatable"]["data"][1][0]);
    $card = array(
        "type" => "card",
        "name" => "Carta de Controle Fator R : ".$receita,
        "header" => array(
            "color" => "#f8f9fa",
            "font" => array(
                "color" => "#343a40",
                "size" => 1
            ),
            "css" => "border: 2px solid #343a40; border-bottom: 0px;"
        ),
        "body" => array(
            "height" => 80,
            "color" => "#f8f9fa",
            "css" => "border: 2px solid #343a40; border-top: 0px;"
        ),
        "elements" => array($el)
    );
    $col = array(
    "type" => "col",
    "grid" => 12,
    "content" => array($card)
    );
    //create row 1
    $row = array(
    "type" => "row",
    "content" => array($col)
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
                    "size" => 1.15
                )
            ),
            "content" => array($row)
        )
    );
    $page = array(
    "layout" => $layout
    );
    put_json("layout.json", $page);

    return 0;
};// End of parse_data function

?>