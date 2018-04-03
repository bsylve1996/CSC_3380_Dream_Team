
<html>
<head>
<title>Login with Google and Facebook</title>
<meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
    <link rl="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <script src ="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<style type="text/css">
h1{ font-family:Arial, Helvetica, sans-serif;
    color:63b0e6;
    }
h8{
    font-family:Arial, Helvetica, sans-serif;
    color:63b0e6;
    font-size: 1.5em;
    padding: 30%;
}
p{
   font-family:Arial, Helvetica,sans-serif;
    color:63b0e6; 
    font-size: 1.17em;
}
body{
    background:#071a44;
}
.navbar{
        background-color: #071a44;
        color: #4d0066;
        padding: 5% 0;
        font-size: 1.2em;
        height:70px;
}
.container{
    padding-left: 25%;
}
.container1{
    height:25%;
    width: 70%;
    background-color: #a068b1;
    margin-bottom: 10px;
    padding: 5px 5px 5px 5px;
}
.container2{
    height:15%;
    width: 70%;
    background-color: #a068b1;
    padding: 5px 5px 5px 5px;
    margin-bottom: 5px;
}
.content1{
    height:100%;
    width: 100%;
    background: #230741;
    padding: 5% 5% 5% 5%;
}
.content2{
    height:100%;
    width: 100%;
    background: #230741;
    padding:0% 10% 10% 10%;
}
</style>
</head>
<body>
  <div class = "navbar">
      <h1 align="Center"> Welcome To Schedulr </h1>
  </div>
  <div class="container">
      <div class="container1">
        <div class="content1">
            <p>Schedulr is a web application designed by students for students. Its ourpose is to make scheduling meetings and events easier by selecting the best time for everyone to meet.</p>
        </div>
      </div>
      <div class="container2">
          <div class="content2">
           <h8>Schedulr</h8>
               <p> Please choose a sign in option: </p>
          </div>
      </div>
  </div>
  <div class="container-fluid">
    <div class="col-xs-12 col-md-8">
            <?php
            include_once 'google.php';
            ?>
             <?php echo $output; ?></div> 
    <div class="col-xs-6 col-md-4">
        <?php
        include_once 'facebook.php';
        ?>
         <?php echo $output; ?></div>
</body>
</html>
