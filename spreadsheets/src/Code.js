import { API_ID, AFFILIATE_ID } from 'babel-dotenv';

function myFunction() {
  const spreadsheet = SpreadsheetApp.openById(
    '1QOcgSLSLDkwB70kuAfXHZbmDhSvCTuPppZUpycotPUo'
  );
  const sheet = spreadsheet.getSheetByName('master');
  const values = [['apple'], ['banana'], ['lemon']];
  // A1に'apple'
  // A2に'banana'
  // A3に'apple'
  // をセットする
  sheet.getRange('A1:A3').setValues(values);
  // B4に'melon'をセットする
  sheet.getRange('B4').setValue('melon');
  // 最後の行に'a man', 'a plan', 'panama'をセットする
  sheet.appendRow(['a man', 'a plan', 'panama']);
  // APIのレスポンスを取得
  const response = UrlFetchApp.fetch(
    `https://api.dmm.com/affiliate/v3/ItemList?api_id=${API_ID}&affiliate_id=${AFFILIATE_ID}&site=DMM.com&hits=20&sort=date&keyword=%E3%82%A2%E3%83%8B%E3%83%A1&output=json`
  );
  // レスポンスをパースする
  const data = JSON.parse(response.getContentText());
  const items = data.result.items.map(item => [item.content_id]);
  // 最後に記述されている行を取得
  const lastRow = sheet.getLastRow();
  // 最後に記述されている行からAPIのレスポンスを追記
  sheet
    .getRange('A' + lastRow + ':A' + (items.length + lastRow - 1))
    .setValues(items);
}
