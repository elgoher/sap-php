<?php

    /*aqui se define la direccion de el archivo WSDL que nos permitira conectarnos con el web service creado en SAP, la url debe provenir de la opcion Open WSDL document for selected binding or service en el SOAMANAGER en la Web Service Configuration y solo se cambia el segundo valor en la siguiente instruccion*/

    define("WSDL", "http://corgsrvsap01.datacenter.local:8000/sap/bc/srt/wsdl/bndg_00215AD9DE241ED3B99BD5D659FA9422/soap12/wsdl11/allinone/standard/document?sap-client=200");

?>
