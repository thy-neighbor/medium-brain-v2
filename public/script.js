console.log("Client Side JS");
$(".like-btn-js").click(function(){// changed to id instead
    //window.t=this;
    $(this).attr("disabled", "disabled");
    let headerText=$(this).parent().find("h3").text();
    let headerImage=$(this).parent().find("img")[0].src;
    let articleUrl=$(this).parent().find("a").attr("href");

    $.post("/article",{input:headerText,headerImage:headerImage,articleUrl:articleUrl,output:{like:1}},function(res){
        console.log(res);
    });
});

$(".dislike-btn-js").click(function(){// changed to id instead
    //window.t=this;
    $(this).attr("disabled", "disabled");
    let headerText=$(this).parent().find("h3").text();
    let headerImage=$(this).parent().find("img")[0].src;
    let articleUrl=$(this).parent().find("a").attr("href");

    $.post("/article",{input:headerText,headerImage:headerImage,articleUrl:articleUrl,output:{dislike:1}},function(res){
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

$("#navbar-search-form-js").submit(function(){
    //event.preventDefault();
    window.t=this;
    
});
