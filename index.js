const inputField = document.getElementById("input-field")
const addBtn = document.getElementById("add-button")

addBtn.addEventListener("click", function(){
    let groceries = inputField.value
    console.log(groceries)
})