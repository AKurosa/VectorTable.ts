"use strict";
class CellSize {
    constructor() {
        this.w = 0.0;
        this.h = 0.0;
        this.row = true;
        this.col = true;
        this.x = 0.0;
        this.y = 0.0;
    }
}
class SvgSize {
    constructor() {
        this.w = 0.0;
        this.h = 0.0;
    }
}
const theXmlns = "http://www.w3.org/2000/svg";
const classVtTable = "_vtTable";
const classVtContext = "_vt-context";
const classVtContextBase = "_vt-context-base";
const zoomDelta = 1.1;
let panFlg = false;
const contextmenuNum = 1;
const contextFontSize = 15;
const contextmenuWidth = 100;
const textOffset = 0.2;
// Reset mousemove event by mouseup on document
function mouseUp(event) {
    panFlg = false;
}
document.addEventListener('mouseup', mouseUp);
/**
 * Contextmenu mouseover event.
 * change color to dark.
 *
 * @param  {HTMLElementEvent<HTMLElement>} event
 */
function contextMouseOver(event) {
    console.log("over");
    event.target.setAttribute("fill-opacity", "10%");
}
/**
 * Contextmenu mouseleave event.
 * change color to default.
 *
 * @param  {HTMLElementEvent<HTMLElement>} event
 */
function contextMouseLeave(event) {
    console.log("leave");
    event.target.setAttribute("fill-opacity", "0%");
}
function saveAsPng(event) {
    console.log("down");
}
/** Class Drow vector table */
class VectorTable {
    constructor() {
        this.panTarget = document.createElementNS(theXmlns, "svg");
        this.panStartPt = this.panTarget.createSVGPoint();
        this.panViewBox = new Array(4);
        this.panTargetW = 0.0;
        this.panTargetH = 0.0;
        this.contextmenuTarget = document.createElement("div");
    }
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
        else {
            if (toString.call(setting.row_dir_line) != "[object Boolean]") {
                throw Error("row_dir_line in setting has to be Boolean");
            }
        }
        if (!('col_dir_line' in setting)) {
            setting.col_dir_line = true;
        } //If no col_dir_line
        else {
            if (toString.call(setting.col_dir_line) != "[object Boolean]") {
                throw Error("col_dir_line in setting has to be Boolean");
            }
        }
        if (!('stroke_width' in setting)) {
            setting.stroke_width = 1.0;
        } //If no stroke_width
        else {
            if (toString.call(setting.stroke_width) != "[object Number]") {
                throw Error("stroke_width in setting has to be Number");
            }
            if (setting.stroke_width < 0) {
                throw Error("stroke_width in setting has to be 0.0 or over");
            }
        }
        if (!('stroke' in setting)) {
            setting.stroke = 'black';
        } //If no stroke
        else {
            if (toString.call(setting.stroke) != "[object String]") {
                throw Error("stroke in setting has to be String");
            }
        }
        if (!('background_color' in setting)) {
            setting.background_color = 'white';
        } //If no background_color
        else {
            if (toString.call(setting.background_color) != "[object String]") {
                throw Error("background_color in setting has to be String");
            }
        }
        if (!('text_font_size' in setting)) {
            setting.text_font_size = 10.0;
        } //If no text_font_size
        else {
            if (toString.call(setting.text_font_size) != "[object Number]") {
                throw Error("text_font_size in setting has to be Number");
            }
            if (setting.text_font_size < 0) {
                throw Error("text_font_size in setting has to be 0.0 or over");
            }
        }
        if (!('text_font_stroke_width' in setting)) {
            setting.text_font_stroke_width = 0.1;
        } //If no text_font_stroke_width
        else {
            if (toString.call(setting.text_font_stroke_width) != "[object Number]") {
                throw Error("text_font_stroke_width in setting has to be Number");
            }
            if (setting.text_font_stroke_width < 0) {
                throw Error("text_font_stroke_width in setting has to be 0.0 or over");
            }
        }
        if (!('text_font_stroke' in setting)) {
            setting.text_font_stroke = 'black';
        } //If no text_font_stroke
        else {
            if (toString.call(setting.text_font_stroke) != "[object String]") {
                throw Error("text_font_stroke in setting has to be Number");
            }
        }
        if (!('text_margin_top' in setting)) {
            setting.text_margin_top = 0.0;
        } //If no text_margin_top
        else {
            if (toString.call(setting.text_margin_top) != "[object Number]") {
                throw Error("text_margin_top in setting has to be Number");
            }
            if (setting.text_margin_top < 0) {
                throw Error("text_margin_top in setting has to be 0.0 or over");
            }
        }
        if (!('text_margin_bottom' in setting)) {
            setting.text_margin_bottom = 0.0;
        } //If no text_margin_bottom
        else {
            if (toString.call(setting.text_margin_bottom) != "[object Number]") {
                throw Error("text_margin_bottom in setting has to be Number");
            }
            if (setting.text_margin_bottom < 0) {
                throw Error("text_margin_bottom in setting has to be 0.0 or over");
            }
        }
        if (!('text_margin_right' in setting)) {
            setting.text_margin_right = 0.0;
        } //If no text_margin_right
        else {
            if (toString.call(setting.text_margin_right) != "[object Number]") {
                throw Error("text_margin_right in setting has to be Number");
            }
            if (setting.text_margin_right < 0) {
                throw Error("text_margin_right in setting has to be 0.0 or over");
            }
        }
        if (!('text_margin_left' in setting)) {
            setting.text_margin_left = 0.0;
        } //If no text_margin_left
        else {
            if (toString.call(setting.text_margin_left) != "[object Number]") {
                throw Error("text_margin_left in setting has to be Number");
            }
            if (setting.text_margin_left < 0) {
                throw Error("text_margin_left in setting has to be 0.0 or over");
            }
        }
        if (!('outer_frame' in setting)) {
            setting.outer_frame = false;
        } //If no outer_frame
        else {
            if (toString.call(setting.outer_frame) != "[object Boolean]") {
                throw Error("outer_frame in setting has to be Boolean");
            }
        }
        if (!('outer_frame_stroke_width' in setting)) {
            setting.outer_frame_stroke_width = setting.stroke_width;
        } //If no outer_frame_stroke_width
        else {
            if (toString.call(setting.outer_frame_stroke_width) != "[object Number]") {
                throw Error("outer_frame_stroke_width in setting has to be Number");
            }
            if (setting.outer_frame_stroke_width < 0) {
                throw Error("outer_frame_stroke_width in setting has to be 0.0 or over");
            }
        }
        if (!('outer_frame_stroke' in setting)) {
            setting.outer_frame_stroke = setting.stroke;
        } //If no outer_frame_stroke
        else {
            if (toString.call(setting.outer_frame_stroke) != "[object String]") {
                throw Error("outer_frame_stroke in setting has to be String");
            }
        }
        if (!('header_row' in setting)) {
            setting.header_row = false;
        } //If no header_row
        else {
            if (toString.call(setting.header_row) != "[object Boolean]") {
                throw Error("header_row in setting has to be Boolean");
            }
        }
        if (!('header_col' in setting)) {
            setting.header_col = false;
        } //If no header_col
        else {
            if (toString.call(setting.header_col) != "[object Boolean]") {
                throw Error("header_col in setting has to be Boolean");
            }
        }
        if (!('header_col_pos' in setting)) {
            setting.header_col_pos = 0;
        } //If no header_col_pos
        else {
            if (toString.call(setting.header_col_pos) != "[object Number]") {
                throw Error("header_col_pos in setting has to be Number");
            }
            if (!Number.isInteger(setting.header_col_pos)) {
                throw Error("header_col_pos in setting has to be Integer");
            }
            if (setting.header_col_pos < 0) {
                throw Error("header_col_pos in setting has to be 0 or over");
            }
        }
        if (!('header_stroke_width' in setting)) {
            setting.header_stroke_width = setting.stroke_width;
        } //If no header_stroke_width
        else {
            if (toString.call(setting.header_stroke_width) != "[object Number]") {
                throw Error("header_stroke_width in setting has to be Number");
            }
            if (setting.header_stroke_width < 0) {
                throw Error("header_stroke_width in setting has to be 0.0 or over");
            }
        }
        if (!('header_stroke' in setting)) {
            setting.header_stroke = setting.stroke;
        } //If no header_stroke
        else {
            if (toString.call(setting.header_stroke) != "[object String]") {
                throw Error("header_stroke in setting has to be String");
            }
        }
        if (!('header_font_stroke_width' in setting)) {
            setting.header_font_stroke_width = setting.text_font_stroke_width;
        } //If no header_font_stroke_width
        else {
            if (toString.call(setting.header_font_stroke_width) != "[object Number]") {
                throw Error("header_font_stroke_width in setting has to be Number");
            }
            if (setting.header_font_stroke_width < 0) {
                throw Error("header_font_stroke_width in setting has to be 0.0 or over");
            }
        }
        if (!('header_font_stroke' in setting)) {
            setting.header_font_stroke = setting.text_font_stroke;
        } //If no header_font_stroke
        else {
            if (toString.call(setting.header_font_stroke) != "[object String]") {
                throw Error("header_font_stroke in setting has to be String");
            }
        }
        if (!('header_background_color' in setting)) {
            setting.header_background_color = setting.background_color;
        } //If no header_background_color
        else {
            if (toString.call(setting.header_background_color) != "[object String]") {
                throw Error("header_background_color in setting has to be String");
            }
        }
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
    /**
     * Get size of svg text
     * @param  {HTMLElement} text element whitch was wanted to get size
     * @returns {[number, number]} text's width and height
     */
    getTextWH(text) {
        const svg = document.createElementNS(theXmlns, "svg");
        const g = document.createElementNS(theXmlns, "g");
        g.setAttribute("name", "content");
        g.appendChild(text);
        svg.appendChild(g);
        document.body.appendChild(svg);
        const box = svg.querySelector("[name=content").getBBox();
        svg.remove();
        return [box.width, box.height];
    }
    /**
     * Get size (width and height) of svg text on Table.
     * @param  {SettingVectorTable} setting Drow Setting
     * @param  {Array<Array<HeaderObject>>} divHead Divided table header data
     * @param  {Array<Array<string>>} body table body data
     * @returns {Array<Array<CellSize>>} matrix contains text size
     */
    getTextWHList(setting, divHead, body) {
        let cellDataMatrix = new Array();
        //header
        divHead.forEach(divLine => {
            let cellDataVector = new Array();
            divLine.forEach(cell => {
                let cellData = new CellSize();
                if ("value" in cell) {
                    let text = document.createElementNS(theXmlns, "text");
                    text.setAttribute('x', '0');
                    text.setAttribute('y', '0');
                    text.setAttribute('font-size', setting.text_font_size);
                    text.setAttribute("stroke", setting.text_font_stroke);
                    text.setAttribute("stroke-width", setting.text_font_stroke_width);
                    text.textContent = cell.value;
                    [cellData.w, cellData.h] = this.getTextWH(text);
                    if ("col_span" in cell) {
                        cellData.w /= cell.col_span;
                    }
                    text.remove();
                }
                cellDataVector.push(cellData);
            });
            cellDataMatrix.push(cellDataVector);
        });
        for (let i = 0; i < divHead.length; i++) {
            for (let j = 0; j < divHead[i].length; j++) {
                if ("col_span" in divHead[i][j]) {
                    for (let k = 1; k < divHead[i][j].col_span; k++) {
                        cellDataMatrix[i][j + k].w = cellDataMatrix[i][j].w;
                        cellDataMatrix[i][j + k].h = cellDataMatrix[i][j].h;
                        cellDataMatrix[i][j + k].row = cellDataMatrix[i][j].row;
                        cellDataMatrix[i][j + k].col = cellDataMatrix[i][j].col;
                    }
                    for (let k = 0; k < divHead[i][j].col_span - 1; k++) {
                        cellDataMatrix[i][j + k].col = false;
                    }
                }
                if ("row_span" in divHead[i][j]) {
                    for (let k = 1; k < divHead[i][j].row_span; k++) {
                        cellDataMatrix[i + k][j].w = cellDataMatrix[i][j].w;
                        cellDataMatrix[i + k][j].h = cellDataMatrix[i][j].h;
                        cellDataMatrix[i + k][j].row = cellDataMatrix[i][j].row;
                        cellDataMatrix[i + k][j].col = cellDataMatrix[i][j].col;
                    }
                    for (let k = 0; k < divHead[i][j].row_span - 1; k++) {
                        cellDataMatrix[i + k][j].row = false;
                    }
                }
            }
        }
        //body
        body.forEach(line => {
            let cellDataVector = new Array();
            line.forEach(cell => {
                let cellData = new CellSize();
                let text = document.createElementNS(theXmlns, "text");
                text.setAttribute('x', '0');
                text.setAttribute('y', '0');
                text.setAttribute('font-size', setting.text_font_size);
                text.setAttribute("stroke", setting.text_font_stroke);
                text.setAttribute("stroke-width", setting.text_font_stroke_width);
                text.textContent = cell;
                [cellData.w, cellData.h] = this.getTextWH(text);
                text.remove();
                cellDataVector.push(cellData);
            });
            cellDataMatrix.push(cellDataVector);
        });
        return cellDataMatrix;
    }
    /**
     * Get max width of column and max height of row
     *
     * @param  {CellSize[][]} cellDataMatrix Text size of SVG at table.
     * @returns {[Array<number>, Array<number>]} Max width of column, max height of row
     */
    getMaxWidthAndHeight(cellDataMatrix) {
        let maxColWidths = new Array(cellDataMatrix[0].length);
        let maxRowHeights = new Array(cellDataMatrix.length);
        maxColWidths.fill(0);
        maxRowHeights.fill(0);
        for (let i = 0; i < cellDataMatrix.length; i++) {
            for (let j = 0; j < cellDataMatrix[i].length; j++) {
                //Max wight
                if (maxColWidths[j] < cellDataMatrix[i][j].w) {
                    maxColWidths[j] = cellDataMatrix[i][j].w;
                }
                //Max height
                if (maxRowHeights[i] < cellDataMatrix[i][j].h) {
                    maxRowHeights[i] = cellDataMatrix[i][j].h;
                }
            }
        }
        return [maxColWidths, maxRowHeights];
    }
    /**
     * Set character position at table.
     *
     * @param  {SettingVectorTable} setting
     * @param  {Array<Array<CellSize>>} cellDataMatrix
     * @param  {Array<number>} maxColWidths
     * @param  {Array<number>} maxRowHeights
     * @param  {number} numHeaderRow
     */
    setCharPos(setting, cellDataMatrix, maxColWidths, maxRowHeights, numHeaderRow) {
        //x direction
        for (let i = 0; i < cellDataMatrix.length; i++) {
            //text width + margin left
            cellDataMatrix[i][0].x = setting.text_margin_left;
            for (let j = 1; j < cellDataMatrix[i].length; j++) {
                cellDataMatrix[i][j].x = cellDataMatrix[i][j - 1].x + maxColWidths[j - 1] + setting.text_margin_left;
            }
            // + margin right
            for (let j = 1; j < cellDataMatrix[i].length; j++) {
                cellDataMatrix[i][j].x += setting.text_margin_right * j;
            }
            if (setting.col_dir_line) {
                // + col dir line width
                for (let j = 0; j < cellDataMatrix[i].length; j++) {
                    cellDataMatrix[i][j].x += setting.stroke_width * (j + 1);
                }
                //+ Outer frame line width
                if (setting.outer_frame) {
                    let tempOuterWidth = setting.outer_frame_stroke_width - setting.stroke_width;
                    for (let j = 0; j < cellDataMatrix[i].length; j++) {
                        cellDataMatrix[i][j].x += tempOuterWidth;
                    }
                }
                //+ header line width
                if (setting.header_col) {
                    let tempHeaderWidth = setting.header_stroke_width - setting.stroke_width;
                    for (let j = setting.header_col_pos; j < cellDataMatrix[i].length; j++) {
                        cellDataMatrix[i][j].x += tempHeaderWidth;
                    }
                }
            }
        }
        //y direction
        for (let j = 0; j < cellDataMatrix[0].length; j++) {
            //text height + margin top
            cellDataMatrix[0][j].y = maxRowHeights[0] + setting.text_margin_top;
            for (let i = 1; i < cellDataMatrix.length; i++) {
                cellDataMatrix[i][j].y = cellDataMatrix[i - 1][j].y + maxRowHeights[i] + setting.text_margin_top;
            }
            //+ margin bottom
            for (let i = 1; i < cellDataMatrix.length; i++) {
                cellDataMatrix[i][j].y += setting.text_margin_bottom * i;
            }
            if (setting.row_dir_line) {
                // + row dir line width
                for (let i = 0; i < cellDataMatrix.length; i++) {
                    cellDataMatrix[i][j].y += setting.stroke_width * (i + 1);
                }
                // + Outer frame line width
                if (setting.outer_frame) {
                    let tempOuterHeight = setting.outer_frame_stroke_width - setting.stroke_width;
                    for (let i = 0; i < cellDataMatrix.length; i++) {
                        cellDataMatrix[i][j].y += tempOuterHeight;
                    }
                }
                //+ header line width
                if (setting.header_row) {
                    let tempHeaderHeight = setting.outer_frame_stroke_width - setting.stroke_width;
                    for (let i = numHeaderRow; i < cellDataMatrix.length; i++) {
                        cellDataMatrix[i][j].y += tempHeaderHeight;
                    }
                }
            }
        }
    }
    /**
     * Calculate SVG area size.
     *
     * @param  {SettingVectorTable} setting
     * @param  {any} maxColWidths
     * @param  {any} maxRowHeights
     * @returns {SvgSize} SVG area size
     */
    calSvgSize(setting, maxColWidths, maxRowHeights) {
        let svgSize = new SvgSize();
        //Width
        let numCol = 0;
        if (setting.col_dir_line) {
            if (setting.outer_frame) {
                svgSize.w += setting.outer_frame_stroke_width * 2;
                numCol += 2;
            }
            if (setting.header_col) {
                svgSize.w += setting.header_stroke_width;
                numCol++;
            }
            let n = maxColWidths.length + 1 - numCol;
            svgSize.w += n * setting.stroke_width;
        }
        let margin_width = setting.text_margin_right + setting.text_margin_left;
        maxColWidths.forEach((mw) => {
            svgSize.w += mw + margin_width;
        });
        //height
        let numRow = 0;
        if (setting.row_dir_line) {
            if (setting.outer_frame) {
                svgSize.h += setting.outer_frame_stroke_width * 2;
                numRow += 2;
            }
            if (setting.header_row) {
                svgSize.h += setting.header_stroke_width;
                numCol++;
            }
            let n = maxRowHeights.length + 1 - numRow;
            svgSize.h += n * setting.stroke_width;
        }
        let margin_height = setting.text_margin_top + setting.text_margin_bottom;
        maxRowHeights.forEach((mh) => {
            svgSize.h += mh + margin_height;
        });
        return svgSize;
    }
    /**
     * Mouse wheel Event
     *
     * @param  {HTMLElementEvent<HTMLElement>} event
     */
    zoomByWheel(event) {
        event.preventDefault();
        let table = event.target;
        while (!table.classList.contains(classVtTable)) {
            table = table.parentElement;
        }
        if (table) {
            let tableView = table.getAttribute("viewBox").split(" ");
            const tableW = Number(table.getAttribute("width"));
            const tableH = Number(table.getAttribute("height"));
            let svgElem = table;
            let pt = svgElem.createSVGPoint();
            pt.x = event.x;
            pt.y = event.y;
            const ptTable = pt.matrixTransform(svgElem.getScreenCTM().inverse());
            let newViweW, newViewH, newViewX, newViewY;
            if (event.deltaY > 0) {
                newViweW = Number(tableView[2]) * zoomDelta;
                newViewH = Number(tableView[3]) * zoomDelta;
                if (newViweW > tableW) {
                    newViweW = tableW;
                }
                if (newViewH > tableH) {
                    newViewH = tableH;
                }
                newViewX = ptTable.x + (Number(tableView[0]) - ptTable.x) * zoomDelta;
                newViewY = ptTable.y + (Number(tableView[1]) - ptTable.y) * zoomDelta;
            }
            else {
                newViweW = Number(tableView[2]) / zoomDelta;
                newViewH = Number(tableView[3]) / zoomDelta;
                newViewX = ptTable.x + (Number(tableView[0]) - ptTable.x) / zoomDelta;
                newViewY = ptTable.y + (Number(tableView[1]) - ptTable.y) / zoomDelta;
            }
            if (newViewX < 0) {
                newViewX = 0;
            }
            else if (newViewX + newViweW > tableW) {
                newViewX = tableW - newViweW;
            }
            if (newViewY < 0) {
                newViewY = 0;
            }
            else if (newViewY + newViewH > tableH) {
                newViewY = tableH - newViewH;
            }
            tableView[0] = newViewX.toString();
            tableView[1] = newViewY.toString();
            tableView[2] = newViweW.toString();
            tableView[3] = newViewH.toString();
            table.setAttribute("viewBox", tableView.join(" "));
        }
        else {
            throw Error("Could not get vt table element");
        }
    }
    /**
     * Mouse down Event for pan.
     *
     * @param  {HTMLElementEvent<HTMLElement>} event
     */
    panMouseDown(event) {
        event.preventDefault();
        panFlg = true;
        let tempTarget = event.target;
        while (!tempTarget.classList.contains(classVtTable)) {
            tempTarget = tempTarget.parentElement;
        }
        this.panTarget = tempTarget;
        this.panViewBox = this.panTarget.getAttribute("viewBox").split(" ").map(s => { return Number(s); });
        this.panTargetW = Number(this.panTarget.getAttribute("width"));
        this.panTargetH = Number(this.panTarget.getAttribute("height"));
        let pt = this.panTarget.createSVGPoint();
        pt.x = event.x;
        pt.y = event.y;
        this.panStartPt = pt.matrixTransform(this.panTarget.getScreenCTM().inverse());
    }
    /**
     * Mouse move Event for pan.
     *
     * @param  {HTMLElementEvent<HTMLElement>} event
     */
    panMouseMove(event) {
        if (panFlg) {
            let pt = this.panTarget.createSVGPoint();
            pt.x = event.x;
            pt.y = event.y;
            let newPt = pt.matrixTransform(this.panTarget.getScreenCTM().inverse());
            let dx = newPt.x - this.panStartPt.x;
            let dy = newPt.y - this.panStartPt.y;
            this.panViewBox = [this.panViewBox[0] - dx, this.panViewBox[1] - dy, this.panViewBox[2], this.panViewBox[3]];
            if (this.panViewBox[0] < 0) {
                this.panViewBox[0] = 0;
            }
            else if (this.panViewBox[0] + this.panViewBox[2] > this.panTargetW) {
                this.panViewBox[0] = this.panTargetW - this.panViewBox[2];
            }
            if (this.panViewBox[1] < 0) {
                this.panViewBox[1] = 0;
            }
            else if (this.panViewBox[1] + this.panViewBox[3] > this.panTargetH) {
                this.panViewBox[1] = this.panTargetH - this.panViewBox[3];
            }
            this.panTarget.setAttribute("viewBox", this.panViewBox.join(" "));
        }
    }
    /**
     * Contextmenu Event
     *
     * @param  {HTMLElementEvent<HTMLElement>} event
     */
    addContextmenu(event) {
        event.preventDefault();
        let contexts = document.getElementsByClassName(classVtContext);
        Array.from(contexts).forEach(element => {
            element.remove();
        });
        this.contextmenuTarget = event.target;
        while (!this.contextmenuTarget.classList.contains(classVtTable)) {
            this.contextmenuTarget = this.contextmenuTarget.parentElement;
        }
        let ww = window.innerWidth;
        let wh = window.innerHeight;
        let style = "position: absolute; top: 0; left: 0; width: " + ww + "px; height: " + wh + "px;";
        let div = document.createElement("div");
        div.setAttribute("style", style);
        div.classList.add(classVtContext);
        div.classList.add(classVtContextBase);
        let contextSvg = document.createElementNS(theXmlns, "svg");
        contextSvg.setAttribute("width", "100%");
        contextSvg.setAttribute("height", "100%");
        let containerShadow = document.createElementNS(theXmlns, "rect");
        containerShadow.setAttribute("x", (event.pageX + 3).toString());
        containerShadow.setAttribute("y", (event.pageY + 3).toString());
        containerShadow.setAttribute("height", (contextmenuNum * contextFontSize).toString());
        containerShadow.setAttribute("width", contextmenuWidth.toString());
        containerShadow.setAttribute("fill", "black");
        containerShadow.setAttribute("fill-opacity", "30%");
        contextSvg.appendChild(containerShadow);
        let container = document.createElementNS(theXmlns, "rect");
        container.setAttribute("x", event.pageX.toString());
        container.setAttribute("y", event.pageY.toString());
        container.setAttribute("height", (contextmenuNum * contextFontSize).toString());
        container.setAttribute("width", contextmenuWidth.toString());
        container.setAttribute("fill", "white");
        contextSvg.appendChild(container);
        //Save
        let menuSave = document.createElementNS(theXmlns, "text");
        menuSave.setAttribute("x", event.pageX.toString());
        menuSave.setAttribute("y", (event.pageY + contextFontSize - contextFontSize * textOffset).toString());
        menuSave.setAttribute("font-size", contextFontSize.toString());
        menuSave.setAttribute("stroke", "black");
        menuSave.setAttribute("fill", "black");
        menuSave.setAttribute("stroke-width", "0.05");
        menuSave.textContent = "Save as PNG";
        contextSvg.appendChild(menuSave);
        let menuBoxSave = document.createElementNS(theXmlns, "rect");
        menuBoxSave.setAttribute("x", event.pageX.toString());
        menuBoxSave.setAttribute("y", event.pageY.toString());
        menuBoxSave.setAttribute("width", contextmenuWidth.toString());
        menuBoxSave.setAttribute("height", contextFontSize.toString());
        menuBoxSave.setAttribute("fill", "black");
        menuBoxSave.setAttribute("fill-opacity", "0%");
        menuBoxSave.addEventListener('mouseover', contextMouseOver);
        menuBoxSave.addEventListener('mouseleave', contextMouseLeave);
        menuBoxSave.addEventListener("mousedown", saveAsPng);
        contextSvg.appendChild(menuBoxSave);
        div.appendChild(contextSvg);
        document.body.appendChild(div);
    }
    /**
     * Create svg element in target element
     *
     * @param  {string} id target element
     * @param  {SvgSize} svgSize calculated table size
     * @returns {[HTMLElement, number]} svg element and aspect rasio.
     */
    createAndAppendSVG(id, svgSize) {
        let element = document.getElementById(id);
        // Get element's width and height
        const elemWidth = element.getBoundingClientRect().width;
        const elemHeight = element.getBoundingClientRect().height;
        const viewBoxText = "0 0 " + elemWidth + " " + elemHeight;
        let asp = Math.min(elemWidth / svgSize.w, elemHeight / svgSize.h);
        //Create SVG
        let svg = document.createElementNS(theXmlns, "svg");
        svg.setAttribute("width", elemWidth.toString());
        svg.setAttribute("height", elemHeight.toString());
        svg.setAttribute("viewBox", viewBoxText);
        svg.setAttribute("_vt-asp", asp.toString());
        svg.setAttribute("_vt-w", svgSize.w.toString());
        svg.setAttribute("_vt-h", svgSize.h.toString());
        svg.classList.add(classVtTable);
        // Append svg to elem
        element.appendChild(svg);
        //Add Zoom and Pan Event
        element.addEventListener('wheel', this.zoomByWheel);
        element.addEventListener('mousedown', this.panMouseDown);
        element.addEventListener('mousemove', this.panMouseMove);
        element.addEventListener('contextmenu', this.addContextmenu);
        return [svg, asp];
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
        let cellMatrix = vectorTable.getTextWHList(setting, divideHeader, body);
        let maxColWidths, maxRowHeights;
        [maxColWidths, maxRowHeights] = vectorTable.getMaxWidthAndHeight(cellMatrix);
        vectorTable.setCharPos(setting, cellMatrix, maxColWidths, maxRowHeights, divideHeader.length);
        let svgSize = vectorTable.calSvgSize(setting, maxColWidths, maxRowHeights);
        let svg, asp;
        [svg, asp] = vectorTable.createAndAppendSVG(id, svgSize);
    }
    catch (error) {
        throw new Error(error + ' [vectorTable]');
    }
}
