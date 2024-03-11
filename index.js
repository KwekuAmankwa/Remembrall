import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js"

const appSettings = {
    databaseURL: "https://groceries---scrimba-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

// ---- Views ----
const loggedInView = document.getElementById("logged-in-view")
const loggedOutView = document.getElementById("logged-out-view")

// --- Signed Out View elements ---
const emailField = document.getElementById("email-field")
const passwordField = document.getElementById("password-field")
const emailSignInBtn = document.getElementById("email-sign-in")
const createAccountBtn = document.getElementById("create-account")

// --- Signed In View elements ----
const inputField = document.getElementById("input-field")
const addBtn = document.getElementById("add-button")
const groceryList = document.getElementById("shopping-list")
const signOutBtn = document.getElementById("sign-out-btn")


// --- event-listeners ---

addBtn.addEventListener("click", function(){
    let groceries = inputField.value
    push(shoppingListInDB, groceries)
    
    clearInputField()
})

emailSignInBtn.addEventListener("click", showLoggedInView)
signOutBtn.addEventListener("click", showLoggedOutView)



// --- toggle views ---

function showView(view) {
    view.style.display = "flex"
}

function hideView(view) {
    view.style.display = "none"
}

function showLoggedOutView() {
    hideView(loggedInView)
    showView(loggedOutView)
}

function showLoggedInView() {
    hideView(loggedOutView)
    showView(loggedInView)
}

showLoggedInView()

// --- firebase console ---
onValue(shoppingListInDB, function(snapshot){

    if (snapshot.exists()){

        let itemsArray = Object.entries(snapshot.val())

        clearGroceryList()

        for (let i = 0; i < itemsArray.length; i++){

            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            
            addListItem(currentItem)
        }
    }else{
        groceryList.innerHTML = "No Items Here... Yet."
    }
})

function clearInputField(){
    inputField.value = ""
}

function addListItem(item){
    // groceryList.innerHTML += `<li> ${item}</li>`
    let itemID = item[0]
    let itemValue = item[1]

    let newElement = document.createElement("li")
    newElement.textContent = itemValue

    newElement.addEventListener("dblclick", function(){
        let itemLocationInDB = ref(database, `shoppingList/${itemID}`)

        remove(itemLocationInDB)
    })

    groceryList.append(newElement)
}

function clearGroceryList(){
    groceryList.innerHTML = ""
}