"use strict";
/** Class Drow vector table */
class VectorTable {
    /**
     * Check exist target element.
     * Throw error if no element.
     * @param  {string} id target ID
     * @throws {string} throw error if can not catch element by id.
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
    /**
     * Gen divided data from input header data.
     * @param  {any} head Header data
     * @returns {Array<Array<HeaderObject>>} Devided header data.
     * @throws {string} Header data is not Array.
     * @throws {string} Header struct is not expected.
     * @throws {string} row_span is smaller than 0.
     * @throws {string} Header data has a worng data
     * @throws {string} row_span has to be 1 or more
     * @throws {string} row_span has to be same as header row count or less
     */
    divideHeader(head) {
        if (toString.call(head) !== "[object Array]") {
            throw Error("Header data should be Array");
        }
        let divideData = new Array();
        let flg_matrix = false;
        //Check header struct
        head.forEach((h1) => {
            if (toString.call(h1) === "[object Array]") { //more than 2 lines
                flg_matrix = true;
                return true;
            }
            else if (toString.call(h1) === "[object Object]") { //only 1 line
                return true;
            }
            else {
                throw Error("Header data struct is not expected");
            }
        });
        if (!flg_matrix) { //if struct is 1D array
            let lineData = new Array();
            head.forEach((element) => {
                if ("row_span" in element) {
                    if (element.row_span < 1) {
                        throw Error("row_span has to be 1 or more");
                    }
                    lineData.push(element);
                    for (let i = 1; i < element.row_span; i++) {
                        let temp = new Object();
                        lineData.push(temp);
                    }
                }
            });
            divideData.push(lineData);
        }
        else { // if struct is 2D array
            for (let i = 0; i < head.length; i++) {
                let row = new Array();
                divideData.push(row);
            }
            for (let i = 0; i < head.length; i++) {
                for (let j = 0; j < head[i].length; j++) {
                    if (toString.call(head[i][j]) !== "[object Object]") {
                        throw Error("Header data has a worng data");
                    }
                    if ("row_span" in head[i][j]) { //If row span is 1 or more
                        //Check row_span
                        if (head[i][j].row_span < 1) {
                            throw Error("row_span has to be 1 or more");
                        }
                        else if (head[i][j].row_span > head.length - i) {
                            throw Error("row_span has to be same as header row count or less");
                        }
                        for (let k = i; k < i + head[i][j].row_span; k++) {
                            if ("col_span" in head[i][j]) {
                                if (head[i][j].col_span < 1) {
                                    throw Error("col_span has to be 1 or more");
                                }
                                divideData[k].push(head[i][j]);
                                for (let l = 1; l < head[i][j].col_span; l++) {
                                    let temp = new Object();
                                    divideData[k].push(temp);
                                }
                            }
                            else { //If col span is undefined
                                if (k == i) {
                                    divideData[k].push(head[i][j]);
                                }
                                else {
                                    let temp = new Object();
                                    divideData[k].push(temp);
                                }
                            }
                        }
                    }
                    else { //If row span is undefined
                        if ("col_span" in head[i][j]) {
                            if (head[i][j].col_span < 1) {
                                throw Error("col_span has to be 1 or more");
                            }
                            divideData[i].push(head[i][j]);
                            for (let k = 1; k < head[i][j].col_span; k++) {
                                let temp = new Object();
                                divideData[i].push(temp);
                            }
                        }
                        else { //If col span is undifined
                            divideData[i].push(head[i][j]);
                        }
                    }
                }
            }
        }
        return divideData;
    }
}
/**
 * Drow Table using SVG.
 * @param  {string} id Target id
 * @param  {SettingVectorTable} setting Drow Setting
 * @param  {Array<Array<object>>} head Table head
 * @param  {Array<Array<string>>} body Table body
 * @throws {string} Throw error if error in function
 */
function addVectorTable(id, setting, head, body) {
    try {
        let vectorTable = new VectorTable();
        vectorTable.checkTargetId(id);
        vectorTable.fillSetting(setting);
        vectorTable.divideHeader(head);
        let divideHeader = vectorTable.divideHeader(head);
        console.log(divideHeader);
    }
    catch (error) {
        throw new Error(error + ' [vectorTable]');
    }
}
