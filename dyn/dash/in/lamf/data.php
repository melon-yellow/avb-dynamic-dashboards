<?php

function _parse_data() {

    $metas = get_json(getenv('AVB_APP_TREFILA_METAS'));

    if (count($metas) == 0) { return -1; };

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

    $datatable_metas = array(
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
    $meta_trim_prod = 2000;
    $indicadores = array(
        "PRODUÇÃO" => array("name" => "Produção Laminação a Frio", "trim" => $meta_trim_prod),
        "sucateamento" => array("name" => "Sucateamento", "trim" => 3),
        "custo" => array("name" => "Custo R$/Ton", "trim" => 160),
        "5S" => array("name" => "5S", "trim" => 90)
    );

    $today_prod = $metas["PRODUÇÃO"]["dia"];
    $mes1_prod  = $metas["PRODUÇÃO"]["mes1"];
    $mes2_prod  = $metas["PRODUÇÃO"]["mes2"];
    $mes3_prod  = $metas["PRODUÇÃO"]["mes3"];

    //foreach meta key
    $keys = array_keys($indicadores);
    for($i = 0; $i < count($keys); $i++){
        $item = $metas[$keys[$i]];
        $ind = $indicadores[$keys[$i]]["name"];
        $ritmo_dia = $item["dia"];
        $acc_trim = ($item["mes1"] + $item["mes2"] + $item["mes3"]);
        $ritmo_trim = ($acc_trim / $count);
        $media_trim = ($acc_trim / 3);
        //condition to do calculations
        if ($ind == "Produção Laminação a Frio") {
            $raz = (4 - $count);
            #$meta_trim_prod = ((($meta_trim_prod * 3) - $acc_trim + $mes3_prod ) / $raz);
			$meta_trim_prod = ((($meta_trim_prod)));
            $ritmo_dia = (($item["dia"] / $sec) * 86400);
            $ritmo_trim = (($ritmo_trim * $count) / ((($trim_days - 1) * 86400) + $sec));
            $ritmo_trim *= (($trim_all_days * 86400) / 3);
            $ritmo_trim = round($ritmo_trim, 0);
            
            
        };
        if($ind == "Utilização %"){
            $item["dia"] = round($item["dia"],1);
            $item["mes1"] = round($item["mes1"],1);
            $item["mes2"] = round($item["mes2"],1);
            $item["mes3"] = round($item["mes3"],1);
            

        }
        if($ind == "Custo R$/Ton"){
            $item["dia"] = round(($item["dia"]/$today_prod),1);
            #$item["mes1"] = round($item["mes1"]/($mes1_prod || 1),1);
	    $item["mes1"] = round($item["mes1"]/((($mes1_prod)?$mes1_prod:1)),1);
            $item["mes2"] = round($item["mes2"]/($mes2_prod || 1),1);
            $item["mes3"] = round($item["mes3"]/($mes3_prod || 1),1);
            #$item["trim"] = 100.0;
            $ritmo_dia = (($item["dia"] / $sec) * 86400);
            $acc_prod_custo = $mes1_prod + $mes2_prod + $mes3_prod  ;
            $ritmo_trim = ($ritmo_trim/$acc_prod_custo);
            $ritmo_trim = (($ritmo_trim * $count) / ((($trim_days - 1) * 86400) + $sec));
            $ritmo_trim *= (($trim_all_days * 86400) / 3);
            $ritmo_trim = round($ritmo_trim, 0);
            $media_trim =  ($item["acumulado"]/$acc_prod_custo)/3;



        }
        if($ind == "Sucateamento"){
            $item["mes1"] = round($item["mes1"]/($mes1_prod || 1),1);
            $item["mes2"] = round($item["mes2"]/($mes2_prod || 1),1);
            $item["mes3"] = round($item["mes3"]/($mes3_prod || 1),1);
            $ritmo_dia = (($item["dia"] / $sec) * 86400);
            $acc_prod_custo = $mes1_prod + $mes2_prod + $mes3_prod  ;
            $ritmo_trim = ($ritmo_trim/$acc_prod_custo);
            $ritmo_trim = (($ritmo_trim * $count) / ((($trim_days - 1) * 86400) + $sec));
            $ritmo_trim *= (($trim_all_days * 86400) / 3);
            $ritmo_trim = round($ritmo_trim, 2);
            $media_trim =  ($item["acumulado"]/$acc_prod_custo)/3;

        }
        if($ind == "5S"){

            $ritmo_trim = (($ritmo_trim * $count) / ((($trim_days - 1) * 86400) + $sec));
            $ritmo_trim *= (($trim_all_days * 86400) / 3);
            $ritmo_trim = round($ritmo_trim, 2);
            $media_trim =  $item["acumulado"]/3;

        }
        //assign values to datatable
        $datatable_metas = array_merge(
            $datatable_metas,
            array(
                array(
                    $ind,
                    $item["meta"],
                    round($ritmo_dia, 1),
                    $item["dia"],
                    $indicadores[$keys[$i]]["trim"],
                    round($ritmo_trim, 1),
                    round($media_trim, 1),
                    $item["mes1"],
                    ($count > 1) ? $item["mes2"] : "--",
                    ($count > 2) ? $item["mes3"] : "--"
                )
            )
        );
        if($ind == "Produção Laminação a Frio"){
            $index_prod = ($i + 2);
            $rit_last_day = $ritmo_dia;
            
        };
       };

    //create prod data
    $timestamp = timestamp();
    $dat_file = get_json("dat.json");
    $dat_file = (is_array($dat_file) && $dat_file["dat"] !== null) ? $dat_file["dat"] : null;
    $prod_data = null;
    $comp = get_json("data.json");
    if(is_array($comp) && array_key_exists("lam_frio_prod_linechart", $comp)){
        $prod_data = $comp["lam_frio_prod_linechart"]["data"];
    };
    if($prod_data == null || $dat_file == null || timestamp($timestamp) >= timestamp($dat_file) + 3600){
        $dat = array("dat" => $timestamp);
        put_json("dat.json",$dat);
        $prod = get_json(getenv('AVB_APP_TREFILA_PRODUCAO'));
        $prod_data = array();
        for ($i = 0; $i < count($prod); $i++) {
            $item = $prod[$i];
            $dia = explode("/", $item["data"])[0];
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
            $prod_data[$e][1] = round($item["peso"]);
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
    $prod_rit_arr[count($prod_rit_arr)-1][1] = round($rit_last_day,1);

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
    #$datatable_metas[$index_prod][1] = $rem_prod;
    $datatable_metas[$index_prod][1] = $rem_meta;
    #$datatable_metas[5][1] = 100.0; // jayron meta custo

    
    //create piechart data
    $prod_mes = $datatable_metas[$index_prod][6 + $count];
    $rit_prod_full = 0;
    $rit_prod_full = (($prod_mes / ((($day - 1) * 86400) + $sec)) * ($month_all_days * 86400));
    //$dfc = $meta_trim_prod - $rit_prod_full + $prod_acc;
    $dfc =  $meta_trim_prod - $rit_prod_full;
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
        "lam_frio_metas_datatable" => array(
            "name" => "Metas Laminação",
            "type" => "datatable",
            "data" => $datatable_metas
        ),
        "lam_frio_prod_linechart" => array(
            "name" => "Produção Diaria Laminação",
            "type" => "linebarchart",
            "um" => "Ton",
            "data" => $prod_data
        ),
        "lam_frio_prod_rit_linechart" => array(
            "name" => "Ritmo Produção Hoje Laminação",
            "type" => "linebarchart",
            "um" => "Ton",
            "data" => $prod_rit_arr
        ),
        "lam_frio_prod_meta_linechart" => array(
            "name" => "Meta Produção Diaria Laminação",
            "type" => "linebarchart",
            "um" => "Ton",
            "data" => $prod_meta_arr
        ),
        "lam_frio_prod_meta_piechart" => array(
            "name" => "Produção/Meta Laminação",
            "type" => "piechart",
            "um" => "Ton",
            "data" => $prod_piechart
        ),
        "lam_frio_rit_prod_mes_text" => array(
            "name" => "Ritmo de Produção do Mês",
            "type" => "text",
            "data" => $prod_mes_text
        )
    );

    //json encode
    put_json("data.json", $datasets);
    index_datasets($datasets);

    return array(
        "datatable" => $datatable_metas,
        "count" => $count
    );
};

?>
