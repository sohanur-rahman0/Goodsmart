$(document).ready(function() {
    //search completion
    // console.log("hello")
    var letters = /^[A-Za-z\s]+$/;
    let req = "term="
    let searchbar = document.querySelector('#searchbar')
    searchbar.addEventListener('keydown', (e)=>{
        let char = e.key;
        if(searchbar.value==""){
            req = "term="
        }
        if(char=='Backspace'){
            // console.log("back")
            req = "term=" + searchbar.value
        }
        else if(char.match(letters)){
            req+= char;
            // console.log(req)
        } else {
            req = "term="
        }
        
        $.ajax({
            url:"/search",
            dataType: "json",
            type: "get",
            data:req,
            success: function(data){
                custome_auto_complete(data)
            },
            error: function(err){
                console.log(err.status)
            }
        })
    })

    function custome_auto_complete(data){
        console.log("auto :")
        $('input.autocomplete').autocomplete({
            data: data,
            limit: 5
        });
    }
})