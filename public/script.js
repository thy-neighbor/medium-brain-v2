console.log("Client Side JS");
$("button").click(function(){
    //window.t=this;
    let headerText=$(this).parent().find("h3").text();
    let headerImage=$(this).parent().find("img")[0].src;

    $.post("/article",{headerText:headerText,headerImage:headerImage},function(res){
        console.log(res);
    });

});

