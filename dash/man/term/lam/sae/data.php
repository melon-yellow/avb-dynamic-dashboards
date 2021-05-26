<?php

function _parse_data() {
    // Import Dat
    require_once(str_repeat("../",substr_count($_SERVER["SCRIPT_NAME"],"/")-4)."dat.php");
    // Set Names
    $e = _process_data([
        "10008252",
        "10008253",
        "10008254",
        "10008255",
        "10008256"
    ]);
    return $e;
};

?>
