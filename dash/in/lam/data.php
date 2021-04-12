<?php

function _parse_data() {

    $metas = get_json("http://127.0.0.1:3000/api/metas_lam_quente");

    if(count($metas) == 0){ return -1; };

    $sec = (time() - strtotime("today"));
    $day = (date("d") - 0);
    $month = (date("m") - 0);
    $year = (date("Y") - 0);
    $this_trim = 3*(floor(($month-1)/3)+1);
    $count = ($month-$this_trim+3);
    $this_trim = array($this_trim-2,$this_trim-1,$this_trim);
    //get month days
    function month_days($month, $year){
        return cal_days_in_month(CAL_GREGORIAN, $month, $year);
    };
    $month_all_days = month_days($month, $year);
    $trim_all_days = month_days($this_trim[0], $year) + month_days($this_trim[1], $year) + month_days($this_trim[2], $year);
    $trim_days = $day + ($count > 1 ? month_days($this_trim[0], $year) : 0) + ($count > 2 ? month_days($this_trim[1], $year) : 0);
    $meses = array("Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez");

    $m_dts = array(
        array(
            "Descrição do Indicador",
            "Dia",
            "Trimestre",
            "Meses"
        ),
        array(
            "Meta",
            "Ritmo",
            "Total",
            "Meta",
            "Ritmo",
            "Média",
            $meses[$this_trim[0]-1],
            $meses[$this_trim[1]-1],
            $meses[$this_trim[2]-1]
        )
    );

    $metas["PROD LAMINADO"]["meta"] = 1100;
    $metas["BLBP"]["meta"] = 130;
    $metas["SUCATEAMENTO"]["mes1"] = 2.6;
    $metas["SUCATEAMENTO"]["mes2"] = 4.7;

    $meta_trim_prod = 31740;
    $trim_metas = array(
        0,
        $meta_trim_prod,
        95.3,
        220,
        3,
        2100000,
    );

    $today_prod = 0;

    //foreach meta key
    $keys = array_keys($metas);
    for($i = 0; $i < count($keys); $i++){
        $ind = "";
        if($keys[$i] == "ACIDENTE CPT"){
            $ind = "Acidente CPT";
        };
        if($keys[$i] == "BLBP"){
            $ind = "Barra Laminada / Barra Perdida";
        };
        if($keys[$i] == "PROD LAMINADO"){
            $ind = "Produção da Laminação";
        };
        if($keys[$i] == "REND. METALICO"){
            $ind = "Rendimento Metálico do Laminado";
        };
        if($keys[$i] == "SUCATEAMENTO"){
            $ind = "Sucateamento de Laminado";
        };
        if($ind != ""){
            $this_meta = $metas[$keys[$i]];
            if($ind == "Produção da Laminação"){
                $today_prod = (str_replace(",", ".", $this_meta["dia"]) - 0);
            };
            $ritmo_dia = (str_replace(",", ".", $this_meta["dia"]) - 0);
            $ritmo_trim = (((str_replace(",", ".", $this_meta["mes1"]) - 0) + (str_replace(",", ".", $this_meta["mes2"]) - 0) + (str_replace(",", ".", $this_meta["mes3"]) - 0)) / $count);
            $media_trim = (((str_replace(",", ".", $this_meta["mes1"]) - 0) + (str_replace(",", ".", $this_meta["mes2"]) - 0) + (str_replace(",", ".", $this_meta["mes3"]) - 0)) / 3);
            if($ind == "Produção da Laminação"){
                $ritmo_dia = (((str_replace(",", ".", $this_meta["dia"]) - 0) / $sec) * 86400);
                $ritmo_trim = (((($ritmo_trim * $count) / ((($trim_days - 1) * 86400) + $sec)) * ($trim_all_days * 86400)) / 3);
                $ritmo_trim = round($ritmo_trim, 0);
            };
            $m_dts[$i + 2][0] = $ind;
            if(is_numeric(str_replace(",", ".", $this_meta["meta"]))){
                $m_dts[$i + 2][1] = (str_replace(",", ".", $this_meta["meta"]) - 0);
            } else {
                $m_dts[$i + 2][1] = 0;
            };
            $m_dts[$i + 2][2] = round($ritmo_dia, 1);
            $m_dts[$i + 2][3] = (str_replace(",", ".", $this_meta["dia"]) - 0);
            $m_dts[$i + 2][4] = $trim_metas[$i];
            $m_dts[$i + 2][5] = round($ritmo_trim, 1);
            $m_dts[$i + 2][6] = round($media_trim, 1);
            $m_dts[$i + 2][7] = (str_replace(",", ".", $this_meta["mes1"]) - 0);
            if($count > 1){
                $m_dts[$i + 2][8] = (str_replace(",", ".", $this_meta["mes2"]) - 0);
            } else {
                $m_dts[$i + 2][8] = "--";
            };
            if($count > 2){
                $m_dts[$i + 2][9] = (str_replace(",", ".", $this_meta["mes3"]) - 0);
            } else {
                $m_dts[$i + 2][9] = "--";
            };
        };
    };

    //create prod data
    $timestamp = timestamp();
    $dat_file = get_json("dat.json");
    $dat_file = (is_array($dat_file) && $dat_file["dat"] !== null) ? $dat_file["dat"] : null;
    $prod_data = null;
    $comp = get_json("data.json");
    if($comp["lam_prod_linechart"] != null){
        $prod_data = $comp["lam_prod_linechart"]["data"];
    };
    if($prod_data == null || $dat_file == null || timestamp($timestamp) >= timestamp($dat_file) + 3600){
        $dat = $timestamp;
        put_json("dat.json",$dat);
        $prod = get_json("http://127.0.0.1:3000/api/prod_lam_quente");
        $prod_data = array();
        for ($i = 0; $i < count($prod); $i++) {
            $dia = explode("/", $prod[$i]["data"])[0];
            for($g = 0; $g < 31; $g++){
                if((count($prod_data) + 1) < $dia){
                    $this_day = (string)(count($prod_data) + 1);
                    if(count(str_split($this_day)) < 2){
                        $this_day = "0".$this_day;
                    };
                    $e = count($prod_data);
                    $prod_data[$e][0] = $this_day;
                    $prod_data[$e][1] = null;
                };
            };
            $e = count($prod_data);
            $prod_data[$e][0] = $dia;
            $prod_data[$e][1] = round($prod[$i]["peso"]);
        };
    };
    $last_day = $prod_data[count($prod_data) - 1][0];
    for($g = 0; $g < 31; $g++){
        $last_day = ($last_day - 0);
        if($last_day < $day){
            $last_day = (string)($last_day + 1);
            if(count(str_split($last_day)) < 2){
                $last_day = "0".$last_day;
            };
            $prod_data[count($prod_data)] = array($last_day, null);
        };
    };
    //remove zeros
    for($i = 0; $i < count($prod_data); $i++){
        if($prod_data[$i][1] == 0){ $prod_data[$i][1] == null; };
    };
    //last day prod
    $prod_data[count($prod_data) - 1][1] = $today_prod;

    //create day prod rit
    $prod_rit_arr = $prod_data;
    for($r = 0; $r < count($prod_rit_arr); $r++){
        $prod_rit_arr[$r][1] = null;
    };
    $prod_rit_arr[count($prod_rit_arr)-1][1] = round($m_dts[3][2]);

    //create dynamic prod meta
    $prod_meta_arr = $prod_data;
    $prod_acc = 0;
    for($r = 0; $r < count($prod_data); $r++){
        $day_acc = $prod_data[$r][0];
        $rem_prod = ($meta_trim_prod - $prod_acc);
        if($rem_prod < 0){ $rem_prod = 0; };
        $rem_days = ($month_all_days - $day_acc + 1);
        if($rem_days < 1){ $rem_days = 1; };
        $rem_meta = ($rem_prod / $rem_days);
        $rem_meta = round($rem_meta, 1);
        $prod_meta_arr[$r][1] = $rem_meta;
        $prod_acc += $prod_data[$r][1];
    };
    $m_dts[3][1] = $rem_meta;

    //create piechart data
    $prod_mes = $m_dts[3][6 + $count];
    $rit_prod_full = 0;
    $rit_prod_full = (($prod_mes / ((($day - 1) * 86400) + $sec)) * ($month_all_days * 86400));
    $dfc = $meta_trim_prod - $rit_prod_full;
    $rit_prod = $rit_prod_full - $prod_mes;
    if($dfc < 0){ $dfc = 0; };
    if($rit_prod < 0){ $rit_prod = 0; };
    $prod_piechart = array(
        array("Déficit", round($dfc, 0)),
        array("Ritmo", round($rit_prod, 0)),
        array("Produzido", round($prod_mes, 0))
    );

    //text of piechart
    $prod_mes_text = "Ritmo: ".((string)round($rit_prod_full, 0))." Ton";

    //create datasets
    $datasets = array(
        "lam_metas_datatable" => array(
            "name" => "Metas Laminação",
            "type" => "datatable",
            "data" => $m_dts
        ),
        "lam_prod_linechart" => array(
            "name" => "Produção Diaria Laminação",
            "type" => "linebarchart",
            "um" => "Ton",
            "data" => $prod_data
        ),
        "lam_prod_rit_linechart" => array(
            "name" => "Ritmo Produção Hoje Laminação",
            "type" => "linebarchart",
            "um" => "Ton",
            "data" => $prod_rit_arr
        ),
        "lam_prod_meta_linechart" => array(
            "name" => "Meta Produção Diaria Laminação",
            "type" => "linebarchart",
            "um" => "Ton",
            "data" => $prod_meta_arr
        ),
        "lam_prod_meta_piechart" => array(
            "name" => "Produção/Meta Laminação",
            "type" => "piechart",
            "um" => "Ton",
            "data" => $prod_piechart
        ),
        "lam_rit_prod_mes_text" => array(
            "name" => "Ritmo de Produção do Mês",
            "type" => "text",
            "data" => $prod_mes_text
        )
    );

    //json encode
    put_json("data.json", $datasets);
    index_datasets($datasets);

    return 0;
};

?>