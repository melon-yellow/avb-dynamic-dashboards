<?php

function _process_layout($in) {

    $sel = $in["sel"];
    $mes = $in["mes"];
    $cc = $in["cc"];

    function _get_style($style, $datatable, $valor, $meta){
        $success = "color: rgb(48,112,48); background-color: rgba(64,255,64,0.6);";
        $danger = "color: rgb(112,48,48); background-color: rgba(255,64,64,0.6);";
        for($i = 1; $i < count($datatable); $i++){
            if($datatable[$i][$valor] !== null){
                if($datatable[$i][$valor] <= $datatable[$i][$meta]){
                    $style[$i][$valor]["css"] .= $success;
                }else{
                    $style[$i][$valor]["css"] .= $danger;
                };
            };
        };
        return $style;
    };

    //CREATE ELEMENTS
    $el1 = array(
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
                )
            ),
            "grid" => array(
                "x" => false,
                "y" => true
            ),
            "legend" => array(
                "display" => true,
                "position" => "right"
            )
        ),
        "update" => array(
            "type" => "default",
            "duration" => 1000
        ),
        "data" => array(
            array(
                "dataset" => "ac_".$sel."_".$mes."_rston_geral_linechart",
                "type" => "bar",
                "display" => true,
                "color" => "rgb(42,53,243)",
                "datalabels" => array(
                    "display" => true,
                    "dataset" => "ac_".$sel."_".$mes."_rston_geral_linechart",
                    "column" => 1,
                    "font" => array(
                        "color" => "rgb(42,53,243)",
                        "size" => 0.8
                    ),
                )
            ),
            array(
                "dataset" => "ac_".$sel."_".$mes."_meta_geral_linechart",
                "type" => "limit",
                "display" => true,
                "color" => "rgb(245,73,43)",
                "dash" => array(
                    "dashlength" => 15,
                    "space" => 10
                )
            )
        )
    );
    $el2 = array(
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
                    "fontSize" => 10
                )
            ),
            "grid" => array(
                "x" => false,
                "y" => true
            ),
            "legend" => array(
                "display" => true,
                "position" => "right"
            )
        ),
        "update" => array(
            "type" => "default",
            "duration" => 1000
        ),
        "data" => array(
            array(
                "dataset" => "ac_".$sel."_".$mes."_rston_mecanica_linechart",
                "type" => "bar",
                "display" => true,
                "color" => "rgb(42,53,243)",
                "datalabels" => array(
                    "display" => true,
                    "dataset" => "ac_".$sel."_".$mes."_rston_mecanica_linechart",
                    "column" => 1,
                    "font" => array(
                        "color" => "rgb(42,53,243)",
                        "size" => 1
                    ),
                )
            ),
            array(
                "dataset" => "ac_".$sel."_".$mes."_meta_mecanica_linechart",
                "type" => "limit",
                "display" => true,
                "color" => "rgb(245,73,43)",
                "dash" => array(
                    "dashlength" => 15,
                    "space" => 10
                )
            )
        )
    );
    $el3 = array(
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
                    "fontSize" => 10
                )
            ),
            "grid" => array(
                "x" => false,
                "y" => true
            ),
            "legend" => array(
                "display" => true,
                "position" => "right"
            )
        ),
        "update" => array(
            "type" => "default",
            "duration" => 1000
        ),
        "data" => array(
            array(
                "dataset" => "ac_".$sel."_".$mes."_rston_eletrica_linechart",
                "type" => "bar",
                "display" => true,
                "color" => "rgb(42,53,243)",
                "datalabels" => array(
                    "display" => true,
                    "dataset" => "ac_".$sel."_".$mes."_rston_eletrica_linechart",
                    "column" => 1,
                    "font" => array(
                        "color" => "rgb(42,53,243)",
                        "size" => 1
                    ),
                )
            ),
            array(
                "dataset" => "ac_".$sel."_".$mes."_meta_eletrica_linechart",
                "type" => "limit",
                "display" => true,
                "color" => "rgb(245,73,43)",
                "dash" => array(
                    "dashlength" => 15,
                    "space" => 10
                )
            )
        )
    );
    $el4 = array(
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
                    "fontSize" => 10
                )
            ),
            "grid" => array(
                "x" => false,
                "y" => true
            ),
            "legend" => array(
                "display" => true,
                "position" => "right"
            )
        ),
        "update" => array(
            "type" => "default",
            "duration" => 1000
        ),
        "data" => array(
            array(
                "dataset" => "ac_".$sel."_".$mes."_rston_servicos_ext_linechart",
                "type" => "bar",
                "display" => true,
                "color" => "rgb(42,53,243)",
                "datalabels" => array(
                    "display" => true,
                    "dataset" => "ac_".$sel."_".$mes."_rston_servicos_ext_linechart",
                    "column" => 1,
                    "font" => array(
                        "color" => "rgb(42,53,243)",
                        "size" => 1
                    ),
                )
            ),
            array(
                "dataset" => "ac_".$sel."_".$mes."_meta_servicos_ext_linechart",
                "type" => "limit",
                "display" => true,
                "color" => "rgb(245,73,43)",
                "dash" => array(
                    "dashlength" => 15,
                    "space" => 10
                )
            )
        )
    );
    $el5 = array(
        "type" => "piechart",
        "addons" => array(
            "legend" => array(
                "display" => true,
                "position" => "bottom"
            )
        ),
        "data" => array(
            array(
                "dataset" => "ac_".$sel."_".$mes."_gastodisp_piechart",
                "datalabels" => array(
                    "display" => true,
                    "font" => array(
                        "size" => 2.5
                    ),
                )
            )
        )
    );
    $el6 = array(
        "type" => "piechart",
        "addons" => array(
            "legend" => array(
                "display" => false,
                "position" => "bottom"
            )
        ),
        "data" => array(
            array(
                "dataset" => "ac_".$sel."_".$mes."_centrc_piechart",
                "datalabels" => array(
                    "display" => true,
                    "font" => array(
                        "size" => 2.5
                    ),
                )
            )
        )
    );
    $title_style = array(
        "css" => "font-weight: bold;
            font-size: 1.8vmin;
            color: #343a40;
            border: 2px solid #343a40;"
    );
    $body_style1 = array(
        "css" => "font-size: 1.8vmin;
            background-color: rgb(232,232,232);
            color: #343a40;
            border: 2px solid #343a40;"
    );
    $body_style2 = array(
        "css" => "font-size: 1.8vmin;
            color: #343a40;
            border: 2px solid #343a40;"
    );
    $dataset_file = get_json("data.json");
    $e = $dataset_file;

    $datatable = $e["ac_".$sel."_".$mes."_geral_datatable"]["data"];
    $custo_geral_style = [
       [
            $title_style,$title_style,$title_style,$title_style,$title_style,$title_style,$title_style,$title_style
       ],
    ];
    for($s = 1; $s < count($datatable); $s++){
        $custo_geral_style[$s] = array();
        $custo_geral_style[$s][0] = $title_style;
        for($y = 1; $y < 8; $y += 2){
            $custo_geral_style[$s][$y] = $body_style1;
        };
        for($y = 2; $y < 8; $y += 2){
            $custo_geral_style[$s][$y] = $body_style2;
        };
    };
    $custo_geral_style = _get_style($custo_geral_style, $datatable, 3, 5);
    $custo_geral_style = _get_style($custo_geral_style, $datatable, 4, 5);
    $el7 = array(
        "type" => "datatable",
        "addons" => array(),
        "data" => array(
            array(
                "dataset" => "ac_".$sel."_".$mes."_geral_datatable",
                "style" => $custo_geral_style
            )
        )
    );
    /*
    //progressbar
    $el6 = array(
        "type" => "progressbar",
        "labels" => array(
            "dataset" => "pmed",
            "column" => array(0),
            "startend" => array(0, 1)
        ),
        "data" => array(
            array(
                "dataset" => "pmed",
                "column" => array(2),
                "startend" => array(0, 14),
                "color" => "rgb(2,73,43)",
                "ref" => array(
                    "dataset" => "pmed",
                    "column" => array(2),
                    "startend" => array(0, 100)
                ),
                "unit" => array(
                    "dataset" => "pmed",
                    "column" => array(3)
                )
            ),
            array(
                "dataset" => "pmed",
                "column" => array(2),
                "startend" => array(15, 30),
                "color" => "rgb(245,73,43)",
                "ref" => array(
                    "dataset" => "pmed",
                    "column" => array(2),
                    "startend" => array(0, 30)
                ),
                "unit" => array(
                    "dataset" => "pmed",
                    "column" => array(3)
                )
            )
        )
    );
    */
    //CREATE CARDS
    $card[0] = array(
        "type" => "card",
        "name" => "Custo Diário (R$/t)",
        "header" => array(
            "color" => "#f8f9fa",
            "font" => array(
                "color" => "#343a40",
                "size" => 1.2
            )
        ),
        "body" => array(
            "height" => 30,
            "color" => "#f8f9fa"
        ),
        "elements" => array($el1)
    );
    $card[1] = array(
        "type" => "card",
        "name" => "Custo Diário - Manutenção Mecânica (R$/t)",
        "header" => array(
            "color" => "#f8f9fa",
            "font" => array(
                "color" => "#343a40",
                "size" => 1.2
            )
        ),
        "body" => array(
            "height" => 30,
            "color" => "#f8f9fa"
        ),
        "elements" => array($el2)
    );
    $card[2] = array(
        "type" => "card",
        "name" => "Custo Diário - Manutenção Elétrica (R$/t)",
        "header" => array(
            "color" => "#f8f9fa",
            "font" => array(
                "color" => "#343a40",
                "size" => 1.2
            )
        ),
        "body" => array(
            "height" => 30,
            "color" => "#f8f9fa"
        ),
        "elements" => array($el3)
    );
    $card[3] = array(
        "type" => "card",
        "name" => "Custo Diário - Serviços Externos (R$/t)",
        "header" => array(
            "color" => "#f8f9fa",
            "font" => array(
                "color" => "#343a40",
                "size" => 1.2
            )
        ),
        "body" => array(
            "height" => 30,
            "color" => "#f8f9fa"
        ),
        "elements" => array($el4)
    );
    /*
    $card3 = array(
        "type" => "card",
        "name" => "Custo por Local",
        "header" => array(
            "color" => "#f8f9fa",
            "font" => array(
                "color" => "#343a40",
                "size" => 2
            )
        ),
        "body" => array(
            "height" => 30,
            "color" => "#f8f9fa"
        ),
        "elements" => array($el1)
    );
    */
    $card[4] = array(
        "type" => "card",
        "name" => "Valor Gasto x Valor disponível",
        "header" => array(
            "color" => "#f8f9fa",
            "font" => array(
                "color" => "#343a40",
                "size" => 1.2
            )
        ),
        "body" => array(
            "height" => 48.5,
            "color" => "#f8f9fa"
        ),
        "elements" => array($el5)
    );
    $card[5] = array(
        "type" => "card",
        "name" => "Centro de Custo Mês (R$/t)",
        "header" => array(
            "color" => "#f8f9fa",
            "font" => array(
                "color" => "#343a40",
                "size" => 1.2
            )
        ),
        "body" => array(
            "height" => 48.5,
            "color" => "#f8f9fa"
        ),
        "elements" => array($el6)
    );
    $card[6] = array(
        "type" => "card",
        "name" => "Tabela de Gasto Geral",
        "header" => array(
            "color" => "#f8f9fa",
            "font" => array(
                "color" => "#343a40",
                "size" => 1.2
            )
        ),
        "body" => array(
            "height" => 150,
            "color" => "#f8f9fa"
        ),
        "elements" => array($el7)
    );
    //CREATE STRUCTURE
    //create col 1
    $col1 = array(
        "type" => "col",
        "grid" => 12,
        "content" => array($card[0])
    );
    //create row 1
    $row[0] = array(
        "type" => "row",
        "content" => array($col1)
    );
    //create col 2
    $col[0] = array(
        "type" => "col",
        "grid" => 9,
        "content" => array($card[1],$card[2],$card[3])
    );
    //create col 3
    $col[1] = array(
        "type" => "col",
        "grid" => 3,
        "content" => array($card[4],$card[5])
    );
    //create col 4
    $col4 = array(
        "type" => "col",
        "grid" => 6,
        "content" => array($card[6])
    );
    //create row 2
    $row[1] = array(
        "type" => "row",
        "content" => array($col[0],$col[1])
    );
    $carde = array();
    for($s = 0; $s < count($cc); $s++){
        $dataset_key = $cc[$s];
        $dataset_name = $dataset_file[$dataset_key]["name"];
        $ele = array(
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
                        "fontSize" => 10
                    )
                ),
                "grid" => array(
                    "x" => false,
                    "y" => true
                ),
                "legend" => array(
                    "display" => true,
                    "position" => "right"
                )
            ),
            "update" => array(
                "type" => "default",
                "duration" => 1000
            ),
            "data" => array(
                array(
                    "dataset" => $dataset_key,
                    "type" => "bar",
                    "display" => true,
                    "color" => "rgb(42,53,243)",
                    "datalabels" => array(
                        "display" => true,
                        "dataset" => $dataset_key,
                        "column" => 1,
                        "font" => array(
                            "color" => "rgb(42,53,243)",
                            "size" => 1
                        ),
                    )
                )
            )
        );
        $carde[$s] = array(
            "type" => "card",
            "name" => $dataset_name,
            "header" => array(
                "color" => "#f8f9fa",
                "font" => array(
                    "color" => "#343a40",
                    "size" => 2
                )
            ),
            "body" => array(
                "height" => 20,
                "color" => "#f8f9fa"
            ),
            "elements" => array($ele)
        );
    };
    $c5 = array();
    $c6 = array();
    //CREATE ROWS
    for($s = 0; $s < floor(0.55 + (count($carde) / 2)); $s++){
        if ((0 + (2 * $s)) < count($carde)) {
            $c5 = array($carde[0 + (2 * $s)]);
        };
        if ((1 + (2 * $s)) < count($carde)) {
            $c6 = array($carde[1 + (2 * $s)]);
        };
    };
    $col5 = array(
        "type" => "col",
        "grid" => 3,
        "content" => array($c5)
    );
    $col6 = array(
        "type" => "col",
        "grid" => 3,
        "content" => array($c6)
    );
    //create row 3
    $row[2] = array(
        "type" => "row",
        "content" => array($col4, $col5, $col6)
    );
    $content = array($row[0],$row[1],$row[2]);
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
            "content" => $content
        )
    );
    $page = array(
    "layout" => $layout
    );
    //JSON ENCODE
    put_json("layout.json", $page);

    return 0;

};// End of parse_data function

?>