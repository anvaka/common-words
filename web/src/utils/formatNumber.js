export default formatNumber;

function formatNumber(number) {
  return number.toString(10).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
}
