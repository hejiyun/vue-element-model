// mixin中相同对象中的属性会合并起来, 方法同名会覆盖,
// 所以可以在mixin中写入需要被很多地方通用的结构
import { getPoolList, getBrandList } from './common'

export default {
  async created() {
    const resBrand = await getBrandList()
    this.$set(this.config.searchBar[1], 'options', resBrand.data.data)
    // 为brand赋值
    const resPool = await getPoolList()
    this.$set(this.config.searchBar[0], 'options', resPool.data.data)
    // 为店铺赋值
  }
}
