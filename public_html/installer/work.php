<?php

session_start();
//Get action to handle the whole process of installation

$action = $_POST['action'];
switch ($action) {
    case "database_check":
        $database_server = $_POST['database_server'];
        $database_username = $_POST['database_username'];
        $database_password = $_POST['database_password'];
        $database_name = $_POST['database_name'];

        //Proveravamo podatke koje je uneo korisnik.
        $link = @mysql_connect($database_server, $database_username, $database_password);
        if (!$link) {
            //Ako nije ok, mysql nam vraca neku gresku i mi to prosledjujemo korisniku
            echo "error::Error while connecting to database server. Check your parameters. (MySQL error: " . mysql_error() . ").";
            die();
        }

        //Ako je sve ok, proveravamo da li postoji baza koja nama treba
        $database = @mysql_select_db($database_name);
        if (!$database) {
            //Ako ne postoji varacamo korisniku gresku, da ta baza ne postoji i vratimo mysql gresku
            echo "error::Error while selecting database.Check if $database_name exist. (MySQL error: " . mysql_error() . ").";
            die();
        }
        echo "ok::Params OK";
        break;

    case "get_version":
    	$applicationXml = simplexml_load_file("../../core/application/configs/application.xml");
        $version = $applicationXml->production->version->attributes()->value;
        echo $version;
        break;

    case "make_domain":
        echo $_SERVER['HTTP_HOST'];
        break;

    case "make_paths":
        $url = $_POST["url"];
        $domain = $_POST["domain"];
        if(strpos( $domain, 'http://') === 0) {
          $domain = str_replace('http://', '', $domain);
        }
        
        $position = __FILE__;

        $url = explode("/", $url);
        unset($url[count($url) - 1]);
        $url = implode("/", $url);

        $position = explode("/", $position);
        unset($position[count($position) - 1]);
        $position = implode("/", $position);

        $domainExt = explode("/", $domain);
        unset($domainExt[0]);
        $domainExt = implode("/", $domainExt);

        $pathToDestract = str_replace($_SERVER['HTTP_HOST'], "||", $url);
        $pathToDestract = explode("||", $pathToDestract);
        unset($pathToDestract[0]);
        $public_path_st = str_replace($pathToDestract[1], "", $position);

        $public_path = $public_path_st . "/" . $domainExt;

        $public_path_st = explode("/", $public_path_st);
        unset($public_path_st[count($public_path_st) - 1]);
        $app_path = implode("/", $public_path_st);
        $app_path = $app_path . "/" . $domainExt;
        echo $public_path . "|||" . $app_path."|||".$domain;

        break;

    //Kreiramo foldere u koje treba da instaliramo cms i sajt. Kopiramo i fajlove koji su potrebni za instalaciju
    case "create_files":
        //Uzimam potrebne parametre
        $www_path = $_POST['www_path'];
        $application_path = $_POST["application_path"];

        //Postavim string koji pamti gde cu da prekorpiam fajlove
        $new_dir = "/";
        //proveravam da li postoji putanja do javnog dela sajta i pravim je ako je nema
        if (file_exists($www_path)) {
            //proveravam da li je fajl ili dir
            if (is_dir($www_path)) {
                $new_dir = $www_path;
            } else {
                //pravim putanju ako ne postoji
                $dirCreated = @mkdir($www_path, 0755, true);
                if (!$dirCreated) {
                    echo "error::Can not make path to www folder!";
                    die();
                }
            }
        } else {
            //pravim putanju ako ne postoji
            $dirCreated = @mkdir($www_path, 0755, true);
            if (!$dirCreated) {
                echo "error::Can not make path to www folder!";
                die();
            }
        }

        //proveravam da li postoji putanja do aplikacionog dela sajta i pravim je ako je nema
        if (file_exists($application_path)) {
            //proveravam da li je fajl ili dir
            if (!is_dir($application_path)) {
                //pravim putanju ako ne postoji
                $dirCreated = @mkdir($application_path, 0755, true);
                if (!$dirCreated) {
                    echo "error::Can not make path to application folder!";
                    die();
                }
            }
        } else {
            //pravim putanju ako ne postoji
            $dirCreated = @mkdir($application_path, 0755, true);
            if (!$dirCreated) {
                echo "error::Can not make path to application folder!";
                die();
            }
        }

        //U sesiju spakujem putanju do direktorijuma sajta, posto ce mi trebati za kasnije
        $_SESSION['new_dir'] = $www_path;

        //Ako ne postji folder cms na serveru, kriramo
        @mkdir($application_path . "core");
        @mkdir($application_path . "core/application");
        @mkdir($application_path . "core/library");
        $cms_path = $application_path . "core";


        //Rekurzivno iskopiramo ceo folder core u novi core direktorijum
        $path = explode("/",$_SERVER["SCRIPT_FILENAME"]);
        array_pop($path);
        array_pop($path);
        array_pop($path);        
        $path = implode("/", $path);                
        $sourceCmsPath    = $path. "/core";
        $sourcePublicPath = $path . "/public_html";
        
        if($sourceCmsPath != $cms_path){
          recurse_copy($sourceCmsPath, $cms_path);
        }
        
        if($sourcePublicPath != $www_path){
          recurse_copy($sourcePublicPath, $www_path);
        }
        //Sve proslo ok, vratim status
        echo "ok::Creating application folders";
    break;
                
    //Akcija koja nam brise instalacione fajlove nakon uspesne instalacije cms-a i sajta
    case "delete_files":

        //Uzimamo podatke potrebne za brisanje fajlova
        $www_path = $_POST['www_path'];//mesto gde je instaliran public_html
        $application_path = $_POST["application_path"]; //mesto gde je instaliran core
        $path = explode("/",$_SERVER["SCRIPT_FILENAME"]);
        array_pop($path);
        array_pop($path);
        array_pop($path);
        $path = implode("/", $path);//install direktorijum
        
        $www_path .= (substr($www_path, -1) == "/" ? "" : "/");
        $path .= (substr($path, -1) == "/" ? "" : "/");
        $application_path .= (substr($path, -1) == "/" ? "" : "/");
                
        if($path == $www_path) {
//         	echo "rm -rf ../installer";
        	shell_exec("rm -rf ../installer");
        	shell_exec("rm -rf ../../installer");
        	shell_exec("rm -rf ../../public_html");
			if($application_path != $path) {
// 				echo "rm -rf ../../core";
				shell_exec("rm -rf ../../core");
			}
        } else {
        	if($application_path == $path){
//         		echo "rm -rf ../../public_html";
//         		echo "rm -rf ../../db";
//         		echo "rm -rf ../../dbpatches";
        		shell_exec("rm -rf ../../public_html");
        		shell_exec("rm -rf ../../db");
        		shell_exec("rm -rf ../../dbpatches");
        	} else {
//         		echo "rm -rf " . $path;
                        shell_exec("rm -rf " . $www_path. "installer");
        		shell_exec("rm -rf " . $path ."public_html/installer");
        	}
        }

        //Brisemo fajl database.sql sa servera
        //Vratimo uspsan status nakon svega
        echo "ok::Removing installation files";
        break;


    //Akcija za rollback koja je razlicita od prethodnog rollbacka po tome sto ova ne brise fajlove, jer fajlovi nisu ni postavljeni na server
    //Ova akcija samo upise u nasu license tabelu koja je greska u pitanju kada dodje do greske prilikom instalacije
    case "rollback_status":

        //Preuzimamo parametre
        $license_key = $_POST['license_key'];
        $error_msg = $_POST['error_msg'];

        //Konektujemo se na bazu i izaberemo bazu
        $connection = mysql_connect("localhost", "human_license", "yvdv217w");
        $link = mysql_select_db("human_license");

        //Apdejtujemo bazu i upisujemo gresku koja se pojavila
        $query = mysql_query("UPDATE license SET `installMsg`='$error_msg' WHERE licenseKey='$license_key'");

        //Vracamo status
        echo "ok::Rollback successfully done!";

        mysql_close();

        break;


    case "pre_test":
        //Uzmemo site_path parametar koji je korisnik uneo
        $application_path = $_POST['application_path'];
        $www_path = $_POST['www_path'];

        //Uzmemo doc root servera i razbijemo kako bi uzeli putanju do cms-a
        //Proveriti da li su mi permisiije na doc_root-u dobar
        $permisions = substr(sprintf('%o', fileperms($application_path)), -4);
        if ($permisions != "0755" || $permisions != "0711") {
            $ch = chmod($application_path, 0755);
            if ($ch) {
                echo "warn::<b>Notice:</b> We changed some of your permissions in order to properly install GitLaunchpad.<br> Please review your server paths and permissions.";
                die();
            } else {
                echo "error::Error Permisions are not set correctly";
                die();
            }
        }
        break;

    //Radimo proveru baze i instalaciju iste
    case "install_database":
    	
        //Preuzimamo parametre koje salje work.php
        $database_server = $_POST["database_server"];
        $database_username = $_POST["database_username"];
        $database_password = $_POST["database_password"];
        $database_name = $_POST["database_name"];
        $admin_username = $_POST['admin_username'];
        $admin_password = $_POST['admin_password'];
        $admin_name = $_POST['admin_name'];
        $admin_lastname = $_POST['admin_lastname'];
        $www_path = $_POST["www_path"];

        //Proveravamo podatke koje je uneo korisnik.
        $link = @mysql_connect($database_server, $database_username, $database_password);
        if (!$link) {
            //Ako nije ok, mysql nam vraca neku gresku i mi to prosledjujemo korisniku
            echo "error::Error while connecting to database server. Check your parameters. (MySQL error: " . mysql_error() . ").";
            die();
        }

        //Ako je sve ok, proveravamo da li postoji baza koja nama treba
        $database = @mysql_select_db($database_name);
        if (!$database) {
            //Ako ne postoji varacamo korisniku gresku, da ta baza ne postoji i vratimo mysql gresku
            echo "error::Error while selecting database.Check if $database_name exist. (MySQL error: " . mysql_error() . ").";
            die();
        }
        
        //Pakujemo niz sve tabele koje je potrebno proveriti da li postoje u bazi, ako neka postoji onda vracamo gresku
        $tables_array = array(
          "category",
          "content_type",
          "content_type_field",
          "countries",
          "dev_log",
          "email",
          "error_controll",
          "form_type",
          "form_type_field",
          "language",
          "menu",
          "menu_link",
          "region",
          "region_article",
          "resource",
          "resource_category",
          "role",
          "rule",
          "seo_link",
          "settings",
          "theme",
          "theme_exception",
          "user",
          "user_comment"
        );
        
        //Selektujemo sve tabele iz baze radi provere
        $tables = @mysql_list_tables($database_name);

        //Krecemo se kroz tabele iz baze
        while ($tables_exist = @mysql_fetch_array($tables)) {
            if (in_array($tables_exist[0], $tables_array)) {
                //Ako postoji neka koja nije potrebna onda vratimo error
                echo "error::Table '" . $tables_exist[0] . "' is already in database.";
                die();
            }
        }

        //Pokrecemo transakciju posto cemo da izvrsavamo kverije
        @mysql_query("START TRANSACTION");

        //Postavljamo statuse i error
        $error = "";
        $status = true;
        
        $path = explode("/",$_SERVER["SCRIPT_FILENAME"]);
        array_pop($path);
        array_pop($path);
        array_pop($path);        
        $path = implode("/", $path);
        //Uzimamo ceo sadrzaj baze koju je potrebno instalirati i uzimamo svaki kveri posebno
        $file_content = @file_get_contents($path . "/db/database.sql");
        
        if(!$file_content){
           $error = "error::Error while loading database.sql";
            $status = false;
        }
        
        $query_lines = explode(";", $file_content);
        //Krecemo se kroz svaki kveri i pokusavamo da ga odradimo
        foreach ($query_lines as $line) {
            $sql = $line . ";";
            $query = @mysql_query($sql);
            if (!query && mysql_error() != "Query was empty") {
                //Ako je doslo do greske u nekom kveriju, kazemo koji je error u pitanju i stavimo status na false
                $error = "error::Error while creating database. (MySQL error: " . mysql_error() . ")";
                $status = false;
            }
        }

        //Pokusamo da ubacimo korisnika u bazu, sa podacima koje je korisnik uneo
        $query_user = @mysql_query("INSERT INTO user (`email`, `password`, `admin`, `fullname`, `role_id`) VALUES ('$admin_username', '" . md5($admin_password) . "', '1', '" . $admin_name . " " . $admin_lastname . "', '1')");

        if (!$query_user) {
            //Ako ni to nismo uspeli vracamo gresku da nije moguce
            $error = "error::Error while creating admin user. (MySQL error: " . mysql_error() . ")";
            $status = false;
        }
        
        //Proverimo status ako je sve ok, komitujemo kverije
        if ($status) {
            echo "ok::Creating and populating database";
            mysql_query("COMMIT");
        } else {
            //Ako nije, onda radimo rollback
            mysql_query("ROLLBACK");
            echo $error;
            die();
        }

        break;

    //U ovom koraku apdejtujemo sve potrebne parametre koji su nam potrebni za funkcionisanje cms-a i sajta
    case "update_params":

        //Preuzimamo sa work.php sve potrebne parametre
        $database_server = $_POST["database_server"];
        $database_username = $_POST["database_username"];
        $database_password = $_POST["database_password"];
        $database_name = $_POST["database_name"];
        $www_path = $_POST['www_path'];
        $new_dir = $_POST['new_dir'];
        $domain = $_POST['domain'];
        $site_path = $_POST['site_path'];
        $application_path = $_POST['application_path'];
        $version = $_POST['version'];
//        $license_key = $_POST['license_key'];
        $cms_path = $application_path . "core/";
        
        
        if($www_path[strlen($www_path)-1] != "/"){
          $www_path .= "/";          
        }        
        if($site_path[strlen($site_path)-1] != "/"){
          $site_path .= "/";          
        }
        if($domain[strlen($domain)-1] != "/"){
          $domain .= "/";          
        }
        if($cms_path[strlen($cms_path)-1] != "/"){
          $cms_path .= "/";          
        }
        if($application_path[strlen($application_path)-1] != "/"){
          $application_path .= "/";          
        }
        if($domain[strlen($domain)-1] != "/"){
          $domain .= "/";          
        }
        if($www_path[strlen($www_path)-1] != "/"){
          $www_path .= "/";          
        }
        
        
        
        //Ovde sredjujemo applications.xml content
        //Uzmemo sadrzaj application.xml fajla i spakujemo u simple xml objekat

        chmod($application_path . "core/application/configs/application.xml", 0755);
        
        $applicationXml = simplexml_load_file($application_path . "core/application/configs/application.xml");
        if (!$applicationXml) {
            echo "error::Error opening application.xml file";
            die();
        }

        //Menjamo potrebne parametre u application.xml fajlu
        $applicationXml->production->resources->db->params->host = $database_server;
        $applicationXml->production->resources->db->params->dbname = $database_name;
        $applicationXml->production->resources->db->params->username = $database_username;
        $applicationXml->production->resources->db->params->password= $database_password;
        
        $applicationXmlStatus = $applicationXml->asXML($application_path . "core/application/configs/application.xml");

        //Kada snimimo fajl proveravmo da li je sve ok, ako nije vracamo gresku
        if (!$applicationXmlStatus) {
            echo "error::Error saving application.xml file";
            die();
        }

        //config.php file3
        chmod($www_path . "config.php", 0755);
        $config_content = file_get_contents($www_path . "config.php");
        if (!$config_content) {
            echo "error::Error opening config.php file";
            die();
        }

        $doc_root = $_SERVER['DOCUMENT_ROOT'];
        
        //Menjamo podatke za config.php fajl
        $config_content = str_replace("[{APP_ADMIN_URL}]", "http://" . $domain . "adminWide", $config_content);
        $config_content = str_replace("[{APPLICATION_PATH}]", $cms_path . "application", $config_content);
        $config_content = str_replace("[{WEB_ROOT_PATH}]", $www_path, $config_content);
        $config_content = str_replace("[{APP_URL}]", "http://" . $domain, $config_content);
        $config_content = str_replace("[{ROOT_PATH}]", $application_path, $config_content);

        $status_config = file_put_contents($www_path . "config.php", $config_content);
        if (!$status_config) {
            echo "error::Error saving config.php file";
            die();
        }
        
        $htaPath = $domain;
        $domain = str_replace("http://", "", $domain);
        $domain = str_replace("https://","",$domain);
        $domainArray = explode("/", $domain);
        if($domainArray !== false){
          unset($domainArray[0]);
          if(count($domainArray) > 0){
            $htaPath = implode("/", $domainArray);
            $htaPath = "/" . $htaPath . "/";
          } else {
            $htaPath = "/";
          }
        } else {
          $htaPath = "/";
        }
        
        //Renaming htaccess file, adding . infront of name
        chmod($www_path . "htaccess", 0755);
        $index_content1 = file_get_contents($www_path . "htaccess");
        if (!$index_content1) {
            echo "error::Error opening index.php file";
            die();
        }
        $index_content1 = str_replace("{[LIB1]}", $htaPath, $index_content1);

        $status_index1 = file_put_contents($www_path . "htaccess", $index_content1);
        if (!$status_index1) {
            echo "error::Error saving htaccess file";
            die();
        }
        $htaccess = copy($www_path . "htaccess", $www_path . ".htaccess");
        if (!$htaccess) {
            echo "error::Error renaming htaccess file";
            die();
        }
        echo "ok::Configuring application";

        break;



    //Rollback akcija a uklanjanje svih nepotrebnih stvari ako dodje do greske prilikom instalacije
    case "rollback":

        //Preuzimamo parametre koje nam salje work.php
        $domain = $_POST['domain'];
        $www_path = $_POST['www_path'];
        $application_path = $_POST["application_path"];
        $cms_path = $application_path . "core/";
        $database_server = $_POST['database_server'];
        $database_user = $_POST['database_user'];
        $database_password = $_POST['database_password'];
        $database_name = $_POST['database_name'];

        //Proveravamo promenljive oko baze da li su poslati, ako su poslati znaci da je baza instalirana ili je neuspesno instalrina, pa onda moramo da pobrisemo sve tabele koje smo kreirali
        if ($database_server != "" && $database_user != "" && $database_password != "" && $database_name != "") {

            mysql_connect($database_server, $database_user, $database_password);
            mysql_select_db($database_name);

            //Niz svih tabela koje smo pokusali da instaliramo, tako da cemo da proverimo da li je neka od ovih jos uvek u bazi i da uklonimo
            $tables_array = array("categories", "contentTypeFields", "contentTypes", "countries", "email", "files", "languages", "menuLinks", "menus", "photos", "regionActions", "regions", "resourceCategories", "resources", "roles", "rules", "seoLink", "settings", "shopDeliveryMethods", "shopInvoices", "shopOrders", "shopPaymentMethods", "shoppingCart", "shopSettings", "stats", "themeExceptions", "themes", "users", "widgets", "_stranice");

            //Prolazimo kroz niz tabela i proveravamo da li postoje
            foreach ($tables_array as $key => $value) {
                //Ako postoji neka tabela, onda je brisemo
                if (mysql_num_rows(mysql_query("SHOW TABLES LIKE '" . $value . "'"))) {
                    mysql_query("DROP TABLE `" . $value . "`");
                }
            }
        }

        //Proverimo za svaki slucaj da li postoji folder cms
        if (is_dir($cms_path)) {
            recursive_remove_directory($cms_path);
        }

        //Uklanjamo folder adminWide ako postoji
        if (is_dir($www_path . "adminThemes")) {
            recursive_remove_directory($www_path . "adminThemes");
        }

        //Uklanjamo folder themes ako postoji
        if (is_dir($www_path . "themes")) {
            recursive_remove_directory($www_path . "themes");
        }

        //Uklanjamo fajl config.php ako postoji
        if (is_file($www_path . "config.php")) {
            unlink($www_path . "config.php");
        }

        //Uklanjamo fajl index.php ako postoji
        if (is_file($www_path . "index.php")) {
            unlink($www_path . "index.php");
        }

        //Uklanjamo fajl .htaccess ako postoji
        if (is_file($www_path . ".htaccess")) {
            unlink($www_path . ".htaccess");
        }
        ////Uklanjamo fajl htaccess ako postoji
        if (is_file("htaccess")) {
            unlink($www_path . "htaccess");
        }

        //Uklanjamo fajl database.sql ako postoji
        if (is_file($www_path . "db/database.sql")) {
            unlink($www_path . "db/database.sql");
        }

        //Uklanjamo fajl __avatars ako postoji
        if (is_dir($www_path . "__avatars")) {
            recursive_remove_directory($www_path . "__avatars");
        }

        //Uklanjamo fajl __uploads ako postoji
        if (is_dir($www_path . "__uploads")) {
            recursive_remove_directory($www_path . "__uploads");
        }
        
        //Vracamo da je rollback prosao kako treba
        echo "ok::Rollback successfully done!";

        break;
}

function checkParamsForConnection($username, $password) {       
    $c = curl_init();
    curl_setopt($c, CURLOPT_URL, "https://api.github.com/user/keys");
    curl_setopt($c, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($c, CURLOPT_USERPWD, "$username:$password");
    if($options["inputPost"])
      curl_setopt($c, CURLOPT_POSTFIELDS, json_encode($options["inputPost"]));
    curl_setopt($c, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($c, CURLOPT_SSL_VERIFYPEER, 0);
    $response = curl_exec($c);
    curl_close($c);
    $response = json_decode($response,true);
    if(isset($response["message"])){        
      $autenticated = false;
    } else {
      $autenticated = true;
    }
    return $autenticated;
}


//uzimanje fajlova iz direktorijuma za zip
function getDirectoryList($directory) {

    // create an array to hold directory list
    $results = array();

    // create a handler for the directory
    $handler = opendir($directory);

    // open directory and walk through the filenames
    while ($file = readdir($handler)) {

        // if file isn't this directory or its parent, add it to the results
        if ($file != "." && $file != "..") {
            $results[] = $file;
        }
    }

    // tidy up: close the handler
    closedir($handler);

    // done!
    return $results;
}

//stampa permisije fajla
function file_perms($file, $octal = false) {
    if (!file_exists($file))
        return false;

    $perms = fileperms($file);

    $cut = $octal ? 2 : 3;

    return substr(decoct($perms), $cut);
}

//Funckija koja brise direktorijum i u rekurzivnom prolazu brise i sve poddirektoprijume i fajlove unutar njega
function recursive_remove_directory($directory, $empty = FALSE) {
    if (substr($directory, -1) == '/') {
        $directory = substr($directory, 0, -1);
    }

    if (!file_exists($directory) || !is_dir($directory)) {
        return FALSE;
    } else if (is_readable($directory)) {
        $handle = opendir($directory);

        while (FALSE !== ($item = readdir($handle))) {
            if ($item != '.' && $item != '..') {
                $path = $directory . '/' . $item;
                if (is_dir($path)) {
                    recursive_remove_directory($path);
                } else {
                    unlink($path);
                }
            }
        }
        closedir($handle);
        if ($empty == FALSE) {
            if (!rmdir($directory)) {
                return FALSE;
            }
        }
    }
    return TRUE;
}

//Funckija koja kopira ceo folder i koja rekurzivno proverava i kopira sve podfoldere i fajlove unutar njega
function recurse_copy($src, $dst) {
    $dir = opendir($src);
    @mkdir($dst);
    while (false !== ( $file = readdir($dir))) {
        if (( $file != '.' ) && ( $file != '..' )) {
            if (is_dir($src . '/' . $file)) {
                recurse_copy($src . '/' . $file, $dst . '/' . $file);
            } else {
                @copy($src . '/' . $file, $dst . '/' . $file);
            }
        }
    }
    @closedir($dir);
}

?>