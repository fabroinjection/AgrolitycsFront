export function cuilValidator(cuil) {
    if (cuil.length !== 11) {
      return false;
    }
  
    const [checkDigit, ...rest] = cuil
      .split('')
      .map(Number)
      .reverse();
  
    const total = rest.reduce((acc, cur, index) => acc + cur * (2 + (index % 6)), 0);
  
    const mod11 = 11 - (total % 11);
  
    if (mod11 === 11) {
      return checkDigit === 0;
    }
  
    if (mod11 === 10) {
      return false;
    }
  
    return checkDigit === mod11;
  }
  