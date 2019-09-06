const modal = document.querySelector(".modal-background");
modal.addEventListener("click", () => {
    modal.classList.add("hide");
});

//fetch categories from API
fetch("https://kea-alt-del.dk/t5/api/categories")
    .then(res => res.json())
    .then(function (data) {
        data.forEach(buildCategory)
        getProducts();
    })

//build category with header and section
//create id
//add category to main
function buildCategory(data) {
    const section = document.createElement("section");
    const header = document.createElement("h1");
    header.textContent = data;
    section.setAttribute("id", data)
    section.appendChild(header);
    document.querySelector("main").appendChild(section);
}

//create function
//fetch products from API
function getProducts() {
    fetch("https://kea-alt-del.dk/t5/api/productlist")
        .then(function (response) {
            return response.json()
        }).then(function (data) {
            data.forEach(showDish)
        })
}

function showDish(dish) {
    const template = document.querySelector("template").content;
    const copy = template.cloneNode(true);
    copy.querySelector(".data_name").textContent = dish.name;
    copy.querySelector(".data_price").textContent = `${dish.price} kr`;
    copy.querySelector(".data_price").classList.add("discount");
    copy.querySelector(".data_image").src = `https://kea-alt-del.dk/t5/site/imgs/small/${dish.image}-sm.jpg`;

//    //if dish has alcohol
//    if (dish.alcohol) {
//        copy.querySelector("data_alcohol").textContent = `hello mom`;
//    }

    if (dish.vegetarian) {
        copy.querySelector(".data_vegetarian").textContent = `${dish.vegetarian} YESSSSSS`;
    }

    else {
        copy.querySelector(".data_vegetarian").remove();
    }

    //if dish is on discount
    if (dish.discount) {
        copy.querySelector(".data_discount").textContent = Math.round(dish.price - dish.discount / 100 * dish.price) + " kr"
        copy.querySelector(".data_discount").classList.add("discounted");
        copy.querySelector(".data_price").classList.add("oldPrice");

    } else {
        copy.querySelector(".data_discount").remove();
    }

    //if dish is not sold out
    if (!dish.soldout) {
        copy.querySelector("article").classList.remove("soldOut");
    }

    copy.querySelector("button").addEventListener("click", () => {
        fetch(`https://kea-alt-del.dk/t5/api/product?id=${dish.id}`)
            .then(res => res.json())
            .then(showDetails);
    });

    //add dish to category
    document.querySelector(`#${dish.category}`).appendChild(copy);
}

// the modal
function showDetails(data) {
    modal.querySelector(".modal-name").textContent = data.name;
    modal.querySelector(".modal-description").textContent = data.longdescription;
    modal.querySelector(".modal-price").textContent = data.price + " kr";
    modal.classList.remove("hide");
}
