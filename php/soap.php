<?php
    session_start();
    include_once('WSDL.php');
    
    //se inicia a la configuracion para conectarse a SAP
    $user= $_POST['User'];
    $password= $_POST['Pass'];
    #se definen las autentificaciones
    
    $SOAP_AUTH = array( 'login'    => $user,
                        'password' => $password);

  #se especifica la ruta del archivo WSDL , este es web service ZWS_MM_APROMOVIL
    
   $WSDL = WSDL;
    
    #opcion b si no cargue el  WSDL desde el servidor
    #$WSDL = "../document.WSDL";*/
    
 try
    {
    #Se crea el objeto cliente SOAP, se le envian el WSDL y la autorizacion
    $client = new SoapClient($WSDL,$SOAP_AUTH);

    #se guardan datos en sesion
    $_SESSION['id_user'] = $user;
    $_SESSION['soap']  = $SOAP_AUTH;
    $_SESSION['wsdl']  = $WSDL;
    $_SESSION['timeout'] = time();
    $result = $client->ZValUserMov();
    if(strcasecmp($result->User, $user) == 0){
	unset($client);    
        echo 'login';
     }else{
	  echo "Error de autenticacion verifique sus datos ".var_dump($result);
          die();
	}       
    }
    catch (SoapFault $exception)
    {
        # codigos de Errores de SOAPCLIENT 
        # WSDL => error de autenticacion o de conexion
        # Client => error de parametrizacion a nivel de programcion (si le falta algo al constructor de SoapClient )
        # HTTP => error de conexion con el servidor
        
       if($exception->faultcode == "WSDL" ){
             echo "Error de conexion, vuelva a intentar mas tarde<br/>Codigo: ".$exception->faultcode;
             die();
        }else{
          if($exception->faultcode == "HTTP" && $exception->getMessage() == "Unauthorized"){
	     echo "Error de autenticacion verifique sus datos. Detalle: ".$exception->getMessage();
             die();
		}else{
            echo 'Detalle: '.$exception->getMessage().'<br/>Codigo: '.$exception->faultcode;
            die();
	}
        }
    }
?>
