<%if(requires) {for (var i = 0; i < requires.length; i++) {%>
require('<%=requires[i]%>');
<%}}%>
require('<%=path%>');

if (module.hot) {
    module.hot.accept('<%=path%>', function () {
        require('<%=path%>')
    })
}