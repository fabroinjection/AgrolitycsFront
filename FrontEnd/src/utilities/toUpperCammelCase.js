export function toUpperCamelCase(str) {
    return str.toLowerCase().replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return word.toUpperCase();
    });
}