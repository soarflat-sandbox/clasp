import { API_ID, AFFILIATE_ID } from 'babel-dotenv';

function setTrigger() {
  let triggerDay = new Date();
  triggerDay.setHours(4);
  triggerDay.setMinutes(0);
  ScriptApp.newTrigger('main')
    .timeBased()
    .at(triggerDay)
    .create();
}

// その日のトリガーを削除する関数(消さないと残る)
function deleteTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() == 'main') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
}

function main() {
  deleteTrigger();

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
  // B1の値（時刻）をパラメータとして利用
  const date = sheet.getRange('B1').getValue();
  // B1に値がなければ、現在時刻をセットする。
  if (!date) {
    sheet.getRange('B1').setValue(getTodayDate());
  }
  // APIのレスポンスを取得
  const response = UrlFetchApp.fetch(
    `https://api.dmm.com/affiliate/v3/ItemList?api_id=${API_ID}&affiliate_id=${AFFILIATE_ID}&site=DMM.com&hits=20&sort=date&keyword=%E3%82%A2%E3%83%8B%E3%83%A1&gte_date=${date}&output=json`
  );
  // レスポンスをパースする
  const data = JSON.parse(response.getContentText());
  // レスポンスから商品IDを抽出した配列を生成
  const ids = data.result.items.map(item => item.content_id);
  // 最後に記述されている行を取得
  const lastRow = sheet.getLastRow();
  // A列に記述されている全ての値を連想配列で取得し、1次元の配列に変換する
  const currentIds = sheet
    .getRange(`A1:A${lastRow}`)
    .getValues()
    .map(v => v[0]);
  Logger.log(currentIds);
  // 取得したIDからすでに存在するIDを取り除き、連想配列にする。
  const filterdIds = ids
    .filter(id => currentIds.indexOf(id) < 0)
    .map(id => [id]);
  if (filterdIds.length < 1) return;
  // 最後に記述されている行からAPIのレスポンスを追記
  sheet
    .getRange(`A${lastRow}:A${filterdIds.length + lastRow - 1}`)
    .setValues(filterdIds);
}
