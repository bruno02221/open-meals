import normalizeMeal from "./normalizeMeal";

export function searchMealsByName(string) {
  return fetchMeals(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${string}`
  );
}

export function fetchLatestMeals() {
  return fetchMeals("https://www.themealdb.com/api/json/v1/1/latest.php");
}

export function fetchMealById(id) {
  return fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then(resp => resp.json())
    .then(json => json.meals)
    .then(meals => meals[0])
    .then(normalizeMeal);
}

export function fetchMealsByCategory({ category, amount, reject }) {
  return fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  )
    .then(resp => resp.json())
    .then(json => json.meals || [])
    .then(meals => meals.filter(meal => meal.idMeal !== reject))
    .then(meals => meals.slice(0, amount || meals.length))
    .then(meals => Promise.all(meals.map(meal => fetchMealById(meal.idMeal))));
}

export function fetchMealsByArea(area) {
  return fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
    .then(resp => resp.json())
    .then(json => json.meals || [])
    .then(meals => Promise.all(meals.map(meal => fetchMealById(meal.idMeal))));
}

export function listCategories() {
  return fetch("https://www.themealdb.com/api/json/v1/1/list.php?c=list")
    .then(resp => resp.json())
    .then(json => json.meals || []);
}

export function listAreas() {
  return fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list")
    .then(resp => resp.json())
    .then(json => json.meals || []);
}

function fetchMeals(url) {
  return fetch(url)
    .then(resp => resp.json())
    .then(json => json.meals || [])
    .then(meals => meals.map(normalizeMeal));
}
