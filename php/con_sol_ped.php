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
        
        $param = array ( 'TypeConsul' => 1 );
        $result = $client->ZmmMovGetdoc($param);
        echo $result->Jsoncab.'&&'.$result->Jsonpos;
        unset($client);        
    }
    catch (SoapFault $exception)
    {
    # codigos de Errores de SOAPCLIENT 
    # WSDL => error de autenticacion
    # Client => error de parametrizacion a nivel de programcion (si le falta algo al constructor de SoapClient )
    # HTTP => error de conexion con el servidor
    if($exception->faultcode == "soap-env:Server"){
        $jsonerr = "{\"DATA\":[{\"PREQ_NO\":\"No es posible determinar ningun grupo de liberacion\",\"DOC_TYPE\":\"soap-env:Server\",\"DOC_CAT\":\" \",\"PROC_STAT\":\" \",\"CREATE_IND\":\" \",\"REL_IND\":\" \",\"REL_STRAT\":\" \",\"PUR_GROUP\":\" \",\"PUR_NAME\":\" \",\"GENERAL_RELEASE\":\" \",\"CREATED_BY\":\" \",\"CH_ON\":\" \",\"PREQ_NAME\":\" \",\"PLANT\":\" \",\"NAME_WERKS\":\" \",\"STORE_LOC\":\" \",\"LGOBE\":\" \",\"PREQ_DATE\":\" \",\"DELIV_DATE\":\" \",\"SUBJ_TO_R\":\" \",\"CURRENCY\":\" \",\"RLWRT\":0}]}";
	echo $jsonerr.'&&'.$jsonerr;
    }else{
        echo 'Detalle: '.$exception->getMessage().'<br/>Codigo: '.$exception->faultcode;
        die();
    }
    }  
  }
?>

