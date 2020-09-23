import Axios from '@/utils/request'
export const downloadFun = (downurl, parmms) => {
  Axios({ method: 'get',
    url: downurl,
    params: parmms,
    responseType: 'blob'
  }).then((res) => {
    const blob = new Blob([res.data], { type: 'application/octet-stream' })
    const url = window.URL.createObjectURL(blob)
    // 通过创建a标签实现
    const link = document.createElement('a')
    link.href = url
    // 对下载的文件命名
    link.download = decodeURI(res.headers['content-disposition'].split('=')[1]) || '下载.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  })
}
export const downloadFunPost = (downurl, data) => {
  Axios({ method: 'post',
    url: downurl,
    data: data,
    responseType: 'blob'
  }).then((res) => {
    const blob = new Blob([res.data], { type: 'application/octet-stream' })
    const url = window.URL.createObjectURL(blob)
    // 通过创建a标签实现
    const link = document.createElement('a')
    link.href = url
    // 对下载的文件命名
    link.download = decodeURI(res.headers['content-disposition'].split('=')[1]) || '下载.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  })
}
