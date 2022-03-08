"use strict";
/** Class Drow vector table */
class VectorTable {
    /**
     * Check exist target element.
     * Throw error if no element.
     * @param  {string} id target ID
     */
    checkTargetId(id) {
        const element = document.getElementById(id);
        if (element === null) {
            throw new Error('No element id=' + id);
        }
    }
    /**
     * Fill setting parameter if not exist.
     * @param  {SettingVectorTable} setting setting parameters for Vector Table
     */
    fillSetting(setting) {
        if (!('row_dir_line' in setting)) {
            setting.row_dir_line = true;
        } //If no row_dir_line
        if (!('col_dir_line' in setting)) {
            setting.col_dir_line = true;
        } //If no col_dir_line
        if (!('stroke_width' in setting)) {
            setting.stroke_width = 1.0;
        } //If no stroke_width
        if (!('stroke' in setting)) {
            setting.stroke = 'black';
        } //If no stroke
        if (!('background_color' in setting)) {
            setting.background_color = 'white';
        } //If no background_color
        if (!('text_font_size' in setting)) {
            setting.text_font_size = 10.0;
        } //If no text_font_size
        if (!('text_font_stroke_width' in setting)) {
            setting.text_font_stroke_width = 0.1;
        } //If no text_font_stroke_width
        if (!('text_font_stroke' in setting)) {
            setting.text_font_stroke = 'black';
        } //If no text_font_stroke
        if (!('text_margin_top' in setting)) {
            setting.text_margin_top = 0.0;
        } //If no text_margin_top
        if (!('text_margin_bottom' in setting)) {
            setting.text_margin_bottom = 0.0;
        } //If no text_margin_bottom
        if (!('text_margin_right' in setting)) {
            setting.text_margin_right = 0.0;
        } //If no text_margin_right
        if (!('text_margin_left' in setting)) {
            setting.text_margin_left = 0.0;
        } //If no text_margin_left
        if (!('outer_frame' in setting)) {
            setting.outer_frame = false;
        } //If no outer_frame
        if (!('outer_frame_stroke_width' in setting)) {
            setting.outer_frame_stroke_width = setting.stroke_width;
        } //If no outer_frame_stroke_width
        if (!('outer_frame_stroke' in setting)) {
            setting.outer_frame_stroke = setting.stroke;
        } //If no outer_frame_stroke
        if (!('header_row' in setting)) {
            setting.header_row = false;
        } //If no header_row
        if (!('header_col' in setting)) {
            setting.header_col = false;
        } //If no header_col
        if (!('header_col_pos' in setting)) {
            setting.header_col_pos = 0;
        } //If no header_col_pos
        if (!('header_stroke_width' in setting)) {
            setting.header_stroke_width = setting.stroke_width;
        } //If no header_stroke_width
        if (!('header_stroke' in setting)) {
            setting.header_stroke = setting.stroke;
        } //If no header_stroke
        if (!('header_font_stroke_width' in setting)) {
            setting.header_font_stroke_width = setting.text_font_stroke_width;
        } //If no header_font_stroke_width
        if (!('header_font_stroke' in setting)) {
            setting.header_font_stroke = setting.text_font_stroke;
        } //If no header_font_stroke
        if (!('header_background_color' in setting)) {
            setting.header_background_color = setting.background_color;
        } //If no header_background_color
    }
}
/**
 * Drow Table using SVG.
 * @param  {string} id Target id
 * @param  {SettingVectorTable} setting Drow Setting
 * @param  {Array<Array<object>>} head Table head
 * @param  {Array<Array<string>>} body Table body
 */
function addVectorTable(id, setting, head, body) {
    try {
        let vectorTable = new VectorTable();
        vectorTable.checkTargetId(id);
        vectorTable.fillSetting(setting);
        console.log(setting);
    }
    catch (error) {
        throw new Error(error + ' [vectorTable]');
    }
}
