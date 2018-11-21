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
    let headerText=$(this).parent().find("h3").text();
    let headerImage=$(this).parent().find("img")[0].src;

    //doesn't work for header texts and header image!!!!
    window.location.href = window.location.origin + `/article-edit?q=${articleUrl}`;

 /*   $.get(`/article?q=${articleUrl}`,function(res){
        console.log(res);
    });
*/
});

$(".save-changes-btn-js").click(function(){
    //window.t=this;
    console.log("SAVE CHANGES BUTTON CLICKED, WE MADE IT");
    let articleContent=$(this).parent().find("div").html();
    let articleUrl=$(this).parent().find("a").attr("href");
    let headerText=$(this).parent().find("h1").text();
    let headerImage=$(this).parent().find("img")[0].src;
    //actually go get header text and stuff on this page
    //do post operation and in post op we check if the url exists in the array and if so we replace the body
    //else we add the new article
    $.post("/update",{headerText:headerText,headerImage:headerImage,articleUrl:articleUrl,articleContent:articleContent,like:1,edit:1},function(res){
        
    });


});

$(".discard-changes-btn-js").click(function(){
    history.back();
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