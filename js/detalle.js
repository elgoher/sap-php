var json, tabla, detalle, linea, total_menge=0, total_brtwr=0, total_netwr=0;
/*
    1. load
    funcion que carga los datos de sol ped/ped selecionado para ver el detalle 
*/
function load(){
        json = window.opener.detalle;
        tabla = $('#detalle');
        try{
        detalle = window.opener.tipo_detalle.split("&&");
     switch (detalle[0]) {
            //Pedido
         case 'ped':
             linea = '<thead><tr><th>Posicion</th><th>Solicitante</th><th>Resumen</th><th>Cantidad</th><th>Valor Bruto</th><th>Valor Neto</th></tr></thead>';
             tabla.append(linea);
             linea = '<tfoot><tr><td colspan=\"3\"><b>Totales</b></td><td><b id=\"C\">C</b></td><td><b id=\"VB\">VB</b></td><td><b id=\"VN\">VN</b></td></tr></tfoot>';
             tabla.append(linea);
              $.each(json['DATA'],function(index,data){
                linea = $('<tr></tr>');
                linea.append(
                    $('<td></td>').html(data['EBELP'])//posicion
                    );
                  if(data['AFNAM'].length>0){
                      linea.append(
                        $('<td></td>').html(data['AFNAM'])//solicitante
                        );
                    }else{
                         linea.append(
                        $('<td></td>').html('N/A')//solicitante
                        );
                     }
                linea.append(
                    $('<td></td>').html(data['TXZ01'])//texto breve
                    );
                linea.append(
                    $('<td></td>').html(data['MENGE'])//cantidad
                    );
                  total_menge = total_menge + data['MENGE'];//sumatoria cantidad
                linea.append(
                    $('<td></td>').html(data['BRTWR'])//valor bruto
                    );
                  total_brtwr = total_brtwr + data['BRTWR'];//sumatoria valor bruto
                linea.append(
                    $('<td></td>').html(data['NETWR'])//valor neto
                    );
                  total_netwr = total_netwr + data['NETWR'];//sumatoria valor neto
                tabla.append(linea);
        });
        tabla.children('tfoot').children('tr').children('td').children('b#C').html(total_menge);//sumatoria cantidad
        tabla.children('tfoot').children('tr').children('td').children('b#VB').html(total_brtwr);//sumatoria valor bruto
        tabla.children('tfoot').children('tr').children('td').children('b#VN').html(total_netwr);//sumatoria valor neto
        $('#update').html('<button class=\"btn btn-primary\" onclick=\"Liberar_single(\'ped\');\">Liberar</button>');
        $('#update').append('<button class=\"btn btn-primary\" onclick=\"Rechazar_single(\'ped\');\">Rechazar</button>');
        $('#update').append('<button class=\"btn btn-primary\" onclick=\"javascript:window.close();\">Volver</button>');
        $('<span>Posiciones: </span><b>'+json['DATA'].length+'</b>').prependTo($('body'));
        $('<span>Pedido: <b>'+detalle[1].bold()+'</b></span>').prependTo($('body'));
        break; 
        //Solicitud de pedido
        case 'sol_ped':
              linea = '<thead><tr><th>Posicion</th><th>Solicitante</th><th>Resumen</th><th>Cantidad</th><th>Valor</th><th>Moneda</th><th>Grp. Compra</th></tr></thead>';
             tabla.append(linea);
             linea = '<tfoot><tr><td colspan=\"3\"><b>Totales</b></td><td><b id=\"C\">C</b></td><td><b id=\"VT\">VT</b></td><td id=\"espacio\" colspan=\"2\"></td></tr></tfoot>';
             tabla.append(linea);
              $.each(json['DATA'],function(index,data){
                linea = $('<tr></tr>');
                linea.append(
                    $('<td></td>').html(data['PREQ_ITEM'])//posicion
                    );
                  if(data['PREQ_NAME'].length>0){
                      linea.append(
                        $('<td></td>').html(data['PREQ_NAME'])//solicitante
                        );
                    }else{
                         linea.append(
                        $('<td></td>').html('N/A')//solicitante
                        );
                     }
                linea.append(
                    $('<td></td>').html(data['SHORT_TEXT'])//texto breve
                    );
                linea.append(
                    $('<td></td>').html(data['QUANTITY'])//cantidad
                    );
                  total_menge = total_menge + data['QUANTITY'];//sumatoria cantidad
                linea.append(
                    $('<td></td>').html(data['C_AMT_BAPI'])//valor
                    );
                  total_brtwr = total_brtwr + data['C_AMT_BAPI'];//sumatoria valor
                linea.append(
                    $('<td></td>').html(data['CURRENCY'])//moneda
                    );
            linea.append(
                    $('<td></td>').html(data['PUR_NAME'])//grupo de compra
                    );
                tabla.append(linea);
        });
        tabla.children('tfoot').children('tr').children('td').children('b#C').html(total_menge);
        tabla.children('tfoot').children('tr').children('td').children('b#VT').html(total_brtwr);
        $('#update').html('<button class=\"btn btn-primary\" onclick=\"Liberar_single(\'sol_ped\');\">Liberar</button>');
        $('#update').append('<button class=\"btn btn-primary\" onclick=\"Rechazar_single(\'sol_ped\');\">Rechazar</button>');
        $('#update').append('<button class=\"btn btn-primary\" onclick=\"javascript:window.close();\">Volver</button>');
        $('<span>Posiciones: </span><b>'+json['DATA'].length+'</b>').prependTo($('body'));
        $('<span>Solicitud de Pedido: <b>'+detalle[1].bold()+'</b></span>').prependTo($('body'));
        break;
      }
    }catch(err){
        console.log(detalle);
        showMessage('E', '#update', 'Opps se ha producido un error en el servidor intente mas tarde. '+err.autoprefixer+' '+err.message, true, "error");
            }
}
/*
    1. Rechazar_single
    funcion para rechazar la sol ped/ped selecionado en el detalle
*/
function Rechazar_single(type){
     var tipo_lib, json_lib = {DATA :[]};
    var text = 'Esta seguro que desea rechazar el registro: '+detalle[1]+'? Revise su seleccion antes rechazar';
    if(confirm(text)){
         if(type === 'ped'){
            tipo_lib = 4;
             window.opener.Json_ped.DATA.push({"NUMERO": detalle[1]});
             json_lib =  window.opener.Json_ped;
             json_lib = JSON.stringify(json_lib);
             window.opener.Json_ped = {DATA :[]};    
        }else{
            tipo_lib = 3;
            $.each(json.DATA,function(index,data){
                json_lib.DATA.push({"NUMERO": data['PREQ_NO'] , "POSICION": data['PREQ_ITEM']});
            });
            json_lib = JSON.stringify(json_lib);
        }
         $.ajax({
            url: "liberar.php",
            type: "POST",
            cache: false,
            data: {
                json: json_lib,
                tipo: tipo_lib
            },
            beforeSend: function () {
                console.log('empezando proceso');
                tabla.empty();
                tabla.toggle(false);
                $('#update').empty();
                $('#update').toggle(false);
                showMessage('L', '#update', "<img src=\"../img/ajax-loader.gif\" alt=\"Verificando con el servidor\">", true, "definir");
            },
        success: function (mensaje) {
           try{
                var json = $.parseJSON(mensaje);
                 $('#update').css( "display", "block");
                 listar(json.DATA);
                 $('#update').append('<button class=\"btn btn-primary\" onclick=\"javascript:window.close();\">Volver</button>');
               if(type === 'ped'){
                   window.opener.con_ped_cab(event);
               }else{
                   window.opener.con_sol_ped(event);
               }
            }catch(err){
            console.log(mensaje);
            showMessage('E', '#update', 'Liberar: Opps! se ha producido un error en el servidor intente mas tarde.'+err.message, true, 'error');
        }
            },//fin success
            error: function (xhr, status, error) {   
              console.log('desde liberar: '+xhr.responseText);
            }   
        });//fin ajax 
        
    }
}
/*
    3. Liberar_single
    funcion para liberar la sol ped/ped selecionado en el detalle
*/
function Liberar_single(type){
    var tipo_lib, json_lib = {DATA :[]};
    var text = 'Esta seguro que desea liberar el registro: '+detalle[1]+'? Revise su seleccion antes liberar';
    if(confirm(text)){
        if(type === 'ped'){
            tipo_lib = 2;
             window.opener.Json_ped.DATA.push({"NUMERO": detalle[1]});
             json_lib =  window.opener.Json_ped;
             json_lib = JSON.stringify(json_lib);
             window.opener.Json_ped = {DATA :[]};    
        }else{
            tipo_lib = 1;
            $.each(json.DATA,function(index,data){
                json_lib.DATA.push({"NUMERO": data['PREQ_NO'] , "POSICION": data['PREQ_ITEM']});
            });
            json_lib = JSON.stringify(json_lib);
        }
        $.ajax({
            url: "liberar.php",
            type: "POST",
            cache: false,
            data: {
                json: json_lib,
                tipo: tipo_lib
            },
            beforeSend: function () {
                console.log('empezando proceso');
                tabla.empty();
                tabla.toggle(false);
                $('#update').empty();
                $('#update').toggle(false);
                showMessage('L', '#update', "<img src=\"../img/ajax-loader.gif\" alt=\"Verificando con el servidor\">", true, "definir");
            },
        success: function (mensaje) {
           try{
                var json = $.parseJSON(mensaje);
                 $('#update').css( "display", "block");
                if(tipo_lib == 1){
                //metodo burbuja para eliminar duplicados
                  var items = {DATA : []};
                  var mensajes = {DATA : []};

                  $.each(json.DATA, function(index, value) {
                     if(items.DATA.length == 0){
                         items.DATA.push(value.NUMERO);
                         mensajes.DATA.push(value.MESSAGE);
                     }
                    if ($.inArray(value.NUMERO, items.DATA)==-1) {
                        items.DATA.push(value.NUMERO);
                        mensajes.DATA.push(value.MESSAGE);
                    }
                   });   
                 listar(mensajes.DATA);
                }else{
                 listar(json.DATA);
                }
               $('#update').append('<button class=\"btn btn-primary\" onclick=\"javascript:window.close();\">Volver</button>');
if(type === 'ped'){
                   window.opener.con_ped_cab(event);
               }else{
                   window.opener.con_sol_ped(event);
               }
            }catch(err){
            console.log(mensaje);
            showMessage('E', '#update', 'Liberar: Opps! se ha producido un error en el servidor intente mas tarde.'+err.message, true, 'error');
        }
            },//fin success
            error: function (xhr, status, error) {   
              console.log('desde liberar: '+xhr.responseText);
            }   
        });//fin ajax 
       
    }
}

$(document).ready(function(){ load(); });
