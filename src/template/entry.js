/**
 * Created by moyu on 2017/7/30.
 */
require('<%=path%>')

if (module.hot) {
    module.hot.accept('<%=path%>', function () {
        require('<%=path%>')
    })
}