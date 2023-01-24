//Dom Get Elements
const btnSave = document.getElementById('btnSave');
const checkboxContainer = document.getElementById('checkbox-list');
const formbox = document.getElementById('form-box');

// Iniciar sessão no navegador
var getCitySession = sessionStorage.getItem("city");


// Mapa
function getInputsMap() {

    if (getCitySession === '[]') { // caso todas as cidades ja estejam alocadas
        formbox.innerHTML = `
            <div>
                <p>Todas as cidades já foram alocadas</p>
            </div>
        `
    }

    if (typeof getCitySession === 'object') { // salvar a sessao inicial com todas as cidades na primeira vez que a sessão for iniciada
        
        var cidades = ["Apuí", "Beruri", "Boca do Acre", "Carauari", "Careiro da Várzea", "Itacoatiara", "Itapiranga", "Juruá", "Manacapuru", "Manaquiri", "Maraã", "Pauini", "Santo Antônio do Içá", "Silves", "São Paulo de Olivença", "Tabatinga", "Autazes", "Borba", "Caapiranga", "Coari", "Humaitá", "Iranduba", "Itamarati", "Japurá", "Jutaí", "Manicoré", "Novo Aripuanã", "São Sebastião do Uatumã", "Tefé", "Atalaia do Norte", "Alvarães", "Barcelos", "Lábrea", "São Gabriel da Cachoeira", "Uarini", "Canutama", "Careiro", "Eirunepé", "Ipixuna", "Novo Airão", "Presidente Figueiredo", "Rio Preto da Eva", "Santa Isabel do Rio Negro", "Tapauá", "Amaturá", "Anamã", "Anori", "Barreirinha", "Benjamin Constant", "Boa Vista do Ramos", "Codajás", "Envira", "Fonte Boa", "Manaus", "Maués", "Nhamundá", "Nova Olinda do Norte", "Parintins", "Tonantins", "Urucará", "Urucurituba", "Guajará"];

        cidades = cidades.sort(); // ordenar em ordem crescente

        var string = JSON.stringify(cidades); // transformar em string

        sessionStorage.setItem("city", string); // salvar na sessão
        
        getCitySession = sessionStorage.getItem("city"); // atualizar com a nova sessao
    }

    let array = JSON.parse(getCitySession); // transformar de string para array

    let content = ''

    for (let i = 0; i < array.length; i++) { // gerar inputs

        let id = array[i].toLowerCase().replaceAll(" ", "-");
        
        content += `
        <div>
            <label for="${id}">${array[i]}</label>
            <input type="checkbox" value="${id}" id="${id}" class="checkbox__cidades" name="checkboxcidades"/>
        </div>
        `;
    };

    checkboxContainer.innerHTML = content; // atualizar o HTML
}

getInputsMap();

// Salvar Gráfico
btnSave.addEventListener('click', () => {
    // Pegar todos os dados
    const name = document.getElementById('name-ipt');
    const file = document.querySelector('#file-ipt');
    const color = document.getElementById('color-ipt');
    const cidades = document.querySelectorAll('.checkbox__cidades');

    const cidadesSelecionadas = [];
    const todasAsCidadesPorId = [];
    
    var existeCidade = false;

    for (const cidade of cidades) { // salvar as cidades marcadas no array

        todasAsCidadesPorId.push(cidade.value) // salvar todas as cidades

        if (cidade.checked === true) {

            cidadesSelecionadas.push(cidade.value); // salvar apenas as que foram marcadas

            existeCidade = true;

        }
    }

    if (validacao(existeCidade, name.value, file.value, color.value) === 0) return;

    let array = JSON.parse(getCitySession); // array da sessao

    for (let i = 0; i < cidadesSelecionadas.length; i++) { // for para criar um array sem as cidades que ja foram selecionadas

        for (let j = 0; j < array.length; j++) {

            if (cidadesSelecionadas[i] === todasAsCidadesPorId[j]) {

                let index = todasAsCidadesPorId.indexOf(cidadesSelecionadas[i]);
                
                // compara com o array todasAsCidadesPorId e remove em ambos pelo index

                todasAsCidadesPorId.splice(index, 1); 
                array.splice(index, 1);

                break;

            }
        }
    }

    // enviar para sessao novamente

    let string = JSON.stringify(array);

    sessionStorage.setItem('city', string);

    saveData(file, name, color, cidadesSelecionadas)
})

function validacao(existeCidade, existeNome, existeArquivo, existeCor) {
    if (existeCidade === false || existeNome === "" || existeArquivo === "" || existeCor === "" ) {
        alert("Preencha todas as informações");
        return 0;
    } else return 1;
}

function saveData(file, name, color, cidadesSelecionadas) {

    const filename = file.files[0].name; 

    d3.dsv(';', filename) // ler e manipular csv
        .then((data) => {

            const labels = []; // eixo x
            const notifications = []; // eixo y

            for (let i = 0; i < data.length; i++) { // ciclo pra armazenar os dados nos respectivos arrays
                labels.push(data[i].Date);
                notifications.push(data[i].Notifications);
            }

            // objeto das configurações que serão enviadas
            const options = {
                data: notifications,
                label: labels,
                color: color.value,
                name: name.value,
                city: cidadesSelecionadas,
            }; 
            
            // session config
            const getDataSession = sessionStorage.getItem('clusters');
            
            if (typeof getDataSession == 'object') { // primeira vez          

                var clusters = []; // array inicial

                clusters.push(options); 

                var string = JSON.stringify(clusters);

                sessionStorage.setItem('clusters', string); 

            } else { 

                var array = JSON.parse(getDataSession);
                
                array.push(options);

                var string = JSON.stringify(array); // dado convertido em string

                sessionStorage.setItem('clusters', string);
            }
        })

        alert(`${name.value} salvo com sucesso`);

        window.location.href = "./index.html";
}

