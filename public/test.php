<?php

date_default_timezone_set("America/New_York");

$string_date = date('G');
$date = intval( $string_date );

$day = date('D');

if($day == 'Fri') {
	if($date < 12) {
		$color = 'l';
	} else if($date >= 12 && $date < 18) {
		$color = 'yellow';
	} else {
		$color = 'magenta';
	}
} else {
	if($date < 12) {
		$color = 'red';
	} else if($date >= 12 && $date < 18) {
		$color = 'green';
	} else {
		$color = 'blue';
	}
}



include 'testb.php';
?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title></title>
  <meta name="description" content="">
</head>
<body style="background-color: <?php echo $color; ?>">
	<h1><?php echo $date; ?></h1>
</body>
</html>
