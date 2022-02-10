
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
            var price = document.getElementById('productPrice');
            var title = document.getElementById('productTitle');
            var comparePrice = e.target.getAttribute('compare-at-price');
            var category = document.getElementById('productCategory');
            var compareAtValue = document.getElementById('onSalePrice');
            var tagsBox = document.getElementById('productTags');
            var stockBox = document.getElementById('leftProductCount');
            var stock = e.target.getAttribute('product-stock');
            var productPrice = e.target.getAttribute('product-price');
            var sku = e.target.getAttribute('product-sku');
            var skuNumber = document.getElementById('skuNumber');
            var vat = e.target.getAttribute('vat');
            var vatInclude = document.getElementById("mainVat").innerText = `( ${vat}`;

            // Showing available stock for product
            stockBox.innerText = stock;

            // Product variants slector js code
            var productSelectModal = document.getElementById('productSelectModal');
            var variants = data.variants;
            productSelectModal.innerHTML = '';
            variants.forEach((variant)=>{
                productSelectModal.innerHTML += `
                    <option value='${variant.id}'>${ variant.title }</option>
                `;
            })

            // Product Quantity selector js code
            var plusQty = document.getElementById('plus');
            var minusQty= document.getElementById('minus');
            var qtyCount= document.getElementById('qtyCount');
            var qtyMainValue = document.getElementById('quantity');

            var g = 0;
            plusQty.addEventListener('click', increaseQuantity);
            minusQty.addEventListener('click', decreaseQuantiy);

            function increaseQuantity(){
                g++;
                var underStock = stock -1;
                qtyMainValue.value = g;
                qtyCount.innerText = g;
                if(g > underStock){
                    alert('We have only '+ stock +' stock');
                    return g=0;
                }
            }
            function decreaseQuantiy(){
                g--;
                qtyMainValue.value = g;
                qtyCount.innerText = g;
                if(g < 1) g=1;
                return;
            }

            // Add to cart modal js functionality
            const modalItemId = document.getElementById('modalItemID');
            modalItemId.value = data.variants[0].id;


            // Adding sku from the product-sku attribute
            if(sku != null){
                skuNumber.innerText = sku;
            }
            if(sku == ''){
                skuNumber.innerText = "N/A";
            }
            
            // Showing product all details field
            compareAtValue.innerText = comparePrice;
            productImgThumb.innerHTML = '';
            featuredImage.src = data.featured_image;
            featuredImage.alt = data.title;
            price.innerText = productPrice;
            title.innerText = data.title;
            
        // Showing product category
            if(data.type != null){
                category.innerText = data.type;
            }else{
                category.innerText = "N/A";
            }

        // Shwoing product tags
            if(data.tags != null){
                tagsBox.innerText = '';
                let tags = data.tags;
                tags.forEach((tag) =>{
                    tagsBox.innerHTML += `
                        <span class='tag'>${tag }</span>,
                    `;
                })
            }

            // Selecting product all images
            var thumbImages = data.images;
            console.log(data);
            thumbImages.forEach((image) =>{
                    productImgThumb.innerHTML += `
                        <img id='thumb-images' src='${image}' alt='${data.title}' class='img-thumbnail' />
                    `;
                    
                })
            
        // modal image slider when click on a image immedietly change big image src from her src attribute.
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


// Add to cart js functionality
const modalAddCartForm = document.getElementById('addToCartModalForm');
modalAddCartForm.addEventListener('submit', function(e){
    e.preventDefault();
    
    var modalFormID = document.getElementById('modalItemID').value;
    var modalQuantity = document.getElementById('quantity').value;

    let formData = {
       'items':[{
               'id': modalFormID,
               'quantity': modalQuantity,
                properties: {
                    'First name': 'Caroline'
                }
            }]
        };
    fetch('/cart/add.js',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(formData)
    })
    .then((resp) => {
        resp.json();
        console.log(resp);
        if(resp.status == '200'){
            alert('Product Added in the cart');
        }else{
            alert('Our stock has been over');
        }
    })
    .catch((error)=> console.log('Error', error))
})