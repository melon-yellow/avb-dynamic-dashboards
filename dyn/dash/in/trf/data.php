<?php

function _parse_data() {

    $js = get_json("http://192.168.17.61:3000/avb/trefila/produtividade");

    if(count($js) == 0){ return -1; };

    //CREATE NAMES
    $table = array(
        array(
            "Máquinas",
            "Máquina 01",
            "Máquina 02",
            "Máquina 03",
            "Máquina 04",
            "Máquina 05"
        ),
        array(
            "Produção (t)",
            (array_key_exists("p01",$js) && $js["p01"] !== null ? (round(($js["p01"]/1000),2)." t") : "--"),
            (array_key_exists("p02",$js) && $js["p02"] !== null ? (round(($js["p02"]/1000),2)." t") : "--"),
            (array_key_exists("p03",$js) && $js["p03"] !== null ? (round(($js["p03"]/1000),2)." t") : "--"),
            (array_key_exists("p04",$js) && $js["p04"] !== null ? (round(($js["p04"]/1000),2)." t") : "--"),
            (array_key_exists("p05",$js) && $js["p05"] !== null ? (round(($js["p05"]/1000),2)." t") : "--")
        ),
        array(
            "Utilização",
            (array_key_exists("u01",$js) && $js["u01"] !== null ? (round(($js["u01"]*100),1)." %") : "--"),
            (array_key_exists("u02",$js) && $js["u02"] !== null ? (round(($js["u02"]*100),1)." %") : "--"),
            (array_key_exists("u03",$js) && $js["u03"] !== null ? (round(($js["u03"]*100),1)." %") : "--"),
            (array_key_exists("u04",$js) && $js["u04"] !== null ? (round(($js["u04"]*100),1)." %") : "--"),
            (array_key_exists("u05",$js) && $js["u05"] !== null ? (round(($js["u05"]*100),1)." %") : "--")
        ),
        array(
            "Tempo de Parada",
            (array_key_exists("t01",$js) && $js["t01"] !== null ? (round($js["t01"])." min") : "--"),
            (array_key_exists("t02",$js) && $js["t02"] !== null ? (round($js["t02"])." min") : "--"),
            (array_key_exists("t03",$js) && $js["t03"] !== null ? (round($js["t03"])." min") : "--"),
            (array_key_exists("t04",$js) && $js["t04"] !== null ? (round($js["t04"])." min") : "--"),
            (array_key_exists("t05",$js) && $js["t05"] !== null ? (round($js["t05"])." min") : "--")
        ),
        array(
            "Vazão Média",
            (array_key_exists("p01",$js) && $js["p01"] !== null ? (round(3600*(($js["p01"]/1000)/$js["s"]),2)." t/h") : "--"),
            (array_key_exists("p02",$js) && $js["p02"] !== null ? (round(3600*(($js["p02"]/1000)/$js["s"]),2)." t/h") : "--"),
            (array_key_exists("p03",$js) && $js["p03"] !== null ? (round(3600*(($js["p03"]/1000)/$js["s"]),2)." t/h") : "--"),
            (array_key_exists("p04",$js) && $js["p04"] !== null ? (round(3600*(($js["p04"]/1000)/$js["s"]),2)." t/h") : "--"),
            (array_key_exists("p05",$js) && $js["p05"] !== null ? (round(3600*(($js["p05"]/1000)/$js["s"]),2)." t/h") : "--")
        ),
    );

    $datasets = array(
        "trf_maquinas_datatable" => array(
            "name" => "Tabela de Produção Trefila",
            "type" => "datatable",
            "data" => $table
        )
    );

    //json encode
    put_json("data.json", $datasets);
    index_datasets($datasets);

    return 0;
};

?>