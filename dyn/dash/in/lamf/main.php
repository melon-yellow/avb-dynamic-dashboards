<?php

//get methods
require_once(str_repeat("../",substr_count($_SERVER["SCRIPT_NAME"],"/")-2)."methods.php");
//main
function main(){
    //route action
    if (@$_REQUEST["action"] == "route") { return route("Metas Laminação a Frio"); };
    //update action
    if (@$_REQUEST["action"] == "update") { return update(300); };
    //if no action was found
    return array("error" => "action not found");
};
//echo
echo_json(main());

?>
