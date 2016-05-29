		//http://www.javascriptlint.com/online_lint.php
		//Funcoes do Phonegap
		var especialidade = "";
		var tipo = "";
		var dia = "";
		var horario = "";
		var isPhoneGapReady = true;
		var isConnected = true;
		var isHighSpeed = false;
		var tipo_conexao = "";
		var latitude = "";
		var longitude = "";
		var bairro = "";
		var cidade = "";
		var estado = "";
		
		function alertDismissed() {
			// do something
		}
		
		
		//$(document).ready(function(){
		document.addEventListener("deviceready", onDeviceReady, false);
		//});
		 
		function onDeviceReady() {
			isPhoneGapReady = true;
			// detect for network access
			networkDetection();
			// attach events for online and offline detection
			document.addEventListener("online", onOnline, false);
			document.addEventListener("offline", onOffline, false);
		}
		
		function networkDetection() {
			if (isPhoneGapReady) {
				
				
				var states = {};
				states[navigator.connection.UNKNOWN]  = 'Unknown connection';
				states[navigator.connection.ETHERNET] = 'Ethernet connection';
				states[navigator.connection.WIFI]     = 'WiFi connection';
				states[navigator.connection.CELL_2G]  = 'Cell 2G connection';
				states[navigator.connection.CELL_3G]  = 'Cell 3G connection';
				states[navigator.connection.CELL_4G]  = 'Cell 4G connection';
				states[navigator.connection.NONE]     = 'No network connection';
				var tipo_conexao = states[navigator.connection.type];
				
				if (tipo_conexao != 'No network connection') {
					isConnected = true;
				}
				
			}	
		}
		
		function onOnline() {
			isConnected = true;
		}
		function onOffline() {
			isConnected = false;
		}
		
		function getGeolocation() {
			// get the user's gps coordinates and display map
			var options = {
			maximumAge: 30000,
			timeout: 9000,
			enableHighAccuracy: false
			};
			navigator.geolocation.getCurrentPosition(loadMap, geoError, options);
		}
		
		function loadMap(position) {
			
			latitude = position.coords.latitude;
			longitude = position.coords.longitude;
			
			$.ajax({
			type: "GET",
			url: "http://www.fisioagenda.com.br/xml/xml_localizacao.php?latitude=" + latitude + "&longitude=" + longitude,
			dataType: "xml",
			success: function(data) {
				
				var output = "";
				$('#listview').empty();
				$(data).find('posicao').each(function(){
					
					bairro = $(this).find("bairro").text();
					cidade = $(this).find("cidade").text();
					estado = $(this).find("estado").text();
				});
				
				if (cidade != ""){
					var conteudo = "Sua localizacao atual:<br/>";
					conteudo += "Bairro:" + bairro + "<br/>";
					conteudo += "Cidade:" + cidade + "<br/>";
					conteudo += "Estado:" + estado + "<br/>";
					$("#posicao_usuario").html(conteudo);
				}
				
			}
			});
		}
		
		function geoError(error) {
			alert('codigo: ' + error.code + '\n' + 'mensagem: ' + error.message + '\n');
		}
		
		//Funcoes do aplicativo
		function echeck(str) {

			var at="@";
			var dot=".";
			var lat=str.indexOf(at);
			var lstr=str.length;
			var ldot=str.indexOf(dot);
			if (str.indexOf(at)==-1){
			   //alert("Invalid E-mail ID");
			   return false;
			}

			if (str.indexOf(at)==-1 || str.indexOf(at)==0 || str.indexOf(at)==lstr){
			   //alert("Invalid E-mail ID");
			   return false;
			}

			if (str.indexOf(dot)==-1 || str.indexOf(dot)==0 || str.indexOf(dot)==lstr){
				//alert("Invalid E-mail ID");
				return false;
			}

			 if (str.indexOf(at,(lat+1))!=-1){
				//alert("Invalid E-mail ID");
				return false;
			 }

			 if (str.substring(lat-1,lat)==dot || str.substring(lat+1,lat+2)==dot){
				//alert("Invalid E-mail ID");
				return false;
			 }

			 if (str.indexOf(dot,(lat+2))==-1){
				//alert("Invalid E-mail ID");
				return false;
			 }
			
			 if (str.indexOf(" ")!=-1){
				//alert("Invalid E-mail ID")/
				return false;
			 }

			 return true;				
		}
		
		function goBack() {
			window.history.back()
		}
		
		function InformarEspecialidade(valor){
			especialidade = valor;
			$.mobile.changePage("#etapa2");
		}
		
		function InformarHorario(valor){
			horario = valor;
			$.mobile.changePage("#etapa4");
		}
		
		function InformarTipoAtendimento(valor){
			tipo = valor;
			$.mobile.changePage("#etapa3");
		}
		
		function InformarDia(valor){
			dia = valor;
			$.mobile.changePage("#etapa5");
		}
		
		//Navegacao
		
		$(document).on('pageshow', '#etapa5', function(){ 
			if (isPhoneGapReady){
				if (isConnected) {
					getGeolocation();
										
					var conteudo = "Voce informou:<br/>";
					conteudo += "Especialidade:" + especialidade + "<br/>";
					conteudo += "Tipo de atendimento:" + tipo + "<br/>";
					conteudo += "Horario:" + horario + "<br/>";
					conteudo += "Dia da semana:" + dia + "<br/>";
					
					$("#resultados_pesquisa").html(conteudo);
				} else {
					navigator.vibrate(2000);
					navigator.notification.alert('Não existe conexão com a Internet', alertDismissed, 'FisioAgenda', 'OK');
					$.mobile.changePage("#main");
				}	
			} else {
				navigator.vibrate(2000);
				navigator.notification.alert('O aplicativo não está pronto!', alertDismissed, 'FisioAgenda', 'OK');
				$.mobile.changePage("#main");
			}	
		});
		
		
		$(document).on('pageshow', '#listagem', function(){ 
			
			if (isPhoneGapReady){
				if (isConnected) {
					
					$("#listview").hide();
					$("#myFilter").hide();
					$("#loading").show();
					$.ajax({
					type: "GET",
					url: "http://www.fisioagenda.com.br/xml/xml_profissionais.php",
					dataType: "xml",
					success: function(data) {
						var output = "";
						$('#listview').empty();
						$(data).find('profissional').each(function(){
							
							var codigo = $(this).find("codigo").text();
							var nome = $(this).find("nome").text();
							
							var especialidade = $(this).find("especialidade").text();
							var observacao = $(this).find("observacao").text();
							var email = $(this).find("email").text();
							var telefone_comercial = $(this).find("telefone_comercial").text();
							var telefone_celular = $(this).find("telefone_celular").text();
							var foto = $(this).find("foto").text();
							var site = $(this).find("site").text();
							var proximo_agendamento = $(this).find("proximo_agendamento").text();
							
							if (foto ==""){
								foto = "img/profissional.png"
							}
							
							output += '<li id="' + codigo + '"><img style="height:200" width="200" src="' + foto + '" /><h3>' + nome + '</h3><p>Especialidade:' + especialidade + '</p><p>Telefone Comercial:' + telefone_comercial + '</p><p>Telefone Celular:' + telefone_celular + '</p><p>Proximo Agendamento:' + proximo_agendamento + '</p><p>&nbsp;</p><h4><a href="'+site+'" target="_blank" style="color:#FFFFFF">Clique aqui para agendar</a></h4></li>';
						});
						$('#listview').append(output).listview('refresh');
						$("#listview").listview("refresh");
						$("#listview").show();
						$("#myFilter").show();
						$("#loading").hide();
						}
					});
					
					
					
				} else {
					navigator.vibrate(2000);
					navigator.notification.alert('Não existe conexão com a Internet', alertDismissed, 'FisioAgenda', 'OK');
					$.mobile.changePage("#main");
				}	
			} else {
				navigator.vibrate(2000);
				navigator.notification.alert('O aplicativo não está pronto!', alertDismissed, 'FisioAgenda', 'OK');
				$.mobile.changePage("#main");
			}	
		});
		
		$(document).on('pageinit', '#faleconosco', function(){  
        $(document).on('click', '#enviar_contato', function() { 
			// catch the form's submit event
		
			var field_tag_css = {
				"background-color": "#FFFF99"
			  };
			var continuar = true;
			var mensagem ="Ocorreram os seguintes erros:\n";
			
			if ($('#nome_contato').val() == "") {
				mensagem = mensagem + 'Prencha o seu nome\n';
				$('#nome_contato').css(field_tag_css);
				continuar = false;
			}

			if ($('#email_contato').val() == "") {
				mensagem = mensagem +  'Digite o endereco de e-mail\n';
				$('#email_contato').css(field_tag_css);
				continuar = false;
			} else {
				if (echeck($('#email_contato').val())==false){
				mensagem = mensagem + 'Preencha corretamente o endereco de e-mail\n';
				continuar = false;
				}
			}


			if ($('#mensagem_contato').val() == "") {
				mensagem = mensagem + 'Prencha a mensagem que deseja enviar\n';
				$('#mensagem_contato').css(field_tag_css);
				continuar = false;
			}
			
			if (isPhoneGapReady){
				if (isConnected) {
					//Continuar processamento
				} else {
					continuar = false;
				}
			} else {
				continuar = false;
			}	
		
			if (continuar){
				// Send data to server through the ajax call
				// action is functionality we want to call and outputJSON is our data
				//formData : $('#check-contato').serialize()
					$.ajax({url: 'http://www.fisioagenda.com.br/xml/ajax_contato.php',
						data: {action : 'enviar', nome: $('#nome_contato').val(), email: $('#email_contato').val(), ddd_telefone: '00', numero_telefone: '00000000', mensagem: $('#mensagem_contato').val()},
						type: 'post',                   
						async: 'true',
                        dataType: 'text',
						beforeSend: function() {
							// This callback function will trigger before data is sent
							$.mobile.loading('show', {
								theme: "a",
								text: "Aguarde...",
								textonly: true,
								textVisible: true
							});
						},
						complete: function() {
							// This callback function will trigger on data sent/received complete
							$.mobile.loading('hide'); // This will hide ajax spinner
						},
						success: function (result) {
							
							if(result =="OK") {
								navigator.notification.alert('Obrigado por enviar sua mensagem!', alertDismissed, 'FisioAgenda', 'OK'); 
								$.mobile.changePage("#main");
							} else {
							    navigator.notification.alert('Erro ao gravar suas informacoes!', alertDismissed, 'FisioAgenda', 'OK'); 
							}
						},
						error: function (request,error) {
							// This callback function will trigger on unsuccessful action                
							navigator.notification.alert('Houve um erro ao enviar suas informações!', alertDismissed, 'FisioAgenda', 'OK');
						}
					});                   
			} else {
				navigator.notification.alert(mensagem,alertDismissed, 'FisioAgenda', 'OK');
				//return false;
			}           
            return false; // cancel original event to prevent form submitting
        });    
		});
		
		
	