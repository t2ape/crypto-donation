const dateToSecond = (millisecondTime) => {
  let value;
  if (millisecondTime === undefined || millisecondTime === null) {
    // ブロックチェーンへのデータの保存上、何かしらの数値を入れる必要がある
    value = 0;
  } else if (Number.isNaN(Date.parse(millisecondTime))) {
    value = null;
  } else {
    value = Math.floor(Date.parse(millisecondTime) / 1000);
  }
  return value;
};

export default dateToSecond;
