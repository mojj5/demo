/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
    config.toolbar = 'MyToolbar';//把默认工具栏改为‘MyToolbar’
    // config.toolbar_Full =
    config.toolbar_MyToolbar =
        [
            // { name: 'document', items : [ 'Source','-','Save','NewPage','DocProps','Preview','Print','-','Templates' ] },
            // { name: 'clipboard', items : [ 'Cut','Copy','Paste','PasteText','PasteFromWord','-','Undo','Redo' ] },
            // { name: 'editing', items : [ 'Find','Replace','-','SelectAll','-','SpellChecker', 'Scayt' ] },
            // { name: 'forms', items : [ 'Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton',
            //         'HiddenField' ] },
            // '/',
            { name: 'basicstyles', items : [ 'Bold','Italic','Underline','Strike','Subscript','Superscript','-','RemoveFormat' ] },
            { name: 'paragraph', items : [ 'NumberedList','BulletedList','-','Outdent','Indent','-','Blockquote','CreateDiv',
                    '-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','-','BidiLtr','BidiRtl' ] },
            // { name: 'links', items : [ 'Link','Unlink','Anchor' ] },
            // { name: 'insert', items : [ 'Image','Flash','Table','HorizontalRule','Smiley','SpecialChar','PageBreak','Iframe' ] },
            '/',
            { name: 'styles', items : [ 'Styles','Format','Font','FontSize' ] },
            { name: 'colors', items : [ 'TextColor','BGColor' ] },
            { name: 'tools', items : [ 'Maximize'/*, 'ShowBlocks','-','About'*/ ] }
]
    config.font_names='宋体/SimSun;新宋体/NSimSun;仿宋_GB2312/FangSong_GB2312;楷体_GB2312/KaiTi_GB2312;黑体/SimHei;微软雅黑/Microsoft YaHei;'+ config.font_names;

};
