<?php
session_start();

//Include Google client library 
include_once 'src/Google_Client.php';
include_once 'src/contrib/Google_Oauth2Service.php';

/*
 * Configuration and setup Google API
 */
$clientId = 'clientId'; //Google client ID
$clientSecret = 'clientSecret'; //Google client secret
$redirectURL = 'http://localhost/google'; //Callback URL

//Call Google API
$gClient = new Google_Client();
$gClient->setApplicationName('');
$gClient->setClientId($clientId);
$gClient->setClientSecret($clientSecret);
$gClient->setRedirectUri($redirectURL);

$google_oauthV2 = new Google_Oauth2Service($gClient);
?>