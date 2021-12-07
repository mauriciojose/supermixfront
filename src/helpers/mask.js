
    const removeItens = (value, mascara) => {
        for (let index = 0; index < mascara.length; index++) {
            const element = mascara[index].toString();
            // console.log(typeof element, element, element.length, element != "#");
            if (element != "#") {
                // console.log("aquiiiiiii");
                let re = new RegExp(element, 'g');
                value = value.replace(element,"");
            }
        }
        return value;
    }
    
    const existeItem = (value, mascara) => {
        for (let index = 0; index < mascara.length; index++) {
            const element = mascara[index];
            if (value[value.length-1] == element && element != "#") {
                return value.substring(0, value.length-1);
            }
        }
        return value;
    }

    const mascara = (id, mask) => {
        id = removeItens(id, mask);
        console.log(id);
        let mascara = mask;
        for (let index = 0; index < id.length; index++) {
            mask = mask.replace("#",id[index]);
        }
        let retorno = '';
        for (let index = 0; index < mask.length; index++) {
            const element = mask[index];
            if (element != "#") {
                retorno += ""+element;
            }else{
                break;
            }
        }
        retorno = existeItem(retorno, mascara);
        return retorno;
    }

    const setNumber = (value) => {
        return value.replace(/[^0-9\.]/g,'');
    }

    export function handleChangeMask (event){
        event.preventDefault();
        let change = {};

        let isNumber = event.target.attributes.number;

        let mask = event.target.attributes.mask;
        let value = event.target.value;

        value = isNumber ? setNumber(value) : value;

        let valueMask =  !mask ? value :  mascara( value, mask.value.toString() );

        return valueMask;
    }
