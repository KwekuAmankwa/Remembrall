import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js"
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js"

const appSettings = {
    databaseURL: "https://groceries---scrimba-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputField = document.getElementById("input-field")
const addBtn = document.getElementById("add-button")
const groceryList = document.getElementById("shopping-list")

addBtn.addEventListener("click", function(){
    let groceries = inputField.value
    push(shoppingListInDB, groceries)
    
    clearInputField()
})

onValue(shoppingListInDB, function(snapshot){
    let itemsArray = Object.entries(snapshot.val())

    clearGroceryList()

    for (let i = 0; i < itemsArray.length; i++){

        let currentItem = itemsArray[i]
        let currentItemID = currentItem[0]
        let currentItemValue = currentItem[1]
        
        addListItem(currentItemValue)
    }
})

function clearInputField(){
    inputField.value = ""
}

function addListItem(item){
    groceryList.innerHTML += `<li> ${item}</li>`
}

function clearGroceryList(){
    groceryList.innerHTML = ""
}