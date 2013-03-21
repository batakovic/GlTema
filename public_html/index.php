<?php   
      //Including configuration php file, with all defined variables
      include("config.php");
      
       if(APPLICATION_PATH == "[{APPLICATION_PATH}]")
            header("Location: installer/index.html"); 
      // Adding library directory to the include path
        
        /**
         * @todo all this can be done in the config file
         */
        set_include_path(implode(PATH_SEPARATOR, array(
            realpath(APPLICATION_PATH . '/modules/gl/models'),
            realpath(APPLICATION_PATH . '/modules/core/views/forms'),
            realpath(APPLICATION_PATH . '/modules/core/models'),
            realpath(APPLICATION_PATH . '/modules/facebook/models'),
            realpath(APPLICATION_PATH . '/modules/ga/models'),
            realpath(APPLICATION_PATH . '/modules/licenses/models'),
            realpath(APPLICATION_PATH . '/modules/subscriptions/models'),
            realpath(APPLICATION_PATH . '/modules/support/models'),
            realpath(APPLICATION_PATH . '/modules/updater/models'),
            realpath(APPLICATION_PATH . '/modules/twoco/models'),
            realpath(APPLICATION_PATH . '/modules/garden/models'),
            realpath(APPLICATION_PATH . '/modules/api/models'),
            realpath(APPLICATION_PATH . '/modules/swagger/models'),
            realpath(APPLICATION_PATH . '/../library'),
            realpath(APPLICATION_PATH . '/../library/Platforma'),
            realpath(APPLICATION_PATH . '/../library/Zend/library'),
            realpath(APPLICATION_PATH . '/../library/Swagger'),
            realpath(APPLICATION_PATH . '/../library/Doctrine'),
            realpath(APPLICATION_PATH . '/../../tests/'),
            realpath(APPLICATION_PATH . '/../../tests/application/'),
            realpath(APPLICATION_PATH . '/modules/cpanel/models'),
            realpath(APPLICATION_PATH . '/../library/Cpanel'),
            realpath(APPLICATION_PATH . '/../library/GitHub'),
            realpath(APPLICATION_PATH . '/../library/Buzz'),
            get_include_path(),
        )));
        

      /** Zend_Application */
      require_once 'Zend/Application.php';
      // Create application, bootstrap, and run     
      $application = new Zend_Application(
          APPLICATION_ENV,
          APPLICATION_PATH . '/configs/application.xml'
      );
      
	require_once 'Platforma/Acl.php';
    
    /**
    * define a simple logging function
    * @todo why is this code here?
    */
    function fb($msg, $label=null) {
      if ($label != null) {
        $msg = array($label,$msg);
      }
      $logger = Zend_Registry::get('logger');
      $msg = print_r($msg,true);
      $logger->info($msg);
      error_log($msg);
    }
    $application->getBootstrap()->bootstrap('db');
    $application->bootstrap();
    
    if(!defined('APP_RUN')) {
        $application->run();
    }
?>
