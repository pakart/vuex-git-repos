// функция сборки строки запроса

function makeRequestString(searchParams) {
  // если поле ввода пустое используем базовый url
  let requestBaseUrl = 'https://api.github.com/search/repositories?q=followers:%3E1&sort=followers&per_page=10&page=1';
  if (searchParams.repo_name === '') return requestBaseUrl;
  // иначе вкручиваем в него q параментры
  requestBaseUrl = `https://api.github.com/search/repositories?q=${searchParams.repo_name}&sort=stars&per_page=10&page=1`;
  return requestBaseUrl;
}

export default makeRequestString;
