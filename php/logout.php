<?php 
session_start();
if (isset($_SESSION['id_user'])||!empty($_SESSION['id_user'])) {
    
    session_unset();
    session_destroy();
    
    echo "logout";
}
else {
	echo "error";
}
?>