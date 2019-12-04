var sisendid = {};
var connect={};

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
		var uhendused=Array.from(connect[elmnt.getAttribute("data-id")]);
		for (let u=0; u<uhendused.length; u++){
			var idd = uhendused[u].split("c");
			paigutaJoon(document.querySelector("[data-id='"+idd[1]+"']"),
						document.querySelector("[data-id='"+idd[0]+"']"));
		};
		newX = elmnt.scrollLeft + elmnt.offsetLeft - pos1;
		newY = elmnt.scrollTop + elmnt.offsetTop - pos2;

		parentSize = elmnt.parentNode.getBoundingClientRect();
		elemSize = elmnt.getBoundingClientRect();
		scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
		scrollY = document.documentElement.scrollTop || document.body.scrollTop;

		// Kui raamist väljas:
		if (newX < parentSize.left + scrollX){
			elmnt.style.left = parentSize.left + scrollX + "px";
		}else if (newX + elemSize.width > parentSize.right + scrollX){
			elmnt.style.left = parentSize.right - elemSize.width + scrollX + "px";
		}else{
			elmnt.style.left = newX + "px";
		}

		if (newY < parentSize.top + scrollY){
			elmnt.style.top = parentSize.top + scrollY + "px";
		}else if (newY + elemSize.height > parentSize.bottom + scrollY){
			elmnt.style.top = parentSize.bottom - elemSize.height + scrollY + "px";
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
		scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
		scrollY = document.documentElement.scrollTop || document.body.scrollTop;
		contextmenu.style.left = (x+scrollX).toString() + "px";
		contextmenu.style.top = (y+scrollY).toString() + "px";

		// Elementide ühendamine
		var uhenda = function(event){
			// Alustab elementide ühendamise
			contextmenu.style.display = "none";

			var uhenda2 = function(event){
				// Ühendab valitud elemendid
				teine = event.target;
				let onLoogikaElemendid = esimene.className.includes("loogikaelement") && teine.className.includes("loogikaelement");
				let poleValjund = esimene != teine && teine.getAttribute("data-type") != "valjund";

				if (onLoogikaElemendid && poleValjund){
					paigutaJoon(teine,esimene);
					sisendid[esimene.getAttribute("data-id")].add(teine.getAttribute("data-id"));
					this.removeEventListener("click", uhenda2);
				}
			}
			this.removeEventListener("click", uhenda);
			document.getElementById("btn-input-remove").removeEventListener("click", uhendalahti);
			document.getElementById("btn-remove").removeEventListener("click", kustuta);
			document.addEventListener("click", uhenda2);
		};
		document.getElementById("btn-input-add").addEventListener("click", uhenda);

		// Elementide lahti ühendamine
		var uhendalahti = function(event){
			// Alustab elementide lahtiühendamise
			contextmenu.style.display = "none";

			var uhendalahti2 = function(event){
				// Ühendab lahti valitud elemendid
				teine = event.target;
				let onLoogikaElemendid = esimene.className.includes("loogikaelement") && teine.className.includes("loogikaelement");
				let poleValjund = esimene != teine && teine.getAttribute("data-type") != "valjund";

				if (onLoogikaElemendid && poleValjund){
					sisendid[esimene.getAttribute("data-id")].delete(teine.getAttribute("data-id"));
					if (sisendid[esimene.getAttribute("data-id")]){

						var uhendusId = esimene.getAttribute("data-id")+"c"+teine.getAttribute("data-id");
						var uhendused = document.querySelectorAll("[data-id='"+uhendusId+"']");
						for(var i=0;i<uhendused.length;i++){
							uhendused[i].parentNode.removeChild(uhendused[i]);
							connect[esimene.getAttribute("data-id")].delete(uhendusId);
							connect[teine.getAttribute("data-id")].delete(uhendusId);
						};
					}
					this.removeEventListener("click", uhendalahti2);
				}
			}
			this.removeEventListener("click", uhendalahti);
			document.getElementById("btn-input-add").removeEventListener("click", uhenda);
			document.getElementById("btn-remove").removeEventListener("click", kustuta);
			document.addEventListener("click", uhendalahti2);
		};
		document.getElementById("btn-input-remove").addEventListener("click", uhendalahti);

		// Elementide kustutamine
		var kustuta = function(event){
			contextmenu.style.display = "none";
			var dataId = esimene.getAttribute("data-id");

			if (esimene.className.includes("loogikaelement") && dataId != "valjund" && dataId != "sisend0"){
				delete sisendid[dataId];
				delete connect[dataId];
				for (var key in sisendid){
					sisendid[key].delete(dataId);
					kustutaJoon(dataId, key);
					kustutaJoon(key, dataId);
				}
				if (esimene.getAttribute("data-type") == "sisend"){
					let input = document.querySelector("[name='"+esimene.getAttribute("data-id")+"']").parentNode;
					input.parentNode.removeChild(input);
				}
				this.removeEventListener("click", kustuta);
				document.getElementById("btn-input-add").removeEventListener("click", uhenda);
				document.getElementById("btn-input-remove").removeEventListener("click", uhendalahti);
				esimene.parentNode.removeChild(esimene);
			}
		};
		document.getElementById("btn-remove").addEventListener("click", kustuta);
	}, false);

	loogikaElemendid = document.getElementsByClassName("loogikaelement");
	for (var i=0; i<loogikaElemendid.length; i++){

		connect[loogikaElemendid[i].getAttribute("data-id")]=new Set();
		sisendid[loogikaElemendid[i].getAttribute("data-id")] = new Set();
		makeDragable(loogikaElemendid[i]);

	}

	var b=document.getElementById("kaivita");
	b.onclick = leiaValjund;
	var a=document.getElementById("klaveritegija");
	a.onclick=lisaSisend;

	var loogikaelemendid=document.getElementsByClassName("loogikaelem");
	for (var i=0; i<loogikaelemendid.length; i++){
		loogikaelemendid[i].addEventListener("click", e=>{
			lisaElement(e.target.parentNode.getAttribute('data-id'));
		});
	}
});

function kustutaJoon(loppId, algusId){
	var id = algusId+"c"+loppId;
	var joon = document.querySelector("[data-id='"+id+"']");
	if (joon){
		joon.parentNode.removeChild(joon);
	}
	for (var key in connect){
		var jooneIdd = Array.from(connect[key]);
		for (var i=0; i<jooneIdd.length; i++){
			if (jooneIdd[i] == id){
				connect[key].delete(jooneIdd[i]);
			}
		}
	}
}

function paigutaJoon(lopp,algus){
	var x1=parseInt(algus.style.left);
	var x2=parseInt(lopp.style.left);
	var y1=parseInt(algus.style.top);
	var y2=parseInt(lopp.style.top);
	var id = algus.getAttribute("data-id")+"c"+lopp.getAttribute("data-id");
	kustutaJoon(algus.getAttribute("data-id"), lopp.getAttribute("data-id"));
	kustutaJoon(lopp.getAttribute("data-id"), algus.getAttribute("data-id"));

	var canvas = document.getElementById("canvas");
	var div = canvas.appendChild(document.createElement("div"));
	div.setAttribute("data-id", id);
	connect[lopp.getAttribute("data-id")].add(div.getAttribute("data-id"));
	connect[algus.getAttribute("data-id")].add(div.getAttribute("data-id"));
	div.style.position="absolute";
	if (y1>=y2){
		div.style.borderTop="1px dashed black";
		div.style.top=(y2+16).toString()+"px";
		div.style.height=(y1-y2).toString()+"px";

	};
	if(y2>y1){
		div.style.borderBottom="1px dashed black";
		div.style.top=(y1).toString()+"px";
		div.style.height=(y2-y1+16).toString()+"px";
	};
	if (x2>=x1){
		div.style.borderLeft="1px dashed black";
		div.style.left=(x1+48).toString()+"px";
		div.style.width=(x2-x1-48).toString()+"px";
	};
	if (x1>x2){
		div.style.borderRight="1px dashed black";
		div.style.left=(x2+48).toString()+"px";
		div.style.width=(x1-x2-48).toString()+"px";
	};
	div.style.pointerEvents="none";
}

function paigutaElement(index, type, elem, parent){
	elem.setAttribute("data-id", type+index);
	elem.setAttribute("data-type", type);
	elem.className = "loogikaelement";
	let posy = 170 + index*48;
	elem.style.top = posy.toString() + "px";
	if (posy > parent.offsetHeight){
		parent.style.height = elem.style.top;
	}
	makeDragable(elem);
	connect[elem.getAttribute("data-id")] = new Set();
	sisendid[elem.getAttribute("data-id")] = new Set();
}

function lisaElement(type){
	let canvas = document.getElementById("canvas");
	let img = canvas.appendChild(document.createElement("img"));
	let index = canvas.getElementsByClassName("loogikaelement").length - 1;
	img.src = "elemendid/" +type+ ".png";
	paigutaElement(index, type, img, canvas);
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
	paigutaElement(index, "sisend", div, canvas);
}

function leiaValjund(event,id="valjund"){
	// Töötab jätkuvalt kõige paremini 1-2 sisendiga
	var elem = document.querySelector("[data-id='"+id+"']");
	var elemType = elem.getAttribute("data-type");

	var inputs = Array.from(sisendid[id]);
	var results = [];
	for (var i=0; i < inputs.length; i++) {
		results.push(leiaValjund(undefined, inputs[i]));
	}
	tulemus = results[0];

	if(elemType == "sisend"){
		return document.querySelector("[name='"+id+"']").value;
	}
	else if(elemType == "neg"){
		tulemus = "";
		for (var i = 0; i < results[0].length; i++) {
			tulemus += 1-results[0].charAt(i);
		}
	}
	else if(elemType == "and"){
		for (var i = 1; i < results.length; i++) {
			tulemus = (parseInt(results[i],2) & parseInt(tulemus,2)).toString(2);
		}
	}
	else if(elemType == "or"){
		for (var i = 1; i < results.length; i++) {
			tulemus = (parseInt(results[i],2) | parseInt(tulemus,2)).toString(2);
		}
	}
	else if(elemType == "nand"){
		for (var i = 1; i < results.length; i++) {
			tulemus = (parseInt(results[i],2) & parseInt(tulemus,2)).toString(2);
		}
		tulemus2 = "";
		for (var i = 0; i < tulemus.length; i++) {
			tulemus2 += 1-tulemus.charAt(i);
		}
		tulemus = tulemus2;
	}
	else if(elemType == "xor"){
		for (var i = 1; i < results.length; i++) {
			tulemus = (parseInt(results[i],2) ^ parseInt(tulemus,2)).toString(2);
		}
	}
	else if(elemType == "valjund"){
		document.getElementById("valjund").innerHTML=tulemus;
	}
	return "0".repeat(Math.abs(results[0].length-tulemus.length)) + tulemus;
}
