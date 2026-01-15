async function call(endpoint) {
  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/${endpoint}`
    );
    const data = await res.json();
    return data.meals;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Get value on button click
document.querySelector(".btn-search").addEventListener("click", (e) => {
  e.preventDefault();
  const searchValue = document.getElementById("search-input").value;
  document.getElementById("search-input").value = "";
  call(`search.php?s=${searchValue}`).then((data) => {
    showSearchedMeals(data);
  });
});

const showSearchedMeals = (meals) => {
  const mealsContainer = document.getElementById("meals-container");
  mealsContainer.innerHTML = "";
  if (!meals) {
    mealsContainer.innerHTML = "<h2>No meals found. Please try again!</h2>";
    return;
  }
  meals.forEach((meal) => {
    const mealDiv = document.createElement("div");
    mealDiv.classList.add("meal");
    mealDiv.innerHTML = `
        <div class="card align-items-center justify-content-evenly" style="width: 20rem; height: 100%;">
        <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.title}" />
        <div class="card-body align-self-evenly justify-content-evenly">
            <h5 class="card-title">${meal.strMeal}</h5>
            <h6 class="card-subtitle mb-2 text-body-secondary">${meal.strCategory}</h6>
            <div>
            <!-- Button trigger modal -->
            <button
                type="button"
                class="btn btn-primary detail-page-open"
                data-bs-toggle="modal"
                data-bs-target="#details_page"
                data-id="${meal.idMeal}"
                >
                Details
            </button>
            </div>
        </div>
    `;
    mealsContainer.appendChild(mealDiv);
  });
};

const getIDmeals = document.getElementById("meals-container");

getIDmeals.addEventListener("click", (event) => {
  if (event.target.classList.contains("detail-page-open")) {
    const btn = event.target;
    const page_label = document.getElementById("details_pageLabel");
    const body = document.getElementById("modal-body");
    const footer = document.getElementById("modal-footer-content");
    const reqTable = document.getElementById("requirement-table");
    console.log(call(`lookup.php?i=${btn.dataset.id}`));

    call(`lookup.php?i=${btn.dataset.id}`).then((data) => {
      page_label.innerText = data[0].strMeal;
      body.innerHTML = `
        <div class="text-center">
          <img src="${data[0].strMealThumb}" class="img-fluid mb-3" alt="${data[0].strArea}" style="max-height: 300px;"/>
        </div>
        <p>Category: ${data[0].strCategory}</p>
        <p><strong>Cooking Instruction:</strong> <br>${data[0].strInstructions}</p>
      `;
      for (let i = 1; i <= 20; i++) {
        const ingredient = data[0][`strIngredient${i}`];
        const measure = data[0][`strMeasure${i}`];
        if (ingredient && ingredient.trim() != "") {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${ingredient}</td>
            <td>${measure}</td>
          `;
          reqTable.appendChild(tr);
        } else {
          break;
        }
      }
    });
  }
});
