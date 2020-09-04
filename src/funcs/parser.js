function getPaginationParams(linkHeader, requestUrl) {
  const cP = Number.parseInt(requestUrl.match('&page=(\\d+)')[1], 10);
  const paginationParams = {
    currentPage: cP,
    nextPage: linkHeader.match('page=(\\d+)>; rel="next"')
      ? Number.parseInt(linkHeader.match('page=(\\d+)>; rel="next"')[1], 10) : cP,
    prevPage: linkHeader.match('page=(\\d+)>; rel="prev"')
      ? Number.parseInt(linkHeader.match('page=(\\d+)>; rel="prev"')[1], 10) : 1,
    lastPage: linkHeader.match('page=(\\d+)>; rel="last"')
      ? Number.parseInt(linkHeader.match('page=(\\d+)>; rel="last"')[1], 10) : cP,
  };
  return paginationParams;
}

export default getPaginationParams;
