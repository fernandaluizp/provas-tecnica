let xhr = new XMLHttpRequest();
let url = "/js/mock-products.json";
 
//Inicialização 
xhr.onreadystatechange = () => {
  if (xhr.readyState == 4 && xhr.status == 200) { 
    let jsonData = JSON.parse(xhr.responseText);
    let arr = [];
	for(let x in jsonData.products){
		arr[x] = jsonData.products[x];
	}	
    pageNumbers(arr);
    clickPage(arr);
    return arr;
  }
};

xhr.open("GET", url, true);
xhr.send();

//Navegação mobile da página

let hamburgerButton = document.querySelector('.hamburger__button');
let mobileNav = document.querySelector('.mobile');

function openMobile() {
    mobileNav.classList.add('open');
}

function closeMobile() {
    mobileNav.classList.remove('open');
}

hamburgerButton.addEventListener('click', openMobile);
mobileNav.addEventListener('click', closeMobile);


// Mostrar produtos na pagina 

function showProducts(items) {
    let output = "<div class='row'>"; // Abrir lista de produtos
    
	    for (let i in items) {
	        output += "<div class='column'><img src='" + items[i].image + "' width='300px' class='responsive'><p>" + items[i].name + "<br>R$ " + items[i].price  + "</p></div>"; 

	    }
	    output += "</div>"; // Fechar lista

	    document.getElementById("products").innerHTML = output;

	}   

//Sort
let changeSelect = document.getElementById('select');
changeSelect.addEventListener('click', function() {sort2(this.value);}, false);


function sort2(value){
let arr = xhr.onreadystatechange();
	if (value == 'men-pr'){
		arr.sort(compareValues('price'));	
		//ordenar por valor menor-maior
	}
	if (value == 'mai-pr'){
		arr.sort(compareValues('price', 'desc'));
		//ordenar por valor maior-menor
	}
	if (value == 'atoz'){
		arr.sort(compareValues('name'));		//ordenar por nome a-z
	}
	if (value == 'ztoa'){
		arr.sort(compareValues('name', 'desc'));	
		//ordenar por nome z-a
	}

	Paginator(arr, null);
}


function compareValues(key, order='asc') {
  return function(a, b) {
    if(!a.hasOwnProperty(key) || 
       !b.hasOwnProperty(key)) {
  	  return 0; 
    }
    
    const varA = (typeof a[key] === 'string') ? 
      a[key].toUpperCase() : a[key];
    const varB = (typeof b[key] === 'string') ? 
      b[key].toUpperCase() : b[key];
      
    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return (
      (order == 'desc') ? 
      (comparison * -1) : comparison
    );
  };
}

//Paginação

let prev = document.getElementById('button_prev');
prev.addEventListener('click', function() {previousPage();}, false);

let next = document.getElementById('button_next');
next.addEventListener('click', function() {nextPage();}, false);

let page = 1;

function nextPage() {
    page += 1;
   if(page > 7){
    return null;
   }
    Paginator(null, page);
}

function previousPage() {
    page -= 1;
   if(page <= 1){
    let prev = document.getElementById('button_prev');
    return null;
   }else{
        Paginator(null, page);
   }

}

function pageNumbers(items) {
          let pageNumber = document.getElementById('page_number');
              pageNumber.innerHTML = "";
          let total_pages = Math.ceil(items.length / 20);
          for(let i = 1; i < total_pages + 1; i++) {
              pageNumber.innerHTML += `<span class='clickPageNumber'>${i}</span>`;
          }
    Paginator(items);
      }

function clickPage(items) {
        let clickNumber = document.getElementsByClassName('clickPageNumber');

        for(let i = 0; i < clickNumber.length; i++) {
          clickNumber[i].addEventListener("click", function() {
              Paginator(items, clickNumber[i].innerText);

          });
        }
}

function Paginator(items, page) {
  if(items == null){
   items = xhr.onreadystatechange(); 

  }
  var page = page || 1,
  per_page = per_page || 20,
  offset = (page - 1) * per_page,
  paginatedItems = items.slice(offset).slice(0, per_page),
  total_pages = Math.ceil(items.length / per_page);
  return {
  page: page,
  per_page: per_page,
  pre_page: page - 1 ? page - 1 : null,
  next_page: (total_pages > page) ? page + 1 : null,
  total: items.length,
  total_pages: total_pages,
  data: showProducts(paginatedItems, total_pages),
  };
}
