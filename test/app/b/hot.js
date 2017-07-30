/**
 * Created by moyu on 2017/7/30.
 */

require('./index')

if (module.hot) {

    module.hot.accept('./', () => {
        require('./index')
    })
}