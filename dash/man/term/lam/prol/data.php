<?php

function _parse_data() {
    // Import Dat
    require_once(str_repeat("../",substr_count($_SERVER["SCRIPT_NAME"],"/")-4)."dat.php");
    // Set Names
    $e = _process_data([
        "10008444",
        "10008445",
        "10008446",
        "10008447",
        "10008448",
        "10008449",
        "10008450",
        "10008451",
        "10008452",
        "10008453",
        "10008454"
    ]);
    return $e;
};

?>
