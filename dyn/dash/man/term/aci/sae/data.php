<?php

function _parse_data() {
    // Import Dat
    require_once(str_repeat("../",substr_count($_SERVER["SCRIPT_NAME"],"/")-4)."dat.php");
    // Set Names
    $e = _process_data([
        "10008227",
        "10008228",
        "10008229",
        "10008230",
        "10008241",
        "10008242",
        "10008248",
        "10008247",
        "10008244",
        "10008245",
        "10008246",
        "10008243"        
    ]);
    return $e;
};

?>
