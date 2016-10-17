angular.module('apuesta.controllers', [])

.controller('ApuestaCtrl', function($scope, refUsuarioActualVal) {

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

.controller('InicioCtrl', function($scope, $stateParams) {

  var starCountRef = firebase.database().ref('usuarios');
  starCountRef.on('value', function(snapshot) {
    console.info(snapshot.val());
    var usuarios = snapshot.val();
    var htmlInterno = "";
    $.each(usuarios, function(i){
      console.info(usuarios[i].online);
      if(usuarios[i].online){
          htmlInterno += "<ion-item class=\"item\">" + usuarios[i].usr + "</ion-item>";
      }
    })

    $('#lista-usuarios-online').html(
        "<div class=\"list\">" + 
          htmlInterno +
        "</div>"
      );
  });

})

.controller('LoginCtrl', function($scope, $stateParams, refUsuarioActualVal) {

  var provider = new firebase.auth.GithubAuthProvider();

  $scope.logear = function(){
    firebase.auth().signInWithPopup(provider)
      .then(function(result) {
        console.info(result.user);
        //Guardar en DB
        var refUsuarios = firebase.database().ref('usuarios/' + result.user.uid);
        refUsuarios.once('value')
          .then(function(snapshot){
            if(snapshot.val() == null){
              refUsuarios.set(
              {
                usr: result.user.email,
                saldo: 100,
                online: true
              });
              console.info(refUsuarios);
            }else{
              refUsuarios.update({
                online: true
              });
            }
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

  });
