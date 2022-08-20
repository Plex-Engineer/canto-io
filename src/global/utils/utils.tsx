export function classNames(...classes: unknown[]): string {
    return classes.filter(Boolean).join(' ')
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

export const noteSymbol:string = "Ꞥ";

export function truncateNumber(value:number, decimals:number) {
  return (Math.trunc(value * Math.pow(10,decimals))/Math.pow(10,decimals))
}

export function truncateByZeros(value:string) {
  if (Number(value) > 1) {
      return truncateNumber(Number(value), 4);
  }
  return truncateNumber(Number(value), findFirstNonZero(value) + 4);

}

function findFirstNonZero(value:string) : number{
  for (let i = 2; i<value.length; i++) {
      if (value[i] != "0") {
          return i - 1;
      }
  }
  return value.length - 1;
}