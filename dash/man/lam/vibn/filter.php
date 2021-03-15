<?php

// Get Methods
require_once(str_repeat("../",substr_count($_SERVER["SCRIPT_NAME"],"/")-2)."methods.php");
# Update Filter.Json
if (file_exists("filter.json")) { $filter = get_json("filter.json"); }
else { $filter = array("meses" => null, "bitola" => null); };
if (@$_REQUEST["meses"] != null){ $filter["meses"] = (@$_REQUEST["meses"] - 0); };
if (@$_REQUEST["bitola"] != null){ $filter["bitola"] = (@$_REQUEST["bitola"] - 0); };
put_json("filter.json", $filter);
# Update Data.json
py_exec("dat.py"); py_exec("lay.py");
# Feedback
echo_json(array("status"=>"done"));

?>