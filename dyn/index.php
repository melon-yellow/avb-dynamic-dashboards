<?php
    // get methods
    require_once("methods.php");
    // get timestamp
    $timestamp = timestamp();

    // dyn function
    function dyn() {
        // get key params
        $key = @$_REQUEST["key"];
        $key = utf8_convert_recursive($key);

        // check key
        if ($key == null || $key == "") {
            header("Location: index.php?key=dash");
            return false;
        };

        // look for key
        $path = str_replace(".","/",$key);
        $item = get_json($path."/main.php?action=route&path=this",1);
        $parent = get_json($path."/main.php?action=route&path=parent",1);

        // verify response
        if (!is_array($parent) || !array_key_exists("this", $parent)) {
            $parent = array("this" => null);
        };
        if (!is_array($item) || !array_key_exists("this", $item)) {
            if (in_str(".", $key)) {
                $key = implode(".",array_slice(explode(".",$key),0,-1));
                header("Location: index.php?key=".$key);
            } else {
                header("Location: index.php?key=dash");
            };
            return false;
        };
        // return data
        return array(
            "n" => $item["this"],
            "p" => $parent["this"],
            "dir" => $path, "key" => $key);
    };

    // execute dyn
    $dyn = dyn();

    // info array
    $info = array(
        "adr" => server()."/dyn"."/",
        "dir" => "", "key" => "",
        "title" => "Not Found"
    );

    // check dyn
    if (is_array($dyn)) {
        $info["title"] = ($dyn["p"] == null ? "" : $dyn["p"]." - ").$dyn["n"];
        $info["dir"] = $info["adr"].$dyn["dir"];
        $info["key"] = $dyn["key"];

        // update
        if (@$_REQUEST["update"] == "force") {
            $update = get_json($info["dir"]."/main.php?action=update&do=force");
        };
    };
?>

<!DOCTYPE html>
<html lang="pt-BR">
    <head>
        <meta charset="utf-8"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
        <meta name="description" content="Dynamic Dashboard"/>
        <meta name="author" content="Anthony"/>
        <base id="url" href="<?php echo $info["adr"] ?>"/>
        <meta id="key" content="<?php echo $info["key"] ?>"/>
        <meta id="time" content="<?php echo $timestamp ?>"/>
        <meta id="dir" content="<?php echo $info["dir"] ?>"/>
        <title><?php echo $info["title"] ?></title>
        <link rel="shortcut icon" type="image/x-icon" href="favicon.ico?timestamp=<?php echo $timestamp ?>"/>
        <link href="css/styles.css?timestamp=<?php echo $timestamp ?>" rel="stylesheet"/>
        <link href="src/data-tables/datatables.css?timestamp=<?php echo $timestamp ?>" rel="stylesheet"/>
        <script src="src/fontawesome-5.13.0/js/all.js?timestamp=<?php echo $timestamp ?>"></script>
    </head>
    <body id="body" class="sb-nav-fixed sb-nav-toggled">
        <nav id="topNav" class="sb-topnav navbar navbar-expand navbar-dark bg-deep-blue shadow">
            <button class="btn btn-link btn-sm order-1 order-lg-0" id="sidebarToggle" href="#">
                <i class="fas fa-bars"></i>
            </button>
        </nav>
        <div id="layoutSidenav">
            <div id="layoutSidenav_nav">
                <nav class="sb-sidenav accordion sb-sidenav-dark bg-deep-blue-dark shadow" id="sidenavAccordion">
                    <div class="sb-sidenav-menu">
                        <div id="navBar" class="nav"></div>
                    </div>
                    <div class="sb-sidenav-footer bg-deep-blue">Aço Verde do Brasil</div>
                </nav>
            </div>
            <div id="layoutSidenav_content">
                <main>
                    <div id="pageContainer" class="container-fluid"></div>
                </main>
                <footer></footer>
            </div>
        </div>
        <script src="src/jquery-3.5.1/jquery-3.5.1.js?timestamp=<?php echo $timestamp ?>"></script>
        <script src="src/bootstrap-4.5.0-dist/js/bootstrap.bundle.js?timestamp=<?php echo $timestamp ?>"></script>
        <script src="src/chartjs/chart.bundle.js?timestamp=<?php echo $timestamp ?>"></script>
        <script src="src/chartjs/chart-rounded-corners.js?timestamp=<?php echo $timestamp ?>"></script>
        <script src="src/chartjs-plugin-datalabels/chartjs-plugin-datalabels.js?timestamp=<?php echo $timestamp ?>"></script>
        <script src="src/data-tables/DataTables-1.10.21/js/jquery.dataTables.js?timestamp=<?php echo $timestamp ?>"></script>
        <script src="src/data-tables/DataTables-1.10.21/js/dataTables.bootstrap4.js?timestamp=<?php echo $timestamp ?>"></script>
        <script src="src/moment-develop/moment.js?timestamp=<?php echo $timestamp ?>"></script>
        <script src="js/index.js?timestamp=<?php echo $timestamp ?>"></script>
    </body>
</html>