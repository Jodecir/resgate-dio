function start() {
	$("#inicio").hide();
	
	$("#fundoGame").append("<div class='anima1' id='jogador'></div>");
	$("#fundoGame").append("<div class='anima2' id='inimigo1'></div>");
	$("#fundoGame").append("<div id='inimigo2'></div>");
	$("#fundoGame").append("<div class='anima3' id='amigo'></div>");
}

var jogo = {}
var velocidade=5;
var posicaoY = parseInt(Math.random() * 334);

jogo.timer = setInterval(loop,15);

function loop() {
  movefundo();
  movejogador();
  moveinimigo1();
  moveinimigo2();
}

function movefundo() {
  esquerda = parseInt($("#fundoGame").css("background-position"));
  $("#fundoGame").css("background-position",esquerda-1);
}
  
var TECLA = {
  W: 87,
  S: 83,
  D: 68
}

jogo.pressionou = [];

$(document).keydown(function(e){
	jogo.pressionou[e.which] = true;
});

$(document).keyup(function(e){
    jogo.pressionou[e.which] = false;
});

function movejogador() {
	if (jogo.pressionou[TECLA.W]) {
		var topo = parseInt($("#jogador").css("top"));
    $("#jogador").css("top",topo-10);	
    
    if (topo<=0) {
      $("#jogador").css("top",topo+10);
    }
	}
	
	if (jogo.pressionou[TECLA.S]) {
		var topo = parseInt($("#jogador").css("top"));
		$("#jogador").css("top",topo+10);	
  }
  
  if (topo>=400) {
    $("#jogador").css("top",topo-10);
  }
	
	if (jogo.pressionou[TECLA.D]) {
	}
}

function moveinimigo1() {
	posicaoX = parseInt($("#inimigo1").css("left"));
	$("#inimigo1").css("left",posicaoX-velocidade);
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