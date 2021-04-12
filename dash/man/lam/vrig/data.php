<?php

function _parse_data() {
    require_once("../../dat.php");
    $e = _process_data(array("10006851"), "data_read.json");
    py_exec("dat.py");
    index_datasets(get_json("data.json"));
    return $e;
};

?>