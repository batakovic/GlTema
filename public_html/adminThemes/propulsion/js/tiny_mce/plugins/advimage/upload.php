<?php
	$error = "";
	$msg = "";
	$fileElementName = 'fileToUpload';
	if(!empty($_FILES[$fileElementName]['error']))
	{
		switch($_FILES[$fileElementName]['error'])
		{

			case '1':
				$error = 'The uploaded file exceeds the upload_max_filesize directive in php.ini';
				break;
			case '2':
				$error = 'The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form';
				break;
			case '3':
				$error = 'The uploaded file was only partially uploaded';
				break;
			case '4':
				$error = 'No file was uploaded.';
				break;

			case '6':
				$error = 'Missing a temporary folder';
				break;
			case '7':
				$error = 'Failed to write file to disk';
				break;
			case '8':
				$error = 'File upload stopped by extension';
				break;
			case '999':
			default:
				$error = 'No error code avaiable';
		}
	}elseif(empty($_FILES['fileToUpload']['tmp_name']) || $_FILES['fileToUpload']['tmp_name'] == 'none')
	{
		$error = 'No file was uploaded..';
	}else 
	{
			//$msg .= " File Name: " . $_FILES['fileToUpload']['name'] . ", ";
			//$msg .= " File Size: " . @filesize($_FILES['fileToUpload']['tmp_name']);
			//for security reason, we force to remove all uploaded file
				
				include("../../../../../../config.php");

				$file = $_FILES['fileToUpload'];
				if ($file['tmp_name'] != '') {
    						if (is_uploaded_file($file['tmp_name'])) {
    						    
    						    $imgageName = $file['name'];
    						    list($imgName, $ext) = explode(".", $imgageName);
    						    $strText = $imgName;
    						    
    						    $strText = str_replace("š", "s", $strText);
                                $strText = str_replace("Š", "s", $strText);
                                $strText = str_replace("ž", "z", $strText);
                                $strText = str_replace("Ž", "z", $strText);
                                $strText = str_replace("Č", "c", $strText);
                                $strText = str_replace("č", "c", $strText);
                                $strText = str_replace("Ć", "c", $strText);
                                $strText = str_replace("ć", "c", $strText);
                                $strText = str_replace("Đ", "dj", $strText);
                                $strText = str_replace("đ", "dj", $strText);
                                $strText = preg_replace('/[^A-Za-z0-9-]/', ' ', $strText);
                                $strText = preg_replace('/ +/', ' ', $strText);
                                $strText = trim($strText);
                                $strText = str_replace(' ', '-', $strText);
                                $strText = preg_replace('/-+/', '-', $strText);
                                $strText = strtolower($strText);
                                
                                $imageName = $strText.".".$ext;
    						    
       							if(!move_uploaded_file($file['tmp_name'],WEB_ROOT_PATH . "__uploads/".$imageName)){
       								$error = "Could not move uploaded file";
       							} else {
       								$msg = APP_URL."/__uploads/".$imageName;

       							} 
       						} else {
       							$error = "File is not uploaded";
       						}
       					}  else {
       						$error = "No file";    
       					}

		
	}		
	echo "{";
	echo				"error: '" . $error . "',\n";
	echo				"msg: '" . $msg . "'\n";
	echo "}";
?>