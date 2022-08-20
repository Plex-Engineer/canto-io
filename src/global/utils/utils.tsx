export function classNames(...classes: unknown[]): string {
    return classes.filter(Boolean).join(' ')
  }
  
  
  export const formatNumber = (num: string | number, precision = 2) => {
    const number = Number(num)
    if (isNaN(number)) return '0.00'
    return number.toFixed(precision)
  }
  
  export const formatPercent = (num: string | number) => {
    return formatNumber(Number(num) * 100) + '%'
  }
  
  export const formatBigNumber = (num: string | number) => {
    const number = Number(num)
    if (isNaN(number)) return '0.00'
    const million = number / 1000000
    if (million > 1) {
      return million.toFixed(2) + 'M'
    }
    const kilo = number / 1000
    if (kilo > 1) {
      return kilo.toFixed(2) + 'K'
    } else {
      return formatNumber(number, 4)
    }
  }

  

  export const formatBalance = (num: string | number) => {
    if(Number(num) > 1){
      return (Math.floor(Number(Number(num).toFixed(3))*100)/100).toFixed(2)
    } else if(num == 0){
      return "0.00"
    } else {
      return (Math.floor(Number(Number(num).toFixed(5))*10000)/10000).toFixed(4)
    }
  }


export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'


function toPlainString(num : string) {
  return (''+ +num).replace(/(-?)(\d*)\.?(\d*)e([+-]\d+)/,
    function(a,b,c,d,e) {
      return e < 0
        ? b + '0.' + Array(1-e-c.length).join("0") + c + d
        : b + c + d + Array(e-d.length+1).join("0");
    });
}

export const noteSymbol:string = "Ꞥ";

