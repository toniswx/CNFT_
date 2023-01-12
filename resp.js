const bar = document.querySelector(".links")
const newBar = document.querySelector(".bar")

newBar.addEventListener("click",()=>{
   bar.classList.toggle("show")
})