<?php
    session_start();
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="viewport" content="height=device-height, initial-scale=1">
        <meta name="author" content="Eliu Gonzalez Hernandez - eliu.co">
        <link rel="icon" type="image/ico" href="../img/favicon.ico"/>
        <link rel="stylesheet" href="../css/bootstrap.min.css">
        <link rel="stylesheet" href="../css/style.css">
	      <script src="../js/modernizr.js"></script>
        <script src="../js/prefixfree.min.js"></script>
        <script src="../js/jquery-1.9.1.js"></script>
        <script src="../js/jquery.dataTables.js"></script>
        <script src="../js/TableTools.js"></script>
        <script src="../js/util.js"></script>
        <title>main</title>
    </head>
    <body>
          <?php
            //se valida la sesion 
            if(isset($_SESSION['id_user']) && !empty($_SESSION['id_user'])){
               //se sacan las variables de sesion
                $user = $_SESSION['id_user'];                
        ?>
        <header>
        <img src="../img/logo50.png" class="img-responsive" alt="Consultoria Organizacional">
        <h4>Liberacion de Documentos de Compras</h4>
      
         <h4><span>Bienvenido </span><?php echo $user; ?></h4>
        </header>
        <nav>
            <ul>
                <li><a href="" onclick="con_ped_cab(event);">Consultar Pedidos</a></li>
                <li><a href="" onclick="con_sol_ped(event);">Consultar Solicitudes de Pedidos</a></li>                
                <li><a href="" onclick="cerrarSesion(event);">Cerrar Sesion</a></li>
            </ul>
        </nav>        
        <table class="table-bordered" id="ped"></table>      
        <table class="table-bordered" id="sol_ped"></table>
        <?php 
          }else{
              $mensaje = 'showMessage(\'L\', \'#update\', \'Usted no ha iniciado sesion, sera redirigido a la pagina de iniciar sesion\', true, \'error\');';
               echo '<script>';
               echo '$(document).ready(function () {';
               echo $mensaje;           
               echo ' setTimeout(function () { location.href = \'../index.html\'; }, 3000);';
               echo '});';
               echo '</script>';
         }?> 
        <div id="update"></div>
        <footer>
           <div class="sticky-footer">
		<p>&copy;2014 Consultoria Organizacional S.A.S</p>
           </div>
        </footer>  
    </body>
</html>
