<?php

/*
##########################################################################################################################
#                                                          METHODS                                                       #
##########################################################################################################################
*/

//pt to number
function num(
    string $string,
    bool $ptbr=false
){
    $string = str_remove($string, " ");
    if($ptbr){
        $string = str_remove($string, ".");
        $string = str_replace(",", ".", $string);
    };
    return ($string - 0);
};

/*
##########################################################################################################################
#                                                          METHODS                                                       #
##########################################################################################################################
*/

//to array
function to_array(
    object|array $input
) {
    if (is_object($input) || is_array($input)) {
        $arr = (array) $input;
        foreach($arr as &$item) {
            if (is_object($item) || is_array($item)) {
                $item = to_array($item);
            };
        };
        return $arr;
    } else {
        return $input;
    };
};

/*
##########################################################################################################################
#                                                          METHODS                                                       #
##########################################################################################################################
*/

//utf8 convert
function utf8_convert(&$input){
    if (gettype($input) == "string") {
        $input = mb_convert_encoding(
            $input,
            "UTF-8",
            mb_detect_encoding(
                $input,
                "UTF-8, ISO-8859-1"
            )
        );
    };
};

//utf8 convert recursive
function utf8_convert_recursive(
    null|string|object|array $input
) {
    if (gettype($input) == "string") {
        utf8_convert($input);
    };
    if (is_object($input) || is_array($input)) {
        $input = to_array($input);
        array_walk_recursive($input, "utf8_convert");
    };
    return $input;
};

/*
##########################################################################################################################
#                                                          METHODS                                                       #
##########################################################################################################################
*/

//utf8 json encode
function utf8_json_encode($obj) {
    return json_encode(
        utf8_convert_recursive($obj),
        JSON_PRETTY_PRINT
    );
};

//utf8 json decode
function utf8_json_decode(string $string) {
    return utf8_convert_recursive(
        json_decode($string, true)
    );
};

/*
##########################################################################################################################
#                                                          METHODS                                                       #
##########################################################################################################################
*/

function in_str(
    string $needle,
    string $haystack,
    bool $all=false
) {
    if (!is_array($needle)) { $needle = array($needle); };
    $cond = false;
    for ($i = 0; $i < count($needle); $i++) {
        $c = (substr_count($haystack, $needle[$i]) > 0);
        if ($i == 0) { $cond = $c; };
        $cond = $all ? ($cond && $c) : ($cond || $c);
        if ($all && !$cond) { break; };
    }; return $cond;
};

/*
##########################################################################################################################
#                                                          METHODS                                                       #
##########################################################################################################################
*/

//http abs address
function http_addr(string $url){
    if(substr($url, 0, 7) === "http://"){ return $url; };
    $path = $_SERVER["SCRIPT_FILENAME"];
    $path = explode("/", $path);
    $offset = substr_count($url, "../");
    $url = str_remove($url, "../");
    $path[count($path)-1-$offset] = $url;
    $path = array_slice($path, 0, count($path)-$offset);
    $path = implode("/", $path);
    $doc_root = str_replace($_SERVER["SCRIPT_NAME"], "", $_SERVER["SCRIPT_FILENAME"]);
    $url = str_replace($doc_root, server(), $path);
    return $url;
};

//check for http or https
function is_http(string $url) {
    $a = strpos($url,"http://") === 0;
    $b = strpos($url,"https://") === 0;
    return ($a || $b);
};

//check if a given url exists
function url_exists(string $url) {
    $status = get_headers($url)[0];
    $a = !in_str("404", $status);
    $b = !in_str("500", $status);
    return ($a && $b);
};

/*
##########################################################################################################################
#                                                          METHODS                                                       #
##########################################################################################################################
*/

//get json
function get_json(
    string $url,
    bool $http=false,
    bool $utf8=true
) {
    $url = ($http && !is_http($url)) ? http_addr($url) : $url;
    $json = json_decode(file_get_contents($url), true);
    return $utf8 ? utf8_convert_recursive($json) : $json;
};

//put json
function put_json(
    string $url,
    $obj=null
){
    file_put_contents($url, utf8_json_encode($obj));
};

//echo json
function echo_json($obj) {
    echo(utf8_json_encode($obj));
};

/*
##########################################################################################################################
#                                                          METHODS                                                       #
##########################################################################################################################
*/

//is equal
function iseq(
    array $array,
    bool $compare_encoding
) {
    if(!is_array($array)){ return false; };
    if(count($array) < 2){ return false; };
    if($compare_encoding !== null){
        if(gettype($compare_encoding) !== "boolean"){ return false; } else {
            if(!$compare_encoding){ $array = utf8_convert_recursive($array); };
        };
    } else { $array = utf8_convert_recursive($array); };
    for($i = 1; $i < count($array); $i++){
        if(json_encode($array[$i]) !== json_encode($array[$i - 1])){ return false; };
    };
    return true;
};

/*
##########################################################################################################################
#                                                          METHODS                                                       #
##########################################################################################################################
*/

//remove sub strings from a string
function str_remove(
    string $string,
    string|array $remove
) {
    if(gettype($string) !== "string"){ return -1; };
    if(gettype($remove) !== "array"){
        if(gettype($remove) === "string"){
            $remove = array($remove);
        } else { return -2; };
    };
    for($i = 0; $i < count($remove); $i++){
        $string = str_replace($remove[$i],"",$string);
    };
    return $string;
};

/*
##########################################################################################################################
#                                                          METHODS                                                       #
##########################################################################################################################
*/

//execute python script
function py_exec(string $file) {
    $py = 'c:\users\administrator\appdata\local\programs\python\python38\python.exe';
    $file = str_replace("/", "\\", realpath($file));
    return shell_exec($py." ".$file);
};

/*
##########################################################################################################################
#                                                          METHODS                                                       #
##########################################################################################################################
*/

//SQL Query Function
function query(
    $db,
    string $string
) {
    $query = $db->prepare($string);
    $query->execute();
    $matrix = $query->fetchAll(\PDO::FETCH_ASSOC);
    $matrix = to_array($matrix);
    $matrix = utf8_convert_recursive($matrix);
    return $matrix;
};

/*
##########################################################################################################################
#                                                          METHODS                                                       #
##########################################################################################################################
*/

//index matrix by column
function index(
    object|array $matrix,
    int|string $set
) {
    $matrix = to_array($matrix);
    $keys = array_keys($matrix);
    $sets = array();
    for($i = 0; $i < count($keys); $i++){
        if($matrix[$keys[$i]][$set] !== null){
            $this_set = $matrix[$keys[$i]][$set];
            if(!array_key_exists($this_set, $sets)){ $sets[$this_set] = array(); };
            $sets[$this_set] = array_merge($sets[$this_set], $matrix[$keys[$i]]);
        };
    };
    return $sets;
};

/*
##########################################################################################################################
#                                                          METHODS                                                       #
##########################################################################################################################
*/

//update datasets index
function index_datasets(
    object|array $datasets
) {
    if (!is_array($datasets)) { return False; };
    //get datasets index
    $datasets_path = array_slice(explode("/",$_SERVER["SCRIPT_NAME"]),4);
    $datasets_path = implode("",array_map(function(){ return "../"; }, $datasets_path));
    $datasets_path .= "datasets.json";
    $datasets_index = array();
    if(file_exists($datasets_path)){
        $datasets_index = get_json($datasets_path);
        if(gettype($datasets_index) !== "array"){
            $datasets_index = array();
        };
    };
    //get file name
    $directory = explode("/", $_SERVER["SCRIPT_NAME"]);
    $directory = array_slice($directory, 2, count($directory)-3);
    $directory = implode("/", $directory);
    //get datasets info
    $do_write = 0;
    $keys = array_keys($datasets);
    for($i = 0; $i < count($keys); $i++){
        $key = $keys[$i];
        $name = $datasets[$key]["name"];
        //check for changes
        if(!array_key_exists($key, $datasets_index)){
            $do_write = 1;
        } else {
            $comp = $datasets_index[$key];
            if($comp["name"] !== $name || $comp["dir"] !== $directory){
                $do_write = 1;
            };
        };
        //assign data
        $datasets_index = array_merge(
            $datasets_index,
            array(
                $key => array(
                    "name" => $name,
                    "dir" => $directory
                )
            )
        );
    };
    if($do_write){
        put_json($datasets_path, $datasets_index);
    };
    return null;
};

/*
##########################################################################################################################
#                                                          METHODS                                                       #
##########################################################################################################################
*/

 //route function
function route(string $name) {
    //get path to methods
    function _methods(){
        $check = explode("/", str_remove($_SERVER["SCRIPT_NAME"], "/dyn/dash/"));
        if(count($check) < 2){
            $path_to = array("methods" => "../../methods.php");
        } else {
            $path_to = get_json("../main.php?action=route&path=methods", 1);
            $path_to["methods"] = "../".$path_to["methods"];
        };
        return array("methods" => $path_to["methods"]);
    };
    //get this
    function _this($name){
        $key = explode("/", $_SERVER["SCRIPT_NAME"]);
        $key = array_slice($key, 3, count($key)-4);
        $key = implode(".", $key);
        $url = url();
        return array(
            "key" => "dash".($key !== "" ? "." : "").$key,
            "this" => $name,
            "url" => $url["http"]
        );
    };
    //get childs
    function _childs(){
        $dir = scandir(".");
        $childs = array();
        for($i = 2; $i < count($dir); $i++){
            if(file_exists($dir[$i]."/main.php")){
                $key = $dir[$i];
                $item = get_json($dir[$i]."/main.php?action=route&path=this", 1);
                if(gettype($item) == "array" && $item["this"] != null){
                    $childs[$key] = $item;
                };
            };
        };
        return $childs;
    };
    //get parent
    function _parent(){
        $parent = array();
        $path = explode("/", $_SERVER["SCRIPT_NAME"]);
        $check = explode("/", str_remove($_SERVER["SCRIPT_NAME"], "/dyn/dash/"));
        if(count($check) < 2){ return $parent; };
        $path = array_slice($path, 0, count($path)-2);
        $path = implode("/", $path);
        $path = server().$path;
        $item = get_json($path."/main.php?action=route&path=this", 1);
        if(gettype($item) == "array" && $item["this"] != null){
            $parent = $item;
        };
        return $parent;
    };
    function _brothers(){
        $parent = _parent();
        $url = $parent["url"];
        $brothers = get_json($url."?action=route&path=childs", 1);
        return $brothers;
    };
    //execute code
    if (@$_REQUEST["path"] == "methods") {
        return _methods();
    };
    if (@$_REQUEST["path"] == "this") {
        return _this($name);
    };
    if (@$_REQUEST["path"] == "childs") {
        return _childs();
    };
    if (@$_REQUEST["path"] == "parent") {
        return _parent();
    };
    if (@$_REQUEST["path"] == "brothers") {
        return _brothers();
    };
    return array("error" => "route not found");
};

/*
##########################################################################################################################
#                                                          METHODS                                                       #
##########################################################################################################################
*/

//update function
function update(int $time) {
    // Standard Layout
    function _standard_layout() {
        $page = array(
            "layout" => array(
                array(
                    "type" => "layout",
                    "sidenav" => array("display" => true),
                    "topnav" => array(),
                    "body" => array(
                        "color" => "#f8f9fa",
                        "font" => array(
                            "color" => "#343a40",
                            "size" => 1.2
                        )
                    ),
                    "content" => array()
        )   )   );
        //JSON ENCODE
        put_json("layout.json", $page);
        return 0;
    };
    $timestamp = timestamp();
    $_timestamp = array("timestamp" => 0);
    if(file_exists("timestamp.json")){
        $_timestamp = get_json("timestamp.json");
    };
    $not = false;
    $force = false;
    $bcmk = false;
    $timer_cond = (timestamp($timestamp) >= (timestamp($_timestamp["timestamp"]) + $time));
    if (@$_REQUEST["do"] !== null && @$_REQUEST["do"] !== "") {
        $force = (@$_REQUEST["do"] === "force");
        $not = (@$_REQUEST["do"] === "not");
        $bcmk = (@$_REQUEST["do"] === "benchmark");
    };
    if(($timer_cond || $force || $bcmk) && !$not){
        //update timestamp
        $_timestamp["timestamp"] = $timestamp;
        put_json("timestamp.json", $_timestamp);
        //run functions
        if(file_exists("data.php")){ include_once("data.php"); };
        if(file_exists("layout.php")){ include_once("layout.php"); };
        $comp1 = -microtime(1);
        $e1 = (file_exists("data.php")) ? _parse_data() : null;
        $comp1 += microtime(1);
        $comp2 = -microtime(1);
        $e2 = (file_exists("layout.php")) ? _parse_layout($e1) : _standard_layout();
        $comp2 += microtime(1);
    };
    if($bcmk){
        return array(
            "memory" => array(
                "peak" => memory_get_peak_usage(),
                "actual" => memory_get_usage()
            ),
            "time" => array(
                "data" => $comp1,
                "layout" => $comp2
            )
        );
    };
    return $_timestamp;
};

/*
##########################################################################################################################
#                                                          METHODS                                                       #
##########################################################################################################################
*/

//server config
function server() {
    return "http://".$_SERVER["HTTP_HOST"];
};

function url() {
    return array(
        "dir" => $_SERVER["SCRIPT_FILENAME"],
        "http" => server().$_SERVER["SCRIPT_NAME"]
    );
};

/*
##########################################################################################################################
#                                                          METHODS                                                       #
##########################################################################################################################
*/

//timestamp
function timestamp(int $t=0): int {
    if ($t !== 0) {
        $t = str_split((string)$t);
        return mktime(
            num($t[8].$t[9]),
            num($t[10].$t[11]),
            num($t[12].$t[13]),
            num($t[6].$t[7]),
            num($t[4].$t[5]),
            num($t[0].$t[1].$t[2].$t[3])
        );
    };
    return num(date("YmdHis"));
};

/*
##########################################################################################################################
#                                                          METHODS                                                       #
##########################################################################################################################
*/

// http_rest
function rest($method, $url, $data = null) {
    $curl = curl_init();
    switch ($method) {
        case "POST":
        curl_setopt($curl, CURLOPT_POST, 1);
        if ($data) curl_setopt($curl, CURLOPT_POSTFIELDS, $data); break;
        case "PUT": curl_setopt($curl, CURLOPT_PUT, 1); break;
        default: if ($data != null) $url = sprintf("%s?%s", $url, http_build_query($data));
    };
    // Optional Authentication:
    curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
    curl_setopt($curl, CURLOPT_USERPWD, "username:password");
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    $result = curl_exec($curl);
    curl_close($curl);
    echo_json($result);
    $json = json_decode($result, true);
    return utf8_convert_recursive($json);
};

/*
##########################################################################################################################
#                                                          METHODS                                                       #
##########################################################################################################################
*/

?>