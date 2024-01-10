import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js"
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js"

const appSettings = {
    databaseURL: "https://groceries---scrimba-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputField = document.getElementById("input-field")
const addBtn = document.getElementById("add-button")

addBtn.addEventListener("click", function(){
    let groceries = inputField.value
    push(shoppingListInDB, groceries)
    console.log(groceries)
})