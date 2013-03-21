<?php 

    // Define path to application directory 
    if (!defined('APPLICATION_PATH')){ 
        define("APPLICATION_PATH","/Users/matija/Desktop/Git/PropulsionPlatform/PropulsionApp/core/application"); 
    } 

    if (!defined('WEB_ROOT_PATH')){ 
        define("WEB_ROOT_PATH","/Users/matija/Desktop/Git/PropulsionPlatform/PropulsionApp/public_html/"); 
    } 
    
    if (!defined('ROOT_PATH')) { 
      define("ROOT_PATH", "/Users/matija/Desktop/Git/PropulsionPlatform/PropulsionApp/"); 
    } 
    
    if(!defined('FB_APP_ID')) { 
        define("FB_APP_ID", "126363994137616"); 
    } 
    
    if(!defined('FB_APP_SECRET')) { 
        define("FB_APP_SECRET", "39d5d2bca4e62f7afd084a20d8c919af"); 
    } 


    if (!defined('APP_URL')){ 
        define("APP_URL","http://local.platforma/public_html/"); 
    } 
    
    if (!defined('APP_ADMIN_URL')){ 
        define("APP_ADMIN_URL","http://local.platforma/public_html/adminThemes/propulsion/"); 
    } 
        
    // Define application environment 
    defined('APPLICATION_ENV') || define('APPLICATION_ENV', (getenv('APPLICATION_ENV') ? getenv('APPLICATION_ENV') : 'production')); 
?>