var tokens = [];
var states = [[]];
var step = 0; //Lugar na tabela
var alphabet = [];

const firstLetter = 'a';
const lastLetter = 'z';

$(document).ready(() => {

});

//Adiciona Token no Array
$("#tokenInsert").click(function(){
    let input = $('#tokenInput');
    let currentToken = input.val();

    insertToken(input, currentToken);
})

//Valida Palavra
$("#validateInput").on('input', function(){
    let input = $(this);
    let currentToken = input.val();

    validate(input, currentToken);
})

function insertToken(input, token){
    if(token){
        if(tokens.indexOf(token) < 0){
            tokens.push(token);
            setStates();
        }
        input.val('');
        alphabet = setAlphabet();
    }
}

function setStates(){
    //Cicla Tokens
    for(let i = 0; i < tokens.length; i++){
        let currentStep = 0;
        let palavra = tokens[i];

        //Cicla letras do Token
        for(let j = 0; j < palavra.length; j++){
            let letra = palavra[j];
            
            if(typeof states[currentStep][letra] === 'undefined'){
                let nextStep = step + 1;

                states[currentStep][letra] = nextStep;
                states[nextStep] = [];
                
                step = currentStep = nextStep;

            } else {
                currentStep = states[currentStep][letra];
            }

            //Final do Token
            if(j == palavra.length - 1){
                states[currentStep]['end'] = true;
            }
        }
    }
}

function setAlphabet(){
    let stateHelper = [];

    //Cicla Estados
    for(let i = 0; i < states.length; i++){
        let aux = [];
        aux['state'] = i;

        //Cicla de A até Z, numerando Estados
        for(let j = firstLetter.charCodeAt(0); j <= lastLetter.charCodeAt(0); j++){
            let letra = String.fromCharCode(j);

            if(typeof states[i][letra] === 'undefined'){
                aux[letra] = '-';
            } else {
                aux[letra] = states[i][letra];
            }
        }

        if(typeof states[i]['final'] !== 'undefined'){
            aux['final'] = true;
        }
        stateHelper.push(aux);
    }
    return stateHelper;
}

function validate(input, validate){
    if(validate && tokens.length > 0){
        let currentStep = 0;
        let error = false;

        for(let i = 0; i < validate.length; i++){
            let letra = validate[i];
            
            if(!error){
                //Se está dentro do alfabeto
                if(validate[i].charCodeAt(0) >= firstLetter.charCodeAt(0) && validate[i].charCodeAt(0) <= lastLetter.charCodeAt(0)){
                    
                    console.log(letra);
                    console.log(alphabet[currentStep][letra]);
    
                    if(alphabet[currentStep][letra] != '-'){
                        currentStep = alphabet[currentStep][letra];
                    } else {
                        error = true;
                        console.log("Letra Inválida: " + alphabet[currentStep][letra]);
                    }
                }
            } else {
                console.log("Caiu fora");
            }
        }
    }
}