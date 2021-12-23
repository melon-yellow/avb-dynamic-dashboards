<?php

function _parse_data() {
    // Import Dat
    require_once(str_repeat("../",substr_count($_SERVER["SCRIPT_NAME"],"/")-4)."dat.php");
    // Set Names
    $e = _process_data([
        "10008249",
        "10008251",
        "10008250"
    ]);
    return $e;
};

?>
