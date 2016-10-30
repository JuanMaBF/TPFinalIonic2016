angular.module('apuesta.controllers', [])

.controller('ApuestaCtrl', function($scope, refUsuarioActualVal) {

  /*CERRAR SESION*/
  $scope.logout = function(){
    //Cerrar sesion
    firebase.auth().signOut();
    //Remover usuario de DB
    var refUsuarioActual = refUsuarioActualVal.ref; 
    refUsuarioActual.remove();
    //Informar
    alert("Sesion cerrada");
    //Redireccionar
    location.href='#/login';
  }

})

.controller('InicioCtrl', function($scope, $stateParams, refUsuarioActualVal) {

  /*CARGAR LOS USUARIOS LOGUEADOS*/
  var starCountRef = firebase.database().ref('usuarios');
  starCountRef.on('value', function(snapshot) {

   var usuarios = snapshot.val();
    var htmlInterno = "";
    $.each(usuarios, function(i){
      if(usuarios[i].online){
          htmlInterno += "<ion-item class=\"item\">" + usuarios[i].usr + "</ion-item>";
      }
    })

    $('#lista-usuarios-online').html(
        "<ion-item>" + 
          htmlInterno +
        "</ion-item>"
      );
  });

  /*CREAR NUEVO DESAFIO*/
  $scope.crear = function(datos){
    //Recoger el ultimo ID y establecer nuevo
    var refDesafios = firebase.database().ref('desafios');
    refDesafios.once('value')
      .then(function(snapshot){
          var id = 0;
          var desafios = snapshot.val();
          $.each(desafios, function(i){
            id = desafios[i].id;
          });
          id++;

          //Obtener id de usuario
          refUsuarioActualVal.ref.once('value')
            .then(function(snapshot){
              var usrActual = snapshot.val();
              var usrId = usrActual.id;
              //Guardar desafio
              var d = new Date();
              var dateActu = d.getTime();
              firebase.database().ref('desafios/' + id).set({
                usr: usrId,
                descripcion: datos.descripcion,
                duracion: 1,
                id: id,
                date: dateActu,
                finalizado: false
              });
            })
            .catch(function(error){
              console.info(error);
          });
      })
      .catch(function(error){
        console.info(error);
    });
  }

  /*CARGAR LOS DESAFIOS EXISTENTES*/
  var refDesafios = firebase.database().ref('desafios');
  refDesafios.on('value', function(snapshot) {
    var desafios = snapshot.val();
    var htmlInterno = "";
    //Datos para comprobar que el desafio no esta vencido
    var d = new Date();
//    var dateActu = d.getTime();
    $.each(desafios, function(i){
      var diferencia = d.getTime() - desafios[i].date;
      if(diferencia < (desafios[i].duracion * 60000) && !desafios[i].finalizado){
        htmlInterno += "<ion-item class=\"item\">" + desafios[i].descripcion + "</ion-item>";
      }else if (!desafios[i].finalizado){
        var refUsr = firebase.database().ref('desafios/' + desafios[i].id);
        refUsr.once('value')
          .then(function(snapshot){
            refUsr.update({
                finalizado: true
            });
          })
          .catch(function(error){
            console.info(error);
        });
      }
    })

    $('#lista-desafios').html(
          "<ion-item>" + 
          htmlInterno +
        "</ion-item>"
      );
  });

})

.controller('LoginCtrl', function($scope, $stateParams, refUsuarioActualVal) {

  /*INICIAR SESION CON GITHUB*/
  var provider = new firebase.auth.GithubAuthProvider();
  $scope.logear = function(){
    firebase.auth().signInWithPopup(provider)
      .then(function(result) {
        //Guardar en DB
        var refUsuarios = firebase.database().ref('usuarios/' + result.user.uid);
        refUsuarios.once('value')
          .then(function(snapshot){
            if(snapshot.val() == null){
              refUsuarios.set({
                usr: result.user.email,
                saldo: 100,
                online: true,
                id: result.user.uid
              });
            }else{
              refUsuarios.update({
                online: true
              });
            }
          })
          .catch(function(error){
            console.info(error);
          });
        //Guardar referencia
        refUsuarioActualVal.ref = refUsuarios;
        //OnDisconnect
        refUsuarios.onDisconnect().update({
          online: false
        });
        //Redireccionar
        location.href='#/apuesta/inicio';
      }).catch(function(error) {
        console.info(error);
      });
    }

})

.controller('TransferenciaCtrl', function($scope, $stateParams, refUsuarioActualVal) {

  /*HACER UNA TRANSFERENCIA DE DINERO*/
  $scope.enviarDinero = function(trans){
    //Comprobar que la cantidad de dinero enviada es positiva
    if(trans.cantidad <= 0){
      alert("Solo se pueden enviar montos positivos");
      return;
    }

    //Comprobar que el que envia tiene el dinero suficiente
    refUsuarioActualVal.ref.once('value')
      .then(function(snapshot){
        var infoUsr = snapshot.val();
        console.info(infoUsr);
        if(parseInt(infoUsr.saldo) < parseInt(trans.cantidad)){
          alert("Usted no posee tanto dinero");
          return;
        }
      })
      .catch(function(error){
        console.info(error);
    });

    //Comprobar que el usuario existe
    var refTransferencia = firebase.database().ref('usuarios');
    refTransferencia.once('value')
      .then(function(snapshot){
          var flag = false;
          var usuarios = snapshot.val();
          $.each(usuarios, function(i){
            if(usuarios[i].usr == trans.usr){
              //Hacer aumento de dinero
              var nuevoSaldo = parseInt(usuarios[i].saldo) + parseInt(trans.cantidad);
              firebase.database().ref('usuarios/' + usuarios[i].id).update({
                saldo: nuevoSaldo
              });
              //Restar cantidad al que envia

              refUsuarioActualVal.ref.once('value')
                .then(function(snapshot){
                  var infoUsr = snapshot.val();
                  nuevoSaldo = parseInt(infoUsr.saldo) - parseInt(trans.cantidad);
                  refUsuarioActualVal.ref.update({
                    saldo: nuevoSaldo
                  });
                })
                .catch(function(error){
                  console.info(error);
              });
              flag = true;
            }
          });

          if(!flag){
            alert("El usuario no existe");
          }
      })
      .catch(function(error){
        console.info(error);
      });

  }

})
.controller('TransferenciaCtrl', function($scope, $stateParams, refUsuarioActualVal) {

});
