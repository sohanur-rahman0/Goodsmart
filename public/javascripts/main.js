

$(document).ready(function () {
    $('.sidenav').sidenav();
    $('.dropdown-trigger').dropdown();
    $('.carousel').carousel({
        indicators: true
    });
    $('.slider').slider();
    $('.materialboxed').materialbox();
    document.querySelector('#year').innerHTML = new Date().getFullYear();
    

    //signup
    const inputs = document.querySelectorAll('input.validation');

    const patterns = {
        phone: /^[0-9]{11}$/,
        username: /^[a-zA-Z\d]{5,20}$/,
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
   
        $('.materialboxed').materialbox();
    
    // checkout
    
        $('.tabs').tabs();
   
    $('.clearcart').on('click', () => {
        if (!confirm('Confirm clearing cart!')) {
            return false;
        }
    })   

});