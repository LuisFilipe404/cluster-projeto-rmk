const btnDados = document.getElementById('btn-dados');
const btnSetores = document.getElementById('btn-setores');
const openBtnMenuMonth = document.getElementById('filterMonth');
const labelMonth = document.getElementById('label-filter-month');

var isDataActive = true;
var isSetoresActive = false;


btnSetores.addEventListener("click", () => {
    if(isSetoresActive == false) {
        isSetoresActive = true;
        isDataActive = false;
        btnSetores.classList.add("btn__active");
        btnDados.classList.remove("btn__active");
    }
})

btnDados.addEventListener("click", () => {
    if(isDataActive == false) {
        isDataActive = true;
        isSetoresActive = false;
        btnSetores.classList.remove("btn__active");
        btnDados.classList.add("btn__active");
        console.log("funcionei");
    }
})

labelMonth.addEventListener("click", () => {
    openBtnMenuMonth.focus();
})