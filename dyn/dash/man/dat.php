<?php

function _process_data($equip, $filename="data.json"){

    // define the connection to database
    $host = "10.10.0.29";
    $port = "";
    $dbname = "ECP";
    $user = "pm_sap";
    $password = "Avb*2020";

    // connect to microsoft sql server database
    $db = new PDO("sqlsrv:server=".$host.$port."; database=".$dbname.";", $user, $password);

    $CD = "(2+2=5)";
    for ($i = 0; $i < count($equip); $i++) {
        $CD .= " OR (\"Equipamento\" = ".$equip[$i].")";
    };

    // get data
    $matrix = query($db, "SELECT * FROM PM_MEASURING_POINT WHERE ".$CD." ORDER BY \"Item Medido\", \"Data Medição\", \"Hora Medição\"");
    // get first element
    $first = query($db, "SELECT TOP 1 * FROM PM_MEASURING_POINT WHERE ".$CD." ORDER BY \"Data Medição\", \"Hora Medição\"");
    $first = (is_array($first) && count($first) != 0) ? (double)$first[0]["Data Medição"] : 99999999;

    // get file data
    $file_matrix = file_exists("dat.json") ? get_json("dat.json") : get_json("../../matrix.json");
    $file_matrix = (!is_array($file_matrix) || count($file_matrix) < 1) ? get_json("../../matrix.json") : $file_matrix;
    if (is_array($file_matrix)) {
        for ($i = 0; $i < count($file_matrix); $i++) {
            if ((double)($file_matrix[$i]["Data Medição"]) < $first) {
                $matrix = array_merge($matrix, array($file_matrix[$i]));
            };
        };
    };
    $dat = array();

    //create dataset
    $datasets = array();
    $items = array();
    $timestamps = array();

    //detect datasets
    for ($i = 1; $i < count($matrix); $i++) {
        $item = $matrix[$i];
        //check if equipament is selected
        if (in_array($item["Equipamento"], $equip)) {
            //index name
            $items[$item["Item Medido"]] = "";
            //get key to dataset
            $key = str_remove($item["Item Medido"], array(" ","\"","'","-","/","=","+",".","|"));
            //create datasets
            if (!array_key_exists($key."_datatable", $datasets)) {
                $datasets[$key."_datatable"] = array(
                    "name" => ($item["Item Medido"])." DATATABLE",
                    "type" => "datatable",
                    "data" => array(
                        array(
                            "Data",
                            "Hora",
                            "Medição",
                            "Unidade de Medida",
                            "Lido Por",
                            "Limite Superior",
                            "Limite Inferior"
                        )
                    )
                );
                $datasets[$key."_linechart"] = array(
                    "name" => ($item["Item Medido"])." VALOR MED",
                    "type" => "linebarchart",
                    "um" => $item["Unidade Medida"],
                    "data" => array()
                );
                $datasets[$key."_max_linechart"] = array(
                    "name" => ($item["Item Medido"])." LIM SUP",
                    "type" => "linebarchart",
                    "um" => $item["Unidade Medida"],
                    "data" => array()
                );
                $datasets[$key."_min_linechart"] = array(
                    "name" => ($item["Item Medido"])." LIM INF",
                    "type" => "linebarchart",
                    "um" => $item["Unidade Medida"],
                    "data" => array()
                );
            };
            //create datatable row
            $datatable = array();
            $r = str_split($item["Data Medição"]);
            $datatable[0] = ($r[6].$r[7]."/".$r[4].$r[5]."/".$r[0].$r[1].$r[2].$r[3]);
            $datatable[1] = $item["Hora Medição"];
            $r = $item["Valor Medido"];
            $datatable[2] = (double)str_replace(",", ".", $r);
            $datatable[3] = $item["Unidade Medida"];
            $datatable[4] = $item["Lido por"];
            $r = $item["Valor Máximo"];
            $datatable[5] = ($r !=  0 && $r != null && $r != "") ? (double)str_replace(",", ".", $r) : null;
            $r = $item["Valor Mínino"];
            $datatable[6] = ($r !=  0 && $r != null && $r != "") ? (double)str_replace(",", ".", $r) : null;
            //create timestamp
            $_timestamp = ($datatable[0]." ".$datatable[1]);
            if (!array_key_exists($key, $timestamps)) { $timestamps[$key] = array(); };
            if (!in_array($_timestamp, $timestamps[$key])) {
                $timestamps[$key] = array_merge($timestamps[$key], array($_timestamp));
                //assign datatable row
                $datasets[$key."_datatable"]["data"] = array_merge(
                    $datasets[$key."_datatable"]["data"],
                    array($datatable)
                );
                //assign linechart item
                $datasets[$key."_linechart"]["data"] = array_merge(
                    $datasets[$key."_linechart"]["data"],
                    array(array($_timestamp, $datatable[2]))
                );
                //assign max linechart item
                $datasets[$key."_max_linechart"]["data"] = array_merge(
                    $datasets[$key."_max_linechart"]["data"],
                    array(array($_timestamp, $datatable[5]))
                );
                //assign min linechart item
                $datasets[$key."_min_linechart"]["data"] = array_merge(
                    $datasets[$key."_min_linechart"]["data"],
                    array(array($_timestamp, $datatable[6]))
                );
            };
            $dat = array_merge($dat, array($item));
        };
        $matrix[$i] = null;
    };
    //save dat
    put_json("dat.json", $dat);

    //json encode
    put_json($filename, $datasets);
    index_datasets($datasets);

    return array_keys($items);
};

?>