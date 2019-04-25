function myFunction() {
  var spreadsheet = SpreadsheetApp.openById(
    '1QOcgSLSLDkwB70kuAfXHZbmDhSvCTuPppZUpycotPUo'
  );
  var sheet = spreadsheet.getSheetByName('master');
  var values = [['apple'], ['banana'], ['lemon']];
  // A1に'apple'
  // A2に'banana'
  // A3に'apple'
  // をセットする
  sheet.getRange('A1:A3').setValues(values);
  // B4に'melon'をセットする
  sheet.getRange('B4').setValue('melon');
  // 最後の行に'a man', 'a plan', 'panama'をセットする
  sheet.appendRow(['a man', 'a plan', 'panama']);
}
