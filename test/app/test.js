/**
 * Created by moyu on 2017/7/30.
 */

import $ from 'jquery'
import _ from 'lodash'

class App {
    init() {

        $('#root').html(`<h1>TESssT relwwwosad OK是ss吗学ssww习?${_.join(['a', 'b'], '-')}</h1>`)
    }
}
new App().init()