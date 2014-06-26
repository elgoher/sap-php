/*
    1. variables globales
*/
var flag = false; //para saber si se cambio de consulta
var Json_ped = {DATA : []};//json con las cabeceras de pedidos consultados de SAP
var Json_ped_pos;//json con las posiciones de pedidos consultados de SAP
var Json_sol_ped = {DATA : []};//json con las cabeceras de solicitudes de pedidos consultados de SAP
var Json_sol_ped_pos;//json con las posiciones de solicitudes de pedidos consultados de SAP
var Json_sol_ped_pos_lib = {DATA : []}; //json con las posiciones de solicitudes de pedidos a liberar
var detalle, tipo_detalle;//variables para se muestra el de detalle de una sol ped o ped
var array_pag = new Array();//array con las total de paginas y verificacion de cuales estan ckecked
var pag_active;

/*
    2. val_flag
    funcion para limpiar las variables globales y tablas para cuando se vuelven a llamar desde el link
*/
function val_flag() {
       if (flag) {
        pag_active = 0;
        Json_ped = {DATA : []};
        Json_ped_pos = {DATA : []};
        Json_sol_ped = {DATA : []};
        Json_sol_ped_pos = {DATA : []};
        Json_sol_ped_pos_lib = {DATA : []};   
        array_pag = new Array();
        $('#sol_ped').empty();
        $('#ped').empty();
        $('#update').empty();
        $('#ped_wrapper').toggle(false);
        $('#sol_ped_wrapper').toggle(false);
       }
}
/*
    3. val_ie
    funcion validar si es esta usando ie y no usar preventDefault
*/
function val_ie(event){
    if (event.preventDefault) { 
        event.preventDefault();
   }else{
        event.returnValue = false;
   }
}
/*
    4. make_table
    funcion para inicializar la data table - recibe el id de la tabla a  construir
*/
function make_table(tabla){
    $(tabla).dataTable({
            "bDestroy": true,
            "sPaginationType": "full_numbers",           
            "oLanguage": {
                "sProcessing":     "Procesando...",
                "sLengthMenu":     "Mostrar _MENU_ registros",
                "sZeroRecords":    "No se encontraron resultados",
                "sEmptyTable":     "Ningun dato disponible en esta tabla",
                "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
                "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
                "sInfoPostFix":    "",
                "sSearch":         "Buscar:",
                "sUrl":            "",
                "sInfoThousands":  ",",
                "sLoadingRecords": "Cargando...",
                "oPaginate": {
                    "sFirst":    "Primero",
                    "sLast":     "Ultimo",
                    "sNext":     "Siguiente",
                    "sPrevious": "Anterior"
                },
                "oAria": {
                    "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
                    "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                    }
                }
     });//fin data table
}
/*
    5. showMessage
    para configurar mensaje con boton y muestra o oculta el div que se le envie 
*/
function showMessage(type, div, text, ShowOrHide, estilo) {
    $(div).removeClass();
    $(div).empty();
    $(div).removeAttr('style');
    switch (type) {
            case 'E': //un div con mensaje y botton para cerrar el div
              var html = "<button type=\"button\" class=\"close\" onclick=\"showMessage(\'S\', \'$\', \'\',false ,\'definir\');\">X</button>";
              html = html.replace("$", div);
              $(div).html(text + html);
              $(div).addClass(estilo);
              $(div).toggle(ShowOrHide);
              break;
            case 'L': //solo oculta o muestra el div con codigo html que puede ser una img o otra etiqueta se manda por text
              $(div).html(text);
              $(div).addClass(estilo);
              $(div).toggle(ShowOrHide);
              break;
            case 'S': //solo oculta o muestra el div
              $(div).addClass(estilo);
              $(div).toggle(ShowOrHide);
              break;
           /* default:
              code to be executed if n is different from case 1 and 2 */
      }
}

/*    6. iniciarSesion
    funcion para iniciar Sesion 
*/
function iniciarSesion(event) {
    var u3r, pA$;
    u3r = $('input:text').val();
    pA$ = $('input:password').val();
    if (u3r.length > 0 && pA$.length > 0) {
       try{
        val_ie(event);        
         $.ajax({        
            url: "php/soap.php",
            type: "POST",
            cache: false,
	        data: {
                User: u3r,
                Pass: pA$
            },             
            beforeSend: function () {
                showMessage('L', '#update', "<img src=\"img/ajax-loader.gif\" alt=\"Verificando con el servidor\">", true, "message");
            },                     
            success: function (mensaje) {
		      console.log(mensaje);                
                if (mensaje === 'login') {                    
                    //showMessage('E', '#update', mensaje, true);
                    location.href='./php/main.php';                    
                } else {                    
                    showMessage('E', '#update', mensaje, true, "message");
                }
            },             
            error: function (mensaje) {
                showMessage('E', '#update', 'Error: No se ha podido establecer comunicacion con el servidor intente mas tarde'+mensaje, true, "error");             
           }                   
        });
        }catch(err){
            showMessage('E', '#update', "Catch: No se ha podido establecer comunicacion con el servidor intente mas tarde"+err.message, true, "error");
        }
    } 
}
/*
    7. cerrarSesion
    funcion para cerrar Sesion 
*/
function cerrarSesion(event){
    val_ie(event);
    $.ajax({
        url: "logout.php",
        type: "POST",
        cache: false,
        success: function (mensaje) {
            if (mensaje === 'logout'){
               location.href = '../index.html';
            }
            else{
             showMessage('E', '#update','else: cerrar sesion:'+mensaje, true, "message");
            }
        },
        error: function (xhr, status, error) { 
             console.log('sesion:'+error.name+' '+error.message+' Status:'+status);
        }        
    });
}
/*
    8. cerrarSesion
    funcion para validar Sesion 
*/
function val_sesion(event){
     $.ajax({
        url: 'timeout.php',
        type: "POST",
        cache: false,
        success: function (mensaje){
         if(mensaje === '0'){
            event.stopImmediatePropagation();
            val_flag();
             if(document.title === 'detallle'){
                window.opener.close();
                alert('Su sesion ha expirado, sera redirigido a la pagina de iniciar sesion');
                location.href = '../index.html';
             }else{
                alert('Su sesion ha expirado, sera redirigido a la pagina de iniciar sesion');
                location.href = '../index.html';
             }
            return false;
         }
        },
        error: function (xhr, status, error) { 
           console.log('desde val session: '+xhr.responseText);
            return false;
        }    
    });
}
/*
    9. listar
    funcion para mostrar en la vista liberaciones o los items que se chequean 
*/
function listar(data){
    var lista = $('<ul></ul>');
    var li;
    var div = $('#update');
    var flag_ped = false, flag_sol_ped = false;
    div.empty();
    div.removeClass();
    div.toggle(true);   
    $.each(data, function(index, obj){
        if(obj['POSICION'] && !(obj['MESSAGE']) && (obj['NUMERO'])){
              li = $('<li></li>');
               li.html('<b>Sol. Pedido: </b>'+obj['NUMERO']);// Solicitud de pedido  
               lista.append(li);
               div.addClass('lista_sol');
               flag_sol_ped = true;
            }else{
                if(obj['NUMERO'] && !(obj['MESSAGE']) && !(obj['POSICION'])){
                  li = $('<li></li>');
                  li.html('<b>Pedido: </b>'+obj['NUMERO']);// Pedidos                 
                  lista.append(li);
                  div.addClass('lista_ped');
                  flag_ped = true;  
                }else{
                    if(obj['POSICION'] && obj['MESSAGE'] && obj['NUMERO']){
                    li = $('<li></li>');
                    li.html('<b>Mensaje: </b>'+obj.MESSAGE);//este es el mensaje cuando se libera/rechaza pedidos
                    lista.append(li);
                    div.addClass('lista_mensaje');
                    }else{
                    li = $('<li></li>');
                    li.html('<b>Mensaje: </b>'+obj);//este es el mensaje cuando se libera solicitudes de pedidos
                    lista.append(li);
                    div.addClass('lista_mensaje');
                    }
                }
            }
    });
    if(flag_ped) $('<b>'+data.length+'</b><span> Pedidos Seleccionados</span>').prependTo(div);
    if(flag_sol_ped) $('<b>'+data.length+'</b><span> Sol. Pedidos Seleccionados</span>').prependTo(div);
    div.append(lista);
}
/*
    10. Rechazar
    funcion para Rechazar pedidos o solicitudes de pedido
*/
function Rechazar(type){
    val_sesion(this);
    var tipo_rechazo, json, elementos;
    if(type === 'ped' ){ elementos = Json_ped.DATA.length ;}else{ elementos = Json_sol_ped.DATA.length;}
    var text = 'Esta seguro que desea Rechazar los '+elementos+' registros seleccionados?. Revise su seleccion antes de Rechazar';
    if(confirm(text)){
        if(type === 'ped' ){
            tipo_rechazo = 4;
            json = JSON.stringify(Json_ped);
            console.log('pedido');
            if($.isEmptyObject(Json_ped.DATA)){
                val_flag();
                showMessage('E', '#update', 'Rechazar Ped: No ha seleccionado ningun Pedido.', true, 'error');
                return false;
            }
        }else{
            tipo_rechazo = 3;
            json = JSON.stringify(Json_sol_ped_pos_lib);
            console.log('solicitud pedido');
            if($.isEmptyObject(Json_sol_ped_pos_lib.DATA)){
                val_flag();
                showMessage('E', '#update', 'Rechazar Sol Ped: No ha seleccionado ninguna Solicitud.', true, 'error');
                return false;
            }
        }
         $.ajax({
            url: "liberar.php",
            type: "POST",
            cache: false,
            data: {
                json: json,
                tipo: tipo_rechazo
            },
            beforeSend: function () {
                console.log('empezando proceso');
                val_flag();
                showMessage('L', '#update', "<img src=\"../img/ajax-loader.gif\" alt=\"Verificando con el servidor\">", true, "definir");
            },
            success: function (mensaje) {
            try{
                var json = $.parseJSON(mensaje);
                listar(json.DATA);
            }catch(err){
                val_flag(); 
                console.log(mensaje);
                showMessage('E', '#update', 'Rechazar: Opps! se ha producido un error en el servidor intente mas tarde.'+err.message, true, 'error');
             }
            },//fin success
            error: function (xhr, status, error) {
              val_flag();    
              console.log('desde liberar: '+xhr.responseText);
            }   
        }); //fin ajax
    }
}
    

/*
    11. liberar
    funcion para liberar pedidos o solicitudes de pedido
*/
function liberar(type){
    val_sesion(this);
    var tipo_lib, json, elementos;
    if(type === 'ped' ){ elementos = Json_ped.DATA.length ;}else{ elementos = Json_sol_ped.DATA.length;}
    var text = 'Esta seguro que desea liberar los '+elementos+' registros seleccionados?. Revise su seleccion antes de liberar';
    if(confirm(text)){
        if(type === 'ped' ){
            tipo_lib = 2;
            json = JSON.stringify(Json_ped);
            console.log('pedido');
            if($.isEmptyObject(Json_ped.DATA)){
                val_flag();
                showMessage('E', '#update', 'Liberar Ped: No ha seleccionado ningun Pedido.', true, 'error');
                return false;
            }
        }else{
            tipo_lib = 1;
            json = JSON.stringify(Json_sol_ped_pos_lib);
            console.log('solicitud pedido');
            if($.isEmptyObject(Json_sol_ped_pos_lib.DATA)){
                val_flag();
                showMessage('E', '#update', 'Liberar Sol Ped: No ha seleccionado ninguna Solicitud.', true, 'error');
                return false;
            }
        }
        $.ajax({
            url: "liberar.php",
            type: "POST",
            cache: false,
            data: {
                json: json,
                tipo: tipo_lib
            },
            beforeSend: function () {
                console.log('empezando proceso');
                val_flag();
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
            }catch(err){
                val_flag(); 
                console.log(mensaje);
                showMessage('E', '#update', 'Liberar: Opps! se ha producido un error en el servidor intente mas tarde.'+err.message, true, 'error');
             }
            },//fin success
            error: function (xhr, status, error) {
              val_flag();    
              console.log('desde liberar: '+xhr.responseText);
            }  //fin error 
        }); //fin ajax
     }
   }
/*
    12. RemovePed
    funcion para quitar el pidido de la lista de liberacion 
*/
function RemovePed(array, property, value) {
 var numero, result, i;
   $.each(array, function(index){
     result = array[index];
     switch (result[property]) {
        case value:
            i = index;
            return false;
         break;    
      }  
   });
  array.splice(i,1);//quitar del json
}
/*
    13. RemoveSol
    funcion para quitar la solicitud de la lista de liberacion 
*/
function RemoveSol(array, property, value){
    var pos=[], result;  
   $.each(array, function(index,data){
       if(data.NUMERO === value){
           pos.push(index);           
       }
    });
    result = $.grep(array, function(n, i) {
        return $.inArray(i, pos) ==-1;
    });
    
    Json_sol_ped_pos_lib = {DATA : []};
    $.each(result, function(index, data){
       Json_sol_ped_pos_lib.DATA.push(data); 
    });
}
/*
    14. removeStyle
    funcion para quitar los estilos inline de las tablas
*/
function removeStyle(tabla){
 tabla.removeAttr('style');
 var th = tabla.children('thead').children('tr').children('th');//para quitar los estilos de los th
    $.each(th,function(index, child){
            $(child).removeAttr('style');
            $(child).removeAttr('aria-label');
            $(child).removeAttr('aria-controls');
            $(child).removeAttr('aria-sort');
        });
}
/*
    15. agrupar
    funcion para agrupar los ped o sol_ped a la lista de liberacion
*/
function agrupar(type,cod){
 var id = $('#'+cod);
 switch (type) {
    case 'ped':
         if(id.is(':checked')){ 
            Json_ped.DATA.push( {"NUMERO": id.val()});
            listar(Json_ped.DATA);
         }else{
            RemovePed(Json_ped.DATA, "NUMERO", id.val());
            listar(Json_ped.DATA);
         }
    break;
    case 'sol_ped':
         var data = id.val();
         if(id.is(':checked')){
           Json_sol_ped.DATA.push({"NUMERO": data, "POSICION": 'X'});
           $.each(Json_sol_ped_pos.DATA, function(index, sol_ped_pos){
               if(data === sol_ped_pos['PREQ_NO']){
                   Json_sol_ped_pos_lib.DATA.push({"NUMERO": sol_ped_pos['PREQ_NO'] , "POSICION": sol_ped_pos['PREQ_ITEM']});
               }
           });
           listar(Json_sol_ped.DATA);
          }else{
           RemoveSol(Json_sol_ped_pos_lib.DATA, "NUMERO", data);
           RemovePed(Json_sol_ped.DATA, "NUMERO", data);    
           listar(Json_sol_ped.DATA);
          }
    break;     
 }
}
/*
    16. verDetalle
    funcion para ver el detalle de el ped o sol_ped
*/
function verDetalle(numero,tipo){
   var Json = {DATA :[]};
   val_ie(this);
   val_sesion(this);
    if(tipo === 'ped'){
    $.each(Json_ped_pos.DATA, function(index, data){
       if(numero === data['PO_NUMBER'] ){
           Json.DATA.push(data);
       }
     });
    }else{
     $.each(Json_sol_ped_pos.DATA, function(index, data){
         if(numero === data['PREQ_NO']){
             Json.DATA.push(data);
         }
     });
    }
    detalle = Json;
    tipo_detalle = tipo+"&&"+numero;
    window.open('detalle.html', '_blank');
}
/*
    17. chg_array_value
    se verifica en el array de las paginas para colocar que se seleccionaron todos los elementos de esa pagina
*/
function chg_array_value(paginas,value){
     $.each(paginas, function(index, pagina){
            if(pagina['className'] === 'paginate_active'){
              $.each(array_pag,function(index,obj_pag){
                  if(array_pag[index][0] === parseInt(pagina['innerHTML'])){
                    array_pag[index][1] = value;
                    console.log(array_pag[index][0]+" changing:"+value);
                    return true;
                  }
              });  
            }
        });   
}
/*
    18. sel_todo
    funcion selecciona todos los items de la tabla
*/
function sel_todo(tabla, id_check, event){
    event.stopImmediatePropagation();
    var checkboxs = $(tabla).children('tbody').children('tr').children('td').children('input');
    var paginas = $(tabla+'_wrapper').children('div'+tabla+'_paginate').children('span').children('a');
    if($(id_check).is(':checked')){
       //se verifica en el array de las paginas para colocar que se seleccionaron todos los elementos de esa pagina
        chg_array_value(paginas, true);
        //se chequean los checkbox y se agragan a la lista
        $.each(checkboxs, function(index, checkbox){
            if(!checkbox['checked']){
                checkbox['checked'] = true;
                agrupar(id_check.substring(5), checkbox['id']); 
            }
        });
    }else{
        chg_array_value(paginas,false);
        $.each(checkboxs, function(index, checkbox){
            checkbox['checked'] = false;
            agrupar(id_check.substring(5), checkbox['id']);
        });
    }
    
}
/*
    19. existe_pag
    funcion de validacion si la pagina existe en el array de paginas, sino existe se agrega al array de paginas
*/
function existe_pag(pag_active,tabla,sel_all){
    var exist;
    for (i = 0; i < array_pag.length; i++) { 
        if(array_pag[i][0] === parseInt(pag_active)){
          exist = true;
          break;    
        }else{
           exist = false;
        }
    }
    if(!exist){
        //en caso que la pagina no este en el array de paginas se agrega para tenerla en cuenta para validar si esta checked
        temp_array_pag = [];
        new_array_pag = [];

        paginas = $(tabla+'_wrapper').children('div'+tabla+'_paginate').children('span').children('a');
        $.each(paginas, function(index, pagina){
            new_array_pag.push(parseInt($(pagina).html()));
        });

        $.each(array_pag, function(index, data){
            temp_array_pag.push(parseInt(data[0]));
        });

        $.each(new_array_pag,function(index, pagina){
            if($.inArray(new_array_pag[index], temp_array_pag)==-1){
                array_pag.push([new_array_pag[index], false]);
                sel_all.attr('checked',false);		 
             }
        });
    }
}
/*
    20. chk_a
    funcion de validacion del checkbox de seleccionar todo cada ves que cambia de pagina
*/
function chk_a(tabla){
      var new_array_pag=new Array();
      var temp_array_pag=new Array();
      var index,i=0;
      var sel_all = $($(tabla).children('thead')[0]).children('tr').children('th').children('input');
      var paginas = $(tabla+'_wrapper').children('div'+tabla+'_paginate').children('span').children('a');
    
      if(paginas.length > 1){
        $.each(paginas,function(index,pagina){
             $(pagina).attr('onclick','chk_a(\''+tabla+'\')');
            });
      //se valida cada ves que se cambia de pagina para chequear o deschequar el check de selecionar todo
        $.each(paginas, function(index, pagina){
           if(pagina['className'] === 'paginate_active'){
               pag_active = pagina['innerHTML'];
           }
        });
        existe_pag(pag_active,tabla,sel_all);
        $.each(array_pag, function(index, pag){
            if(pag[0]==parseInt(pag_active)){
                if(pag[1]){
                    $.each(sel_all,function(index,data){
                        data['checked']=true;
                    });
                }else{
                    sel_all.attr('checked',false);
                }
            }
        });
    }else{
       console.log('hay una pagina');
    } 
}
/*
    21. con_ped_cab
    funcion que consulta los pedidos y los muestra en la tabla
*/
function con_ped_cab(event){
    var tabla,json,linea,arrayValores,paginas,paginadores;
    val_ie(event);
    val_flag();
    val_sesion(event);
    $.ajax({
        url: "con_ped.php",
        type: "POST",
        cache: false,
        beforeSend: function () {
            console.log('empezando proceso');
                showMessage('L', '#update', "<img src=\"../img/ajax-loader.gif\" alt=\"Verificando con el servidor\">", true, "definir");
        },//fin  beforeSend            
        complete: function () {
            console.log('proceso completo');
        },//fin complete        
        success: function(data){
            showMessage('S', '#update', "random", false, "sin-estilo");
            try{
            data = data.split('&&');
            json = $.parseJSON(data[0]);
            Json_ped_pos = $.parseJSON(data[1]);
            arrayValores = json['DATA'];
            tabla = $('#ped');         
            linea = '<thead><tr><th><input type=\'checkbox\' id="all_ped" onclick=\"sel_todo(\'#ped\', \'#all_ped\', event);\">  Lib.</th><th>Pedido</th><th>Respons.</th><th>Fecha</th><th>Valor</th><th>Moneda</th><th>Grp Compra</th><th>Proveedor</th><th>Detalle</th></tr><thead>'; 
            tabla.append(linea);
            $.each(arrayValores, function(index, data){                
                linea = $('<tr></tr>');                
                linea.append( $('<td></td>')
                      .html('<input type=\'checkbox\' value=\''+data['PO_NUMBER']+'\' id=\''+data['PO_NUMBER']+'\' onclick=\"agrupar(\'ped\',\''+data['PO_NUMBER']+'\');\">') // checkbox para escojer el pedido
                             );                
                linea.append( $('<td></td>')
                      .html(data['PO_NUMBER'] ) // numero pedido
                             );
                linea.append( $('<td></td>')
                      .html(data['CREATED_BY'].charAt(0).toUpperCase()+data['CREATED_BY'].substring(1).toLowerCase()) // responsable (creado por)
                             );
                 linea.append( $('<td></td>')
                      .html(data['DOC_DATE'] ) // fecha pedido
                             );
                 linea.append( $('<td></td>')
                      .html(data['VALOR_TOTAL'] ) // el valor total de pedido
                             );
                 linea.append( $('<td></td>')
                      .html(data['CURRENCY'] ) // moneda
                             );
                 linea.append( $('<td></td>')
                      .html(data['PUR_NAME'].charAt(0).toUpperCase()+data['PUR_NAME'].substring(1).toLowerCase()) // grupo de compra
                             );
                 linea.append( $('<td></td>')
                      .html(data['VEND_NAME'].charAt(0).toUpperCase()+data['VEND_NAME'].substring(1).toLowerCase()) // vendedor
                             );
                 linea.append( $('<td></td>')
                      .html( '<a href=\"#\" onclick=\"verDetalle(\''+data['PO_NUMBER']+'\', \'ped\');\">ver</>' ) //ver datalle
                             );
                tabla.append(linea);
            }); //fin each
            flag = true; //se lleno la data table
            make_table('#ped');
            removeStyle(tabla);
            //se seleccionan los links de las paginas y paginadores de la tabla
            paginas = $('#ped_wrapper').children('div#ped_paginate').children('span').children('a');
            paginadores = $('#ped_wrapper').children('div#ped_paginate').children('a');
            //se llena el array con las paginas que tenga la tabla y se les coloca el evento del click
            $.each(paginas, function(index, pagina){
               $(pagina).attr('onclick','chk_a(\'#ped\')');
                array_pag.push([parseInt($(pagina).html()), false]);               
            });
            //se les coloca el evento del click a los paginadores
            $.each(paginadores, function(index, paginador){
                $(paginador).attr('onclick','chk_a(\'#ped\')');
            });    
            $('#ped_wrapper').append($('<div></div>').html('<button class=\"btn btn-primary\" onclick=\"liberar(\'ped\');\">Liberar</button>').append('<button class=\"btn btn-primary\" onclick=\"Rechazar(\'ped\');\">Rechazar</button>'));
            $('#ped_wrapper').toggle(true);
            document.getElementById("all_ped").checked = false;
            }catch(err){
                console.log(data);
                showMessage('E', '#update', 'Opps se ha producido un error en el servidor intente mas tarde. '+err.message, true, "error");
            }
        },//fin success
        error: function (xhr, status, error) {
            console.log('desde consultar ped: '+xhr.responseText);
        }//fin error
    }); //fin ajax
}//fin funcion

/*
    22. con_ped_cab
    funcion que consulta las sol_ped y los muestra en la tabla
*/
function con_sol_ped(event){ 
var tabla,json,linea,arrayValores,paginas,paginadores;
  val_ie(event);
  val_flag();
  val_sesion(this);
  $.ajax({
        url: "con_sol_ped.php",        
        type: "POST",
        cache: false,
        beforeSend: function () {
            console.log('empezando proceso');
            showMessage('L', '#update', "<img src=\"../img/ajax-loader.gif\" alt=\"Verificando con el servidor\">", true, "definir");
            }, // fin beforeSend 
        complete: function () {
            console.log('ajax completo');
            },// fin complete
        success: function(data){
            showMessage('S', '#update', "random", false, "definir");
           try{
            data = data.split('&&');
            json = $.parseJSON(data[0]);
            Json_sol_ped_pos = $.parseJSON(data[1]);
            arrayValores = json['DATA'];        
            tabla = $('#sol_ped');
            linea = '<thead><tr><th><input type=\'checkbox\' id="all_sol_ped" onclick=\"sel_todo(\'#sol_ped\', \'#all_sol_ped\', event);\">  Lib.</th><th>Sol. Pedido</th><th>Respons.</th><th>Fecha</th><th>Valor</th><th>Moneda</th><th>Detalle</th><thead>';      
            tabla.append(linea);
            $.each(arrayValores, function(index, data){
                linea = $('<tr></tr>');
                linea.append( $('<td></td>')
                      .html('<input type=\'checkbox\' value=\''+data['PREQ_NO']+'\' id=\''+index+'\' onclick=\"agrupar(\'sol_ped\', \''+index+'\');\">') /* checkbox para escojer la solicitud de pedido*/                             );
                linea.append( $('<td></td>').html(data['PREQ_NO']) // NUMERO SOL PED
                             );
                linea.append( $('<td></td>').html(data['CREATED_BY'].charAt(0).toUpperCase()+data['CREATED_BY'].substring(1).toLowerCase()) // solicitante
                             );
                linea.append( $('<td></td>').html(data['PREQ_DATE'] ) // FECHA SOL PED
                             );
                linea.append( $('<td></td>').html(data['RLWRT'] ) // valor total sol ped
                             );
                linea.append( $('<td></td>').html(data['CURRENCY'] ) // valor total sol ped
                             );
                linea.append( $('<td></td>').html( '<a href=\"#\" onclick=\"verDetalle(\''+data['PREQ_NO']+'\', \'sol_ped\');\">ver</>' ) //ver datalle
                             );
                tabla.append(linea);
            }); //fin each
            flag = true; //se lleno la data table
            make_table('#sol_ped');//se construye la data table
            removeStyle(tabla);//se le quitan los estilos inline a la tabla
            //se seleccionan las paginas y paginadores de la tabla
            paginas = $('#sol_ped_wrapper').children('div#sol_ped_paginate').children('span').children('a');                        
            paginadores = $('#sol_ped_wrapper').children('div#sol_ped_paginate').children('a');
            //se llena el array con las paginas que tenga la tabla y se les coloca el evento del click
            $.each(paginas, function(index, pagina){
               $(pagina).attr('onclick','chk_a(\'#sol_ped\')');
               array_pag.push([parseInt($(pagina).html()), false]);               
            });
            //se les coloca el evento del click a los paginadores
            $.each(paginadores, function(index, paginador){
                $(paginador).attr('onclick','chk_a(\'#sol_ped\')');
            });            
            $('#sol_ped_wrapper').append($('<div></div>').html('<button class=\"btn btn-primary\" onclick=\"liberar(\'sol_ped\');\">Liberar</button>').append('<button class=\"btn btn-primary\" onclick=\"Rechazar(\'sol_ped\');\">Rechazar</button>'));
            $('#sol_ped_wrapper').toggle(true);
            document.getElementById("all_sol_ped").checked = false;
            }catch(err){
                console.log(data);
                showMessage('E', '#update', 'Opps se ha producido un error en el servidor intente mas tarde. '+err.autoprefixer+' '+err.message, true, "error");
            }
        },//fin success
        error: function (xhr, status, error) {
            console.log('desde consultar solicitud: '+xhr.responseText);
        }//fin error
    }); //fin ajax
}//fin funcion

$(document).ready(function(){
    if(document.title != 'login'){
        val_sesion(this);
    }
});
