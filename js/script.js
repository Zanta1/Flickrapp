let currentPage = 1;
let maxpages = 0;


document.querySelector(`button.search`).addEventListener(`click`, async () => {

    currentPage = 1;

    let images = await getImages();

    updateUI(images);

});



document.querySelector(`button.prev`).addEventListener(`click`, async () => {
    
    currentPage--;

    if (currentPage >= 1) {
        let images = await getImages();
        
        updateUI(images);
    }

});



document.querySelector(`button.next`).addEventListener(`click`, async () => {
    
    currentPage++;

    if (currentPage <= maxpages){
        let images = await getImages();
        
        updateUI(images);
    }

});



async function getImages(){

    const apiKey = `2af54aca22ccb9c902078adc64b47907`;
    let method = `flickr.photos.search`;
    const baseUrl = `https://api.flickr.com/services/rest`;
    let per_page = perPage();

    let license = document.querySelector(`select.license`).value;
    let text = document.querySelector(`input`).value;
    let sort = document.querySelector(`select.sort`).value;


    let url = `${baseUrl}?api_key=${apiKey}&method=${method}&text=${text}&license=${license}&sort=${sort}&per_page=${per_page}&page=${currentPage}&format=json&nojsoncallback=1`;


    try{

        let resp = await fetch(url);
        let data = await resp.json();

        maxpages = data.photos.pages;

        let pop = `<div class="div-undercover-as-an-article" >` +
        `<p> ${currentPage} av ${maxpages} </p>`+
        `</div>`;
        document.getElementById("pageofpages").innerHTML = pop;
        
        return await data;
    }

    catch(err){
        console.error(err)
    }
};



function imgUrl(img, size){

    let imgSize = `z`
    if(size == `thumb`) {imgSize = `q`}
    if(size == `large`) {imgSize = `b`}
    
    let url = `https://farm${img.farm}.staticflickr.com/${img.server}/${img.id}_${img.secret}_${imgSize}.jpg`

    return url;
};



function updateUI(data){


    let main = document.querySelector(`main`);
    main.innerHTML = ``;

    data.photos.photo.forEach(img =>{

        if(img.farm !==0){

        let el = document.createElement(`img`);
        el.setAttribute(`src`, imgUrl(img, `thumb`));
        el.setAttribute(`alt`, img.title);

        el.addEventListener(`click`, () => {
    
            let ellarge = document.createElement(`img`);
            ellarge.setAttribute(`src`, imgUrl(img, `large`));
            ellarge.setAttribute(`alt`, img.title);
    
            document.querySelector(`.overlay`).appendChild(ellarge);
    
            document.querySelector(`.overlay`).classList.add(`show`);
            document.querySelector(`.overlay`).classList.remove(`hide`);
        });

        main.appendChild(el);
        }

    });

};


document.querySelector(`.overlay`).addEventListener(`click`, () => {
    
    document.querySelector(`.overlay`).innerHTML = ``;

    document.querySelector(`.overlay`).classList.remove(`show`);
    document.querySelector(`.overlay`).classList.add(`hide`);

});



function perPage(){

    let e = document.querySelector(`select.page`);
    let strUser = e.value

    let em = document.querySelector(`select.pagemobile`);
    let strUsermobile = em.value

    if(window.innerWidth >= 480 ){
        return strUser;
    } else {
        return strUsermobile;
    }
};



let enter = document.querySelector("input");

enter.addEventListener("keyup", function(event) {

  if (event.keyCode === 13) {
    event.preventDefault();
    document.querySelector("button.search").click();
  }
});






