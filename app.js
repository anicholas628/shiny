var $pokeNum = $("#pokenumber");
var $submit = $("#submit");

$submit.click(pokeSubmit);



function pokeSubmit(){
	event.preventDefault();
	//api data that allows the person to see the image of the pokemon when they click submit
    var pokeNum = $pokeNum.val().toLowerCase();
    var pokeURL = "https://pokeapi.co/api/v2/pokemon/" + pokeNum;
    
    var pokeImgData = $.get(pokeURL, (pokemon) => {
    	$pokeNum.css("border", "2px solid lightblue");
    	$("#error").text("");
    	$("#card").removeAttr('id');
	    $("#pokename").text(pokemon.name);
	    $("#pokeimage").attr("src", pokemon.sprites.front_default);
	    Bounce($("#pokeimage"), 20, '20px', 400);   
	
  	});

    pokeImgData.fail(()=>{
    	$pokeNum.css("border", "2px solid red");
    	$("#card").attr("id", "card");
    	$("#error").text(pokeNum + " is not in the database. Please check the spelling and try again.");
  		return null;
    });

  	//get the max cp data for all the pokemon in GO

	$.ajax(settingsCP).done(function (response) {
		console.log(response);
		console.log(pokeNum.toLowerCase())
		
		var cpKey=0;
		//you need to capture the key of the pokemon the user entered in order to use the other api to get the max CP
		$.each(response, function(key, value){
			if (response[key]["pokemon_name"].toLowerCase() === pokeNum){
				cpKey = key;
				console.log(key)
			}
		displayCP(response, cpKey);
	});


	//tell whether or not the user requested pokemon can be shiny
	$.ajax(settings).done(function (response){
		var shinyKey=0;
		$.each(response, function(key, value){

			if (response[key]["name"].toLowerCase() === pokeNum){
				console.log(key)
				shinyKey = key;
			}
		displayShiny(response, shinyKey);
		
		});
	})
})};
       
function displayCP(response, pokeKey){
	$("#cp").text("Max CP: " + response[pokeKey].max_cp);
}

function displayShiny(response, shinyKey){
	if(response[shinyKey]){
		$("#shiny").text("Can be shiny:").append("<span class='pokefont'>Yes</span>");
	}
	else {
		$("#shiny").text("Can be shiny:").append("<span class='pokefont'>No</span>");
	}
}

//get the cp data
var settingsCP = {
	"async": true,
	"crossDomain": true,
	"url": "https://pokemon-go1.p.rapidapi.com/pokemon_max_cp.json",
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "pokemon-go1.p.rapidapi.com",
		"x-rapidapi-key": "baba1b39d1mshe3d86a94db41c08p1aa4c1jsn776a5c57531e"
	}
}

//get the shiny pokemon data
var settings = {
	"async": true,
	"crossDomain": true,
	"url": "https://pokemon-go1.p.rapidapi.com/shiny_pokemon.json",
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "pokemon-go1.p.rapidapi.com",
		"x-rapidapi-key": "baba1b39d1mshe3d86a94db41c08p1aa4c1jsn776a5c57531e"
	}
}
//display the shiny data
$.ajax(settings).done(function (response) {
	console.log(response);

	$.each(response, function(key, value) {
		$("#shinyList").append("<li class=\"list-group-item\">" + value.name + "</li>");
		
  		if(value.alolan_shiny===true){
  			$("#alolanList").append("<li class=\"list-group-item\">" + value.name + "</li>");
  		}
  		if(value.found_egg){
  			$("#eggList").append("<li class=\"list-group-item\">" + value.name + "</li>");
  		}
  		if(value.found_raid){
  			$("#raidList").append("<li class=\"list-group-item\">" + value.name + "</li>");
  		}
	});
});

function Bounce(ele, times, distance, speed) {
    for(i=0; i<times; i++) {
        ele.animate({
          marginTop: '-=' + distance
        }, speed).animate({
          marginTop: '+=' + distance
        }, speed);
    }        
}




/*
Javascript version
const search = (event) => {
  event.preventDefault();
  const pokenumber = document.getElementById("pokenumber").value;
  const baseURL = "https://pokeapi.co/api/v2/pokemon/";
  $.get(baseURL + pokenumber, (pokemon) => {
    document.getElementById("pokename").innerHTML = pokemon.name;
    document.getElementById("pokeimage").src = pokemon.sprites.front_default;
  });
}
document.getElementById("pokeform").addEventListener('submit', search);
*/