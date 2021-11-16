<?php

function _parse_data() {

#############################################################################################################################

    $ld_host = "192.168.17.42";
    $fp_host = "192.168.17.43";
    $ld_user = "cv.avb";
    $fp_user = "fp.avb";
    $password = "avbfpcv*56";
    $dbname = "ANALYSES";

    // DBs
    $ld_db = new PDO("odbc:server=".$ld_host."; database=".$dbname.";", $ld_user, $password);
    $fp_db = new PDO("odbc:server=".$fp_host."; database=".$dbname.";", $fp_user, $password);

#############################################################################################################################

    function query_expec($index) {

        $aco = ($index != 0) ? "16" : "17";
        $corr_gusa = ($index != 0) ? "" : "corrida_gusa.value as 'Corrida Gusa',";
        $left_join = ($index != 0) ? "" : implode(" ", array(
            "LEFT JOIN Attributes corrida_gusa (nolock) ON",
            "corrida_gusa.LinkAnalyses = Elements.LinkAnalyses and",
            "corrida_gusa.LinkName = 21")
        );

        return implode(" ",
            array(
                "declare @DATA as datetime",
                "set @DATA=getdate()-3",
                "SELECT",
                "Elements.LinkAnalyses as 'ID',",
                "convert(varchar(10), analyses.Anadatetime, 103) AS data,",
                "convert(varchar(10), analyses.Anadatetime, 108) AS hora,",
                "origem.value as 'Origem',",
                "tipo_aço.Value as 'Tipo Aço', ",
                $corr_gusa,
                "substring(Attributes.Value, 1, 7) AS Corrida,",
                "Attributes.Value AS Corrida_Completa,",
                "turma.value as 'Turma',",
                "DisplayName.Name as 'Elemento',",
                "CASE",
                "WHEN DisplayName.Name like 'N' then Elements.Value*10000",
                "ELSE Elements.Value",
                "end as 'Dados'",
                "FROM",
                "Elements (nolock)",
                "INNER JOIN DisplayName (nolock) ON",
                "DisplayName.ID = Elements.LinkName",
                "INNER JOIN Analyses (nolock) ON",
                "Analyses.ID = Elements.LinkAnalyses",
                "INNER JOIN Attributes (nolock) ON",
                "Attributes.LinkAnalyses = Elements.LinkAnalyses and",
                "Attributes.LinkName = 4",
                "INNER JOIN Attributes origem (nolock) ON",
                "origem.LinkAnalyses = Elements.LinkAnalyses and", 
                "origem.LinkName = 15",
                "INNER JOIN Attributes tipo_aço (nolock) ON",
                "tipo_aço.LinkAnalyses = Elements.LinkAnalyses and",
                "tipo_aço.LinkName =".$aco,
                "INNER JOIN Attributes turma (nolock) ON",
                "turma.LinkAnalyses = Elements.LinkAnalyses and",
                "turma.LinkName = 18",
                $left_join,
                "WHERE",
                "DisplayName.Name in ('P') and",
                "Attributes.Value like '%%' and anadatetime>=@DATA",
                "ORDER BY analyses.Anadatetime DESC"
            )
        );
    };

    // get data
    $ld = query($ld_db, query_expec(0));
    $fp = query($fp_db, query_expec(1));
    $ld_db = null;
    $fp_db = null;

#############################################################################################################################

    // Index Object
    function deindex($ld, $fp) {
        $map = array();
        $obj = array_merge($ld, $fp);
        for ($i = 0; $i < count($obj); $i++) {
            $id = $obj[$i]["Origem"];
            if(!array_key_exists($id, $map)) {
                $map[$id] = array(); };
            $map[$id] = array_merge(
                $map[$id], array($obj[$i]));
        }; return $map;
    };
    $p = deindex($ld, $fp);

#############################################################################################################################

    // Reindex Object
    function convert($corr, $letters=1) {
        $corr = str_split($corr);
        $lett = "";
        for ($i = 0; $i < $letters; $i++) {
            $lett .= array_shift($corr); };
        $corr = implode($corr);
        $cond = ctype_alpha($lett);
        $cond = $cond && is_numeric($corr);
        $corr = $cond ? ($corr - 0) : $corr;
        if (!$cond) { return false; }
        else { return array($lett, $corr); };
    };

#############################################################################################################################

    // Reindex Object
    function check($corr, $letters=1) {
        $corr = convert($corr, $letters);
        return is_array($corr);
    };

#############################################################################################################################

    // Reindex Object
    function compare($ref, $comp, $letters=1) {
        $ref = convert($ref, $letters);
        $comp = convert($comp, $letters);
        if (!is_array($ref) || !is_array($comp)) { return false; }
        elseif ($ref[0] != $comp[0] || $ref[1] != $comp[1]) { return false; }
        else { return true; };
    };

#############################################################################################################################

    // Reindex Object
    function reform($corr, $numbers=6) {
        if (!is_array($corr)) { return false; };
        $corr[1] = strval($corr[1]); while (strlen($corr[1]) < $numbers) {
            $corr[1] = "0".$corr[1]; }; $corr = implode("", $corr);
        return $corr;
    };

#############################################################################################################################

    // Reindex Object
    function reindex($obj) {
        $map = array();
        for ($i = 0; $i < count($obj); $i++) {
            $corg = explode(" ", $obj[$i]["Corrida_Completa"])[0];
            $corg = reform(convert($corg,3),5);
            $map = array_merge($map, array($corg));
        }; return $map;
    };
    $gusa_index = reindex($p["AF01"]);

#############################################################################################################################

    // Reverse XRF Object
    function reverseindex($obj, $keys) {
        $map = array_flip($keys);
        for ($j = 0; $j < count($keys); $j++) { 
            $map[$keys[$j]] = array(); };
        for ($i = 0; $i < count($obj); $i++) {
            for ($j = 0; $j < count($keys); $j++) {
                $k = $keys[$j]; $map[$k] = array_merge(
                    $map[$k], array(array("Dados" => $obj[$i][$k],
                    "Corrida_Completa" => $obj[$i]["corrida"])));
            };
        }; return $map;
    };
    $xrf = get_json("xrf_service.json");
    $xrf = reverseindex($xrf, array("CaO","P2O5"));
    $p["LD_CAO"] = $xrf["CaO"];
    $p["LD_P2O5"] = $xrf["P2O5"];

#############################################################################################################################

    // Aco Reindex Object
    function aco_reindex($obj, $haystack) {
        $map = array();
        $map_gusa = array();
        $key = array_keys($haystack);
        for ($k = 0; $k < count($key); $k++) {
            $hst = $haystack[$key[$k]];
            for ($i = 0; $i < count($hst); $i++) {
                $corr = null;
                # Get Correct Reference to Item
                $ref = explode(" ", $hst[$i]["Corrida_Completa"])[0];
                if (check($ref)) { $corr = reform(convert($ref)); }
                # If is Gusa
                elseif (check($ref,3)) { $corg = reform(convert($ref,3),5);
                    $map_gusa[$corg] = ($hst[$i]["Dados"]-0); continue; }
                # Else
                else { continue; };
                # Create Item
                if (!array_key_exists($corr, $map)) {
                    $map[$corr] = array("__gusa__" => null); };
                if (array_key_exists("Tipo Aço", $hst[$i])) {
                    $map[$corr]["__aco__"] = $hst[$i]["Tipo Aço"]; };
                # Add Data
                if (!array_key_exists($key[$k], $map[$corr])) {
                    $map[$corr][$key[$k]] = array(); };
                $map[$corr][$key[$k]] = array_merge(
                    $map[$corr][$key[$k]], array($hst[$i]["Dados"]-0)
                );
                # Add Gusa
                if (array_key_exists("Corrida Gusa", $hst[$i])) {
                    for ($o = 0; $o < count($obj); $o++) {
                        $cond = compare($obj[$o], $hst[$i]["Corrida Gusa"], 3);
                        if ($cond) { $map[$corr]["__gusa__"] = reform(convert($obj[$o],3),5); };
                    };
                };
            };
        };
        # Do Gusa Reindex After Main Stack is Indexed
        $key = array_keys($map);
        for ($k = 0; $k < count($key); $k++) {
            $c = $key[$k]; if ($map[$c] == null) { continue; };
            if ($map[$c]["__gusa__"] == null) { continue; };
            if (!array_key_exists("AF01", $map[$c])) { $map[$c]["AF01"] = array(); };
            if (array_key_exists($map[$c]["__gusa__"], $map_gusa)) {
                $map[$c]["AF01"] = array_merge($map[$c]["AF01"],
                    array($map_gusa[$map[$c]["__gusa__"]]));
            };
        };
        # Return Map
        ksort($map);
        $map = array_reverse($map);
        return $map;
    };
    $p = aco_reindex($gusa_index, $p);

#############################################################################################################################

    // Limiter Object
    function limiter($haystack) {
        $map = array();
        $key = array_keys($haystack);
        for ($i = 0; $i < count($key); $i++) {
            if (count($map) >= 20) { break; };
            if ($haystack[$key[$i]] !== null) {
                $map[$key[$i]] = $haystack[$key[$i]];
            }
        };
        $map = array_reverse($map);
        return $map;
    };
    $p = limiter($p);

#############################################################################################################################
    # Function Calc Delta
    function delta_p($later, $earlier) {
        if ($later == null) { return null; };
        if ($earlier == null) { return null; };
        if (!is_numeric($later) || !is_numeric($earlier)) { return null; };
        return round(($later - $earlier), 3);
    };

#############################################################################################################################

    # Function Create Line Bar Chart
    function linebarchart($haystack, $acc=array()) {
        $map = array();
        $key = array_keys($haystack);
        for ($i = 0; $i < count($key); $i++) {
            $hst = $haystack[$key[$i]];
            $dat = null;
            for ($j = 0; $j < count($acc); $j++) {
                if (!array_key_exists($acc[$j], $hst)) { continue; };
                $lst = $hst[$acc[$j]]; if (count($lst) > 0) {
                    $dat = round($hst[$acc[$j]][0], 3);
                    break;
                };
            };
            $map[$i] = array($key[$i], $dat);
        };
        return $map;
    };

#############################################################################################################################

    function rlinebarchart($line, $val) {
        for ($i = 0; $i < count($line); $i++) {
            $line[$i][1] = $val; };
        return $line;
    };

    function dlinebarchart($a, $b) {
        for ($i = 0; $i < count($a); $i++) {
            $a[$i][1] = delta_p($a[$i][1], $b[$i][1]); };
        return $a;
    };

#############################################################################################################################

    function to_fixed($num) {
        if ($num === null){ return null; };
        $sizea = ($num < 1 ? 3 : ($num < 10 ? 2 : 1));
        if ($sizea == 1) { return $num; };
        return number_format($num, $sizea, ".", "");
    };

    function label($a) {
        for ($i = 0; $i < count($a); $i++) {
            $a[$i][1] = to_fixed($a[$i][1]); };
        return $a;
    };

    function labelz($a) {
        for ($i = 1; $i < count($a); $i++) {
            $a[$i][1] = null; };
        $a[0][1] = to_fixed($a[0][1]);
        return $a;
    };

#############################################################################################################################

    # P Saida FP
    $p_saida_fp = linebarchart($p, array("LC1","LC2"));
    $p_saida_fp_max = rlinebarchart($p_saida_fp, 0.045);
    $p_saida_fp_min = rlinebarchart($p_saida_fp, null);

    # P Chegada FP
    $p_chegada_fp = linebarchart($p, array("FP0","FP1","FP2","FP3"));
    $p_chegada_fp_max = rlinebarchart($p_chegada_fp, 0.04);
    $p_chegada_fp_min = rlinebarchart($p_chegada_fp, null);

    # P Vazamento LD
    $p_vazamento_ld = linebarchart($p, array("LD","LD1"));
    $p_vazamento_ld_max = rlinebarchart($p_vazamento_ld, 0.035);
    $p_vazamento_ld_min = rlinebarchart($p_vazamento_ld, null);

    # P Gusa
    $p_gusa = linebarchart($p, array("AF01"));
    $p_gusa_max = rlinebarchart($p_gusa, 0.225);
    $p_gusa_min = rlinebarchart($p_gusa, 0.125);

    # Delta P FP
    $delta_p_af_ld = dlinebarchart($p_gusa, $p_vazamento_ld);
    $delta_p_af_ld_max = rlinebarchart($delta_p_af_ld, 0.4);
    $delta_p_af_ld_min = rlinebarchart($delta_p_af_ld, 0);

#############################################################################################################################

    # Delta P FP
    $delta_p_fp = dlinebarchart($p_saida_fp, $p_chegada_fp);
    $delta_p_fp_max = rlinebarchart($delta_p_fp, 0.007);
    $delta_p_fp_min = rlinebarchart($delta_p_fp, null);

    # Delta P FP
    $delta_p_ld_fp = dlinebarchart($p_chegada_fp, $p_vazamento_ld);
    $delta_p_ld_fp_max = rlinebarchart($delta_p_ld_fp, null);
    $delta_p_ld_fp_min = rlinebarchart($delta_p_ld_fp, 0.0075);

    # P2O5 Escoria LD
    $p2o5_escoria_ld = linebarchart($p, array("LD_P2O5"));
    $p2o5_escoria_ld_max = rlinebarchart($p2o5_escoria_ld, null);
    $p2o5_escoria_ld_min = rlinebarchart($p2o5_escoria_ld, 2.5);

    # CaO Escoria LD
    $cao_escoria_ld = linebarchart($p, array("LD_CAO"));
    $cao_escoria_ld_max = rlinebarchart($cao_escoria_ld, 50);
    $cao_escoria_ld_min = rlinebarchart($cao_escoria_ld, 30);

#############################################################################################################################

    # Append Data Function
    function meta_append($n, $d){
        return array(
            "name" => $n, "um" => "%",
            "type" => "linebarchart",
            "data" => $d
        );
    };
    function append_dataset($dts, $name, $dat, $dat_max, $dat_min) {
        return array(
            $dts."_linechart" => meta_append(str_replace("*", "", $name), $dat),
            $dts."_max_linechart" => meta_append(str_replace("*", " Máximo", $name), $dat_max),
            $dts."_min_linechart" => meta_append(str_replace("*", " Mínimo", $name), $dat_min),
            $dts."_label_linechart" => meta_append(str_replace("*", "", $name)." Label", label($dat)),
            $dts."_label_max_linechart" => meta_append(str_replace("*", " Máximo", $name)." Label", labelz($dat_max)),
            $dts."_label_min_linechart" => meta_append(str_replace("*", " Mínimo", $name)." Label", labelz($dat_min))
        );
    };

#############################################################################################################################

    # Datasets
    $datasets = array_merge(
        append_dataset("p_saida_fp", "P* Saída do FP",
            $p_saida_fp, $p_saida_fp_max, $p_saida_fp_min),
        append_dataset("p_chegada_fp", "P* Chegada no FP",
            $p_chegada_fp, $p_chegada_fp_max, $p_chegada_fp_min),
        append_dataset("p_vazamento_ld", "P* Vazamento LD",
            $p_vazamento_ld, $p_vazamento_ld_max, $p_vazamento_ld_min),
        append_dataset("cao_escoria_ld", "CaO* da Escória LD",
            $cao_escoria_ld, $cao_escoria_ld_max, $cao_escoria_ld_min),
        append_dataset("p_gusa", "P* do Gusa",
            $p_gusa, $p_gusa_max, $p_gusa_min),
        append_dataset("delta_p_fp", "Delta P* (FP)",
            $delta_p_fp, $delta_p_fp_max, $delta_p_fp_min),
        append_dataset("delta_p_ld_fp", "Delta P* (LD - FP)",
            $delta_p_ld_fp, $delta_p_ld_fp_max, $delta_p_ld_fp_min),
        append_dataset("p2o5_escoria_ld", "P2O5* Escória LD",
            $p2o5_escoria_ld, $p2o5_escoria_ld_max, $p2o5_escoria_ld_min),
        append_dataset("delta_p_af_ld", "Delta P* (AF - LD)",
            $delta_p_af_ld, $delta_p_af_ld_max, $delta_p_af_ld_min)
    );

    //json encode
    put_json("data.json", $datasets);
    index_datasets($datasets);

#############################################################################################################################

    return $datasets;
};

?>