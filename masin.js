var sisendid = {};

//Allikas: https://www.w3schools.com/HOWTO/howto_js_draggable.asp
function makeDragable(elmnt) {
	var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
	elmnt.onmousedown = dragMouseDown;

	function dragMouseDown(e) {
		e = e || window.event;
		e.preventDefault();
		// get the mouse cursor position at startup:
		pos3 = e.clientX;
		pos4 = e.clientY;
		document.onmouseup = closeDragElement;
		// call a function whenever the cursor moves:
		document.onmousemove = elementDrag;
	}

	function elementDrag(e) {
		e = e || window.event;
		e.preventDefault();
		// calculate the new cursor position:
		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;
		pos3 = e.clientX;
		pos4 = e.clientY;
		// set the element's new position:
		newX = elmnt.offsetLeft - pos1;
		newY = elmnt.offsetTop - pos2;

		parentSize = elmnt.parentNode.getBoundingClientRect();
		elemSize = elmnt.getBoundingClientRect();
		// Kui raamist väljas:
		if (newX < parentSize.left){
			elmnt.style.left = parentSize.left + "px";
		}else if (newX + elemSize.width > parentSize.right){
			elmnt.style.left = parentSize.right - elemSize.width + "px";
		}else{
			elmnt.style.left = newX + "px";
		}

		if (newY < parentSize.top){
			elmnt.style.top = parentSize.top + "px";
		}else if (newY + elemSize.height > parentSize.bottom){
			elmnt.style.top = parentSize.bottom - elemSize.height + "px";
		}else{
			elmnt.style.top = newY + "px";
		}
	}

	function closeDragElement() {
		// stop moving when mouse button is released:
		document.onmouseup = null;
		document.onmousemove = null;
	}
}


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
		makeDragable(loogikaElemendid[i]);
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

function paigutaElement(index, elem, parent){
	elem.setAttribute("data-id", "sisend"+index);
	elem.className = "loogikaelement";
	let posy = 170 + index*32;
	elem.style.top = posy.toString() + "px";
	if (posy > parent.offsetHeight){
		parent.style.height = elem.style.top;
	}
	makeDragable(elem);

	sisendid[elem.getAttribute("data-id")] = new Set();
}

function lisaElement(type){
	let canvas = document.getElementById("canvas");
	let img = canvas.appendChild(document.createElement("img"));
	let index = canvas.getElementsByClassName("loogikaelement").length - 1;
	img.src = "elemendid/" +type+ ".png";
	paigutaElement(index, img, canvas);
}

function lisaSisend(){
	let ol = document.getElementById("sisendid");
	let li = document.createElement("li");
	let input = li.appendChild(document.createElement("input"));
	let index = ol.children.length.toString();
	input.name = "sisend"+index;
	input.placeholder = "bitijada";
	input.type = "text";
	ol.appendChild(li);

	var canvas = document.getElementById("canvas");
	var div = canvas.appendChild(document.createElement("div"));
	div.textContent = "IN" + index;
	paigutaElement(index, div, canvas);
}
