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

export function truncateNumber(value:string, decimals?: number) {
  const decimalLocation = value.indexOf('.');
  if (Number(value) == 0) {
    return "0";
  }
  if (decimalLocation == -1) {
    return value;
  }
  if (!decimals) {
    if (Number(value) > 1) {
      return value.slice(0, decimalLocation + 5)
    }
    return value.slice(0, findFirstNonZeroAfter(value, decimalLocation) + 5);
  }
  return value.slice(0, decimalLocation + decimals)

}

function findFirstNonZeroAfter(value: string, after: number) {
  for (let i = after + 1 ; i<value.length; i++) {
    if (value[i] != "0") {
      return i-1;
    }
  }
  return value.length -1;
}

function findFirstNonZero(value:string) : number{
  for (let i = 2; i<value.length; i++) {
      if (value[i] != "0") {
          return i - 1;
      }
  }
  return value.length - 1;
}