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

    if(tokens.indexOf(currentToken) < 0){
        insertToken(input, currentToken);
    }
    input.val('');
});

//Valida Palavra
$("#validateInput").on('keyup', function(e){
    let input = $(this);
    let currentToken = input.val();

    validate(input, currentToken, e.keyCode);
});

//Remove Token
$("#tokens").on('click', '.token', function(){
    let input = $(this);
    let token = input.find('input').val();

    if(removeToken(token)){
        input.remove();
    };
})

function insertToken(input, token){
    if(token){
        if(tokens.indexOf(token) < 0){
            tokens.push(token);
            setStates();
        }
        alphabet = setAlphabet();
        createTable(alphabet);

        let tokenDisplay = '<div class="token">';
            tokenDisplay += '<input type="hidden" value="'+ token +'"></input>';
            tokenDisplay += '<span class="text">'+ token +'</span>';
            tokenDisplay += '<span class="close">X</span>';
        tokenDisplay += '</div>';

        $('#tokens').append(tokenDisplay);
    }
}

function removeToken(token){
    if(token){
        let tokenArray = tokens.indexOf(token);

        if(tokenArray > -1){
            tokens.splice(tokenArray,1);

            //Reseta Variaveis
            states = [[]];
            alphabet = [];
            step = 0;

            //Remonta alfabeto e Estados
            setStates();
            alphabet = setAlphabet();
            createTable(alphabet);

            return true;
        }
        return false;
    }
    return false;
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
            } else {
                states[currentStep]['end'] = false;
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

        if(states[i]['end']){
            aux['end'] = true;
        } else {
            aux['end'] = false;
        }
        stateHelper.push(aux);
    }
    return stateHelper;
}

function validate(input, validate, last){
    //Se for válido, Espaço, Backspace ou Del
    if(validate || last == 32 || last == 8 || last == 46){
        if(tokens.length > 0){
            //Limpa CSS linhas
            $("#table tr").removeClass('green');
            $("#table tr").removeClass('red');
            $("#table tr").removeClass('current_step');

            let currentStep = 0;
            let error = false;
            
            for(let i = 0; i < validate.length; i++){
                let letra = validate[i];
                
                if(!error){
                    //Se está dentro do alfabeto
                    if(validate[i].charCodeAt(0) >= firstLetter.charCodeAt(0) && validate[i].charCodeAt(0) <= lastLetter.charCodeAt(0)){

                        if(alphabet[currentStep][letra] != '-'){
                            $("#table tr").removeClass('current_step');
                            $(`.step_${currentStep}`).addClass('green');
                            $(`.step_${currentStep}`).addClass('current_step');
                            currentStep = alphabet[currentStep][letra];
                        } else {
                            error = true;
                            $(`.step_${currentStep}`).addClass('red');
                        }

                        //Se for o ultimo, pressionando Espaço
                        if(last == 32){
                            if(alphabet[currentStep]['end']){
                                $("#table tr").removeClass('current_step');
                                $(`.step_${currentStep}`).addClass('green');
                                $(`.step_${currentStep}`).addClass('current_step');
                                input.val('');
                            }
                        }
                    }
                }
            }
        }
    }
}

function createTable(alphabet){
    let table = $('#table');
    table.html('');

    let header = $(document.createElement('th'));
    let row = $(document.createElement('tr'));

    header.html('Estados');

    row.append(header);
    table.append(row);

    //Colocar letras de A-Z na tabela
    for(let i = firstLetter.charCodeAt(0); i <= lastLetter.charCodeAt(0); i++){
        let header = $(document.createElement('th')); 
        header.append(String.fromCharCode(i))
        row.append(header);
    }

    //Estados
    for(let j = 0; j < alphabet.length; j++){
        let row = $(document.createElement('tr'));
        let cell = $(document.createElement('td'));

        if(alphabet[j]['end']){
            cell.html('q' + alphabet[j]['state'] + '*');
            cell.addClass('end');
            row.addClass('end');
        } else {
            cell.html('q' + alphabet[j]['state']);
        }

        row.append(cell);
        row.addClass(`step_${j}`);

        //Letras/Tokens
        for (var k = firstLetter.charCodeAt(0); k <= lastLetter.charCodeAt(0); k++) {
            let innerCell = $(document.createElement('td'));
            let letra = String.fromCharCode(k);

            innerCell.html(alphabet[j][letra]);

            if(alphabet[j][letra] != '-'){
                innerCell.addClass('step');
            } else {
                innerCell.addClass('empty');
            }

            row.append(innerCell);
        }

        table.append(row);
    }
}