/**
 * Created by moyu on 2017/7/30.
 */
require('/Users/moyu/my-code/NodeCode/fly-js/test/app/test.js')

if (module.hot) {
    module.hot.accept('/Users/moyu/my-code/NodeCode/fly-js/test/app/test.js', function () {
        require('/Users/moyu/my-code/NodeCode/fly-js/test/app/test.js')
    })
}