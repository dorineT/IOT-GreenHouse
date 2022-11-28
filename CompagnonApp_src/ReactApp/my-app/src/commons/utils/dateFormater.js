/**
 * Converts a standard Date object into a displayable string
 * @param {Object} date - The date object
 * @returns {string} - The date converted to a string
 */
function dateToString(dateObj) {

  const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

  return `Le ${dateObj.getDate()} ${months[dateObj.getMonth()]} à ${zeroFill(dateObj.getHours(), 2)}h${zeroFill(dateObj.getMinutes(), 2)}`;
}

/**
 * Converts a number into a string and prepends 0s
 * @param {integer} number - The number to convert to string
 * @param {integer} length - The length of the returned string
 * @returns {string} - String of set length representing the number
 * @example zeroFill(3,4) == "0003"
 */
function zeroFill(number, length){

    let num = number.toString();

    let missing = length-num.length;
    let prefix = "";
    for(let i = 0; i < missing; i++){
        prefix += "0";
    }
    prefix += num;

    return prefix;
}



function padTo2Digits(num) {
  return String(num).padStart(2, '0');
}

function formatDate(current){
  const yyyy = current.getFullYear();
  let mm = current.getMonth() + 1; // Months start at 0!
  let dd = current.getDate();

  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;
  const hoursAndMinutes = padTo2Digits(current.getHours()) + 'h' + padTo2Digits(current.getMinutes());
  
  return dd + '/' + mm + '/' + yyyy + ' à ' + hoursAndMinutes;      
}

export {dateToString, formatDate};
