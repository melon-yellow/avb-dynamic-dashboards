<?php

// Get Methods
require_once(str_repeat("../",substr_count($_SERVER["SCRIPT_NAME"],"/")-2)."methods.php");

# Get Inputs From Request
function input() {
    # Update Filter.Json
    if (file_exists("inputs.json")) {
        $data = get_json("inputs.json");
    } else { $data = array(); };
    # Get Inputs
    $inputs = get_json("php://input",0,0);
    $err = array("status" => "rejected");
    if (!is_array($inputs)) { return $err; };
    if (!array_key_exists("action", $inputs)) { return $err; };
    if (!array_key_exists("pass", $inputs)) { return $err; };
    if ($inputs["action"] != "pda_rod_therm_ntm") { return $err; };
    if ($inputs["pass"] != "efbuy3uy42ub429d") { return $err; };
    # Mix Data
    $inputs = $inputs["dat"];
    if (!is_array($inputs)) { return array("status" => "rejected"); };
    $inputs["bitola"] = $inputs["params"][0];
    $inputs["fmrb"] = $inputs["params"][1];
    $inputs["vel"] = $inputs["params"][2];
    unset($inputs["params"]); $t = $inputs["t"];
    $inputs["t"] = date("d/m/Y", mktime(0, 0, 0, $t[5], $t[4], $t[6]));
    $inputs["fmrb"] = $inputs["fmrb"] ? "rb" : "fm";
    # Round Temperatures
    for ($i = 0; $i < count($inputs["therm"]); $i++) {
        for ($j = 0; $j < count($inputs["therm"][$i]); $j++) {
            $inputs["therm"][$i][$j] = round($inputs["therm"][$i][$j], 1);
        }; };
    # Format Final
    $data = array_merge($data, array($inputs));
    # Update Json
    put_json("inputs.json", $data);
    # Done
    return array("status" => "done");
};

# Feedback
echo_json(input());

?>