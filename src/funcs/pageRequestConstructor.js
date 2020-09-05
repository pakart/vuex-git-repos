// тупо меняем номер страницы для запроса
// можно файл выпиливать и строку эту в сам запрос перенести

function pageRequestConstructor(requestUrl, pageNumber) {
  return requestUrl.replace(requestUrl.match('&page=(\\d+)$')[0], `&page=${pageNumber}`);
}

export default pageRequestConstructor;
