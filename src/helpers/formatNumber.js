export function setFormatMoneyBr( value ){

    if ( value == undefined ) {
        return 0;
    }

    value = value.toString().replace(/\D/g, "");
    // value = value.replace(/0+$/g,'');
    value = value/100;
    

    const numberFormat = (value) =>
        new Intl.NumberFormat('pt-br', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2
    }).format(value);

    if ( !isNaN(value) ) {
        return numberFormat(value).replace('R$', '');
    } else {
        return numberFormat(0).replace('R$', '');
    }
}

export function setFormatDecimal( value ){

    if ( value == undefined ) {
        return 0;
    }
    value = value.toString().replace(/\D/g, "");
    // value = value.replace(/0+$/g,'');
    value = value/100;
    
    if ( !isNaN(value) ) {
        return parseFloat(value).toFixed(2);
    } else {
        return 0;
    }
}

export function setFormatNumber( value ){

    value = value.toString().replace(/\D/g, "");
    
    value = value.toString().length == 0 ? 0 : value;
    
    if ( !isNaN(value) ) {
        return parseInt(value);
    } else {
        return 0;
    }
}