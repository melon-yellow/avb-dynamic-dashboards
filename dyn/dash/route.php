<?php

//get methods
require_once(str_repeat("../",substr_count($_SERVER["SCRIPT_NAME"],"/")-2)."methods.php");

//get routes
function get_routes($key = "dash") {
    $url = (server())."/dyn"."/".(str_replace(".", "/", $key));
    $item = get_json($url."/main.php?action=route&path=this");
    $routes = array($item);
    $childs = get_json($url."/main.php?action=route&path=childs");
    foreach ($childs as $child) {
        $routes = array_merge($routes, get_routes($child["key"])); };
    return $routes;
};
$routes = get_routes();

//filter
$get = @$_REQUEST["get"];
$get = utf8_convert_recursive($get);
function getter($i){ $g = @$_REQUEST["get"]; return $i[$g]; };
if(in_array($get, array("key","this","url"))){
    $routes = array_map("getter", $routes); };

//echo json
echo_json($routes);

?>