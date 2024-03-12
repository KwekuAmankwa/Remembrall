import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, 
        collection, 
        addDoc, 
        doc, 
        deleteDoc,
        query,
        where,
        onSnapshot } 
from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js'
import { getAuth, 
        createUserWithEmailAndPassword,
        signInWithEmailAndPassword,
        GoogleAuthProvider,
        signInWithPopup,
        onAuthStateChanged,
        signOut } 
from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js"

const firebaseConfig = {
  apiKey: "AIzaSyCK-2qFTZOgVfxdZJ6LGq_tJcGRdBiiGo0",
  authDomain: "groceries---scrimba.firebaseapp.com",
  databaseURL: "https://groceries---scrimba-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "groceries---scrimba",
  storageBucket: "groceries---scrimba.appspot.com",
  messagingSenderId: "167845050379",
  appId: "1:167845050379:web:5548b6cf0740722a746f0e"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const collectionName = "lists"
const auth = getAuth(app)

const provider = new GoogleAuthProvider()


// ---- Views ----
const loggedInView = document.getElementById("logged-in-view")
const loggedOutView = document.getElementById("logged-out-view")

// --- Signed Out View elements ---
const userAlertsEl = document.getElementById("user-alerts")
const emailField = document.getElementById("email-field")
const passwordField = document.getElementById("password-field")
const emailSignInBtn = document.getElementById("email-sign-in")
const createAccountBtn = document.getElementById("create-account")
const googleSignInBtn = document.getElementById("google-sign-in")

// --- Signed In View elements ----
const itemAlertsEl = document.getElementById("item-alerts")
const inputField = document.getElementById("input-field")
const addBtn = document.getElementById("add-button")
const groceryList = document.getElementById("shopping-list")
const signOutBtn = document.getElementById("sign-out-btn")


// --- event-listeners ---

addBtn.addEventListener("click", addButtonPressed)

createAccountBtn.addEventListener("click", authCreateAccountWithEmail)

emailSignInBtn.addEventListener("click", authSignInWithEmail)
signOutBtn.addEventListener("click", authSignOut)

googleSignInBtn.addEventListener("click", authSignInWithGoogle)



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



// --- firebase console Authentication ---

function authStateCheck() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            showLoggedInView()
            renderItems()
        } else {
            showLoggedOutView()
        }
      })
}
authStateCheck()


function authCreateAccountWithEmail() {
    const email = emailField.value
    const password = passwordField.value

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
           const alert = "Account created. Please Sign In"
            userAlertMessage(alert)
            clearAuthFields()
        })
        .catch((error) => {
            console.log(error.message)
            const alert = "Please enter valid email and password"
            userAlertMessage(alert)
        })

}

function authSignInWithEmail() {
    const email = emailField.value
    const password = passwordField.value

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            clearAuthFields()
        })
        .catch((error) => {
            console.log(error.message)
            const alert = "Invalid email or password."
            userAlertMessage(alert)
        })
}

function authSignInWithGoogle(){
    signInWithPopup(auth, provider)
    .then((result) => {
        
      }).catch((error) => {
       console.log(error.message)
      })
}

function authSignOut(){
    signOut(auth).then(() => {
        showLoggedOutView()
        clearAuthFields()
      }).catch((error) => {
        console.log(error.message)
      })
}


// --- firebase console Add and Delete Item ---

async function createListItem(itemName,user){
    if (itemName === ""){
        const alert = "Please enter valid item"
        itemAlertMessage(alert)
    }else{
        clearGroceryList()
        const docRef = await addDoc(collection(db, collectionName), {
            item: itemName,
            uid: user.uid
        })
        renderItems()
    }
}

async function deleteListItem(itemId) {
    await deleteDoc(doc(db, collectionName, itemId))
    clearGroceryList()
    renderItems()
}

async function renderItems() {
    const user = auth.currentUser
    const q = query(collection(db, collectionName), where("uid", "==", user.uid))
    onSnapshot(q, (querySnapshot) => {
        clearGroceryList()
        querySnapshot.forEach((doc) => {
            createListContent(doc)
        })
    })    
}



// --- UI functions ---

function userAlertMessage(alert){
    userAlertsEl.textContent = alert
    return userAlertsEl
}

function itemAlertMessage(alert) {
    itemAlertsEl.textContent = alert
    return userAlertsEl
}

function addButtonPressed(){
    const item = inputField.value
    console.log(item)
    const user = auth.currentUser
    createListItem(item,user)
    clearInputField()
}

function createListContent(itemData){
    const itemId = itemData.id
    const itemName = itemData.data()
    const listItem = document.createElement("li")
    listItem.innerHTML = itemName.item
    listItem.addEventListener("dblclick", function (){
        deleteListItem(itemId)
    })
    groceryList.appendChild(listItem)
}


// --- clear input fields ---
function clearInputField(){
    inputField.value = ""
}

function clearGroceryList(){
    groceryList.innerHTML = ""
}

function clearField(field){
    field.value = ""
}

function clearAuthFields(){
    clearField(emailField)
    clearField(passwordField)
}