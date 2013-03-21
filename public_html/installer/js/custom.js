$(function(){
    $.ajax({
        type: "POST",
        async: false,
        url: "work.php",
        data: "action=get_version",
        success: function(msg){
            $(".header").find(".title").html("INSTALLER " + msg);
            $(".title-footer").html("INSTALLER " + msg);
        }
    });

    var stepText = new Array();
    stepText[1] = "This step will check if your server has the software required for GitLaunchpad to run. Everything except PHPUnit and PHPDocumentor is required.";
    stepText[2] = "In this step you need to specify the URL where your GL will be located. Also, you need to provide server paths for GL files. We recommend that for security reasons a path for application system files is above your public_html directory.";
    stepText[3] = "Please configure the database for Git Launchpad to use. We sugest using an empty database for platform.";
    stepText[4] = "Configure your Git Launchpad login details. Use this details to log in to GitLaunchpad after installation has completed.";
    stepText[5] = "Configure your GitHub login details. These details are required in order to properly fetch and deploy your code from github.";

    $("#go_back").hide();
    $("#refresh").hide();
    var step = 1;
    var admin_name = $("#admin_name").val();
    var admin_lastname = $("#admin_lastname").val();
    var admin_user = $("#admin_user").val();
    var admin_password = $("#admin_password").val();
    var database_server = $("#database_server").val();
    var database_user = $("#database_user").val();
    var database_password = $("#database_password").val();
    var database_name = $("#database_name").val();
    var domain = $("#domain").val();
    var www_path = $("#www_path").val();
    var application_path = $("#application_path").val();
    var installation = true;
        
    //Postavljam neke globalne promenljive koje mi trebaju tokom celog procesa instalacije
    var glob_status;
    glob_status = true;
    var glob_version;
    glob_version = "";
    var glob_error_log;
    glob_error_log = "";
    var glob_lk;
    glob_lk = "";
    var glob_cms_path;
    glob_cms_path = "";
    var glob_error_msg;
    glob_error_msg = "";

    var ajaxUrl
    var host = window.location.hostname;

    function next(step){
        if(installation){
            $(".labelErrorInput").html("");
            var i = 1;
            if(step < 6){
                for(i = 1; i < 6; i++){
                    if(i != step){
                        $(".step"+i).hide();
                    } else {
                        $(".step"+i).show();
                    }
                }
                $("#stepText").html(stepText[step]);
                $("#stepTitle").html($(".left-box ul li").eq(step-1).find("a").html());
                $(".left-box ul li").removeClass("active");
                $(".left-box ul li").eq(step-1).addClass("active");
                $(".left-box").height($(".right-box").height());
                $(".background-image-x").height($(".right-box").height() + 200);
            }
        }
    }

    next(step);

    $(".next").live("click", function(){
        switch(step){
            case 1:
            case "1":
                var val = checkStep2();
                if(val == "false"){
                    return false;
                }
                break;
            case 2:
            case "2":
                var val = checkStep3();
                if(val == "false"){
                    return false;
                }
                break;
            case 3:
            case "3":
                var val = checkStep4();
                if(val == "false"){
                    return false;
                }
                break;
        }
        step++;
        next(step);
    });

    $(".input").focus(function() {
        $(this).removeClass("ok");
        $(this).removeClass("error");
        $(this).removeClass("normal");
        $(this).addClass("focus");
    });

    $(".input").focusout(function() {
        $(this).removeClass("focus");
        $(this).addClass("normal");
    })

    function makePaths(domain){
        $.ajax({
            type: "POST",
            url: "work.php",
            data: "action=make_paths&url=" + document.URL + "&domain=" + domain,
            success: function(msg){
                var status = msg.split("|||");
                var public_path = status[0];
                var app_path = status[1];
                var domain_path = status[2];

                $("#domain").val(domain_path);
                $("#www_path").val(public_path);
                $("#application_path").val(app_path);
            }
        });
    }

    $(".git_test_on_fail").hide();
    if($("#git_path_test").is(":visible")){
        var gitPath = $("#git_path_test").val();
    } else {
        var gitPath = "git";
    }

    $("#domain").focus(function(){
        $(".next").hide();
    });

    $("#domain").focusout(function(){
        var domain = $("#domain").val();
        if(domain != ""){
            if(domain.indexOf(".") == -1) {
                $.ajax({
                    type: "POST",
                    url: "work.php",
                    data: "action=make_domain",
                    success: function(msg){
                        if(domain[0] == "/"){
                            $("#domain").val(msg + domain);
                            domain = msg + domain;
                        } else {
                            $("#domain").val(msg + "/" + domain);
                            domain = msg + "/" + domain;
                        }
                        makePaths(domain);
                    }
                });
            } else {
                makePaths(domain);
            }
        }
        $(".next").show();
    });

    function checkStep2(){
        //FTP and Domain paramas
        domain = $("#domain").val();
        //Path params
        www_path = $("#www_path").val();
        application_path = $("#application_path").val();

        //Checking FTP and domain paramas
        if(domain == "") {
            $("#domain").removeClass("normal");
            $("#domain").removeClass("ok");
            $("#domain").removeClass("focus");
            $("#domain").addClass("error");
            $("#domain").parent().find(".labelErrorInput").html("<span>Application URL is required and can not be empty.</span>");
            $("#domain").parent().find(".labelErrorInput").height("20px");
            return "false";
        } else {
            $("#domain").parent().find(".labelErrorInput").html("");
            $("#domain").parent().find(".labelErrorInput").height("0px");
        }

        if(application_path == "") {
            $("#application_path").removeClass("normal");
            $("#application_path").removeClass("ok");
            $("#application_path").removeClass("focus");
            $("#application_path").addClass("error");
            $("#application_path").parent().find(".labelErrorInput").html("<span>Application core path is required and can not be empty.</span>");
            $("#application_path").parent().find(".labelErrorInput").height("20px");
            return "false";
        } else {
            if(application_path.substr(0, 1) != "/") {
                $("#application_path").removeClass("normal");
                $("#application_path").removeClass("ok");
                $("#application_path").removeClass("focus");
                $("#application_path").addClass("error");
                $("#application_path").parent().find(".labelErrorInput").html("<span>Must start with \"/\"</span>");
                $("#application_path").parent().find(".labelErrorInput").height("20px");
                return "false";
            } else if(application_path.substr(application_path.length-1, application_path.length) != "/"){
                application_path += "/";
                $("#application_path").parent().find(".labelErrorInput").html("");
                $("#application_path").parent().find(".labelErrorInput").height("0px");
            } else {
                $("#application_path").parent().find(".labelErrorInput").html("");
                $("#application_path").parent().find(".labelErrorInput").height("0px");
            }
        }

        //Checking Path paramas
        if(www_path == "") {
            $("#www_path").removeClass("normal");
            $("#www_path").removeClass("ok");
            $("#www_path").removeClass("focus");
            $("#www_path").addClass("error");
            $("#www_path").parent().find(".labelErrorInput").html("<span>Application public path is required and can not be empty.</span>");
            $("#www_path").parent().find(".labelErrorInput").height("20px");
            return "false";
        } else if(www_path.substr(0, 1) != "/") {
            $("#www_path").removeClass("normal");
            $("#www_path").removeClass("ok");
            $("#www_path").removeClass("focus");
            $("#www_path").addClass("error");
            $("#www_path").parent().find(".labelErrorInput").html("<span>Must start with \"/\"</span>");
            $("#www_path").parent().find(".labelErrorInput").height("20px");
            return "false";
        } else if(www_path.substr(www_path.length-1, www_path.length) != "/"){
            www_path += "/";
            $("#www_path").parent().find(".labelErrorInput").html("");
            $("#www_path").parent().find(".labelErrorInput").height("0px");
        } else {
            $("#www_path").parent().find(".labelErrorInput").html("");
            $("#www_path").parent().find(".labelErrorInput").height("0px");
        }

    }

    function checkStep3(){
        //Database paramas
        database_server = $("#database_server").val();
        database_user = $("#database_user").val();
        database_password = $("#database_password").val();
        database_name = $("#database_name").val();

        //Checking database params
        if(database_server == "") {
            $("#database_server").removeClass("normal");
            $("#database_server").removeClass("ok");
            $("#database_server").removeClass("focus");
            $("#database_server").addClass("error");
            $("#database_server").parent().find(".labelErrorInput").html("<span>Database server is required and can not be empty.</span>");
            $("#database_server").parent().find(".labelErrorInput").height("20px");
            return "false";
        } else {
            $("#database_server").parent().find(".labelErrorInput").html("");
            $("#database_server").parent().find(".labelErrorInput").height("0px");
        }

        if(database_name == "") {
            $("#database_name").removeClass("normal");
            $("#database_name").removeClass("ok");
            $("#database_name").removeClass("focus");
            $("#database_name").addClass("error");
            $("#database_name").parent().find(".labelErrorInput").html("<span>Database name is required and can not be empty.</span>");
            $("#database_name").parent().find(".labelErrorInput").height("20px");
            return "false";
        } else {
            $("#database_name").parent().find(".labelErrorInput").html("");
            $("#database_name").parent().find(".labelErrorInput").height("0px");
        }

        if(database_user == "") {
            $("#database_user").removeClass("normal");
            $("#database_user").removeClass("ok");
            $("#database_user").removeClass("focus");
            $("#database_user").addClass("error");
            $("#database_user").parent().find(".labelErrorInput").html("<span>Database user is required and can not be empty.</span>");
            $("#database_user").parent().find(".labelErrorInput").height("20px");
            return "false";
        } else {
            $("#database_user").parent().find(".labelErrorInput").html("");
            $("#database_user").parent().find(".labelErrorInput").height("0px");
        }

        if(database_password == "") {
            $("#database_password").removeClass("normal");
            $("#database_password").removeClass("ok");
            $("#database_password").removeClass("focus");
            $("#database_password").addClass("error");
            $("#database_password").parent().find(".labelErrorInput").html("<span>Database password is required and can not be empty.</span>");
            $("#database_password").parent().find(".labelErrorInput").height("20px");
            return "false";
        } else {
            $("#database_password").parent().find(".labelErrorInput").html("");
            $("#database_password").parent().find(".labelErrorInput").height("0px");
        }

        var statusDB = false;

        $.ajax({
            type: "POST",
            async: false,
            url: "work.php",
            data: "action=database_check&database_server="+database_server+"&database_password="+database_password+"&database_name="+database_name+"&database_username="+database_user,
            success: function(msg){
                var status = msg.split("::");
                var type = status[0];
                var note = status[1];
                //Vracam status da li je konektovano ili nije
                if(type == "ok") {
                    $("#database_password").parent().find(".labelErrorInput").html("");
                    $("#database_password").parent().find(".labelErrorInput").height("0px");
                    statusDB = true;
                } else if(type == "error") {
                    $("#database_password").parent().find(".labelErrorInput").html("<div>"+note+"</div>");
                    $("#database_password").parent().find(".labelErrorInput").height("20px");
                    statusDB = false;
                }
            }
        });

        if(!statusDB){
            return "false";
        }
    }

    function checkStep4(){
        //Admin paramas
        admin_name = $("#admin_name").val();
        admin_lastname = $("#admin_lastname").val();
        admin_user = $("#admin_user").val();
        admin_password = $("#admin_password").val();

        //Checking admin paramas
        if(admin_name == "") {
            $("#admin_name").removeClass("normal");
            $("#admin_name").removeClass("ok");
            $("#admin_name").removeClass("focus");
            $("#admin_name").addClass("error");
            $("#admin_name").parent().find(".labelErrorInput").html("<span>First name is required and can not be empty.</span>");
            $("#admin_name").parent().find(".labelErrorInput").height("20px");
            return "false";
        } else {
            $("#admin_name").parent().find(".labelErrorInput").html("");
            $("#admin_name").parent().find(".labelErrorInput").height("0px");
        }

        if(admin_lastname == "") {
            $("#admin_lastname").removeClass("normal");
            $("#admin_lastname").removeClass("ok");
            $("#admin_lastname").removeClass("focus");
            $("#admin_lastname").addClass("error");
            $("#admin_lastname").parent().find(".labelErrorInput").html("<span>Last name is required and can not be empty.</span>");
            $("#admin_lastname").parent().find(".labelErrorInput").height("20px");
            return "false";
        } else {
            $("#admin_lastname").parent().find(".labelErrorInput").html("");
            $("#admin_lastname").parent().find(".labelErrorInput").height("0px");
        }

        if(admin_user == "") {
            $("#admin_user").removeClass("normal");
            $("#admin_user").removeClass("ok");
            $("#admin_user").removeClass("focus");
            $("#admin_user").addClass("error");
            $("#admin_user").parent().find(".labelErrorInput").html("<span>Username is required and can not be empty.</span>");
            $("#admin_user").parent().find(".labelErrorInput").height("20px");
            return "false";
        } else {
            $("#admin_user").parent().find(".labelErrorInput").html("");
            $("#admin_user").parent().find(".labelErrorInput").height("0px");
        }

        if(admin_password == "") {
            $("#admin_password").removeClass("normal");
            $("#admin_password").removeClass("ok");
            $("#admin_password").removeClass("focus");
            $("#admin_password").addClass("error");
            $("#admin_password").parent().find(".labelErrorInput").html("<span>Password is required and can not be empty.</span>");
            $("#admin_password").parent().find(".labelErrorInput").height("20px");
            return "false";
        } else {
            $("#admin_password").parent().find(".labelErrorInput").html("");
            $("#admin_password").parent().find(".labelErrorInput").height("0px");
        }
    }

        $("#install_button").live("click", function(){
            installation = false;
            $(".labelErrorInput").html("");
            if(checkStep4() == "false"){
                return false;
            }

            $(".left-box").find("li").removeClass("active");
            $(".left-box").find("li a#4").parent().addClass("active");
            ajaxUrl = domain.substr(host.length, domain.length) + "/";
            //Everything is ok, move on
            $('#install_form').hide();

            createFiles();

            function createFiles(){
                //U ovom koraku kreiramo potrebne foldere u koje cemo da instaliramo cms i sajt
                //Takodje u ovom istom koraku kopiramo instalacione fajlove koji su potreni za instalaciju (install.php i install.zip)
                var current_action_html = "<div class='current_action'> Creating folders and copying installation files.. <img src='images/loader.gif' /> </div>";
                $('#installation_progress').show();
                $('#installation_progress').append(current_action_html);

                $.ajax({
                    type: "POST",
                    url: "work.php",
                    data: "action=create_files&www_path="+www_path+"&version="+glob_version+"&domain="+domain+"&application_path="+application_path,
                    success: function(msg){
                        var status = msg.split("::");
                        var type = status[0];
                        var note = status[1];

                        //Proveravam da li je sve ok i prikazujemo poruku
                        if(type == "ok") {
                            $('.current_action').remove();
                            $('#installation_progress').append("<div class=\"ElemRowShowOk\"><div class=\"label2\">"+note+"</div><div class=\"labelOk\"></div><img class=\"imgStat\" src=\"images/success.png\"></div>");
                            pre_test();
                        } else if(type == "error") {
                            $('.current_action').remove();
                            $('#installation_progress').append("<div class=\"ElemRowShowError\"><div class=\"label2\">"+note+"</div><img class=\"imgStat\" src=\"images/error.png\"></div>");
                            $('#refresh').show();
                            return false;
                        }
                    }
                });
            }

            function pre_test(){
                //U ovom koraku kreiramo potrebne foldere u koje cemo da instaliramo cms i sajt
                //Takodje u ovom istom koraku kopiramo instalacione fajlove koji su potreni za instalaciju (install.php i install.zip)
                var current_action_html = "<div class='current_action'> Check for requirements.. <img src='images/loader.gif' /> </div>";
                $('#installation_progress').show();
                $('#installation_progress').append(current_action_html);

                $.ajax({
                    type: "POST",
                    url: "work.php",
                    data: "action=pre_test&application_path=" + application_path + "&www_path=" + www_path,
                    success: function(msg){
                        var status = msg.split("::");
                        var type = status[0];
                        var note = status[1];

                        //Vracam status da li je konektovano ili nije
                        if(type == "ok") {
                            $('.current_action').remove();
                            $('#installation_progress').append("<div class=\"ElemRowShowOk\"><div class=\"label2\">"+note+"</div><div class=\"labelOk\"></div><img class=\"imgStat\" src=\"images/success.png\"></div>");
                            installDb();
                        } else if(type == "error") {
                            $('.current_action').remove();
                            $('#installation_progress').append("<div class=\"ElemRowShowError\"><div class=\"label2\">"+note+"</div><img class=\"imgStat\" src=\"images/error.png\"></div>");
                            //Pozivamo funkciju za rollback
                            rollBack(domain, www_path, glob_cms_path, "", "", "", "", glob_lk, glob_error_msg,application_path,ajaxUrl);
                            $('#refresh').show();
                            return false;
                        } else if(type == "warn") {
                            $('.current_action').remove();
                            $('#installation_progress').append("<div class=\"ElemRowShowError\"><div class=\"label2\">"+note+"</div><img class=\"imgStat\" src=\"images/success.png\"></div>");
                            installDb();
                        }
                    }
                });
            }

            function installDb(){
                //U ovom koraku proveramo da li postoji baza i ubacujemo tabele ako postoji
                var current_action_html = "<div class='current_action'> Checking for database and paramters. Creating databse.. <img src='images/loader.gif' /> </div>";
                $('#installation_progress').show();
                $('#installation_progress').append(current_action_html);
                $.ajax({
                    type: "POST",
                    url: "work.php",
                    data:{
                        'action': 'install_database',
                        'database_server': database_server,
                        'database_username':database_user,
                        'database_password': database_password,
                        'database_name':database_name,
                        'admin_username':admin_user,
                        'admin_password':admin_password,
                        'admin_name':admin_lastname,
                        'admin_lastname':admin_lastname,
                        'www_path':www_path
                    },
                    success: function(msg){
                        var status = msg.split("::");
                        var type = status[0];
                        var note = status[1];

                        //Proverimo da li je ok sve proslo i stampamo gresku ukoliko nije
                        if(type == "ok") {
                            $('.current_action').remove();
                            $('#installation_progress').append("<div class=\"ElemRowShowOk\"><div class=\"label2\">"+note+"</div><div class=\"labelOk\"></div><img class=\"imgStat\" src=\"images/success.png\"></div>");
                            updateParams();
                        } else if(type == "error") {
                            $('.current_action').remove();
                            $('#installation_progress').append("<div class=\"ElemRowShowError\"><div class=\"label2\">"+note+"</div><img class=\"imgStat\" src=\"images/error.png\"></div>");
                            rollBack(domain, www_path, glob_cms_path, "", "", "", "", glob_lk, glob_error_msg,application_path,ajaxUrl);
                            $('#refresh').show();
                            return false;
                        }
                    }
                });
            }

            function updateParams(){
                //U ovom koraku apdejtujemo parametre u fajlovima
                var current_action_html = "<div class='current_action'> Updating params in application.ini, config.php and index.php file.. <img src='images/loader.gif' /> </div>";
                $('#installation_progress').show();
                $('#installation_progress').append(current_action_html);

                $.ajax({
                    type: "POST",
                    url: "work.php",
                    data: "action=update_params&database_server=" + database_server + "&database_username=" + database_user + "&database_password=" + database_password + "&database_name=" + database_name + "&domain=" + domain + "&new_dir=" + www_path + "&www_path=" + www_path + "&application_path=" + application_path  ,
                    success: function(msg){
                        var status = msg.split("::");
                        var type = status[0];
                        var note = status[1];
                        var version = status[2];
                        var error_log = status[3];
                        glob_version = version;
                        glob_error_log = error_log;

                        //Vratim status i vidim je l sve ok
                        if(type == "ok") {
                            $('.current_action').remove();
                            $('#installation_progress').append("<div class=\"ElemRowShowOk\"><div class=\"label2\">"+note+"</div><div class=\"labelOk\"></div><img class=\"imgStat\" src=\"images/success.png\"></div>");
                            deleteFiles();
                        } else if(type == "error") {
                            $('.current_action').remove();
                            $('#installation_progress').append("<div class=\"ElemRowShowError\"><div class=\"label2\">"+note+"</div><img class=\"imgStat\" src=\"images/error.png\"></div>");
                            rollBack(domain, www_path, glob_cms_path, database_server, database_user, database_password, database_name, glob_lk, glob_error_msg,application_path,ajaxUrl);
                            $('#refresh').show();
                            return false;
                        }
                    }
                });
            }

        });
        //Sluzi za prikazivanje gresaka prilikom unosa podataka
        $('.error_msg').live("click", function(){
            $(this).hide();
        });

    function finall(){
        //Prikazujemo tekst da ce korisnik biti redirektovan na svoj novi sajt
        $('#go_back').show();
        var url = "http://" + domain + "/login";
        $('.current_action').remove();
        window.open(url,'_blank');
        var lastM = "<div class=\"install-successfull\">Installation successful!</div>";
        var returnLink = "<a id=\"go_back_link\" href=\"" + url + "\" target=\"_blank\">If platform is not already opened in a new tab you can click here.</a>";
        $('#installation_progress').append("<div class=\"ElemRowShowLast\"><div class=\"label3\">" + lastM + "<br>" + returnLink + "</div><div class=\"labelOk\"></div></div><div class='clear-ten'></div>");
        $(".left-box").height($(".right-box").height());
        $(".background-image-x").height($(".right-box").height() + 200);		
    }
    //Funckija koja radi rollback ukoliko dodje do greske prilikom instalacije.
    function rollBack(domain, www_path, glob_cms_path, database_server, database_user, database_password, database_name, license_key, glob_error_msg,application_path,ajaxUrl) {
        var current_action_html = "<div class='current_action'> Rollback action.. <img src='images/loader.gif' /> </div>";
        $('#installation_progress').show();
        $('#installation_progress').append(current_action_html);

        $.ajax({
            type: "POST",
            url: "work.php",
            data: "action=rollback&www_path=" + www_path + "&application_path=" + application_path + "&database_server=" + database_server + "&database_user=" + database_user + "&database_password=" + database_password + "&database_name=" + database_name,
            success: function(msg){
                var status = msg.split("::");
                var type = status[0];
                var note = status[1];
                //Vracamo status da li je rollback uspesno uradjen
                if(type == "ok") {
                    $('.current_action').remove();
                    $('#installation_progress').append("<div class=\"ElemRowShowOk\"><div class=\"label2\">"+note+"</div><div class=\"labelOk\"></div><img class=\"imgStat\" src=\"images/success.png\"></div>");
                } else if(type == "error") {
                    $('.current_action').remove();
                    $('#installation_progress').append("<div class=\"ElemRowShowError\"><div class=\"label2\">"+note+"</div><img class=\"imgStat\" src=\"images/error.png\"></div>");
                    glob_status = false;
                }
            }
        });
    }

    function deleteFiles(){
        //Ova akcija sluzi za brisanje instalacionih fajlova sa novog servera
        var current_action_html = "<div class='current_action'> Deleting installation files on .. <img src='images/loader.gif' /> </div>";
        $('#installation_progress').show();
        $('#installation_progress').append(current_action_html);

        $.ajax({
            type: "POST",
            url: "work.php",
            data: "action=delete_files&www_path="+www_path+"&application_path="+application_path,
            success: function(msg){
                var status = msg.split("::");
                var type = status[0];
                var note = status[1];

                //Vraca se status o obrisanim fajlovima
                if(type == "ok") {
                    $('.current_action').remove();
                    $('#installation_progress').append("<div class=\"ElemRowShowOk\"><div class=\"label2\">"+note+"</div><div class=\"labelOk\"></div><img class=\"imgStat\" src=\"images/success.png\"></div>");
                    finall();
                } else if(type == "error") {
                    $('.current_action').remove();
                    $('#installation_progress').append("<div class=\"ElemRowShowError\"><div class=\"label2\">"+note+"</div><img class=\"imgStat\" src=\"images/error.png\"></div>");
                    rollBack(domain, www_path, glob_cms_path, database_server, database_user, database_password, database_name, glob_lk, glob_error_msg,application_path,ajaxUrl);
                    $('#refresh').show();
                    return false;
                }
            }
        });
    }
});
