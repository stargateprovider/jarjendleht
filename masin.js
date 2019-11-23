$(function() {
	$(".loogikaelement").draggable({
		grid: [32, 32],
		snap: true
	});
});


// Main funktsioon
document.addEventListener("DOMContentLoaded", function(){
	document.addEventListener('contextmenu', function(e) {
		e.preventDefault();
		let x = event.clientX;
		let y = event.clientY;
		contextmenu = document.getElementById("menu")
		contextmenu.style.display = "block";
		contextmenu.style.left = x.toString() + "px";
		contextmenu.style.top = y.toString() + "px";
	}, false);

	var a=document.getElementById("klaveritegija");
	a.onclick=mutus;
	b=document.getElementById("emme");
	b.onclick=mutus1;
});

function mutus(){
	var a=document.getElementById("sisendid");
	/*a.innerHTML+="<br><input type=\"text\" name=\"sisend\" placeholder=\"bitijada\">";*/
	a.appendChild(document.createElement("br"))
	input = a.appendChild(document.createElement("input"))
	input.type = "text"
	input.name = "sisend"
	input.placeholder = "bitijada"
}
function mutus1(){
	var a=document.getElementById("side");
	div = a.appendChild(document.createElement("div"));
	div.className="loogikaelement ui-draggable ui-draggable-handle";
	im=div.appendChild(document.createElement("img"));
	im.src="elemendid/or.png"
	$(function(){$(div).draggable({grid:[32,32],snap:true});});
	$(div).css({top:200,left:200,position:"absolute"});

}
