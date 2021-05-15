$(document).ready(function() {
    //search completion
    // console.log("hello")
    // var letters = /^[A-Za-z\s]+$/;
    let req = "term="
    let searchbar = document.querySelector('#searchbar')
    searchbar.addEventListener('input', (e)=>{
         
        $.ajax({
            url:"/search",
            dataType: "json",
            type: "get",
            data:req + searchbar.value,
            success: function(data){
                custome_auto_complete(data)
            },
            error: function(err){
                console.log(err.status)
            }
        })
    })

    function custome_auto_complete(data){
        //console.log("auto :")
        $('input.autocomplete').autocomplete({
            data: data,
            limit: 5
        });
    }
})