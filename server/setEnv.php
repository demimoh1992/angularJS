<?php
$path = '/local-html/cm0665-assignment/server';
set_include_path(get_include_path() . PATH_SEPARATOR . $path);

// turn on all possible errors
error_reporting(-1);
// display errors, should be value of 0, in a production system of course
ini_set("display_errors", 1);

?>