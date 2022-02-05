
const overlay = document.querySelector('.overlay');

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


// Theme localization js code

const localItems = document.querySelectorAll('#localeItem');
if(localItems.length > 0){
    localItems.forEach(item => {
        item.addEventListener('click', (event)=>{
            document.getElementById('localeCode').value = item.getAttribute('lang');
            document.getElementById('localization_form_tag').submit();
        })
    })
}


// Predective search js code 
var searchField = document.getElementById('searchInputField');
var searchResult = document.querySelector('.predective-search-box');
var timer;

if(searchField != null){
    
    searchField.addEventListener('input', (event)=>{
        
        clearTimeout(timer);

        if(event.target.value){
            searchResult.classList.add('active');
            timer = setTimeout(fetchPredectiveSearch(), 1000);
        }else{
            searchResult.classList.remove('active');
        }

    })
}

function fetchPredectiveSearch(){
    fetch(`/search/suggest.json?q=${searchField.value}&resources[type]=product&resources[options][unavailable_products]=hide&resources[options][fields]=title,product_type,variants.title`)
        .then(resp => resp.json())
        .then(data => {

            searchResult.innerHTML = '';
            var products = data.resources.results.products;
            if(products.length > 0){
                products.forEach(function(product,index){
                    searchResult.innerHTML += `
                        <div class='single-search-item'>
                            <a href='${ product.url }'>
                                <img src='${product.featured_image.url}' class='img-responsive' />
                                <span>${product.title}</span>
                            </a>
                        </div>
                    `;
                })
            }else{
                searchResult.innerHTML = `<div class='alert alert-warning w-100'>
                    <h4>Not Product fuound!</h4>
                </div>`;
            }
            
            console.log(products);

        });
    
}

// product details modal



const productModalBtns = document.querySelectorAll('#showProduct');
const productDetailsBox= document.querySelector(".product-modal-details");
const closeModal = document.querySelector('.modal-close');


   productModalBtns.forEach((productModalBtn) => {
    productModalBtn.addEventListener('click', (e) =>{

        var productHandle = e.target.getAttribute('product-handle');

        var url = '/products/'+productHandle+'.js';
        fetch(url)
        .then(respn => respn.json())
        .then(data => {
            var  featuredImage = document.querySelector('#featuredImage');
            var productImgThumb = document.querySelector('.product-img-thumb');
            productImgThumb.innerHTML = '';
            featuredImage.src = data.featured_image;
            featuredImage.alt = data.title;

            var thumbImages = data.images;
            console.log(thumbImages);
            thumbImages.forEach((image) =>{
                    productImgThumb.innerHTML += `
                        <img id='thumb-images' src='${image}' alt='${data.title}' class='img-thumbnail' />
                    `;
                    
                })
                
            var clickImgs = productImgThumb.querySelectorAll('#thumb-images');
            clickImgs.forEach((clickImg)=>{
                clickImg.addEventListener('click', (e)=>{
                    featuredImage.src = e.target.src;
                    console.log(e.target.src);
                })
            })

            productDetailsBox.classList.add('active');
            overlay.classList.add('active');
        });
    })       
})

overlay.addEventListener('click', function(){
    overlay.classList.remove('active');
    productDetailsBox.classList.remove('active');
})

closeModal.addEventListener('click', function(){
    overlay.classList.remove('active');
    productDetailsBox.classList.remove('active');
})


