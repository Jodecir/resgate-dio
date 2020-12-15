function start() {
	$("#start-game").hide();
	
  $("#background-game").append("<div id='armor'></div>");
  $("#background-game").append("<div class='anima1' id='jogador'></div>");
	$("#background-game").append("<div class='anima3' id='amigo'></div>");
	$("#background-game").append("<div class='anima2' id='inimigo1'></div>");
  $("#background-game").append("<div id='inimigo2'></div>");
  $("#background-game").append("<div id='scoreboard'></div>");
  
  var game = {}
  var player = {}
  var armorAtual=3;
  var speed=5;
  var posicaoY = parseInt(Math.random() * 334);
  var podeAtirar=true;
  var lostedAllArmor=false;
  var pontos=0;
  var salvos=0;
  var perdidos=0;

  game.timer = setInterval(loop,15);

  function loop() {
    armor();
    movefundo();
    movejogador();
    moveamigo();
    moveinimigo1();
    moveinimigo2();
    colisao(); 
    scoreboard();
  }

  function armor() {
    if (armorAtual==3) {  
      $("#armor").css("background-image", "url(img/armor3.png)");
    }

    if (armorAtual==2) {
      $("#armor").css("background-image", "url(img/armor2.png)");
    }

    if (armorAtual==1) {
      $("#armor").css("background-image", "url(img/armor1.png)");
    }

    if (armorAtual==0) {
      $("#armor").css("background-image", "url(img/hud.png)"); 
      gameOver();
    }
  }

  function gameOver() {
    lostedAllArmor=true;
    musica.pause();
    somGameover.play();
    
    window.clearInterval(game.timer);
    game.timer=null;
    
    $("#jogador").remove();
    $("#inimigo1").remove();
    $("#inimigo2").remove();
    $("#amigo").remove();
    
    $("#background-game").append("<div id='fim'></div>");
    
    $("#fim").html("<h1> Game Over </h1>" + "<div id='reinicia' onClick=reiniciagame()><h3>Jogar Novamente</h3></div>");
  }

  function movefundo() {
    esquerda = parseInt($("#background-game").css("background-position"));
    $("#background-game").css("background-position",esquerda-1);
  }
    
  var KEY = {
    W: 87,
    S: 83,
    D: 68
  }

  var somDisparo=document.getElementById("somDisparo");
  var somExplosao=document.getElementById("somExplosao");
  var musica=document.getElementById("musica");
  var somGameover=document.getElementById("somGameover");
  var somPerdido=document.getElementById("somPerdido");
  var somResgate=document.getElementById("somResgate");

  musica.addEventListener("ended", function(){ musica.currentTime = 0; musica.play(); }, false);
  musica.play();

  player.press = [];

  $(document).keydown(function(e){
    player.press[e.which] = true;
  });

  $(document).keyup(function(e){
      player.press[e.which] = false;
  });

  function movejogador() {
    if (player.press[KEY.W]) {
      var topo = parseInt($("#jogador").css("top"));
      $("#jogador").css("top",topo-10);	
      
      if (topo<=0) {
        $("#jogador").css("top",topo+10);
      }
    }
    
    if (player.press[KEY.S]) {
      var topo = parseInt($("#jogador").css("top"));
      $("#jogador").css("top",topo+10);	
    }
    
    if (topo>=400) {
      $("#jogador").css("top",topo-10);
    }
    
    if (player.press[KEY.D]) {
      disparo();
    }
  }

  function disparo() {
    if (podeAtirar==true) {	
      podeAtirar=false;
      
      topo = parseInt($("#jogador").css("top"))
      posicaoX= parseInt($("#jogador").css("left"))
      tiroX = posicaoX + 190;
      topoTiro=topo+37;
      $("#background-game").append("<div id='disparo'></div");
      $("#disparo").css("top",topoTiro);
      $("#disparo").css("left",tiroX);
    
      var tempoDisparo=window.setInterval(executaDisparo, 30);
    } 
    function executaDisparo() {
      posicaoX = parseInt($("#disparo").css("left"));
      $("#disparo").css("left",posicaoX+15); 

      if (posicaoX>900) {   
        window.clearInterval(tempoDisparo);
        tempoDisparo=null;
        $("#disparo").remove();
        podeAtirar=true;
      }
      
      somDisparo.play();
    }
  }

  function colisao() {
    var colisao1 = ($("#jogador").collision($("#inimigo1")));
    var colisao2 = ($("#jogador").collision($("#inimigo2")));
    var colisao3 = ($("#disparo").collision($("#inimigo1")));
    var colisao4 = ($("#disparo").collision($("#inimigo2")));
    var colisao5 = ($("#jogador").collision($("#amigo")));
    var colisao6 = ($("#inimigo2").collision($("#amigo")));
      
    // jogador com o inimigo1
    if (colisao1.length>0) {
      inimigo1X = parseInt($("#inimigo1").css("left"));
      inimigo1Y = parseInt($("#inimigo1").css("top"));
      explosao1(inimigo1X,inimigo1Y);

      posicaoY = parseInt(Math.random() * 334);
      $("#inimigo1").css("left",694);
      $("#inimigo1").css("top",posicaoY);

      armorAtual--;
    }

    if (colisao2.length>0) {
      inimigo2X = parseInt($("#inimigo2").css("left"));
      inimigo2Y = parseInt($("#inimigo2").css("top"));
      explosao2(inimigo2X,inimigo2Y);
          
      $("#inimigo2").remove();
        
      reposicionaInimigo2();  

      armorAtual--;
    }

    // Disparo com o inimigo1
    if (colisao3.length>0) {
      
      speed=speed+0.1;
      inimigo1X = parseInt($("#inimigo1").css("left"));
      inimigo1Y = parseInt($("#inimigo1").css("top"));
        
      explosao1(inimigo1X,inimigo1Y);
      $("#disparo").css("left",950);
        
      posicaoY = parseInt(Math.random() * 334);
      $("#inimigo1").css("left",694);
      $("#inimigo1").css("top",posicaoY);
      
      pontos=pontos+100;
    }

    if (colisao4.length>0) {
      inimigo2X = parseInt($("#inimigo2").css("left"));
      inimigo2Y = parseInt($("#inimigo2").css("top"));
      $("#inimigo2").remove();
    
      explosao2(inimigo2X,inimigo2Y);
      $("#disparo").css("left",950);
      
      reposicionaInimigo2();
      
      pontos=pontos+50;
    }

    if (colisao5.length>0) {		
      reposicionaAmigo();
      $("#amigo").remove();
      
      salvos++;
      somResgate.play();
    }

    if (colisao6.length>0) {
      amigoX = parseInt($("#amigo").css("left"));
      amigoY = parseInt($("#amigo").css("top"));
      explosao3(amigoX,amigoY);
      $("#amigo").remove();
          
      reposicionaAmigo();
      perdidos++;
    }
  }

  function explosao1(inimigo1X,inimigo1Y) {
    $("#background-game").append("<div id='explosao1'></div");
    $("#explosao1").css("background-image", "url(img/explosao.png)");
    var div=$("#explosao1");
    div.css("top", inimigo1Y);
    div.css("left", inimigo1X);
    div.animate({width:200, opacity:0}, "slow");
    
    var tempoExplosao=window.setInterval(removeExplosao, 500);
    
    function removeExplosao() {
      div.remove();
      window.clearInterval(tempoExplosao);
      tempoExplosao=null;
    }

    somExplosao.play();
  }

  function explosao2(inimigo1X,inimigo1Y) {
    $("#background-game").append("<div id='explosao1'></div");
    $("#explosao1").css("background-image", "url(img/explosao.png)");
    var div=$("#explosao1");
    div.css("top", inimigo2Y);
    div.css("left", inimigo2X);
    div.animate({width:200, opacity:0}, "slow");
    
    var tempoExplosao=window.setInterval(removeExplosao, 500);
    
    function removeExplosao() {
      div.remove();
      window.clearInterval(tempoExplosao);
      tempoExplosao=null;
    }
    
    somExplosao.play();
  }

  function explosao3(amigoX,amigoY) {
    $("#background-game").append("<div id='explosao3' class='anima4'></div");
    $("#explosao3").css("top",amigoY);
    $("#explosao3").css("left",amigoX);
    var tempoExplosao3=window.setInterval(resetaExplosao3, 500);
    function resetaExplosao3() {
    $("#explosao3").remove();
    window.clearInterval(tempoExplosao3);
    tempoExplosao3=null;
    }
    
    somPerdido.play();
  }

  function reposicionaAmigo() {
    var tempoAmigo=window.setInterval(reposiciona6, 6000);
    
    function reposiciona6() {
    window.clearInterval(tempoAmigo);
    tempoAmigo=null;
      
      if (lostedAllArmor==false) {
      $("#background-game").append("<div id='amigo' class='anima3'></div>");		
      }
    }
  }

  function reposicionaInimigo2() {
    var tempoColisao4=window.setInterval(reposiciona4, 5000);
      
      function reposiciona4() {
        window.clearInterval(tempoColisao4);
        tempoColisao4=null;
        
        if (lostedAllArmor==false) {
        
        $("#background-game").append("<div id=inimigo2></div");	
      }
    }	
  }

  function moveamigo() {
    posicaoX = parseInt($("#amigo").css("left"));
    $("#amigo").css("left",posicaoX+1);
          
    if (posicaoX>906) {
    $("#amigo").css("left",0);			
    }
  }

  function moveinimigo1() {
    posicaoX = parseInt($("#inimigo1").css("left"));
    $("#inimigo1").css("left",posicaoX-speed);
    $("#inimigo1").css("top",posicaoY);
      
    if (posicaoX<=0) {
    posicaoY = parseInt(Math.random() * 335);
    $("#inimigo1").css("left",700);
    $("#inimigo1").css("top",posicaoY);			
    }
  }

  function moveinimigo2() {
    posicaoX = parseInt($("#inimigo2").css("left"));
    $("#inimigo2").css("left",posicaoX-3);
      
    if (posicaoX<=0) {
      $("#inimigo2").css("left",775);
    }
  }

  function scoreboard() {	
    $("#scoreboard").html("<h2> Pontos: " + pontos + " Salvos: " + salvos + " Perdidos: " + perdidos + "</h2>");
  }
}

function reiniciagame() {
	somGameover.pause();
	$("#fim").remove();
  start();
}