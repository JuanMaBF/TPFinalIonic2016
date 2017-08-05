angular.module('app.controllers', [])
  
.controller('menuCtrl', function ($scope, $stateParams, $ionicPopup, $timeout) {
  $scope.logout = function() {
    var myPopup = $ionicPopup.show({
      template: '<center> Sesión Cerrada! </center>',
      title: 'Logout'
    });
    $timeout(function(){
      myPopup.close();
    }, 1000);
    firebase.auth().signOut();
    var usuarios;
    firebase.database().ref('UsuariosOnline/').once('value').then(function(snapshot){
      usuarios = snapshot.val();
      var arrayObjetos = $.map(usuarios, function(value, index) {
        return [value];
      });
      var arrayIndex = $.map(usuarios, function(value, index) {
        return [index];
      });
      for(i=0; i<arrayObjetos.length; i++){
        if(arrayObjetos[i].email == firebase.User.email){
          firebase.database().ref('UsuariosOnline/' + arrayIndex[i]).set({
            email: null
          });
        }
      }
    });
    location.href="#/login";
  };
})
   
.controller('usuariosOnlineCtrl', function ($scope, $stateParams, $ionicPopup) {

  firebase.database().ref('UsuariosOnline/').on('value', function(snapshot){
    $('#usuariosOnline-list5').html('');
    var el = '';
    if(snapshot.val() != null){
      usuarios = snapshot.val();
      var arrayObjetos = $.map(usuarios, function(value, index) {
        return [value];
      });
      var count = 0;
      arrayObjetos.forEach(function(element){
        el += "<ion-item id=\"usuariosOnline-list-item"+count+"\">";
        el += element.nombre.toString();
        el += "</ion-item>";
        count++;
      });
    }else{
      el = "<ion-item id=\"usuariosOnline-list-item11\">No hay usuarios online</ion-item>";
    }

    $('#usuariosOnline-list5').html(el);
    compilarElemento("#usuariosOnline-list5");
  });

  firebase.database().ref('Usuarios/').on('value', function(snapshot){
    $('#dinero-list5').html('');
    usuarios = snapshot.val();
    var arrayObjetos = $.map(usuarios, function(value, index) {
      return [value];
    });
    var usrActual
    arrayObjetos.forEach(elemento => {
      if(elemento.email == firebase.auth().currentUser.email){
        usrActual = elemento;
      }
    })
    el = "<ion-item id=\"usuariosOnline-list-item11\">Dinero actual: §" + usrActual.dinero + "</ion-item>";
    el += "<a href=\"#/inicio/crearDesafio\" id=\"login-button2\" class=\"button button-energized  button-block\">CREAR DESAFIO</a>"
    el += "<a href=\"#/inicio/desafios\" id=\"login-button2\" class=\"button button-energized  button-block\">VER DESAFIOS ACTUALES</a>"
    $('#dinero-list5').html(el);
    compilarElemento("#dinero-list5");
  });

})

.controller('desafiosCtrl', function ($scope, $stateParams, $ionicPopup, $timeout, $location) {

  
  firebase.database().ref('Desafios/').on('value', function(snapshot){
    $('#desafiosActuales').html('');
    var el = '';
    if(snapshot.val() != null){
      desafios = snapshot.val();
      var arrayObjetos = $.map(desafios, function(value, index) {
        return [value];
      });
      var count = 0;
      arrayObjetos.forEach(function(element){
        if(element.resultado == "null"){
          el += "<div id=\"desafios-container"+count+"\">";
          el += "<div class=\"spacer\" style=\"width: 300px; height: 24px;\"></div>";
          el += "<ion-list id=\"desafios-list9\">";
          el += "<ion-item class=\"item-avatar\" id=\"desafios-list-item18\">";
          el += "<h2>" + element.nombre.toString() +"</h2>";
          el += "<p>Dura " + element.tiempoStr.toString() +".</p>";
          el += "</ion-item>";
          el += "<div class='classInputContainer'>";
          el += "<ion-radio ng-model=\"data.nombreDesafio\" value=\"" + element.nombre.toString() + "\">Aceptar por §" + element.dinero.toString() + "</ion-radio>";
          el += "<div>";
          el += "</ion-list>";
          el += "</div>";
          count++;
        }
      });
      if(count != 0){
        el += "<button type=\"submit\" id=\"desafios-button5\" style=\"font-weight:600;\" class=\"button button-energized  button-block\">Aceptar desafio</button>";
      }else{
        el = "<ion-item id=\"usuariosOnline-list-item11\">No hay desafios...</ion-item>";
      }
    }else{
      el = "<ion-item id=\"usuariosOnline-list-item11\">No hay desafios...</ion-item>";
    }
    el += "<a href=\"#/inicio/crearDesafio\" id=\"login-button2\" class=\"button button-energized  button-block\">CREAR DESAFIO</a>"
    $('#desafiosActuales').html(el);
    compilarElemento("#desafiosActuales");
  });

  $scope.aceptar = function(){
    var nombreDesafio = $('.classInputContainer').find('.ng-valid-parse').val();

    firebase.database().ref('Desafios/').once('value').then(function(snapshot){

      var arrayObjetos = $.map(snapshot.val(), function(value, index) {
        return [value];
      });
      var arrayIndex = $.map(snapshot.val(), function(value, index) {
        return [index];
      });

      for(i=0; i<arrayObjetos.length; i++){
        if(arrayObjetos[i].nombre == nombreDesafio){

          if(arrayObjetos[i].acepta1 == "null"){
            firebase.database().ref('Desafios/' + arrayIndex[i]).update({
              acepta1: firebase.auth().currentUser.displayName,
              acepta1Email: firebase.auth().currentUser.email
            });
          } else if(arrayObjetos[i].acepta2 == "null"){
            firebase.database().ref('Desafios/' + arrayIndex[i]).update({
              acepta2: firebase.auth().currentUser.displayName,
              acepta2Email: firebase.auth().currentUser.email
            });
          } else if(arrayObjetos[i].acepta3 == "null"){
            firebase.database().ref('Desafios/' + arrayIndex[i]).update({
              acepta3: firebase.auth().currentUser.displayName,
              acepta3Email: firebase.auth().currentUser.email
            });
          }else{
            var myPopup = $ionicPopup.show({
	            template: '<center>El desafio ya fue aceptado por tres personas</center>',
	            title: 'No hay espacio'
	          });
            $timeout(function(){
              myPopup.close();
            }, 3000);
            return;
          }
          location.href = '#/desafioAceptado';
        }
      }

    });
  }

})
   
.controller('crearDesafioCtrl', function ($scope, $stateParams, $ionicPopup, $timeout) {
  $scope.crearDesafio = function(data){

    if(data == undefined || data.nombre == undefined || data.nombre == ''){
      var myPopup = $ionicPopup.show({
	      template: '<center>Ingrese un nombre</center>',
	      title: 'Nombre'
	    });
	    $timeout(function(){
	      myPopup.close();
	    }, 1000);
      return;
    }
    if(data.dinero == undefined || data.dinero == ''){
      var myPopup = $ionicPopup.show({
	      template: '<center>Seleccione una suma de dinero</center>',
	      title: 'Dinero'
	    });
	    $timeout(function(){
	      myPopup.close();
	    }, 1000);
      return;
    }
    if(data.tiempo == undefined || data.tiempo == ''){
      var myPopup = $ionicPopup.show({
	      template: '<center>Seleccion el tiempo deseado</center>',
	      title: 'Tiempo'
	    });
	    $timeout(function(){
	      myPopup.close();
	    }, 1000);
      return;
    }

    var nombre = data.nombre;
    var dinero = data.dinero.replace('§', '');
    var tiempo;
    var tiempoStr = data.tiempo;
    switch(data.tiempo){
      case "30 Segundos":
        tiempo = 30000;
        break;
      case "1 Minuto":
        tiempo = 60000;
        break;
      case "10 Minutos":
        tiempo = 600000;
        break;
      case "30 Minutos":
        tiempo = 1800000;
        break;
      case "1 Hora":
        tiempo = 3600000;
        break;
      case "2 Horas":
        tiempo = 7200000;
        break;
    }

    firebase.database().ref('Usuarios/').once('value').then(function(snapshot){
      
      var usuarios = snapshot.val();
      var dineroActual;
      var arrayObjetos = $.map(usuarios, function(value, index) {
        return [value];
      });
      arrayObjetos.forEach(usr => {
        if(usr.email == firebase.auth().currentUser.email){
          dineroActual = usr.dinero;
          desafioActual = usr.desafio;
        }
      });
      if(dinero <= dineroActual){
          if(desafioActual == "null"){
            var date = new Date();
            firebase.database().ref('Desafios/').push({
              nombre: nombre,
              dinero: dinero,
              tiempo: tiempo,
              tiempoStr: tiempoStr,
              creador: firebase.auth().currentUser.email,
              creadorName: firebase.auth().currentUser.displayName,
              acepta1: "null",
              acepta1Email: "null",
              resultado: Math.round(Math.random()),
              minutes: date.getMinutes(),
              seconds: date.getSeconds()
            });

            firebase.database().ref('Usuarios/').once('value').then(function(snapshot){
              usuarios = snapshot.val();
              var arrayObjetos = $.map(usuarios, function(value, index) {
                return [value];
              });
              var arrayIndex = $.map(usuarios, function(value, index) {
                return [index];
              });
              for(i=0; i<arrayObjetos.length; i++){
                if(arrayObjetos[i].email == firebase.auth().currentUser.email){
                  firebase.database().ref('Usuarios/' + arrayIndex[i]).update({
                    desafio: nombre
                  });
                }
              }
            });

            location.href="#/inicio/desafioActual";
          } else {
            var myPopup = $ionicPopup.show({
              template: '<center>Usted ya tiene un desafio aceptado</center>',
              title: 'Ya hay un desafio'
            });
            $timeout(function(){
              myPopup.close();
            }, 3000);
          }
      }else{
        var myPopup = $ionicPopup.show({
          template: '<center>Usted no posee dinero suficiente</center>',
          title: 'No hay fondos'
        });
        $timeout(function(){
          myPopup.close();
        }, 3000);
      }
    });
  }
})
   
.controller('desafioActualCtrl', function ($scope, $stateParams, $timeout, $ionicPopup) {

  firebase.database().ref('Desafios/').once('value').then(function(snapshot){
    var tiempo = 0;
    var arrayDesafios = $.map(snapshot.val(), function(value, index) {
      return [value];
    });

    firebase.database().ref('Usuarios/').once('value').then(function(snapshot){
      usuarios = snapshot.val();
      var arrayObjetos = $.map(usuarios, function(value, index) {
        return [value];
      });
      var arrayIndex = $.map(usuarios, function(value, index) {
        return [index];
      });
      for(i=0; i<arrayObjetos.length; i++){
        if(arrayObjetos[i].email == firebase.auth().currentUser.email){
          arrayDesafios.forEach(des => {
            if(arrayObjetos[i].desafio == des.nombre){
              /*********/
              tiempo = des.tiempo;
              firebase.database().ref('Desafios/').on('value', function(snapshot){
                var desafioActual;
                var arrayDesafios = $.map(snapshot.val(), function(value, index) {
                  return [value];
                });
                arrayDesafios.forEach(des => {
                  if(des.creador == firebase.auth().currentUser.email){
                    desafioActual = des;
                  }
                });
                var el = '';
                if(desafioActual.acepta1 != "null"){
                  el += "<ion-item id=\"desafioActual-list-item25\">"+ desafioActual.acepta1 +"</ion-item>";
                }
                if(el == ''){
                  el += "<ion-item id=\"desafioActual-list-item27\">NADIE ACEPTA AUN EL DESAFIO</ion-item>";
                }
                $('#desafioActual-list13').html(el);
                compilarElemento('#desafioActual-list13');
                iniciarReloj(desafioActual.tiempo, desafioActual.minutes, desafioActual.seconds);
              });    
              /*********/
            }
          });
        }
      }

      $timeout(function(){
        if(tiempo == 0){
          $scope.cargarPagSinDesafio();  
        }
      }, 500);

    });
  });

  function iniciarReloj(milisegundos, minutos, segundos){
    var totalObj = minutos*(60000);
    totalObj += segundos*(1000) + milisegundos;

    var date = new Date();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var totalReal = minutes*(60000) + seconds*(1000);
    var diferencia = totalObj - totalReal;
    $("#contador").html('00:' + diferencia/1000);
    $timeout(function(){
      diferencia -= 1000;
      if(diferencia > 0 && diferencia > -10){
        console.log(diferencia);
        iniciarReloj(milisegundos, minutos, segundos)
      }else{
        $("#contador").html('00:00');
        $("#button-ver-resultado").prop("disabled", false);
      }
    }, 1000);
  }

  $scope.cargarPagSinDesafio = function(){
    $("#desafioActual-heading8").html('Usted no tiene ningun desafio actual');
    $("#desafioActual-heading2").html('');
    $("#desafioActual-list-item25").html('');
    $("#contador").html('00:00');
    var el = "<ion-item id=\"desafioActual-list-item27\"></ion-item>";
    $('#desafioActual-list13').html(el);
    compilarElemento('#desafioActual-list13');
  }

  $scope.resultado = function(){
    firebase.database().ref('Desafios/').once('value').then(function(snapshot){
      var desafioActual;
      var arrayDesafios = $.map(snapshot.val(), function(value, index) {
        return [value];
      });
      arrayDesafios.forEach(des => {
        if( (des.creador == firebase.auth().currentUser.email || des.acepta1Email == firebase.auth().currentUser.email)){
          desafioActual = des;
          var aCreador = 0;
          var aAcepta1 = 0;

          if(desafioActual.resultado == 0){ //Gana el creador
            aCreador += desafioActual.dinero + 0;
            aAcepta1 -= desafioActual.dinero + 0;
            if(desafioActual.creador ==firebase.auth().currentUser.email && desafioActual.acepta1 != "null"){
              var myPopup = $ionicPopup.show({
              template: '<center>Ganaste :)</center>',
              title: 'Winner'
              });
              $timeout(function(){
                myPopup.close();
              }, 3000);
            } else if (desafioActual.acepta1 == "null") {
              var myPopup = $ionicPopup.show({
              template: '<center>Nadie aceptó el desafio :(</center>',
              title: 'Nadie me quiere, todos me odian'
              });
              $timeout(function(){
                myPopup.close();
              }, 3000);
              aAcepta1 = 0;
              location.href="#/inicio/usuariosOnline";
            } else {
              var myPopup = $ionicPopup.show({
              template: '<center>Perdiste :(</center>',
              title: 'Loser'
              });
              $timeout(function(){
                myPopup.close();
              }, 3000);
            }
          }else if(desafioActual.resultado == 1){ //Gana el que aceptó
            aCreador -= desafioActual.dinero;
            aAcepta1 += desafioActual.dinero;
          }

          firebase.database().ref('Usuarios/').once('value').then(function(snapshot){
            usuarios = snapshot.val();
            var arrayObjetos = $.map(usuarios, function(value, index) {
              return [value];
            });
            var arrayIndex = $.map(usuarios, function(value, index) {
              return [index];
            });
            for(i=0; i<arrayObjetos.length; i++){
              if(arrayObjetos[i].email == desafioActual.creador){
                var nuevoDinero = arrayObjetos[i].dinero + aCreador;
                firebase.database().ref('Usuarios/' + arrayIndex[i]).update({
                  dinero: nuevoDinero,
                  desafio: "null" //Vuelven a ser nulos
                });
              }
              if(arrayObjetos[i].email == desafioActual.acepta1Email){
                var nuevoDinero = arrayObjetos[i].dinero + aAcepta1;
                console.log(nuevoDinero);
                firebase.database().ref('Usuarios/' + arrayIndex[i]).update({
                  dinero: nuevoDinero,
                  desafio: "null" //Vuelven a ser nulos
                });
              }
            }
          });
          location.href="#/inicio/usuariosOnline";
        }
      });
    });
  }

})
   
.controller('desafioAceptadoCtrl', function ($scope, $stateParams, $timeout) {
  
  firebase.database().ref().on('value', function(snapshot){
    var ref = firebase.database().ref('Desafios/');
    ref.once('value').then(function(snapshot){

      var desafioActual = 'nada';
      var arrayDesafios = $.map(snapshot.val(), function(value, index) {
        return [value];
      });
      var mailAct = firebase.auth().currentUser.email
      arrayDesafios.forEach(des => {
        if(des.acepta1Email == mailAct || des.acepta2Email ==mailAct || des.acepta3Email == mailAct){
          desafioActual = des;
        }
      });

      if(desafioActual.resultado != "null"){
        if(desafioActual.resultado == "perdi"){
          alert("GANASTE");
          location.href="#/inicio/usuariosOnline";
        }else{
          alert("Perdiste :(");
          location.href="#/inicio/usuariosOnline";
        }
      }

      $timeout(function(){
        $('#divCosas').html('');
        var el = '';
        el += "<ion-content padding=\"true\" class=\"manual-ios-statusbar-padding\">";
        el += '<h2 id="desafioAceptado-heading7" style="color:#000000;font-weight:600;text-align:center;">Desafio aceptado</h2>';
        el += '<h2 id="desafioAceptado-heading4" style="color:#2C2121;text-align:center;">Creador</h2>';
        el += '<ion-list id="desafioAceptado-list15">';
        el += '<ion-item id="desafioAceptado-list-item31">' + desafioActual.creadorName + '</ion-item>'
        el += '</ion-list>';
        el += '<h2 id="desafioAceptado-heading3" style="color:#2C2121;text-align:center;">Aceptaron</h2>';
        el += '<ion-list id="desafioAceptado-list14">';
        el += "<ion-item id=\"desafioAceptado-list-item28\"> VOS </ion-item>";

        if(desafioActual.acepta1 != "null" && desafioActual.acepta1Email != mailAct){
          el += "<ion-item id=\"desafioAceptado-list-item28\">" + desafioActual.acepta1 + "</ion-item>";
        }
        if(desafioActual.acepta2 != "null" && desafioActual.acepta2Email != mailAct){
          el += "<ion-item id=\"desafioAceptado-list-item28\">" + desafioActual.acepta2 + "</ion-item>";
        }
        if(desafioActual.acepta3 != "null" && desafioActual.acepta3Email != mailAct){
          el += "<ion-item id=\"desafioAceptado-list-item28\">" + desafioActual.acepta3 + "</ion-item>";
        }
        el += "</ion-list>";
        el += "</ion-content>";

        $('#divCosas').html(el);
        compilarElemento('#divCosas');
      }, 1000);

    });
  });
})
      
.controller('loginCtrl', function ($scope, $stateParams, $ionicPopup, $timeout) {

  $scope.loginData = {};
	$scope.login = function(){
	  /*Validar datos de logueo*/
	  if($scope.loginData.email == null){ 
	    alert("Ingrese un email");
	    return -1;
	  }else if($scope.loginData.password == null){
	    alert("Ingrese un password");
	    return -1;
	  }
	  /*Crear variables con datos de logueo*/
	  var email = $scope.loginData.email;
	  var password = $scope.loginData.password;

	  /*Loguear con mail y password*/
	  firebase.auth().signInWithEmailAndPassword(email, password)
	    .then(function(usuario){ /*Logueo exitoso*/
	      firebase.User = usuario;
        firebase.database().ref('UsuariosOnline/').push({
          nombre: firebase.auth().currentUser.displayName,
          email: email
        });          
	      location.href="#/inicio/usuariosOnline"; //Redireccionamiento
	      var myPopup = $ionicPopup.show({
	        template: '<center> Bienvenido ' + firebase.auth().currentUser.displayName + "</center>",
	        title: 'Bienvenido'
	      });
	      $timeout(function(){
	        myPopup.close();
	      }, 1000);  
	    })
	    .catch(function(error) { /*Manejo de errores*/
	      var errorCode = error.code;
	      var errorMessage = error.message;
	      if (errorCode == 'auth/invalid-email') {
	        alert('El email ingresado no es válido.');
	      } 
	      else if (errorCode == 'auth/user-disabled') {
	        alert('El usuario ha sido deshabilitado.');
	      } 
	      else if (errorCode == 'auth/user-not-found') {
	        alert('El usuario ingresado no existe.');
	      } 
	      else if (errorCode == 'auth/wrong-password') {
	        alert('El password ingresado es incorrecto.');
	      } 
	      else {
	        alert(errorMessage); //Otro tipo de error
	      }
	      console.info(error);
		  });
	}

  $('#test-button3').click(function(){
    $('#login-email').val('test1@email.com');
    $('#login-password').val('estoesuntest123');
    $scope.loginData = {
      email: "test1@email.com",
      password: "estoesuntest123"
    }
  });

  $('#test-button4').click(function(){
    $('#login-email').val('test2@email.com');
    $('#login-password').val('estoesuntest123');
    $scope.loginData = {
      email: "test2@email.com",
      password: "estoesuntest123"
    }
  });

})

.controller('registroCtrl', function ($scope, $stateParams, $ionicPopup, $timeout) {

  $('#test-button1').click(function(){
    $('#nombre-registro').val('Uno');
    $('#email-registro').val('test1@email.com');
    $('#pass-registro').val('estoesuntest123');
    $scope.regData = {
      email: "test1@email.com",
      nombre: "Uno",
      password: "estoesuntest123"
    }
  });

  $('#test-button2').click(function(){
    $('#nombre-registro').val('Dos');
    $('#email-registro').val('test2@email.com');
    $('#pass-registro').val('estoesuntest123');
    $scope.regData = {
      email: "test2@email.com",
      nombre: "Dos",
      password: "estoesuntest123"
    }
  });

  $scope.regData = {};
  // Hacer logueo
  $scope.registrar = function() {
    console.log($scope.regData);
    /*Validar datos de logueo*/
    if($scope.regData.nombre == null){ 
      alert("Ingrese un nombre.");
      return -1;
    } else if($scope.regData.email == null){ 
      alert("Ingrese un email.");
      return -1;
    } else if($scope.regData.password == null){
      alert("Ingrese un password.");
      return -1;
    } 

    /*Crear variables con datos de registro*/
    var nombre = $scope.regData.nombre;
    var email = $scope.regData.email;
    var password = $scope.regData.password;

    /*Registrar con mail y password*/
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(function(usuario){ /*Registro exitoso*/
        firebase.User = usuario;
        usuario.updateProfile({
          displayName: nombre
        }).then(function() {
          var displayName = usuario.displayName;
        }, function(error) {
          console.info(error);
        });

        firebase.database().ref('UsuariosOnline/').push({
          nombre: $scope.regData.nombre,
          email: email
        });

        firebase.database().ref('Usuarios/').push({
          nombre: $scope.regData.nombre,
          email: email,
          dinero: 3000,
          desafio: "null"
        });

        var myPopup = $ionicPopup.show({
           template: '<center> Bienvenido ' + firebase.auth().currentUser.displayName + "</center>",
           title: 'Bienvenido'
        });
        $timeout(function(){
          myPopup.close();
        }, 1000);
        location.href="#/inicio/usuariosOnline"; //Redireccionamiento
      })
      .catch(function(error) { /*Manejo de errores*/
        var errorCode = error.code;
        var errorMessage = error.message;

        if (errorCode == 'auth/email-already-in-use') {
          alert('El email ingresado ya se encuentra en uso.');
        } 
        else if (errorCode == 'auth/invalid-email') {
          alert('El email ingresado no es válido.');
        } 
        else if (errorCode == 'auth/operation-not-allowed') {
          alert('Esta operación se encuentra deshabilitada.');
        } 
        else if (errorCode == 'auth/weak-password') {
          alert('El password ingresado es muy debil.');
        } 
        else {
          alert(errorMessage); //Otro tipo de error
        }
        console.info(error);
      });
  }

})

.controller('listaDesafiosCtrl', function ($scope, $stateParams, $ionicPopup) {

  /*LISTA DE DESAFIOS*/

})

.controller('verDesafioCtrl', function ($scope, $stateParams, $ionicPopup) {

  /*VER DESAFIO PUNTUAL*/

});

function compilarElemento(elemento) {
  var elemento = (typeof elemento == "string") ? elemento : null;  
  if (elemento != null) {
    var div = $(elemento);
    var target = $("[ng-app]");
    angular.element(target).injector().invoke(["$compile", function ($compile) {
      var $scope = angular.element(target).scope();
      $compile(div)($scope);
    }]);
  }
}