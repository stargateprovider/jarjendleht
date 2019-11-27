var sisendid = {};

$(function() {
	$(".loogikaelement").draggable({
		grid: [16, 16],
		snap: true
	});
});


// Main funktsioon
window.addEventListener("load", function(){
	document.getElementById("canvas").addEventListener('contextmenu', e=>{
		// Teeb kontekstmenüü
		let x = event.clientX;
		let y = event.clientY;
		var esimene = document.elementFromPoint(x, y);

		e.preventDefault();
		var contextmenu = document.getElementById("menu");
		contextmenu.style.display = "block";
		contextmenu.style.left = x.toString() + "px";
		contextmenu.style.top = y.toString() + "px";

		var uhenda = function(event){
			// Alustab elementide ühendamise
			contextmenu.style.display = "none";

			var uhenda2 = function(event){
				// Ühendab valitud elemendid
				teine = event.target;
				let onLoogikaElemendid = esimene.className.includes("loogikaelement") && teine.className.includes("loogikaelement");
				let poleValjund = esimene != teine && teine.getAttribute("data-id") != "valjund";

				if (onLoogikaElemendid && poleValjund){
					teine.style.boxShadow="0px 0px 20px #880000";
					sisendid[esimene.getAttribute("data-id")].add(teine.getAttribute("data-id"));
					this.removeEventListener("click", uhenda2);
				}
			}
			this.removeEventListener("click", uhenda);
			document.addEventListener("click", uhenda2);
		};
		document.getElementById("btn-input").addEventListener("click", uhenda);

		var kustuta = function(event){
			// Kustutab elemendi
			contextmenu.style.display = "none";
			dataId = esimene.getAttribute("data-id");

			if (esimene.className.includes("loogikaelement" && dataId != "valjund")){
				esimene.parentNode.removeChild(esimene);
				delete sisendid[dataId];
				for (var i=0; i<sisendid.length; i++){
					sisendid.delete(dataId);
				}
				this.removeEventListener("click", kustuta);
			}
		};
		document.getElementById("btn-remove").addEventListener("click", kustuta);
	}, false);

	loogikaElemendid = document.getElementsByClassName("loogikaelement");
	for (var i=0; i<loogikaElemendid.length; i++){
		sisendid[loogikaElemendid[i].getAttribute("data-id")] = new Set();
	}

	//document.getElementById("kaivita").onclick = leiaValjund;
	var a=document.getElementById("klaveritegija");
	a.onclick=lisaSisend;

	var emmed=document.getElementsByClassName("emme");
	for (var i=0; i<emmed.length; i++){
		emmed[i].addEventListener("click", e=>{
			lisaElement(e.target.parentNode.getAttribute('data-id'));
		});
	}
});

function lisaElement(type){
	var canvas = document.getElementById("canvas");
	var img = canvas.appendChild(document.createElement("img"));
	img.className = "loogikaelement";
	img.src="elemendid/" + type + ".png";
	index = canvas.getElementsByClassName("loogikaelement").length.toString();
	img.setAttribute("data-id", type+index);
	$(function(){$(img).draggable({grid:[16,16], snap:true});});
	$(img).css({top:50, left:100});

	sisendid[img.getAttribute("data-id")] = new Set();
}

function lisaSisend(){
	let ol = document.getElementById("sisendid");
	let li = document.createElement("li");
	let input = li.appendChild(document.createElement("input"));
	index = ol.children.length.toString();
	input.name = "sisend"+index;
	input.placeholder = "bitijada";
	input.type = "text";
	ol.appendChild(li);

	var canvas = document.getElementById("canvas");
	var div = canvas.appendChild(document.createElement("div"));
	div.className = "loogikaelement";
	div.textContent = "IN" + index
	div.setAttribute("data-id", "sisend"+index);
	$(function(){$(div).draggable({grid:[16,16], snap:true});});
	$(div).css({top:50, left:100});

	sisendid[div.getAttribute("data-id")] = new Set();
}
