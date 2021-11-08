<?php

function _parse_layout($in) {
    // Import Dat
    require_once(str_repeat("../",substr_count($_SERVER["SCRIPT_NAME"],"/")-4)."lay.php");
    // Set Names
    $e = _process_layout($in);
    return $e;
};// End of parse_data function

?>