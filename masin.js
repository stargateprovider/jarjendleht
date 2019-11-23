$(function() {
	$(".loogikaelement").draggable({
		grid: [32, 32],
		snap: true
	});
});

document.addEventListener("DOMContentLoaded", e=>{
	if (document.addEventListener) {
		document.addEventListener('contextmenu', function(e) {
			e.preventDefault();
			let x = event.clientX;
			let y = event.clientY;
			contextmenu = document.getElementById("menu")
			contextmenu.style.display = "block";
			contextmenu.style.left = x.toString() + "px";
			contextmenu.style.top = y.toString() + "px";
		}, false);
	} else {
		document.attachEvent('oncontextmenu', function() {
			alert("You've tried to open context menu");
			window.event.returnValue = false;
		});
	}
});