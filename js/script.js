function start() {
	$("#start-game").hide();
	
  $("#background-game").append("<div id='armor'></div>");
  $("#background-game").append("<div class='anima1' id='jogador'></div>");
	$("#background-game").append("<div class='anima3' id='amigo'></div>");
	$("#background-game").append("<div class='anima2' id='enemy1'></div>");
  $("#background-game").append("<div id='enemy2'></div>");
  $("#background-game").append("<div id='scoreboard'></div>");
  
  var game = {}
  var player = {}
  var armor = 3;
  var armorZero = false;
  var speed = 5;
  var yPosition = parseInt(Math.random() * 334);
  var shootUnlocked = true;
  var points = 0;
  var peopleRescued = 0;
  var peopleDead = 0;

  game.timer = setInterval(loop,15);

  function loop() {
    armorRefresh();
    bgMovement();
    playerMovement();
    friendMovement();
    enemy1Movement();
    enemy2Movement();
    collision(); 
    scoreboardRefresh();
  }
  
  var KEY = {
    W: 87,
    S: 83,
    D: 68,  
    ArrowUp: 38,
    ArrowDown: 40,
    SpaceBar: 32,
  }

  player.press = [];

  $(document).keydown(function(e){
    player.press[e.which] = true;
  });

  $(document).keyup(function(e){
      player.press[e.which] = false;
  });

  function playerMovement() {
    if (player.press[KEY.W] | player.press[KEY.ArrowUp]) {
      var topo = parseInt($("#jogador").css("top"));
      $("#jogador").css("top",topo-10);	
      
      if (topo<=0) {
        $("#jogador").css("top",topo+10);
      }
    }
    
    if (player.press[KEY.S] | player.press[KEY.ArrowDown]) {
      var topo = parseInt($("#jogador").css("top"));
      $("#jogador").css("top",topo+10);	
    }
    
    if (topo>=400) {
      $("#jogador").css("top",topo-10);
    }
    
    if (player.press[KEY.D] | player.press[KEY.SpaceBar]) {
      disparo();
    }
  }

  function armorRefresh() {
    if (armor==3) {  
      $("#armor").css("background-image", "url(img/armor3.png)");
    }

    if (armor==2) {
      $("#armor").css("background-image", "url(img/armor2.png)");
    }

    if (armor==1) {
      $("#armor").css("background-image", "url(img/armor1.png)");
    }

    if (armor==0) {
      $("#armor").css("background-image", "url(img/hud.png)"); 
      gameOver();
    }
  }

  var bgmMusic=document.getElementById("bgmMusic");
  var sfxDisparo=document.getElementById("sfxDisparo");
  var sfxExplosao=document.getElementById("sfxExplosao");
  var sfxPerdido=document.getElementById("sfxPerdido");
  var sfxResgate=document.getElementById("sfxResgate");
  var bgmGameover=document.getElementById("bgmGameover");

  bgmMusic.addEventListener("ended", function(){ bgmMusic.currentTime = 0; bgmMusic.play(); }, false);
  bgmMusic.play();

  function bgMovement() {
    esquerda = parseInt($("#background-game").css("background-position"));
    $("#background-game").css("background-position",esquerda-1);
  }

  function disparo() {
    if (shootUnlocked==true) {	
      shootUnlocked=false;
      
      topo = parseInt($("#jogador").css("top"))
      xPosition= parseInt($("#jogador").css("left"))
      tiroX = xPosition + 190;
      topoTiro=topo+37;
      $("#background-game").append("<div id='disparo'></div");
      $("#disparo").css("top",topoTiro);
      $("#disparo").css("left",tiroX);
    
      var tempoDisparo=window.setInterval(executaDisparo, 30);
    } 
    function executaDisparo() {
      xPosition = parseInt($("#disparo").css("left"));
      $("#disparo").css("left",xPosition+15); 

      if (xPosition>900) {   
        window.clearInterval(tempoDisparo);
        tempoDisparo=null;
        $("#disparo").remove();
        shootUnlocked=true;
      }
      
      sfxDisparo.play();
    }
  }

  function collision() {
    var colisao1 = ($("#jogador").collision($("#enemy1")));
    var colisao2 = ($("#jogador").collision($("#enemy2")));
    var colisao3 = ($("#disparo").collision($("#enemy1")));
    var colisao4 = ($("#disparo").collision($("#enemy2")));
    var colisao5 = ($("#jogador").collision($("#amigo")));
    var colisao6 = ($("#enemy2").collision($("#amigo")));
      
    if (colisao1.length>0) {
      enemy1X = parseInt($("#enemy1").css("left"));
      enemy1Y = parseInt($("#enemy1").css("top"));
      explosao1(enemy1X,enemy1Y);

      yPosition = parseInt(Math.random() * 334);
      $("#enemy1").css("left",694);
      $("#enemy1").css("top",yPosition);

      armor--;
    }

    if (colisao2.length>0) {
      enemy2X = parseInt($("#enemy2").css("left"));
      enemy2Y = parseInt($("#enemy2").css("top"));
      explosao2(enemy2X,enemy2Y);
          
      $("#enemy2").remove();
        
      reposicionaInimigo2();  

      armor--;
    }

    if (colisao3.length>0) {
      
      speed=speed+0.1;
      enemy1X = parseInt($("#enemy1").css("left"));
      enemy1Y = parseInt($("#enemy1").css("top"));
        
      explosao1(enemy1X,enemy1Y);
      $("#disparo").css("left",950);
        
      yPosition = parseInt(Math.random() * 334);
      $("#enemy1").css("left",694);
      $("#enemy1").css("top",yPosition);
      
      points=points+100;
    }

    if (colisao4.length>0) {
      enemy2X = parseInt($("#enemy2").css("left"));
      enemy2Y = parseInt($("#enemy2").css("top"));
      $("#enemy2").remove();
    
      explosao2(enemy2X,enemy2Y);
      $("#disparo").css("left",950);
      
      reposicionaInimigo2();
      
      points=points+50;
    }

    if (colisao5.length>0) {		
      reposicionaAmigo();
      $("#amigo").remove();
      
      peopleRescued++;
      sfxResgate.play();
    }

    if (colisao6.length>0) {
      amigoX = parseInt($("#amigo").css("left"));
      amigoY = parseInt($("#amigo").css("top"));
      explosao3(amigoX,amigoY);
      $("#amigo").remove();
          
      reposicionaAmigo();
      peopleDead++;
    }
  }

  function explosao1(enemy1X,enemy1Y) {
    $("#background-game").append("<div id='explosao1'></div");
    $("#explosao1").css("background-image", "url(img/explosao.png)");
    var div=$("#explosao1");
    div.css("top", enemy1Y);
    div.css("left", enemy1X);
    div.animate({width:200, opacity:0}, "slow");
    
    var tempoExplosao=window.setInterval(removeExplosao, 500);
    
    function removeExplosao() {
      div.remove();
      window.clearInterval(tempoExplosao);
      tempoExplosao=null;
    }

    sfxExplosao.play();
  }

  function explosao2(enemy2X,enemy2Y) {
    $("#background-game").append("<div id='explosao2'></div");
    $("#explosao2").css("background-image", "url(img/explosao.png)");
    var div=$("#explosao2");
    div.css("top", enemy2Y);
    div.css("left", enemy2X);
    div.animate({width:200, opacity:0}, "slow");
    
    var tempoExplosao=window.setInterval(removeExplosao, 500);
    
    function removeExplosao() {
      div.remove();
      window.clearInterval(tempoExplosao);
      tempoExplosao=null;
    }
    
    sfxExplosao.play();
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
    
    sfxPerdido.play();
  }

  function reposicionaAmigo() {
    var tempoAmigo=window.setInterval(reposiciona6, 6000);
    
    function reposiciona6() {
    window.clearInterval(tempoAmigo);
    tempoAmigo=null;
      
      if (armorZero==false) {
      $("#background-game").append("<div id='amigo' class='anima3'></div>");		
      }
    }
  }

  function reposicionaInimigo2() {
    var tempoColisao4=window.setInterval(reposiciona4, 5000);
      
      function reposiciona4() {
        window.clearInterval(tempoColisao4);
        tempoColisao4=null;
        
        if (armorZero==false) {
        
        $("#background-game").append("<div id=enemy2></div");	
      }
    }	
  }

  function friendMovement() {
    xPosition = parseInt($("#amigo").css("left"));
    $("#amigo").css("left",xPosition+1);
          
    if (xPosition>906) {
    $("#amigo").css("left",0);			
    }
  }

  function enemy1Movement() {
    xPosition = parseInt($("#enemy1").css("left"));
    $("#enemy1").css("left",xPosition-speed);
    $("#enemy1").css("top",yPosition);
      
    if (xPosition<=0) {
    yPosition = parseInt(Math.random() * 335);
    $("#enemy1").css("left",700);
    $("#enemy1").css("top",yPosition);			
    }
  }

  function enemy2Movement() {
    xPosition = parseInt($("#enemy2").css("left"));
    $("#enemy2").css("left",xPosition-3);
      
    if (xPosition<=0) {
      $("#enemy2").css("left",775);
    }
  }

  function scoreboardRefresh() {	
    $("#scoreboard").html("<h2> Pontos: " + points + " Salvos: " + peopleRescued + " Perdidos: " + peopleDead + "</h2>");
  }
  
  function gameOver() {
    armorZero=true;
    bgmMusic.pause();
    bgmGameover.play();
    
    window.clearInterval(game.timer);
    game.timer=null;
    
    $("#jogador").remove();
    $("#enemy1").remove();
    $("#enemy2").remove();
    $("#amigo").remove();
    
    $("#background-game").append("<div id='fim'></div>");
    
    $("#fim").html("<h1> Game Over </h1>" + "<div id='reinicia' onClick=reiniciagame()><h3>Jogar Novamente</h3></div>");
  }
}

function reiniciagame() {
	bgmGameover.pause();
	$("#fim").remove();
  start();
}