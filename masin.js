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

			if (esimene.className.includes("loogikaelement") && dataId != "valjund"){
				delete sisendid[dataId];
				delete connect[dataId];
				for (var key in sisendid){
					sisendid[key].delete(dataId);
					kustutaJoon(dataId, key);
					kustutaJoon(key, dataId);
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

function leiaValjund(event,a="valjund"){
	var inputs=Array.from(sisendid[a]);
	var results=[];
	inputs.forEach(function (item, index) {
		results.push(leiaValjund(undefined, item))
	});
	if(document.querySelector("[data-id='"+a+"']").getAttribute("data-type") == "sisend"){
		return document.querySelector("[name='"+a+"']").value;
	}
	else if(document.querySelector("[data-id='"+a+"']").getAttribute("data-type") == "neg"){
		tulemus="";
		for (var i = 0; i < results[0].length; i++) {
			tulemus=tulemus.concat(1-results[0].charAt(i));
		}
		return tulemus;
	}
	else if(document.querySelector("[data-id='"+a+"']").getAttribute("data-type") == "and"){
		tulemus="";
		for (var i = 0; i < results[0].length; i++) {
			if(results[0].charAt(i)=="1" && results[1].charAt(i)=="1"){
				tulemus=tulemus.concat(1);
			}
			else{
				tulemus=tulemus.concat(0);
			}
		}
		return tulemus;
	}
	else if(document.querySelector("[data-id='"+a+"']").getAttribute("data-type") == "or"){
		tulemus="";
		for (var i = 0; i < results[0].length; i++) {
			if(results[0].charAt(i)=="1" || results[1].charAt(i)=="1"){
				tulemus=tulemus.concat(1);
			}
			else{
				tulemus=tulemus.concat(0);
			}
		}
		return tulemus;
	}
	else if(document.querySelector("[data-id='"+a+"']").getAttribute("data-type") == "nand"){
		tulemus="";
		for (var i = 0; i < results[0].length; i++) {
			if(results[0].charAt(i)=="0" || results[1].charAt(i)=="0"){
				tulemus=tulemus.concat(1);
			}
			else{
				tulemus=tulemus.concat(0);
			}
		}
		return tulemus;
	}
	else if(document.querySelector("[data-id='"+a+"']").getAttribute("data-type") == "xor"){
		tulemus="";
		for (var i = 0; i < results[0].length; i++) {
			if(results[0].charAt(i)==results[1].charAt(i)){
				tulemus=tulemus.concat(0);
			}
			else{
				tulemus=tulemus.concat(1);
			}
		}
		return tulemus;
	}
	else if(document.querySelector("[data-id='"+a+"']").getAttribute("data-type") == "valjund"){
		document.getElementById("valjund").innerHTML=results;
	}
}
