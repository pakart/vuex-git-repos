function pageRequestConstructor(requestUrl, pageNumber) {
  return requestUrl.replace(requestUrl.match('&page=(\\d+)$')[0], `&page=${pageNumber}`);
}

export default pageRequestConstructor;
