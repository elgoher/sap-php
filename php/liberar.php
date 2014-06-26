<?php 
  session_start();
  
  if(isset($_SESSION['id_user']) && !empty($_SESSION['id_user'])){
   try{
       //se sacan las variables de sesion
       
       $WSDL = $_SESSION['wsdl'];
       $SOAP_AUTH = $_SESSION['soap'];

       //se hace la conxion a sap
       $client = new SoapClient($WSDL,$SOAP_AUTH);
        
       /*
       codigo para tipos de consulta
       1 = solicitudes de pedido
       2 = pedidos
       */
        
       $tipo_lib = $_POST['tipo'];
       $json = $_POST['json'];
               
       $param = array (  'Json' => $json,
                          'TypeConsul' => $tipo_lib        
                        );
       $result = $client->ZmmDocRelease($param);
       echo $result->Resu;

       unset($client);       
    }catch(SoapFault $exception){
    # codigos de Errores de SOAPCLIENT 
    # WSDL => error de autenticacion
    # Client => error de parametrizacion a nivel de programcion (si le falta algo al constructor de SoapClient )
    # HTTP => error de conexion con el servidor

    echo 'Detalle: '.$exception->getMessage().'<br/>Codigo: '.$exception->faultcode;
    die();
    }  
  }
?>
