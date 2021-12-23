<?php

//get methods
require_once(str_repeat("../",substr_count($_SERVER["SCRIPT_NAME"],"/")-2)."methods.php");

# Parser Function
function parse() {
    # Get Post
    $inputs = get_json("php://input",0,0);
    $err = array("status" => "rejected");
    if (!is_array($inputs)) { return $err; };
    if (!array_key_exists("action", $inputs)) { return $err; };
    if (!array_key_exists("pass", $inputs)) { return $err; };
    if ($inputs["action"] != "xrf_service") { return $err; };
    if ($inputs["pass"] != "efbuy3uy42ub429d") { return $err; };
    $inputs = $inputs["csv"];
    # Parse
    $map = array();
    for ($i = 2; $i < count($inputs); $i++) {
        if (!is_array($inputs[$i])) { continue; };
        $y = count($map);
        for ($b = 0; $b < count($inputs[$i]); $b++) {
            if ($b == 0) {
                $e = explode("__", $inputs[$i][$b]);
                $map[$y]["corrida"] = $e[0];
                $map[$y]["index"] = $e[1];
            };
            $map[$y][$inputs[0][$b]] = $inputs[$i][$b];
        };
    }; $inputs = $map;
    # Put Json
    put_json("xrf_service.json", $inputs);
    # Done
    return array("status" => "done");
};
# Execute Function
echo_json(parse());

?>