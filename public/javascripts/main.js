$(document).ready(function () {
    $('.sidenav').sidenav();
    $('.dropdown-trigger').dropdown();
    $('.carousel').carousel({
        indicators: true
    });
    $('.slider').slider();
    document.querySelector('#year').innerHTML = new Date().getFullYear();
    $('input.autocomplete').autocomplete({
        data: {
            "Apple": null,
            "Microsoft": null,
            "Google": 'https://placehold.it/250x250'
        },
    });

    //signup
    const inputs = document.querySelectorAll('input');

    const patterns = {
        phone: /^[0-9]{11}$/,
        username: /^[a-zA-Z\d]{5,12}$/,
        password: /^[\w@-]{8,20}$/i,
        email: /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/
    }

    //validate
    function validate(field, regex) {
        if (regex.test(field.value)) {
            field.className = 'valid';
            $('#submit').removeClass('disabled');
        } else {
            field.className = 'invalid';
            $('#submit').addClass('disabled');
        }
    }

    inputs.forEach((input) => {
        input.addEventListener('keyup', (e) => {
            //console.log(e.target.attributes.name.value);
            validate(e.target, patterns[e.target.attributes.name.value]);
        })
    })

    //product_details
    $(document).ready(function () {
        $('.materialboxed').materialbox();
    });
    // checkout
    $(document).ready(function () {
        $('.tabs').tabs();
    });
    $('.clearcart').on('click', () => {
        if (!confirm('Confirm clearing cart!')) {
            return false;
        }
    }) 
    
    
    //search completion

    $('#searchbox').autocomplete({
        source: function(req,res){
            $.ajax({
                url:"/search",
                dataType: "json",
                type: "get",
                data:req,
                success: function(data){
                    // let source = []
                    // if(data){
                    //     data.forEach(element => {
  
                    //         source.push(element.name)
                    //     });
                    //     res(source)
                    // }
                    res(data)
                    
                },
                error: function(err){
                    console.log(err.status)
                }
            })
        },
  
        minLength: 1,
        select: function(event,ui){
            if(ui.item){
                
                $('#searchbox').val(ui.item.label)
            }
        }
    })
      

});