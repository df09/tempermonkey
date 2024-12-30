(function() {
  'use strict';

  // TODO: перейти на yaml
  // input:
  //   panl-12cl_door-38cl_panl-38cl: test_A1 test_B2 test_C3
  //   panl-38cl_door-38cl_panl-12cl: test_D4 test_E5 test_F6
  // output: [
  //   [test_A1, 12cl, panl],
  //   [test_A1, 38cl, door],
  //   [test_B2: 12cl, panl],
  //   ...
  // ]
  function getBarcodesData(textarea) {
    const result = [];
    const lines = textarea.value.trim().split('\n');
    lines.forEach((line) => {
      line = line.trim();
      line = line.replace(/\s+/g, ' ');
      if (!line) return;
      const [locParams, locs] = line.split(':').map((part) => part.trim());
      if (!locParams || !locs) {
        throw new Error(`Некорректная строка: "${line}"`);
      }
      const foParams = locParams.split('_').map((pair) => {
        const [fo, glass] = pair.split('-');
        if (!fo || !glass) {
          throw new Error(`Некорректная пара: "${pair}"`);
        }
        return { fo, glass };
      });
      locs.split(' ').forEach((loc) => {
        foParams.forEach(({ fo, glass }) => {
          console.log(loc, glass, fo)
          result.push([loc, glass, fo]);
        });
      });
    });
    console.log('Formatted Data:', result);
    return result;
  }
  function getJobId() {
    try {
      const match = window.location.href.match(/\/jobs\/(\d+)/);
      if (match && match[1]) {
        const jobId = match[1];
        console.log('getJobId:', jobId);
        return jobId;
      }
      abort('getJobId - Job ID not found in the URL');
    } catch (error) {
      abort('getJobId - Error extracting Job ID:', error.message);
    }
  }
  function getFosId() {
    try {
      const viewFoSelector = "a[href*='/fabrication_orders/'][href$='/edit']";
      const match = getEl(viewFoSelector).href.match(/\/fabrication_orders\/(\d+)\/edit/);
      if (match && match[1]) {
        const fosId = match[1];
        console.log('getFosId:', fosId);
        return fosId;
      }
      abort('getFosId - fosId not found in "View FO" button href');
    } catch (error) {
      abort('getFosId - Error extracting fosId:', error.message);
    }
  }
  // TODO: УБЕДИТЬСЯ ЧТО НЕТ N/A ПЕРЕД ЗАПУСКОМ
  // TODO: УБЕДИТЬСЯ ЧТО НЕТ N/A ПЕРЕД ЗАПУСКОМ
  // TODO: УБЕДИТЬСЯ ЧТО НЕТ N/A ПЕРЕД ЗАПУСКОМ
  // TODO: УБЕДИТЬСЯ ЧТО НЕТ N/A ПЕРЕД ЗАПУСКОМ
  // TODO: гарантировать что каждый когда поток заканчиватся ошибкой данные будут очищаться
  // TODO:   даже если не мой exception а стандартный
  // TODO:   предустмотреть другие случаи внезапного завершения потока, если существуют
  // TODO:
  // TODO: Shift+j - go to jobId
  // TODO: Shift+a - search active jobs
  // TODO: Shift+i - search inactive jobs
  // TODO:
  // TODO: вместо alert использовать custom modals - ok,note,error - info,y/n
  // TODO:
  // TODO: next:
  // TODO:   добавить меню на все страницы
  // TODO:   добавить кпопку очистить storage
  // TODO:   отображение кнопок должно зависеть от того что в хранилице
  // TODO:   добавить меню с breadcrumbs
  // TODO:     у input должны быть примеры данных
  // TODO:   добавить кнопку пауза
  function start() {
    // storage
    tmsDeleteAll();
    tmsSetState('createBarcodes:start');
    // get data
    const barcodesData = getBarcodesData(getEl(tmMenuTextareaSelector));
    const jobId = getJobId();
    const fosId = getFosId();
    tmsSet('tm_barcodesData', barcodesData);
    tmsSet('tm_jobId', jobId);
    tmsSet('tm_fosId', fosId);
    // redirect
    redirect(`http://bravura-crm.com/fabrication_orders/${fosId}/new_product`);
  }

  // === action ============================================
  tmsDeleteAll();
  tmMenuAdd();
  getEl(tmMenuStartSelector).addEventListener('click', () => start());
})();