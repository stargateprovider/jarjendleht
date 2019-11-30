window.addEventListener("load", function(){
  document.getElementById("nupp").addEventListener("click",function(){
    console.log(document.getElementById("sisend").value);
    if (document.getElementById("sisend").value=="Toomast"){
      document.getElementById("kusimus").innerHTML="Õige";
    };
  });
});
