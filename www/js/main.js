document.addEventListener("DOMContentLoaded", fetchData());


/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const section = document.querySelectorAll('section[id]')

function scrollActive(){
    const scrollY = window.pageYOffset

    section.forEach(current =>{
        const sectionHeight = current.offsetHeight,
            sectionTop = current.offsetTop - 50,
            sectionId = current.getAttribute('id')

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link')
        }else{
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link')
        }
    })
}
window.addEventListener('scroll', scrollActive)


/*=============== CHANGE BACKGROUND HEADER ===============*/
function scrollHeader(){
    const header = document.getElementById('header')
    // When the scroll is greater than 80 viewport height, add the scroll-header class to the header tag
    if(this.scrollY >= 80) header.classList.add('scroll-header'); else header.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)




const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');




// get meal list that matches with the ingredients
function getMealList(){
    let searchInputTxt = document.getElementById('search-input').value.trim();
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
    .then(response => response.json())
    .then(data => {
        let html = "";
        if(data.meals){
            data.meals.forEach(meal => {
                html += `
                    <div class = "meal-item" data-id = "${meal.idMeal}">
                        <div class = "meal-img">
                            <img src = "${meal.strMealThumb}" alt = "food">
                        </div>
                        <div class = "meal-name">
                            <h3>${meal.strMeal}</h3>
                            <a href = "#" class = "recipe-btn">Get Recipe</a>
                        </div>
                    </div>
                `;
            });
            mealList.classList.remove('notFound');
        } else{
            html = "Sorry, we didn't find any meal!";
            mealList.classList.add('notFound');
        }

        mealList.innerHTML = html;
    });
}


// get recipe of the meal
function getMealRecipe(e){
    e.preventDefault();
    if(e.target.classList.contains('recipe-btn')){
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
        .then(response => response.json())
        .then(data => mealRecipeModal(data.meals));
    }
}

// create a modal
function mealRecipeModal(meal){
    console.log(meal);
    meal = meal[0];
    let html = `
        <h2 class = "recipe-title">${meal.strMeal}</h2>
        <p class = "recipe-category">${meal.strCategory}</p>
        <div class = "recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class = "recipe-meal-img">
            <img src = "${meal.strMealThumb}" alt = "">
        </div>
        <div class = "recipe-link">
            <a href = "${meal.strYoutube}" target = "_blank">Watch Video</a>
        </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}



function fetchData() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://www.themealdb.com/api/json/v1/1/categories.php", true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            const categories = data.categories;

            const categoriesContainer = document.getElementById("categories");

            categories.forEach((category) => {
                const categoryCard = createCategoryCard(category);
                categoriesContainer.appendChild(categoryCard);
            });
        } else {
            console.log("Error fetching data. Status:", xhr.status);
        }
    };

    xhr.onerror = function () {
        console.log("Error fetching data. Please try again later.");
    };

    xhr.send();
}



function createCategoryCard(category) {
    const categoryCardLink = document.createElement("a");
    categoryCardLink.href = "#";

    const categoryCard = document.createElement("div");
    categoryCard.className = "category-card";

    const categoryImage = document.createElement("img");
    categoryImage.src = category.strCategoryThumb;
    categoryImage.alt = category.strCategory;

    const categoryName = document.createElement("h3");
    categoryName.textContent = category.strCategory;

    categoryCard.appendChild(categoryImage);
    categoryCard.appendChild(categoryName);

    categoryCardLink.appendChild(categoryCard);

    // Add event listener to category card link
    categoryCardLink.addEventListener("click", function () {
        displayCategoryContent(category.strCategory);
    });

    return categoryCardLink;
}




function displayCategoryContent(category) {
    // Redirect to the list.html page with the selected category as a URL parameter
    window.location.href = "list.html?category=" + category;
}


/// Fetch random recipes
function fetchRandomRecipes() {
    const mealList = document.getElementById('meal');

    fetch("https://www.themealdb.com/api/json/v1/1/random.php")
        .then(response => response.json())
        .then(data => {
            let html = "";
            const randomRecipes = data.meals.slice(0, 3); // Get the first 3 random recipes
            randomRecipes.forEach(meal => {
                html += `
                    <div class="meal-item" data-id="${meal.idMeal}">
                        <div class="meal-img">
                            <img src="${meal.strMealThumb}" alt="food">
                        </div>
                        <div class="meal-name">
                            <h3>${meal.strMeal}</h3>
                            <a href="#" class="recipe-btn">Get Recipe</a>
                        </div>
                    </div>
                `;
            });
            mealList.innerHTML = html;
        })
        .catch(error => console.log("Error fetching random recipes:", error));
}

// Call fetchRandomRecipes function to display initial random recipes
fetchRandomRecipes();

