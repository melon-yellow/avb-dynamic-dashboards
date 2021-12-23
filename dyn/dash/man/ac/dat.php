<?php

function _process_data($sel, $sel_full){

    //get data
    $dat = get_json("../dat.json");
    //metas
    $metas = $dat["metas"];
    //centros de custo
    $cc_names = $dat["cc_names"];

    //link: https://docs.google.com/spreadsheets/d/1kJJ9mDJNNy-5948AeqlEHHINurqDCFZ6llkdjhbpJrM/edit#gid=0
    $custo_txt = file_get_contents("https://docs.google.com/spreadsheets/d/1kJJ9mDJNNy-5948AeqlEHHINurqDCFZ6llkdjhbpJrM/export?format=tsv&id=1kJJ9mDJNNy-5948AeqlEHHINurqDCFZ6llkdjhbpJrM&gid=0");
    //link: https://docs.google.com/spreadsheets/d/1kJJ9mDJNNy-5948AeqlEHHINurqDCFZ6llkdjhbpJrM/edit#gid=1961924549
    $producao_txt = file_get_contents("https://docs.google.com/spreadsheets/d/1kJJ9mDJNNy-5948AeqlEHHINurqDCFZ6llkdjhbpJrM/export?format=tsv&id=1kJJ9mDJNNy-5948AeqlEHHINurqDCFZ6llkdjhbpJrM&gid=1961924549");

    if($custo_txt == "" || $producao_txt == ""){ return -1; };

    $rawdata = null;
    $rows = explode("\r\n", $custo_txt);
    $rawdata = array();
    for($i = 0; $i < count($rows); $i++){
        $rawdata[$i] = explode("\t", $rows[$i]);
        for($s = 0; $s < count($rawdata[$i]); $s++){
            if($rawdata[$i][$s] != str_replace(",", "", $rawdata[$i][$s])){
                $e = str_remove($rawdata[$i][$s], array("R","$"," ","-","."));
                $e = str_replace(",", ".", $e);
                $rawdata[$i][$s] = (double)$e;
            };
        };
    };
    $custo = $rawdata;

    $rawdata = null;
    $rows = explode("\r\n", $producao_txt);
    $rawdata = array();
    for($i = 0; $i < count($rows); $i++){
        $rawdata[$i] = explode("\t", $rows[$i]);
        for($s = 0; $s < count($rawdata[$i]); $s++){
            if($rawdata[$i][$s] != str_replace(",", "", $rawdata[$i][$s])){
                $e = str_remove($rawdata[$i][$s], array("R","$"," ","-","."));
                $e = str_replace(",", ".", $e);
                $rawdata[$i][$s] = (double)$e;
            };
        };
    };
    $producao = $rawdata;

    function _index($matrix, $col){
        $sets = array();
        //detect datasets
        for($i = 0; $i < count($matrix); $i++){
            if(count($sets) > 0){
                $exists = false;
                for($s = 0; $s < count($sets); $s++){
                    if($sets[$s]["set"] == $matrix[$i][$col]){
                        $sets[$s]["dataset"][count($sets[$s]["dataset"])] = $matrix[$i];
                        $exists = true;
                    };
                };
                if(!$exists){
                    $sets[count($sets)] = array(
                        "set" => $matrix[$i][$col],
                        "dataset" => array($matrix[$i])
                    );
                };
            } else {
                $sets[0] = array(
                    "set" => $matrix[$i][$col],
                    "dataset" => array($matrix[$i])
                );
            };
        };
        return $sets;
    };

    //custo
    $e = _index($custo, 2);

    function fix_sel($sel){
        $sel = str_replace("Ç", "C", $sel);
        $sel = str_replace("Ã", "A", $sel);
        return $sel;
    };

    $custo = null;
    for($i = 0; $i < count($e); $i++){
        if($e[$i]["set"] == fix_sel($sel_full)){
            $custo = $e[$i]["dataset"];
        };
    };

    $mes_custo = _index($custo, 1);

    function idont_know($mes_custo){
        $e_ar = array();
        for($i = 0; $i < count($mes_custo); $i++){
            $e = _index($mes_custo[$i]["dataset"], 11);
            $sort = null;
            $sort = array();
            for($s = 0; $s < count($e); $s++){
                $sort[$e[$s]["set"]] = $e[$s]["dataset"];
            };
            $e_ar[$mes_custo[$i]["set"]] = $sort;
        };
        return $e_ar;
    };
    $e_custo = idont_know($mes_custo);

    function _method_fill_full($centro, $u, $h, $dt){
        return array(
            "aplicacao" => $centro,
            "mes" => (100*((int)(explode(";",$u)[0])) + ((int)(explode(";",$u)[1]))),
            "dia" => (int)implode("",array_reverse(explode("/",$h))),
            "centro" => "geral",
            "dataset" => $dt
        );
    };

    function fill_full_dataset($e, $centro, $full_dataset){
        $u = array_keys($e);
        for($i = 0; $i < count($u); $i++){
            $h = array_keys($e[$u[$i]]);
            for($s = 0; $s < count($h); $s++){
                $me = array();
                $el = array();
                $se = array();
                $ge = $e[$u[$i]][$h[$s]];
                for($t = 0; $t < count($e[$u[$i]][$h[$s]]); $t++){
                    if($e[$u[$i]][$h[$s]][$t][5] == "MANUTENÇÃO MECÂNICA"){
                        $me[count($me)] = $e[$u[$i]][$h[$s]][$t];
                    } else {
                        if($e[$u[$i]][$h[$s]][$t][5] == "MANUTENÇÃO ELÉTRICA"){
                            $el[count($el)] = $e[$u[$i]][$h[$s]][$t];
                        } else {
                            $se[count($se)] = $e[$u[$i]][$h[$s]][$t];
                        };
                    };
                };
                $mes = (string)(100*((int)(explode(";",$u[$i])[0])) + ((int)(explode(";",$u[$i])[1])));
                if(!array_key_exists($mes, $full_dataset)){
                    $full_dataset[$mes] = array(
                        $centro => array(
                            "geral" => array(),
                            "mecanica" => array(),
                            "eletrica" => array(),
                            "servicos_ext" => array()
                        )
                    );
                };
                $full_dataset[$mes][$centro]["geral"][count($full_dataset[$mes][$centro]["geral"])] = _method_fill_full($centro, $u[$i], $h[$s], $ge);
                $full_dataset[$mes][$centro]["mecanica"][count($full_dataset[$mes][$centro]["mecanica"])] = _method_fill_full($centro, $u[$i], $h[$s], $me);
                $full_dataset[$mes][$centro]["eletrica"][count($full_dataset[$mes][$centro]["eletrica"])] = _method_fill_full($centro, $u[$i], $h[$s], $el);
                $full_dataset[$mes][$centro]["servicos_ext"][count($full_dataset[$mes][$centro]["servicos_ext"])] = _method_fill_full($centro, $u[$i], $h[$s], $se);
            };
        };
        return $full_dataset;
    };

    $full_dataset = fill_full_dataset($e_custo, $sel, array());

    //producao

    $e = _index($producao, 2);

    $sel_prod = null;

    for($i = 0; $i < count($e); $i++){
        if($e[$i]["set"] == fix_sel($sel_full)){
            $sel_prod = $e[$i]["dataset"];
        };
    };

    function pr_dia($to_sort){
        $sorted = array();
        for($i = 0; $i < count($to_sort); $i++){
            $sum = 0;
            if($to_sort[$i]["set"] != ""){
                for($s = 0; $s < count($to_sort[$i]["dataset"]); $s++){
                    $sum += (double)$to_sort[$i]["dataset"][$s][4];
                };
                $mes = array_reverse(explode("/", $to_sort[$i]["set"]));
                $sorted[count($sorted)] = array(($mes[0].$mes[1]), (int)($mes[0].$mes[1].$mes[2]), $sum, $to_sort[$i]["set"]);
            };
        };
        return $sorted;
    };

    function pr_mes($a_prod_mes, $set, $prod_mes){
        for($i = 0; $i < count($a_prod_mes); $i++){
            $mes = $a_prod_mes[$i]["set"];
            if(!array_key_exists($mes, $prod_mes)){
                $prod_mes[$mes] = array();
            };
            $prod_mes[$mes][$set] = $a_prod_mes[$i]["dataset"];
        };
        return $prod_mes;
    };

    $prod_mes = pr_mes(_index(pr_dia(_index($sel_prod, 3)), 0), $sel, array());

    //centros de custo

    function _deindex($i_matrix, $prod_mes, $app, $cc_names){
        $e = array();
        for($i = 0; $i < count($i_matrix); $i++){
            $mes = (100*((int)(explode(";",$i_matrix[$i]["set"])[0])) + ((int)(explode(";",$i_matrix[$i]["set"])[1])));
            $mes = (string)$mes;
            if(strlen($mes) < 6){
                $mes = "0".$mes;
            };
            $prod = 0;
            for($w = 0; $w < count($prod_mes[$mes][$app]); $w++){
                $prod += $prod_mes[$mes][$app][$w][2];
            };
            $data = $i_matrix[$i]["dataset"];
            $this_cc = _index($data, 9);
            $e[$mes] = array();
            for($r = 0; $r < count($this_cc); $r++){
                $cc = $this_cc[$r]["set"];
                $cc_data = $this_cc[$r]["dataset"];
                $gasto_cc = 0;
                for($g = 0; $g < count($cc_data); $g++){
                    $gasto_cc += ((double)str_replace(",", ".", $cc_data[$g][3]));
                };
                if(array_key_exists($cc, $cc_names)){
                    $cc = $cc_names[$cc];
                };
                if($prod > 0){
                $e[$mes][$cc] = round(($gasto_cc / $prod), 1);
                } else {
                    $e[$mes][$cc] = round($gasto_cc, 1);
                };
            };
        };

        return $e;
    };

    $custo_cc = _deindex($mes_custo, $prod_mes, $sel, $cc_names);

    //create month datasets

    function _pre_count($matrix, $mes){

        $e = array(
            "Data",
            "Custo Diário (R$)",
            "Produção (Ton)",
            "Custo por Tonelada (R$/Ton)",
            "Acumulado (R$/Ton)",
            "Meta (R$/Ton)",
            "Custo Acumulado (R$)",
            "Produção Acumulada (Ton)"
        );

        $v = array($e);

        $mx = str_split($mes);

        $count = cal_days_in_month(CAL_GREGORIAN, (int)($mx[4].$mx[5]), (int)($mx[0].$mx[1].$mx[2].$mx[3]));

        $prodAcc = 0;
        for($t = 0; $t < $count; $t++){
            $prod = 0;
            $data = ((string)($t + 1))."/".$mx[4].$mx[5]."/".$mx[0].$mx[1].$mx[2].$mx[3];
            if($t < 9){ $data = "0".$data; };
            if($t < count($matrix)){
                $prod = round((double)($matrix[$t][2]), 3);
                $prodAcc += $prod;
                $prodAcc = round($prodAcc, 3);
                $data = $matrix[$t][3];
            };
            $v[count($v)] = array($data,0,$prod,0,0,0,0,$prodAcc);
        };

        return $v;
    };

    function _assemble($e, $prod_mes, $full_dataset, $metas, $mes, $app, $centro){

        $lastOffset = 0;

        for($w = 0; $w < count($prod_mes[$mes][$app]); $w++){

            $s = 42;
            for($si = 0; $si < count($full_dataset[$mes][$app][$centro]); $si++){
                if($prod_mes[$mes][$app][$w][1] == $full_dataset[$mes][$app][$centro][$si]["dia"]){
                    $s = $si;
                };
            };

            $Custo = 0.0;
            $offset = $w;
            $Data = $prod_mes[$mes][$app][$w][3];

            if($s != 42){
                $offset = $w + 1;
                for($x = 0; $x < count($full_dataset[$mes][$app][$centro][$s]["dataset"]); $x++){
                    $Custo += (double)($full_dataset[$mes][$app][$centro][$s]["dataset"][$x][3]);
                };
            } else {
                $offset = $w + 1;
            };

            $Prod = $e["ac_".$app."_".$mes."_".$centro."_datatable"]["data"][$offset][2];
            $RsTon = $Custo;
            if($Prod != 0 && $Prod != null){
                $RsTon = (double)($Custo / $Prod);
            };
            $Meta = $metas[$app][$centro];
            $CustoAcc = (double)$Custo;
            for($x = 1; $x < $offset; $x++){
                $CustoAcc += (double)($e["ac_".$app."_".$mes."_".$centro."_datatable"]["data"][$x][1]);
            };
            $CustoAcc = $CustoAcc;
            $ProdAcc = $e["ac_".$app."_".$mes."_".$centro."_datatable"]["data"][$offset][7];
            $RsTonAcc = (double)$CustoAcc;
            if($ProdAcc != 0){
                $RsTonAcc = (double)($CustoAcc / $ProdAcc);
            };

            $row = array($Data,$Custo,$Prod,$RsTon,$RsTonAcc,$Meta,$CustoAcc,$ProdAcc);
            $e["ac_".$app."_".$mes."_".$centro."_datatable"]["data"][$offset] = $row;

            $lastOffset = $offset;

        };

        for($w = 1; $w < count($e["ac_".$app."_".$mes."_".$centro."_datatable"]["data"]); $w++){

            $e["ac_".$app."_".$mes."_".$centro."_datatable"]["data"][$w][1] = round($e["ac_".$app."_".$mes."_".$centro."_datatable"]["data"][$w][1], 1);
            $e["ac_".$app."_".$mes."_".$centro."_datatable"]["data"][$w][2] = round($e["ac_".$app."_".$mes."_".$centro."_datatable"]["data"][$w][2], 1);
            $e["ac_".$app."_".$mes."_".$centro."_datatable"]["data"][$w][3] = round($e["ac_".$app."_".$mes."_".$centro."_datatable"]["data"][$w][3], 1);
            $e["ac_".$app."_".$mes."_".$centro."_datatable"]["data"][$w][4] = round($e["ac_".$app."_".$mes."_".$centro."_datatable"]["data"][$w][4], 1);
            $e["ac_".$app."_".$mes."_".$centro."_datatable"]["data"][$w][5] = round($e["ac_".$app."_".$mes."_".$centro."_datatable"]["data"][$w][5], 1);
            $e["ac_".$app."_".$mes."_".$centro."_datatable"]["data"][$w][6] = round($e["ac_".$app."_".$mes."_".$centro."_datatable"]["data"][$w][6], 1);
            $e["ac_".$app."_".$mes."_".$centro."_datatable"]["data"][$w][7] = round($e["ac_".$app."_".$mes."_".$centro."_datatable"]["data"][$w][7], 1);

            if((double)($e["ac_".$app."_".$mes."_".$centro."_datatable"]["data"][$w][5]) == 0){
                $e["ac_".$app."_".$mes."_".$centro."_datatable"]["data"][$w][4] = (double)($e["ac_".$app."_".$mes."_".$centro."_datatable"]["data"][$w - 1][4]);
                $e["ac_".$app."_".$mes."_".$centro."_datatable"]["data"][$w][5] = (double)($e["ac_".$app."_".$mes."_".$centro."_datatable"]["data"][$w - 1][5]);
                $e["ac_".$app."_".$mes."_".$centro."_datatable"]["data"][$w][6] = (double)($e["ac_".$app."_".$mes."_".$centro."_datatable"]["data"][$w - 1][6]);
                $e["ac_".$app."_".$mes."_".$centro."_datatable"]["data"][$w][7] = (double)($e["ac_".$app."_".$mes."_".$centro."_datatable"]["data"][$w - 1][7]);
            };

            if($w > $lastOffset){
                for($o = 0; $o < count($e["ac_".$app."_".$mes."_".$centro."_datatable"]["data"][$w]); $o++){
                    if($e["ac_".$app."_".$mes."_".$centro."_datatable"]["data"][$w][$o] == 0){
                        $e["ac_".$app."_".$mes."_".$centro."_datatable"]["data"][$w][$o] = null;
                    };
                };
            };

        };

        $CustoAccF = 0;
        $ProdAccF = 0;
        for($x = 1; $x < count($e["ac_".$app."_".$mes."_".$centro."_datatable"]["data"]); $x++){
            $CustoAccF += (double)($e["ac_".$app."_".$mes."_".$centro."_datatable"]["data"][$x][1]);
            $ProdAccF += (double)($e["ac_".$app."_".$mes."_".$centro."_datatable"]["data"][$x][2]);
        };
        $RsTonAccF = $CustoAccF;
        if($ProdAccF != 0){
            $RsTonAccF = (double)($CustoAccF / $ProdAccF);
        };

        $row = $e["ac_".$app."_".$mes."_".$centro."_datatable"]["data"][count($e["ac_".$app."_".$mes."_".$centro."_datatable"]["data"]) - 1];
        $row[0] = "ACUMULADO";
        $row[1] = round($CustoAccF, 1);
        $row[2] = round($ProdAccF, 1);
        $row[3] = round($RsTonAccF, 1);
        $e["ac_".$app."_".$mes."_".$centro."_datatable"]["data"][count($e["ac_".$app."_".$mes."_".$centro."_datatable"]["data"])] = $row;

        $name = explode(" ", $e["ac_".$app."_".$mes."_".$centro."_datatable"]["name"]);

        $lbc = array();
        $lbc["prod"] = array();
        $lbc["custo"] = array();
        $lbc["rston"] = array();
        $lbc["meta"] = array();
        for($u = 0; $u < (count($e["ac_".$app."_".$mes."_".$centro."_datatable"]["data"]) - 1); $u++){
            $day = (string)($u + 1);
            if(strlen($day) < 2){ $day = "0".$day; };
            if($u == (count($e["ac_".$app."_".$mes."_".$centro."_datatable"]["data"]) - 2)){
                $day = "ACC";
            };
            $lbc["prod"][$u] = array($day,
                $e["ac_".$app."_".$mes."_".$centro."_datatable"]["data"][$u + 1][2]
            );
            $lbc["custo"][$u] = array($day,
                $e["ac_".$app."_".$mes."_".$centro."_datatable"]["data"][$u + 1][1]
            );
            $lbc["rston"][$u] = array($day,
                $e["ac_".$app."_".$mes."_".$centro."_datatable"]["data"][$u + 1][3]
            );
            $lbc["meta"][$u] = array($day,
                $e["ac_".$app."_".$mes."_".$centro."_datatable"]["data"][$u + 1][5]
            );
            if($lbc["prod"][$u][1] <= 0){ $lbc["prod"][$u][1] = null; };
            if($lbc["custo"][$u][1] <= 0){ $lbc["custo"][$u][1] = null; };
            if($lbc["rston"][$u][0] != "ACC"){
                if($lbc["rston"][$u][1] <= 0){ $lbc["rston"][$u][1] = null; };
            };
        };

        $e["ac_".$app."_".$mes."_prod_linechart"] = array(
            "name" => $name[0]." PRODUÇÃO ".$name[2],
            "type" => "linebarchart",
            "um" => "Ton",
            "data" => $lbc["prod"]
        );

        $e["ac_".$app."_".$mes."_custo_".$centro."_linechart"] = array(
            "name" => $name[0]." CUSTO ".$name[2]." - ".strtoupper($centro),
            "type" => "linebarchart",
            "um" => "R$",
            "data" => $lbc["custo"]
        );

        $e["ac_".$app."_".$mes."_rston_".$centro."_linechart"] = array(
            "name" => $name[0]." R$/TON ".$name[2]." - ".strtoupper($centro),
            "type" => "linebarchart",
            "um" => "R$/Ton",
            "data" => $lbc["rston"]
        );

        $e["ac_".$app."_".$mes."_meta_".$centro."_linechart"] = array(
            "name" => $name[0]." META ".$name[2]." - ".strtoupper($centro),
            "type" => "linebarchart",
            "um" => "R$/Ton",
            "data" => $lbc["meta"]
        );

        return $e;
    };

    function _tot($e, $app, $appl, $mes, $m){

        $d = array(
            array("Mes", "Projeção", "Valor Disponivel Total", "Valor Gasto", "Valor Disponível Liquido"),
            array($m, "Real", null, null, null),
            array($m, "Ritmo", null, null, null)
        );

        $e["ac_".$app."_".$mes."_gastodisp_datatable"] = array(
            "name" => $appl." VALOR DISPONÍVEL ".$m,
            "type" => "datatable",
            "data" => $d
        );

        $acc = $e["ac_".$app."_".$mes."_geral_datatable"]["data"][count($e["ac_".$app."_".$mes."_geral_datatable"]["data"]) - 1];
        $rsTon = $acc[4];
        $meta = $acc[5];
        $gasto = $acc[6];
        $prod = $acc[7];
        $disp = ($prod * $meta);
        $dispL = $disp - $gasto;

        $e["ac_".$app."_".$mes."_gastodisp_datatable"]["data"][1][2] = round($disp, 1);
        $e["ac_".$app."_".$mes."_gastodisp_datatable"]["data"][1][3] = round($gasto, 1);
        $e["ac_".$app."_".$mes."_gastodisp_datatable"]["data"][1][4] = round($dispL, 1);

        $lastOffset = 1;
        for($j = (count($e["ac_".$app."_".$mes."_geral_datatable"]["data"]) - 2); $j > 0; $j--){
            $a = ($e["ac_".$app."_".$mes."_geral_datatable"]["data"][$j][4] == $rsTon);
            $b = ($e["ac_".$app."_".$mes."_geral_datatable"]["data"][$j][6] == $gasto);
            $c = ($e["ac_".$app."_".$mes."_geral_datatable"]["data"][$j][7] == $prod);
            if($a && $b && $c){
                $lastOffset = $j;
            };
        };

        $dispRt = ($disp / $lastOffset) * (count($e["ac_".$app."_".$mes."_geral_datatable"]["data"]) - 2);
        $gastoRt = ($gasto / $lastOffset) * (count($e["ac_".$app."_".$mes."_geral_datatable"]["data"]) - 2);
        $dispLRt = $dispRt - $gastoRt;

        $e["ac_".$app."_".$mes."_gastodisp_datatable"]["data"][2][2] = round($dispRt, 1);
        $e["ac_".$app."_".$mes."_gastodisp_datatable"]["data"][2][3] = round($gastoRt, 1);
        $e["ac_".$app."_".$mes."_gastodisp_datatable"]["data"][2][4] = round($dispLRt, 1);

        if($dispL < 0){ $dispL = 0; };
        if($dispLRt < 0){ $dispLRt = 0; };

        $name = $e["ac_".$app."_".$mes."_gastodisp_datatable"]["name"];

        $e["ac_".$app."_".$mes."_gastodisp_piechart"] = array(
            "name" => $name,
            "type" => "piechart",
            "um" => "R$",
            "data" => array(
                array("Gasto", round($gasto, 1)),
                array("Disponível", round($dispL, 1))
            )
        );
        $e["ac_".$app."_".$mes."_gastodisprit_piechart"] = array(
            "name" => $name." RITMO",
            "type" => "piechart",
            "um" => "R$",
            "data" => array(
                array("Gasto Ritmo", round($gastoRt, 1)),
                array("Disponível Ritmo", round($dispLRt, 1))
            )
        );

        return $e;
    };

    function _cc_generate($e, $app, $mes, $cc_mes){
        $cc = $cc_mes[$mes];
        $cc_keys = array_keys($cc);
        $pie = array();
        for($f = 0; $f < count($cc_keys); $f++){
            $pie[$f] = array();
            $pie[$f][0] = $cc_keys[$f];
            $pie[$f][1] = $cc[$cc_keys[$f]];
        };
        $e["ac_".$app."_".$mes."_centrc_piechart"] = array(
            "name" => strtoupper($app)." ".$mes." CENTROS DE CUSTO",
            "type" => "piechart",
            "um" => "R$/Ton",
            "data" => $pie
        );
        return $e;
    };

    function _cc_ans($cc){
        $mod = array(
            "name" => "",
            "type" => "linebarchart",
            "um" => "R$/Ton",
            "data" => array()
        );
        $e = array();
        $cc_keys = array_keys($cc);
        for($f = 0; $f < count($cc_keys); $f++){
            $label = $cc_keys[$f];
            $ccy = $cc[$label];
            $cc_t_keys = array_keys($ccy);
            for($i = 0; $i < count($cc_t_keys); $i++){
                $cc_t = $cc_t_keys[$i];
                $value = $ccy[$cc_t];
                $name = strtoupper($cc_t);
                $key = strtolower(str_replace(" ", "", $cc_t));
                $arr = array();
                if(array_key_exists($key."_centrc_piechart", $e)){
                    $arr = $e["ac_".$key."_centrc_piechart"]["data"];
                } else {
                    $e["ac_".$key."_centrc_piechart"] = $mod;
                    $e["ac_".$key."_centrc_piechart"]["name"] = "CENTROS DE CUSTO - ".$name;
                };
                $arr = array_merge($arr, [[$label, $value]]);
                $e["ac_".$key."_centrc_piechart"]["data"] = $arr;
            };
        };
        $key = array_keys($e);
        for($i = 0; $i < count($key); $i++){
            $dts = $e[$key[$i]]["data"];
            $arr = array();
            for($f = 0; $f < count($cc_keys); $f++){
                $arr[$f] = array($cc_keys[$f], 0);
                for($r = 0; $r < count($dts); $r++){
                    if($dts[$r][0] == $cc_keys[$f]){
                        $arr[$f][1] = $dts[$r][1];
                    };
                };
                $l = (string)$arr[$f][0];
                $l = str_split($l);
                $l = $l[0].$l[1].$l[2].$l[3]."/".$l[4].$l[5];
                $arr[$f][0] = $l;
            };
            $e[$key[$i]]["data"] = $arr;
        };
        return $e;
    };

    function _pre_create($key, $name, $prod_mes, $mes, $m){
        $r = _pre_count($prod_mes[$mes][$key], $mes);
        $e = array(
            "ac_".$key."_".$mes."_geral_datatable" => array(
                "name" => $name." CUSTO ".$m." - GERAL",
                "type" => "datatable",
                "data" => $r
            ),
            "ac_".$key."_".$mes."_mecanica_datatable" => array(
                "name" => $name." CUSTO ".$m." - MECANICA",
                "type" => "datatable",
                "data" => $r
            ),
            "ac_".$key."_".$mes."_eletrica_datatable" => array(
                "name" => $name." CUSTO ".$m." - ELETRICA",
                "type" => "datatable",
                "data" => $r
            ),
            "ac_".$key."_".$mes."_servicos_ext_datatable" => array(
                "name" => $name." CUSTO ".$m." - SERVIÇOS EXTERNOS",
                "type" => "datatable",
                "data" => $r
            )
        );
        return $e;
    };

    $meses = array_keys($full_dataset);
    $final_set = array();
    //for each month
    for($i = 0; $i < count($meses); $i++){
        $mes = $meses[$i];
        $m = str_split($mes);
        $m = $m[4].$m[5]."/".$m[0].$m[1].$m[2].$m[3];
        $um = array();
        $um[0] = array("Texto", "Texto", "Texto", "Texto", "Texto", "Texto", "Texto", "Texto");
        for($y = 1; $y <= 31; $y++){
            $um[$y] = array("Data", "R$", "Ton", "R$/Ton", "R$/Ton", "R$/Ton", "R$", "Ton");
        };
        //execute functions
        $dat = _pre_create($sel, $sel_full, $prod_mes, $mes, $m);
        $dat = _assemble($dat, $prod_mes, $full_dataset, $metas, $mes, $sel, "geral");
        $dat = _assemble($dat, $prod_mes, $full_dataset, $metas, $mes, $sel, "mecanica");
        $dat = _assemble($dat, $prod_mes, $full_dataset, $metas, $mes, $sel, "eletrica");
        $dat = _assemble($dat, $prod_mes, $full_dataset, $metas, $mes, $sel, "servicos_ext");
        $dat = _cc_generate($dat, $sel, $mes, $custo_cc);
        $dat = _tot($dat, $sel, $sel_full, $mes, $m);
        //merge arrays
        $final_set = array_merge($final_set, $dat);
    };
    //finally
    $final_cc = _cc_ans($custo_cc);
    $final_set = array_merge($final_set, $final_cc);

    put_json("data.json", $final_set);
    index_datasets($final_set);

    return array(
        "sel" => $sel,
        "mes" => max($meses),
        "cc" => array_keys($final_cc)
    );
};

?>