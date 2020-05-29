UI = (function () {
    // public
    var rtn = {
        attrEditWin: function($obj) {
            var init = false;
            var uiFunc = function() {
                var tbl = $('#sys-attrEdit-table');
                tbl.empty();
                var text = $obj.val();
                if(text == null || text == '') {
                    text = '{}';
                }
                eval('var data = ' + text);
                var i = 1;
                for(var idx in data) {
                    var html = '<tr><td><input id="sys_key_' + $obj.prop('id') + '_' + i + '" type="text" style="width:90px;" class="js-sys-attrEdit-input" style="margin-bottom: 0px" value="' + idx + '">:' +
                        '<input id="sys_val_' + $obj.prop('id') + '_' + i + '" type="text" style="width:480px;" class="js-sys-attrEdit-input" style="margin-bottom: 0px" value="' + data[idx] + '">' +
                        '&nbsp;<button class="js-sys-attrEdit-Delete btn btn-danger btn-xs">删除</button></td></tr>';
                    tbl.append($(html));
                    i ++;
                }
                $obj.data('num', i);
                if(init == false) {
                    $obj.after($('#sys-attr-modal'));
                    $('#sys-attr-modal').show();
                }
            }

            var codeFunc = function() {
                var tbl = $('#sys-attrEdit-table');
                tbl.empty();
                var html = '<tr><td><textarea id="sys-attr-textarea" rows="15" class="input-xxlarge">' + $obj.val() + '</textarea></td></tr>';
                tbl.append($(html));
            }

            var uiUpdate = function() {
                var num = parseInt($obj.data('num'));
                var str = '';
                for(var i=1; i<100; i++) {
                    var keyObj = $('#sys_key_' + $obj.prop('id') + '_' + i);
                    if(keyObj.length == 0) continue;
                    str += ',"' + keyObj.val() + '":"' + $('#sys_val_' + $obj.prop('id') + '_' + i).val() + '"';
                }
                if(str != '') {
                    str = str.substring(1);
                }
                str = '{' + str + '}';
                $obj.val(str);
            }

            uiFunc();
            $('#sys-attr-ui').hide();

            $('#sys-attr-ui').click(function() {
                $('#js-sys-attrEdit-add').show();
                $(this).hide();
                $('#sys-attr-code').show();
                uiFunc();
            });

            $('#sys-attr-code').click(function() {
                $('#js-sys-attrEdit-add').hide();
                $(this).hide();
                $('#sys-attr-ui').show();
                codeFunc();
            });

            $('#js-sys-attrEdit-add').click(function() {
                var tbl = $('#sys-attrEdit-table');
                var num = parseInt($obj.data('num'));
                var html = '<tr><td><input id="sys_key_' + $obj.prop('id') + '_' + num + '" type="text" style="width:90px;" class="js-sys-attrEdit-input" style="margin-bottom: 0px" >:' +
                    '<input id="sys_val_' + $obj.prop('id') + '_' + num + '" type="text" style="width:480px;" class="js-sys-attrEdit-input" style="margin-bottom: 0px">' +
                    '&nbsp;<button type="button" class="js-sys-attrEdit-Delete btn btn-danger btn-xs">删除</button></td></tr>';
                tbl.append($(html));
                $obj.data('num', num + 1);
            });

            $('#sys-attrEdit-table').on('click','button', function() {
                var tr = $(this).parent().parent();
                tr.remove();
                uiUpdate();
            });

            $('#sys-attrEdit-table').on('input propertychange', 'textarea', function() {
                $obj.val($(this).val());
            });

            $('#sys-attrEdit-table').on('input propertychange', 'input', function() {
                uiUpdate();
            });

        },
        waitWinOpen: function () {
            var h =$(window).height();
            var w =$(window).width();
            var win = $('#sys-waitingWin');
            win.css('width', w + 'px');
            win.css('height', h + 'px');
            win.show();
            var win1 = $('#sys-waitingWin-ico');
            win1.css('left', w / 2 - 125 + 'px');
            win1.css('top', h /3 + 'px');
            win1.show();
        },
        waitWinClose: function () {
            $('#sys-waitingWin').hide();
            $('#sys-waitingWin-ico').hide();
        }
    };
    return rtn;
})();