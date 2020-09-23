// mixin中相同对象中的属性会合并起来, 方法同名会覆盖,
// 所以可以在mixin中写入需要被很多地方通用的结构
import { getTypeCode, getPoolList, getBrandList } from './common'

export default {
  async created() {
    const params = { dictCodes: ['ONFFLINE_STATUS'] }
    const res = await getTypeCode(params)
    this.$set(this.config.searchBar[5], 'options', res.data.data.ONFFLINE_STATUS.dictItems)
    const resBrand = await getBrandList()
    this.$set(this.config.searchBar[1], 'options', resBrand.data.data)
    // 为brand赋值
    const resPool = await getPoolList()
    this.$set(this.config.searchBar[0], 'options', resPool.data.data)
    // 为店铺赋值
  }
}
