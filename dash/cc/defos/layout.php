<?php

function _parse_layout($e) {

    function _card($name, $h) {
        return array(
            "type" => "card",
            "name" => $name,
            "header" => array(
                "color" => "#f8f9fa",
                "font" => array(
                    "color" => "#343a40",
                    "size" => 1
                ),
                "css" => "border: 2px solid #343a40; border-bottom: 0px;"
            ),
            "body" => array(
                "height" => $h,
                "color" => "#f8f9fa",
                "css" => "border: 2px solid #343a40; border-top: 0px;"
            ),
            "elements" => array()
        );
    };

    function _el($card, $name, $database, $end=false) {

        $rgb = array(
            "24,108,218",
            "206,52,52",
            "0,144,0",
            "118,0,196",
            "225,118,0"
        );

        $c = count($card["elements"]);
     
        //CREATE ELEMENTS
        $el = array(
            "type" => "linebarchart",
            "addons" => array(
                "title" => $name,
                "ticks" => array(
                    "x" => array(
                        "display" => $end,
                        "fontStyle" => "bold",
                        "fontSize" => 9,
                        "fontColor" => "rgb(64,64,64)"
                    ),
                    "y" => array(
                        "display" => false,
                        "fontStyle" => "bold",
                        "fontSize" => 10
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
            "data" => array(
                array(
                    "dataset" => $database."_linechart",
                    "type" => "line",
                    "display" => true,
                    "offset" => true,
                    "color" => "rgb(".($rgb[$c]).")",
                    "background" => "rgba(0,0,0,0)",
                    "datalabels" => array(
                        "display" => true,
                        "dataset" => $database."_label_linechart",
                        "column" => 1,
                        "font" => array(
                            "color" => "rgba(".($rgb[$c]).",0.8)",
                            "size" => 1.2
                        )
                    )
                ),
                array(
                    "dataset" => $database."_max_linechart",
                    "type" => "limit",
                    "display" => true,
                    "offset" => true,
                    "color" => "rgb(255,84,64)",
                    "dash" => array(
                        "dashlength" => 15,
                        "space" => 10
                    ),
                    "datalabels" => array(
                        "display" => true,
                        "dataset" => $database."_label_max_linechart",
                        "column" => 1,
                        "font" => array(
                            "color" => "rgb(255,84,64)",
                            "size" => 1.2
                        )
                    )
                ),
                array(
                    "dataset" => $database."_min_linechart",
                    "type" => "limit",
                    "display" => true,
                    "offset" => true,
                    "color" => "rgb(255,84,64)",
                    "dash" => array(
                        "dashlength" => 15,
                        "space" => 10
                    ),
                    "datalabels" => array(
                        "display" => true,
                        "dataset" => $database."_label_min_linechart",
                        "column" => 1,
                        "font" => array(
                            "color" => "rgb(255,84,64)",
                            "size" => 1.2
                        )
                    )
                )
            )
        );

        //CREATE CARDS
        $card["elements"] = array_merge($card["elements"], array($el));

        return $card;
    };

    $hh = 80;
    $h1 = ($hh/5);
    $h2 = ($hh/4);

    $cards = array(
        _card("Carta de Controle de Desfosforação do Processo Aciaria", $h1),
        _card("Carta de Controle de Delta de Processos - AF / Aciaria", $h2));

    # Create Cards
    $cards[0] = _el($cards[0], "P Saída Forno Panela", "p_saida_fp");
    $cards[0] = _el($cards[0], "P Chegada Forno Panela", "p_chegada_fp");
    $cards[0] = _el($cards[0], "P Vazamento LD", "p_vazamento_ld");
    $cards[0] = _el($cards[0], "Delta P (AF - LD)", "delta_p_af_ld");
    $cards[0] = _el($cards[0], "P do Gusa", "p_gusa", true);
    $cards[1] = _el($cards[1], "Delta P (Forno Panela)", "delta_p_fp");
    $cards[1] = _el($cards[1], "Delta P (LD - FP)", "delta_p_ld_fp");
    $cards[1] = _el($cards[1], "P2O5 Escória LD", "p2o5_escoria_ld");
    $cards[1] = _el($cards[1], "CaO da Escória LD", "cao_escoria_ld", true);

    $cols = array();

    $cols[0] = array(
        "type" => "col",
        "grid" => 6,
        "content" => array($cards[0])
    );

    $cols[1] = array(
        "type" => "col",
        "grid" => 6,
        "content" => array($cards[1])
    );

    $row = array(
        "type" => "row",
        "content" => array($cols[0], $cols[1])
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

    $page = array("layout" => $layout);
    put_json("layout.json", $page);

    return 0;
};// End of parse_data function

?>