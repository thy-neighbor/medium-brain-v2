console.log("Client Side JS");
$("button").click(function(){
    window.t=this;
    let headerText=$(this).parent().find("h3").text();
    let headerImage=$(this).parent().find("img")[0].src;
    let articleUrl=$(this).parent().find("a").attr("href");

    $.post("/article",{headerText:headerText,headerImage:headerImage,articleUrl:articleUrl},function(res){
        console.log(res);
    });

});

/*
//Nav bar
document.getElementById('menu').addEventListener('click', function () {
    var nav = document.getElementsByTagName('nav')[0];
    if (nav.style.display == 'block') {
        nav.style.display = 'none';
    } else {
        nav.style.display = 'block';
    }
}, false);

*/