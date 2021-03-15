<?php

function _parse_data() { py_exec("dat.py");
    index_datasets(get_json("data.json"));
};

?>