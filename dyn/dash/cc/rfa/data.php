<?php

function _parse_data() {

    $json_dec = get_json("http://192.168.17.61:3000/avb/laminador/rfa/");
    $sp_dec = get_json("http://192.168.17.61:3000/avb/laminador/rfal2/");
    
    if(count($json_dec) == 0 || count($sp_dec) == 0){ return -1; };

    $this_data = array(
        "STD01" => array("VALUE" => null, "SUP" => null, "INF" => null, "SP" => round($sp_dec["01_CTR\RM_ST01_XRED"],3)),
        "STD02" => array("VALUE" => null, "SUP" => null, "INF" => null, "SP" => round($sp_dec["01_CTR\RM_ST02_XRED"],3)),
        "STD03" => array("VALUE" => null, "SUP" => null, "INF" => null, "SP" => round($sp_dec["01_CTR\RM_ST03_XRED"],3)),
        "STD04" => array("VALUE" => null, "SUP" => null, "INF" => null, "SP" => round($sp_dec["01_CTR\RM_ST04_XRED"],3)),
        "STD05" => array("VALUE" => null, "SUP" => null, "INF" => null, "SP" => round($sp_dec["01_CTR\RM_ST05_XRED"],3)),
        "STD06" => array("VALUE" => null, "SUP" => null, "INF" => null, "SP" => round($sp_dec["01_CTR\RM_ST06_XRED"],3)),
        "STD07" => array("VALUE" => null, "SUP" => null, "INF" => null, "SP" => round($sp_dec["01_CTR\IM_ST07_XRED"],3)),
        "STD08" => array("VALUE" => null, "SUP" => null, "INF" => null, "SP" => round($sp_dec["01_CTR\IM_ST08_XRED"],3)),
        "STD09" => array("VALUE" => null, "SUP" => null, "INF" => null, "SP" => round($sp_dec["01_CTR\IM_ST09_XRED"],3)),
        "STD10" => array("VALUE" => null, "SUP" => null, "INF" => null, "SP" => round($sp_dec["01_CTR\IM_ST10_XRED"],3)),
        "STD11" => array("VALUE" => null, "SUP" => null, "INF" => null, "SP" => round($sp_dec["01_CTR\IM_ST11_XRED"],3)),
        "STD12" => array("VALUE" => null, "SUP" => null, "INF" => null, "SP" => round($sp_dec["01_CTR\IM_ST12_XRED"],3)),
        "STD13" => array("VALUE" => null, "SUP" => null, "INF" => null, "SP" => round($sp_dec["01_CTR\FM_ST13_XRED"],3)),
        "STD14" => array("VALUE" => null, "SUP" => null, "INF" => null, "SP" => round($sp_dec["01_CTR\FM_ST14_XRED"],3)),
        "STD15" => array("VALUE" => null, "SUP" => null, "INF" => null, "SP" => round($sp_dec["01_CTR\FM_ST15_XRED"],3)),
        "STD16" => array("VALUE" => null, "SUP" => null, "INF" => null, "SP" => round($sp_dec["01_CTR\FM_ST16_XRED"],3)),
        "STD17" => array("VALUE" => null, "SUP" => null, "INF" => null, "SP" => round($sp_dec["01_CTR\FM_ST17_XRED"],3)),
        "STD18" => array("VALUE" => null, "SUP" => null, "INF" => null, "SP" => round($sp_dec["01_CTR\FM_ST18_XRED"],3))
    );

    $lim_fr = array(
        $sp_dec["01_CTR\RM_ST01_XRED_PERC"],
        $sp_dec["01_CTR\RM_ST02_XRED_PERC"],
        $sp_dec["01_CTR\RM_ST03_XRED_PERC"],
        $sp_dec["01_CTR\RM_ST04_XRED_PERC"],
        $sp_dec["01_CTR\RM_ST05_XRED_PERC"],
        $sp_dec["01_CTR\RM_ST06_XRED_PERC"],
        $sp_dec["01_CTR\IM_ST07_XRED_PERC"],
        $sp_dec["01_CTR\IM_ST08_XRED_PERC"],
        $sp_dec["01_CTR\IM_ST09_XRED_PERC"],
        $sp_dec["01_CTR\IM_ST10_XRED_PERC"],
        $sp_dec["01_CTR\IM_ST11_XRED_PERC"],
        $sp_dec["01_CTR\IM_ST12_XRED_PERC"],
        $sp_dec["01_CTR\FM_ST13_XRED_PERC"],
        $sp_dec["01_CTR\FM_ST14_XRED_PERC"],
        $sp_dec["01_CTR\FM_ST15_XRED_PERC"],
        $sp_dec["01_CTR\FM_ST16_XRED_PERC"],
        $sp_dec["01_CTR\FM_ST17_XRED_PERC"],
        $sp_dec["01_CTR\FM_ST18_XRED_PERC"]
    );
    for ($y = 0; $y < count($lim_fr); $y++) {
        $lim_fr[$y] = ($lim_fr[$y] - 0);
        if($lim_fr[$y] == 0){
            $lim_fr[$y] = 5;
        };
    };

    $receita = array(array(), array());
    $receita[0][0] = "RECEITA";
    $receita[1][0] = str_replace(" ", "", $json_dec["CTR_PRODUCT_NAME"]);
    $fatr_rel = array(
        array(
            "Stands",
            "Value",
            "Mu",
            "Sup",
            "Setpoint",
            "Inf"
        )
    );
    $fatr_abs = array(
        array(
            "Stands",
            "Value",
            "Mu",
            "Sup",
            "Setpoint",
            "Inf"
        )
    );

    $e = 0;
    foreach(array_keys($this_data) as $i => $key){
        //calculate proportions
        $calc = 0;
        $thisSTD = $this_data[$key];
        //transform
        $thisSTD["VALUE"] = $json_dec[$key."_RFA"];
        $thisSTD["SUP"] = (($thisSTD["SP"]) * (1 + ($lim_fr[$e]/100)));
        $thisSTD["INF"] = (($thisSTD["SP"]) * (1 - ($lim_fr[$e]/100)));
        if($thisSTD["VALUE"] > $thisSTD["SP"]){
            $calc = (100)*(($thisSTD["VALUE"] - $thisSTD["SP"])/($thisSTD["SUP"] - $thisSTD["SP"]));
        };
        if($thisSTD["VALUE"] < $thisSTD["SP"]){
            $calc = (-100)*(($thisSTD["VALUE"] - $thisSTD["SP"])/($thisSTD["INF"] - $thisSTD["SP"]));
        };
        $prop_value = round($calc, 3);
        //assign values to dataset
        $fatr_rel[$i + 1] = array(
            $key,
            $prop_value,
            "%",
            100,
            0,
            (-100)
        );
        $fatr_abs[$i + 1] = array(
            $key,
            round($thisSTD["VALUE"], 3),
            "Fator",
            round($thisSTD["SUP"], 3),
            round($thisSTD["SP"], 3),
            round($thisSTD["INF"], 3)
        );
        $e++;
    };

    $fatr_rel_v = array();
    $fatr_rel_sp = array();
    $fatr_rel_sup = array();
    $fatr_rel_inf = array();
    for($i = 1; $i < count($fatr_rel); $i++){
        $fatr_rel_v[$i-1] = array();
        $fatr_rel_v[$i-1][0] = $fatr_rel[$i][0];
        $fatr_rel_sp[$i-1][0] = $fatr_rel[$i][0];
        $fatr_rel_sup[$i-1][0] = $fatr_rel[$i][0];
        $fatr_rel_inf[$i-1][0] = $fatr_rel[$i][0];
        $fatr_rel_v[$i-1][1] = $fatr_rel[$i][1];
        $fatr_rel_sp[$i-1][1] = $fatr_rel[$i][4];
        $fatr_rel_sup[$i-1][1] = $fatr_rel[$i][3];
        $fatr_rel_inf[$i-1][1] = $fatr_rel[$i][5];
    };
    $fatr_abs_v = array();
    $fatr_abs_sp = array();
    $fatr_abs_sup = array();
    $fatr_abs_inf = array();
    for($i = 1; $i < count($fatr_abs); $i++){
        $fatr_abs_v[$i-1] = array();
        $fatr_abs_v[$i-1][0] = $fatr_abs[$i][0];
        $fatr_abs_sp[$i-1][0] = $fatr_abs[$i][0];
        $fatr_abs_sup[$i-1][0] = $fatr_abs[$i][0];
        $fatr_abs_inf[$i-1][0] = $fatr_abs[$i][0];
        $fatr_abs_v[$i-1][1] = $fatr_abs[$i][1];
        $fatr_abs_sp[$i-1][1] = $fatr_abs[$i][4];
        $fatr_abs_sup[$i-1][1] = $fatr_abs[$i][3];
        $fatr_abs_inf[$i-1][1] = $fatr_abs[$i][5];
    };

    $datasets = array(
        "rfa_receita_datatable" => array(
            "name" => "RECEITA TABELA",
            "type" => "datatable",
            "data" => $receita
        ),
        "rfa_rel_datatable" => array(
            "name" => "FATOR R VALOR RELATIVO TABELA",
            "type" => "datatable",
            "data" => $fatr_rel
        ),
        "rfa_rel_v_linechart" => array(
            "name" => "FATOR R VALOR RELATIVO LINECHART",
            "um" => "%",
            "type" => "linebarchart",
            "data" => $fatr_rel_v
        ),
        "rfa_rel_sup_linechart" => array(
            "name" => "FATOR R SUP VALOR RELATIVO LINECHART",
            "um" => "%",
            "type" => "linebarchart",
            "data" => $fatr_rel_sup
        ),
        "rfa_rel_sp_linechart" => array(
            "name" => "FATOR R SP VALOR RELATIVO LINECHART",
            "um" => "%",
            "type" => "linebarchart",
            "data" => $fatr_rel_sp
        ),
        "rfa_rel_inf_linechart" => array(
            "name" => "FATOR R INF VALOR RELATIVO LINECHART",
            "um" => "%",
            "type" => "linebarchart",
            "data" => $fatr_rel_inf
        ),
        "rfa_abs_datatable" => array(
            "name" => "FATOR R VALOR ABSOLUTO TABELA",
            "type" => "linebarchart",
            "data" => $fatr_abs
        ),
        "rfa_abs_v_linechart" => array(
            "name" => "FATOR R VALOR ABSOLUTO LINECHART",
            "um" => "Fator",
            "type" => "linebarchart",
            "data" => $fatr_abs_v
        ),
        "rfa_abs_sup_linechart" => array(
            "name" => "FATOR R SUP VALOR ABSOLUTO LINECHART",
            "um" => "Fator",
            "type" => "linebarchart",
            "data" => $fatr_abs_sup
        ),
        "rfa_abs_sp_linechart" => array(
            "name" => "FATOR R SP VALOR ABSOLUTO LINECHART",
            "um" => "Fator",
            "type" => "linebarchart",
            "data" => $fatr_abs_sp
        ),
        "rfa_abs_inf_linechart" => array(
            "name" => "FATOR R INF VALOR ABSOLUTO LINECHART",
            "um" => "Fator",
            "type" => "linebarchart",
            "data" => $fatr_abs_inf
        )
    );

    //json encode
    put_json("data.json", $datasets);
    index_datasets($datasets);

    return 0;
};

?>