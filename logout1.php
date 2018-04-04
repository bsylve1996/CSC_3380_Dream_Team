<?php
//Include Fb config file
include_once 'fbconfig.php';

if(isset($_GET['logout'])){
	echo($_GET['logout']);
    if($_GET['logout']=='true'){
     	$redir_url='http://localhost/google';
	$logoutUrl = $facebook->getLogoutUrl(array('next'=>$redir_url));
        session_destroy();
	header('location:'.$logoutUrl);     
    }
header('location: index.php')
?>