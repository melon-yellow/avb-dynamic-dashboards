<?php

function _parse_data() {

    $json_dec = get_json("http://127.0.0.1:3000/api/furnace");

    if(count($json_dec) == 0){ return -1; };

    //CREATE NAMES
    $names = array(
	    array("ULTIMA_HORA_PECAS", "Peças Ultima Hora","pçs"),
        array("ULTIMA_HORA_PESO", "Peso Ultima Hora (t)","t"),
        array("ATUAL_HORA_PECAS", "Peças Hora Atual","pçs"),
        array("ATUAL_HORA_PESO", "Peso Hora Atual (t)","t"),
		array("QTD_PECAS", "Peças no Dia","pçs"),
        array("PESO_TOTAL", "Peso Total Dia (t)","t"),
        array("RITIMO_DIA", "Ritmo Dia (t)","t"),
		array("RITIMO_HORA", "Ritmo Hora (t)","t"),
        array("VAZAO_INST", "Vazão Instantânea","t/s"),
        array("VAZAO2_H_MINUTO", "Vazão Minuto","t/min"),
        array("VAZAO2_M_HORA", "Vazão Hora","t/h"),
        array("VAZAO_MEDIA", "Vazão Média Dia","t/h"),
        array("UTIL","Utilização do Laminador","%"),
        array("TEMPO_PARADO","Tempo Parado Dia","min")
    );

    $datasets = array();
    $rtrn = array();

    if ($json_dec["RITIMO_DIA"] == null) { $json_dec["RITIMO_DIA"] = "--"; };
    if ($json_dec["VAZAO_MEDIA"] == null) { $json_dec["VAZAO_MEDIA"] = "--"; };

    $json_dec["TEMPO_PARADO"] = round($json_dec["TEMPO_PARADO"]);
    $json_dec["UTIL"] = ($json_dec["UTIL"] * 100);
    if ($json_dec["TEMPO_PARADO"] == 0 && $json_dec["UTIL"] == 0) {
        $json_dec["TEMPO_PARADO"] = "--"; $json_dec["UTIL"] = "--";
    };

    for($i = 0; $i < count($names); $i++){
        $key = $names[$i][0];
        $name = $names[$i][1];
        $um = $names[$i][2];
        $value = $json_dec[$key];
        if (is_numeric($value)) { $value = round($value, 1); };
        $key_d = "rhf_".(strtolower($key))."_display";
        $datasets = array_merge($datasets,
            array(
                $key_d => array(
                    "name" => $name,
                    "type" => "display",
                    "data" => $value,
                    "um" => $um
                )
            )
        );
        $rtrn = array_merge($rtrn,
            array( $key_d => $name )
        );
    };

    //json encode
    put_json("data.json", $datasets);
    index_datasets($datasets);

    return $rtrn;
};

?>