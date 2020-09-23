// 获取url参数(&符号拼接参数)
export const getQueryString = (name) => {
  var str = window.location.href.split('?')[1].split(name)[1]
  str = str.split('=')[1]
  if (str.indexOf('&') > 0) {
    str = str.split('&')[0]
  }
  return str
}
