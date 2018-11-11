console.log("Client Side JS");
$(".save-btn-js").click(function(){// changed to id instead
    //window.t=this;
    $(this).attr("disabled", "disabled");
    let headerText=$(this).parent().find("h3").text();
    let headerImage=$(this).parent().find("img")[0].src;
    let articleUrl=$(this).parent().find("a").attr("href");

    $.post("/article",{headerText:headerText,headerImage:headerImage,articleUrl:articleUrl,like:1,edit:0},function(res){
        console.log(res);
    });
});

$(".edit-btn-js").click(function(){// changed to id instead
    window.t=this;
    console.log("EDIT BUTTON CLICKED, WE MADE IT");
    let articleUrl=$(this).parent().find("a").attr("href");
    
    //let headerText=$(this).parent().find("h3").text();
    //let headerImage=$(this).parent().find("img")[0].src;

    window.location.href = window.location.origin + `/article?q=${articleUrl}`;

 /*   $.get(`/article?q=${articleUrl}`,function(res){
        console.log(res);
    });
*/
});

$(".save-btn-js").click(function(){

});

$(".discard-btn-js").click(function(){
    
});


$("#navbar-search-form-js").submit(function(){
    //event.preventDefault();
    window.t=this;
    
});

$('.delete-btn').click(function(){
    console.log($(this).data('id'));
    let id=$(this).data('id');
    $.post("delete", {id:id}, function(res){
        console.log(res);
        window.d = $(`[data-id=${res.deleted}]`);

        $(`[data-id=${res.deleted}]`).closest(".col-sm").remove();
    });
});