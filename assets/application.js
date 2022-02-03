// Collection page sorting javascript code
const sort_by = document.querySelector('#sort_by');
    if(sort_by != null){
    sort_by.addEventListener('change', function(e){

        var url = new URL(window.location.href);
        url.searchParams.set('sort_by', e.currentTarget.value);
        window.location = url.href;
    })
}

// Add address model javascript code
const modal = document.querySelector('.adress-modal');
    if(modal != null){
    const showModal = document.getElementById('showModal');
    const closeBtn = document.getElementById('closeBtn');
    const overlay = document.querySelector('.overlay');

    showModal.addEventListener('click', function(){
        modal.classList.add('active');
        overlay.classList.add('active');
    });
    overlay.addEventListener('click', function(){
        this.classList.remove('active');
        modal.classList.remove('active');
    })
    closeBtn.addEventListener('click', function(){
        modal.classList.remove('active');
        overlay.classList.remove('active');
    })
}

// Forgot password modal
const ForgotBtn = document.querySelector('.forgot-password');
if(ForgotBtn != null){
    ForgotBtn.addEventListener('click', function(){
        let forgetFormBox = document.querySelector('.reset-password-box ');
        forgetFormBox.classList.add('active');
    })
}

// Country selector javascript code
if(document.getElementById('country')){

    let country = document.getElementById('country');

    country.addEventListener('change', function(e){

        var provinces = e.target.options[e.target.selectedIndex].getAttribute('data-provinces');
        var provincesArray = JSON.parse(provinces);
        var province = document.getElementById('province');

        if(provincesArray.length < 1){
            province.setAttribute('disabled', 'disabled');
        }else{
            province.removeAttribute('disabled');
        }

        province.innerHTML = '';
        var options = '';

        for(let i= 0; i < provincesArray.length; i++){
            options += `<option value='${provincesArray[i][0]}'>
            ${provincesArray[i][0]}
            </option>`;
        }

        province.innerHTML = options;


    })
}
