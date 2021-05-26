<?php

function _parse_data() {
    // Import Dat
    require_once(str_repeat("../",substr_count($_SERVER["SCRIPT_NAME"],"/")-4)."dat.php");
    // Set Names
    $e = _process_data([
        "10008434",
        "10008435",
        "10008436",
        "10008437",
        "10008438",
        "10008439",
        "10008440",
        "10008441",
        "10008442"       
    ]);
    return $e;
};

?>
