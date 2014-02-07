<?php
/*
Credits: Bit Repository
URL: http://www.bitrepository.com/
*/

/*
include 'config.php';

error_reporting (E_ALL ^ E_NOTICE);

$post = (!empty($_POST)) ? true : false;

if($post)
{

$name = stripslashes($_POST['name']);
$email = trim($_POST['email']);
$subject = stripslashes($_POST['subject']);
$message = stripslashes($_POST['message']);

$error = '';

if(!$error)
{
$mail = mail(WEBMASTER_EMAIL, $subject, $message,
     "From: ".$name." <".$email.">\r\n"
    ."Reply-To: ".$email."\r\n"
    ."X-Mailer: PHP/" . phpversion());


if($mail)
{
echo 'OK';
}

}

}

*/

$name = stripslashes($_POST['name']);
$email = trim($_POST['email']);
$subject = stripslashes($_POST['subject']);
$message = stripslashes($_POST['message']);

//$handle = fopen("comments.txt", "a");
//fwrite( $handle, "Name: ".$name."\n"."Email: ".$email."\n"."Subject: ".$subject."\n"."Message: ".$message."\n\n");

$url = 'http://sendgrid.com/';
$user = 'chapman';
$pass = 'qwerty23';

$json_string = array(
  'filters' => array( 'subscriptiontrack' => array ( 'settings' => array ( 'enable' => '1') ) ) );

$params = array(
    'api_user'  => $user,
    'api_key'   => $pass,
    'x-smtpapi' => json_encode($json_string),
    'to'        => 'info@colabeo.com',
    'subject'   => $subject,
    'html'      => $name.": ".$message,
    'text'      => $message,
    'from'      => $email,
  );


$request =  $url.'api/mail.send.json';


$data = http_build_query($params);
  $options =
      array("http"=>
        array(
          "method" => "POST",
          "content" => $data,
        )
      );
 
$context = stream_context_create($options);
$result = file_get_contents($request, false, $context);






?>