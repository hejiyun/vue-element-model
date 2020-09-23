/**
 * Created by jiachenpan on 16/11/18.
 */

export function isvalidUsername(str) {
  // const valid_map = ['admin', 'editor']
  // return valid_map.indexOf(str.trim()) >= 0
  const reg = /^[a-zA-Z0-9]+$/
  return reg.test(str)
}
// 8-15位区分大小写
export function validatePassword(str) {
  const policyPatternRegex = /^((?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,15})|((?=.*[0-9])(?=.*[a-z])(?=.*[.@#$%^&+=!]).{8,15})|((?=.*[0-9])(?=.*[A-Z])(?=.*[.@#$%^&+=!]).{8,15})|((?=.*[a-z])(?=.*[A-Z])(?=.*[.@#$%^&+=!]).{8,15})$/
  // const policyPatternRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[.@#$%^&+=!]).{8,15}$/
  // const policyPatternRegex = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[.@#$%^&+=!]).{8,15}$/
  // const policyPatternRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[.@#$%^&+=!]).{8,15}$/
  // const policyPatternRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[.@#$%^&+=!]).{8,15}$/
  return policyPatternRegex.test(str)
}

// 匹配关键词
export function validatePasswordKeywords(str) {
  // 关键字
  const policyPatternRegexKeywords = /(?!.*ADMIN|.*PASSWORD|.*ABC|.*TEST)^.*/

  return policyPatternRegexKeywords.test(str)
}

// 匹配连续数字
export function validatePasswordNums(str) {
  // 关键字
  const policyPatternRegexNums = /(0(?=1)|1(?=2)|2(?=3)|3(?=4)|4(?=5)|5(?=6)|6(?=7)|7(?=8)|8(?=9)){3}/

  return policyPatternRegexNums.test(str)
}
// 获取字符串重复最多字符 个数
export function maxCount(str) {
  var obj = {}
  for (var i = 0; i < str.length; i++) {
    var key = str[i]
    if (obj[key]) {
      obj[key]++
    } else {
      obj[key] = 1
    }
  }
  var maxCount = 0
  for (var k in obj) {
    if (maxCount < obj[k]) {
      maxCount = obj[k]
    }
  }
  return maxCount
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validateAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * validate email
 * @param email
 * @returns {boolean}
 */
export function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}
