<?php
session_start();
$timeout = 600; // Number of seconds until it times out.
// Check if the timeout field exists.
if(isset($_SESSION['timeout'])){
    // See if the number of seconds since the last
    // visit is larger than the timeout period.
    $duration = time() - (int)$_SESSION['timeout'];
    if($duration > $timeout) {
        // Destroy the session and restart it.
        $_SESSION=array();
        session_regenerate_id(); 
        session_destroy();
        session_start();
        echo '0';
    }else{
        echo '1';
    }
}
// Update the timout field with the current time.
$_SESSION['timeout'] = time();
?>