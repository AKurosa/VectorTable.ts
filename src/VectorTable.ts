/**
 * Interface for Setting Data
 * 
 * @interface
 */
interface SettingVectorTable {
    [prop: string]: any;
}

/**
 * Interface for Header Data
 * 
 * @interface
 */
interface HeaderObject {
    value: string;
    type: string;
    [prop: string]: any;
}

interface HTMLElementEvent<T extends HTMLElement> extends Event{
    target: T;
    x: number;
    y: number;
    deltaY: number;
    pageX: number;
    pageY: number;
}

class CellSize{
    public w: number = 0.0;
    public h: number = 0.0;
    public row: boolean = true;
    public col: boolean = true;
    public x: number = 0.0;
    public y: number = 0.0;
}

class SvgSize{
    public w: number = 0.0;
    public h: number = 0.0;
}

const theXmlns: string = "http://www.w3.org/2000/svg"
const classVtTable: string = "_vtTable";
const classVtContext: string = "_vt-context";
const classVtContextBase: string = "_vt-context-base";
const zoomDelta: number = 1.1;
let panFlg: boolean = false;
const contextmenuNum: number = 1;
const contextFontSize: number = 15;
const contextmenuWidth: number = 100;
const textOffset: number = 0.2;
let contextmenuTarget: SVGSVGElement;
let globalElements = new Array<HTMLElement>();

// Reset mousemove event by mouseup on document
function mouseUp(event: HTMLElementEvent<HTMLElement>){
    panFlg = false;
}
document.addEventListener('mouseup', mouseUp as EventListenerOrEventListenerObject);

//For unknown reasons,
//event function for svg element have to code out of class.
/**
 * Contextmenu mouseover event.
 * change color to dark.
 * 
 * @param  {HTMLElementEvent<HTMLElement>} event
 */
function contextMouseOver(event: HTMLElementEvent<HTMLElement>){
    event.target.setAttribute("fill-opacity", "10%");
}
/**
 * Contextmenu mouseleave event.
 * change color to default.
 * 
 * @param  {HTMLElementEvent<HTMLElement>} event
 */
function contextMouseLeave(event: HTMLElementEvent<HTMLElement>){
    event.target.setAttribute("fill-opacity", "0%");
}
/**
 * Contextmenu mousedown event. Save target table as PNG.
 * 
 * @param  {HTMLElementEvent<HTMLElement>} event
 */
function saveAsPng(event: HTMLElementEvent<HTMLElement>){
    let canvas = document.createElement("canvas") as HTMLCanvasElement;
    let svgData = new XMLSerializer().serializeToString(contextmenuTarget);
    canvas.width = contextmenuTarget.width.baseVal.value;
    canvas.height = contextmenuTarget.height.baseVal.value;
    let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    let image = new Image;

    image.onload = () =>{
        ctx.drawImage(image, 0, 0);
        let a = document.createElement("a");
        a.href = canvas.toDataURL("image/png");
        a.setAttribute("download", "image.png");
        a.dispatchEvent(new MouseEvent("click"));
    };

    image.src = 'data:image/svg+xml;charset=utf-8;base64,' + btoa(unescape(encodeURIComponent(svgData)));
}
/**
 * Reset contextmenu
 * 
 * @param  {HTMLElementEvent<HTMLElement>} event
 */
function contextmenuDown(event: HTMLElementEvent<HTMLElement>){
    event.preventDefault();

    let contexts = document.getElementsByClassName(classVtContext);
    Array.from(contexts).forEach(content =>{
        content.remove();
    });
}

/** Class Drow vector table */
class VectorTable{
    private panStartPt: DOMPoint;
    private panTarget: SVGSVGElement;
    private panViewBox: Array<number>;
    private panTargetW: number;
    private panTargetH: number;

    constructor(){
        this.panTarget = document.createElementNS(theXmlns, "svg") as SVGSVGElement;
        this.panStartPt = this.panTarget.createSVGPoint();
        this.panViewBox = new Array<number>(4);
        this.panTargetW = 0.0;
        this.panTargetH = 0.0;
    }

    /**
     * Check exist target element.
     * Throw error if no element.
     * @param  {string} id target ID
     * @throws {string} throw error if can not catch element by id.
     */
    checkTargetId(id: string): void{
        const element: HTMLInputElement = <HTMLInputElement>document.getElementById(id);
        if(element===null){
            throw new Error('No element id=' + id);
        }
    }

    /**
     * Fill setting parameter if not exist.
     * @param  {SettingVectorTable} setting setting parameters for Vector Table
     */
    fillSetting(setting: SettingVectorTable): void{
        if(!('row_dir_line' in setting)){setting.row_dir_line = true;} //If no row_dir_line
        else{
            if(toString.call(setting.row_dir_line) != "[object Boolean]"){
                throw Error("row_dir_line in setting has to be Boolean");
            }
        }
        if(!('col_dir_line' in setting)){setting.col_dir_line = true;} //If no col_dir_line
        else{
            if(toString.call(setting.col_dir_line) != "[object Boolean]"){
                throw Error("col_dir_line in setting has to be Boolean");
            }
        }
        if(!('stroke_width' in setting)){setting.stroke_width = 1.0;} //If no stroke_width
        else{
            if(toString.call(setting.stroke_width) != "[object Number]"){
                throw Error("stroke_width in setting has to be Number")
            }
            if(setting.stroke_width < 0){
                throw Error("stroke_width in setting has to be 0.0 or over");
            }
        }
        if(!('stroke' in setting)){setting.stroke = 'black';} //If no stroke
        else{
            if(toString.call(setting.stroke) != "[object String]"){
                throw Error("stroke in setting has to be String")
            }
        }
        if(!('background_color' in setting)){setting.background_color = 'white';} //If no background_color
        else{
            if(toString.call(setting.background_color) != "[object String]"){
                throw Error("background_color in setting has to be String");
            }
        }
        if(!('text_font_size' in setting)){setting.text_font_size = 10.0;} //If no text_font_size
        else{
            if(toString.call(setting.text_font_size) != "[object Number]"){
                throw Error("text_font_size in setting has to be Number");
            }
            if(setting.text_font_size < 0){
                throw Error("text_font_size in setting has to be 0.0 or over");
            }
        }
        if(!('text_font_stroke_width' in setting)){setting.text_font_stroke_width = 0.1;} //If no text_font_stroke_width
        else{
            if(toString.call(setting.text_font_stroke_width) != "[object Number]"){
                throw Error("text_font_stroke_width in setting has to be Number");
            }
            if(setting.text_font_stroke_width < 0){
                throw Error("text_font_stroke_width in setting has to be 0.0 or over");
            }
        }
        if(!('text_font_stroke' in setting)){setting.text_font_stroke = 'black';} //If no text_font_stroke
        else{
            if(toString.call(setting.text_font_stroke) != "[object String]"){
                throw Error("text_font_stroke in setting has to be Number");
            }
        }
        if(!('text_margin_top' in setting)){setting.text_margin_top = 0.0;} //If no text_margin_top
        else{
            if(toString.call(setting.text_margin_top) != "[object Number]"){
                throw Error("text_margin_top in setting has to be Number");
            }
            if(setting.text_margin_top < 0){
                throw Error("text_margin_top in setting has to be 0.0 or over");
            }
        }
        if(!('text_margin_bottom' in setting)){setting.text_margin_bottom = 0.0;} //If no text_margin_bottom
        else{
            if(toString.call(setting.text_margin_bottom) != "[object Number]"){
                throw Error("text_margin_bottom in setting has to be Number");
            }
            if(setting.text_margin_bottom < 0){
                throw Error("text_margin_bottom in setting has to be 0.0 or over");
            }
        }
        if(!('text_margin_right' in setting)){setting.text_margin_right = 0.0;} //If no text_margin_right
        else{
            if(toString.call(setting.text_margin_right) != "[object Number]"){
                throw Error("text_margin_right in setting has to be Number");
            }
            if(setting.text_margin_right < 0){
                throw Error("text_margin_right in setting has to be 0.0 or over");
            }
        }
        if(!('text_margin_left' in setting)){setting.text_margin_left = 0.0;} //If no text_margin_left
        else{
            if(toString.call(setting.text_margin_left) != "[object Number]"){
                throw Error("text_margin_left in setting has to be Number");
            }
            if(setting.text_margin_left < 0){
                throw Error("text_margin_left in setting has to be 0.0 or over");
            }
        }
        if(!('outer_frame' in setting)){setting.outer_frame = false;} //If no outer_frame
        else{
            if(toString.call(setting.outer_frame) != "[object Boolean]"){
                throw Error("outer_frame in setting has to be Boolean");
            }
        }
        if(!('outer_frame_stroke_width' in setting)){setting.outer_frame_stroke_width = setting.stroke_width;} //If no outer_frame_stroke_width
        else{
            if(toString.call(setting.outer_frame_stroke_width) != "[object Number]"){
                throw Error("outer_frame_stroke_width in setting has to be Number");
            }
            if(setting.outer_frame_stroke_width < 0){
                throw Error("outer_frame_stroke_width in setting has to be 0.0 or over");
            }
        }
        if(!('outer_frame_stroke' in setting)){setting.outer_frame_stroke = setting.stroke;} //If no outer_frame_stroke
        else{
            if(toString.call(setting.outer_frame_stroke) != "[object String]"){
                throw Error("outer_frame_stroke in setting has to be String");
            }
        }
        if(!('header_row' in setting)){setting.header_row = false;} //If no header_row
        else{
            if(toString.call(setting.header_row) != "[object Boolean]"){
                throw Error("header_row in setting has to be Boolean");
            }
        }
        if(!('header_col' in setting)){setting.header_col = false;} //If no header_col
        else{
            if(toString.call(setting.header_col) != "[object Boolean]"){
                throw Error("header_col in setting has to be Boolean");
            }
        }
        if(!('header_col_pos' in setting)){setting.header_col_pos = 0;} //If no header_col_pos
        else{
            if(toString.call(setting.header_col_pos) != "[object Number]"){
                throw Error("header_col_pos in setting has to be Number");
            }
            if(!Number.isInteger(setting.header_col_pos)){
                throw Error("header_col_pos in setting has to be Integer");
            }
            if(setting.header_col_pos < 0){
                throw Error("header_col_pos in setting has to be 0 or over");
            }
        }
        if(!('header_stroke_width' in setting)){setting.header_stroke_width = setting.stroke_width;} //If no header_stroke_width
        else{
            if(toString.call(setting.header_stroke_width) != "[object Number]"){
                throw Error("header_stroke_width in setting has to be Number");
            }
            if(setting.header_stroke_width < 0){
                throw Error("header_stroke_width in setting has to be 0.0 or over");
            }
        }
        if(!('header_stroke' in setting)){setting.header_stroke = setting.stroke;} //If no header_stroke
        else{
            if(toString.call(setting.header_stroke) != "[object String]"){
                throw Error("header_stroke in setting has to be String");
            }
        }
        if(!('header_font_stroke_width' in setting)){setting.header_font_stroke_width = setting.text_font_stroke_width} //If no header_font_stroke_width
        else{
            if(toString.call(setting.header_font_stroke_width) != "[object Number]"){
                throw Error("header_font_stroke_width in setting has to be Number");
            }
            if(setting.header_font_stroke_width < 0){
                throw Error("header_font_stroke_width in setting has to be 0.0 or over");
            }
        }
        if(!('header_font_stroke' in setting)){setting.header_font_stroke = setting.text_font_stroke;} //If no header_font_stroke
        else{
            if(toString.call(setting.header_font_stroke) != "[object String]"){
                throw Error("header_font_stroke in setting has to be String");
            }
        }
        if(!('header_background_color' in setting)){setting.header_background_color = setting.background_color;} //If no header_background_color
        else{
            if(toString.call(setting.header_background_color) != "[object String]"){
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
    divideHeader(head: any): Array<Array<HeaderObject>>{
        if(toString.call(head) !== "[object Array]"){
            throw Error("Header data should be Array");
        }
        let divideData: Array<Array<HeaderObject>> = new Array();
        let flg_matrix: boolean = false;

        //Check header struct
        head.forEach((h1: any) => {
            if(toString.call(h1) === "[object Array]"){ //more than 2 lines
                flg_matrix =true;
                return true;
            }
            else if(toString.call(h1) === "[object Object]"){//only 1 line
                return true;
            }else{
                throw Error("Header data struct is not expected")
            }
        });

        if(!flg_matrix){//if struct is 1D array
            let lineData: Array<HeaderObject> = new Array();
            head.forEach((element: HeaderObject) =>{
                if("row_span" in element){
                    if(element.row_span < 1){
                        throw Error("row_span has to be 1 or more");
                    }
                    lineData.push(element);
                    for(let i=1; i<element.row_span; i++){
                        let temp: any = new Object();
                        lineData.push(temp);
                    }
                }
            });
            divideData.push(lineData);
        }else{// if struct is 2D array
            for(let i=0; i<head.length; i++){
                let row: Array<HeaderObject> = new Array();
                divideData.push(row);
            }

            for(let i=0; i<head.length; i++){
                for(let j=0; j<head[i].length; j++){
                    if(toString.call(head[i][j]) !== "[object Object]"){
                        throw Error("Header data has a worng data");
                    }

                    if("row_span" in head[i][j]){//If row span is 1 or more
                        //Check row_span
                        if(head[i][j].row_span < 1){
                            throw Error("row_span has to be 1 or more");
                        }else if(head[i][j].row_span > head.length - i){
                            throw Error("row_span has to be same as header row count or less");
                        }

                        for(let k=i; k<i+head[i][j].row_span; k++){
                            if("col_span" in head[i][j]){
                                if(head[i][j].col_span < 1){
                                    throw Error("col_span has to be 1 or more");
                                }
                                divideData[k].push(head[i][j]);
                                for(let l=1; l<head[i][j].col_span; l++){
                                    let temp: any = new Object();
                                    divideData[k].push(temp);
                                }
                            }else{//If col span is undefined
                                if(k==i){
                                    divideData[k].push(head[i][j]);
                                }else{
                                    let temp: any = new Object();
                                    divideData[k].push(temp);
                                }
                            }
                        }
                    }else{//If row span is undefined
                        if("col_span" in head[i][j]){
                            if(head[i][j].col_span < 1){
                                throw Error("col_span has to be 1 or more");
                            }
                            divideData[i].push(head[i][j]);
                            for(let k=1; k<head[i][j].col_span; k++){
                                let temp: any = new Object();
                                divideData[i].push(temp);
                            }
                        }else{//If col span is undifined
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
    getTextWH(text: HTMLElement): any{
        const svg: HTMLElement = <HTMLElement>document.createElementNS(theXmlns, "svg");
        const g: HTMLElement = <HTMLElement>document.createElementNS(theXmlns,"g");
        g.setAttribute("name", "content");
        g.appendChild(text);
        svg.appendChild(g);

        document.body.appendChild(svg);
        const box: any = (svg.querySelector("[name=content") as any).getBBox();
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
    getTextWHList(setting: SettingVectorTable, divHead: Array<Array<HeaderObject>>, body: Array<Array<string>>): Array<Array<CellSize>>{
        let cellDataMatrix = new Array<Array<CellSize>>();
        
        //header
        divHead.forEach(divLine=>{
            let cellDataVector = new Array<CellSize>();
            divLine.forEach(cell=>{
                let cellData = new CellSize();
                if("value" in cell){
                    let text: HTMLElement = <HTMLElement>document.createElementNS(theXmlns, "text");
                    text.setAttribute('x', '0');
                    text.setAttribute('y', '0');
                    text.setAttribute('font-size', setting.text_font_size);
                    text.setAttribute("stroke", setting.text_font_stroke);
                    text.setAttribute("stroke-width", setting.text_font_stroke_width);
                    text.textContent = cell.value;

                    [cellData.w, cellData.h] = this.getTextWH(text);
                    if("col_span" in cell){
                        cellData.w /= cell.col_span;
                    }
                    text.remove();
                }
                cellDataVector.push(cellData);
            });
            cellDataMatrix.push(cellDataVector);
        });

        for(let i=0; i<divHead.length; i++){
            for(let j=0; j<divHead[i].length; j++){
                if("col_span" in divHead[i][j]){
                    for(let k=1; k<divHead[i][j].col_span; k++){
                        cellDataMatrix[i][j+k].w = cellDataMatrix[i][j].w;
                        cellDataMatrix[i][j+k].h = cellDataMatrix[i][j].h;
                        cellDataMatrix[i][j+k].row = cellDataMatrix[i][j].row;
                        cellDataMatrix[i][j+k].col = cellDataMatrix[i][j].col;
                    }
                    for(let k=0; k<divHead[i][j].col_span-1; k++){
                        cellDataMatrix[i][j+k].col = false;
                    }
                }
                if("row_span" in divHead[i][j]){
                    for(let k=1; k<divHead[i][j].row_span; k++){
                        cellDataMatrix[i+k][j].w = cellDataMatrix[i][j].w;
                        cellDataMatrix[i+k][j].h = cellDataMatrix[i][j].h;
                        cellDataMatrix[i+k][j].row = cellDataMatrix[i][j].row;
                        cellDataMatrix[i+k][j].col = cellDataMatrix[i][j].col;
                    }
                    for(let k=0; k<divHead[i][j].row_span-1; k++){
                        cellDataMatrix[i+k][j].row = false;
                    }
                }
            }   
        }

        //body
        body.forEach(line =>{
            let cellDataVector = new Array<CellSize>();
            line.forEach(cell=>{
                let cellData = new CellSize();
                let text = <HTMLElement>document.createElementNS(theXmlns,"text");
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
    getMaxWidthAndHeight(cellDataMatrix: CellSize[][]): any{
        let maxColWidths: Array<number> = new Array<number>(cellDataMatrix[0].length);
        let maxRowHeights: Array<number> = new Array<number>(cellDataMatrix.length);

        maxColWidths.fill(0);
        maxRowHeights.fill(0);

        for(let i=0; i<cellDataMatrix.length;i++){
            for(let j=0; j<cellDataMatrix[i].length; j++){
                //Max wight
                if(maxColWidths[j] < cellDataMatrix[i][j].w){
                    maxColWidths[j] = cellDataMatrix[i][j].w;
                }

                //Max height
                if(maxRowHeights[i] < cellDataMatrix[i][j].h){
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
    setCharPos(setting: SettingVectorTable, cellDataMatrix: Array<Array<CellSize>>, maxColWidths: Array<number>, maxRowHeights: Array<number>, numHeaderRow: number){
        //x direction
        for(let i=0; i<cellDataMatrix.length; i++){
            //text width + margin left
            cellDataMatrix[i][0].x = setting.text_margin_left;
            for(let j=1; j<cellDataMatrix[i].length; j++){
                cellDataMatrix[i][j].x = cellDataMatrix[i][j-1].x + maxColWidths[j-1] + setting.text_margin_left;
            }
            // + margin right
            for(let j=1; j<cellDataMatrix[i].length; j++){
                cellDataMatrix[i][j].x += setting.text_margin_right * j;
            }

            if(setting.col_dir_line){
                // + col dir line width
                for(let j=0; j<cellDataMatrix[i].length; j++){
                    cellDataMatrix[i][j].x += setting.stroke_width * (j+1);
                }
                //+ Outer frame line width
                if(setting.outer_frame){
                    let tempOuterWidth = setting.outer_frame_stroke_width - setting.stroke_width;
                    for(let j=0; j<cellDataMatrix[i].length; j++){
                        cellDataMatrix[i][j].x += tempOuterWidth;
                    }
                }
                //+ header line width
                if(setting.header_col){
                    let tempHeaderWidth = setting.header_stroke_width - setting.stroke_width;
                    for(let j=setting.header_col_pos; j<cellDataMatrix[i].length; j++){
                        cellDataMatrix[i][j].x += tempHeaderWidth;
                    }
                }
            }
        }

        //y direction
        for(let j=0; j<cellDataMatrix[0].length; j++){
            //text height + margin top
            cellDataMatrix[0][j].y = maxRowHeights[0] + setting.text_margin_top;
            for(let i=1; i<cellDataMatrix.length; i++){
                cellDataMatrix[i][j].y = cellDataMatrix[i-1][j].y + maxRowHeights[i] + setting.text_margin_top;
            }

            //+ margin bottom
            for(let i=1; i<cellDataMatrix.length; i++){
                cellDataMatrix[i][j].y += setting.text_margin_bottom * i;
            }

            if(setting.row_dir_line){
                // + row dir line width
                for(let i=0; i<cellDataMatrix.length; i++){
                    cellDataMatrix[i][j].y += setting.stroke_width * (i+1);
                }

                // + Outer frame line width
                if(setting.outer_frame){
                    let tempOuterHeight = setting.outer_frame_stroke_width - setting.stroke_width;
                    for(let i=0; i<cellDataMatrix.length; i++){
                        cellDataMatrix[i][j].y += tempOuterHeight;
                    }
                }

                //+ header line width
                if(setting.header_row){
                    let tempHeaderHeight = setting.outer_frame_stroke_width - setting.stroke_width;
                    for(let i=numHeaderRow; i<cellDataMatrix.length; i++){
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
    calSvgSize(setting: SettingVectorTable, maxColWidths: any, maxRowHeights: any): SvgSize{
        let svgSize: SvgSize = new SvgSize();

        //Width
        let numCol = 0;
        if(setting.col_dir_line){
            if(setting.outer_frame){
                svgSize.w += setting.outer_frame_stroke_width * 2;
                numCol += 2;
            }
            if(setting.header_col){
                svgSize.w += setting.header_stroke_width;
                numCol++;
            }
            let n = maxColWidths.length + 1 - numCol;
            svgSize.w += n * setting.stroke_width;
        }
        let margin_width = setting.text_margin_right + setting.text_margin_left;
        maxColWidths.forEach((mw: any) =>{
            svgSize.w += mw + margin_width;
        });

        //height
        let numRow = 0;
        if(setting.row_dir_line){
            if(setting.outer_frame){
                svgSize.h += setting.outer_frame_stroke_width * 2;
                numRow += 2;
            }
            if(setting.header_row){
                svgSize.h += setting.header_stroke_width;
                numCol++;
            }
            let n = maxRowHeights.length + 1 - numRow;
            svgSize.h += n * setting.stroke_width;
        }
        let margin_height = setting.text_margin_top + setting.text_margin_bottom;
        maxRowHeights.forEach((mh: any) =>{
            svgSize.h += mh + margin_height;
        });
        
        return svgSize;
    }
    /**
     * Mouse wheel Event
     * 
     * @param  {HTMLElementEvent<HTMLElement>} event
     */
    zoomByWheel(event: HTMLElementEvent<HTMLElement>){
        event.preventDefault();

        let table = event.target as HTMLElement;

        while(!table.classList.contains(classVtTable)){
            table = table.parentElement as HTMLElement;
        }

        if(table){
            let tableView = (table.getAttribute("viewBox") as string).split(" ");
            const tableW = Number(table.getAttribute("width"));
            const tableH = Number(table.getAttribute("height"));

            let svgElem = table as any as SVGSVGElement;
            let pt = svgElem.createSVGPoint();
            pt.x = event.x;
            pt.y = event.y;

            const ptTable = pt.matrixTransform((svgElem.getScreenCTM() as DOMMatrix).inverse());
            let newViweW, newViewH, newViewX, newViewY: number;

            if(event.deltaY > 0){
                newViweW = Number(tableView[2])*zoomDelta;
                newViewH = Number(tableView[3])*zoomDelta;
                if(newViweW > tableW){
                    newViweW = tableW;
                }
                if(newViewH > tableH){
                    newViewH = tableH;
                }

                newViewX = ptTable.x + (Number(tableView[0]) - ptTable.x)*zoomDelta;
                newViewY = ptTable.y + (Number(tableView[1]) - ptTable.y)*zoomDelta;
            }else{
                newViweW = Number(tableView[2])/zoomDelta;
                newViewH = Number(tableView[3])/zoomDelta;

                newViewX = ptTable.x + (Number(tableView[0]) - ptTable.x)/zoomDelta;
                newViewY = ptTable.y + (Number(tableView[1]) - ptTable.y)/zoomDelta;
            }

            if(newViewX < 0){
                newViewX = 0;
            }else if(newViewX + newViweW > tableW){
                newViewX = tableW - newViweW;
            }

            if(newViewY < 0){
                newViewY = 0;
            }else if(newViewY + newViewH > tableH){
                newViewY = tableH - newViewH;
            }
            
            tableView[0] = newViewX.toString();
            tableView[1] = newViewY.toString();
            tableView[2] = newViweW.toString();
            tableView[3] = newViewH.toString();
            table.setAttribute("viewBox", tableView.join(" "));
        }else{
            throw Error("Could not get vt table element");
        }      
    }
    /**
     * Mouse down Event for pan.
     * 
     * @param  {HTMLElementEvent<HTMLElement>} event
     */
    panMouseDown(event: HTMLElementEvent<HTMLElement>){
        event.preventDefault();
        panFlg = true;

        let tempTarget = event.target;
        while(!tempTarget.classList.contains(classVtTable)){
            tempTarget = tempTarget.parentElement as HTMLElement;
        }
        this.panTarget = tempTarget as any as SVGSVGElement;
        this.panViewBox = (this.panTarget.getAttribute("viewBox") as string).split(" ").map(s => {return Number(s)});
        this.panTargetW = Number(this.panTarget.getAttribute("width"));
        this.panTargetH = Number(this.panTarget.getAttribute("height"));

        let pt = this.panTarget.createSVGPoint();
        pt.x = event.x;
        pt.y = event.y;

        this.panStartPt = pt.matrixTransform((this.panTarget.getScreenCTM() as DOMMatrix).inverse());
    }
    /**
     * Mouse move Event for pan.
     * 
     * @param  {HTMLElementEvent<HTMLElement>} event
     */
    panMouseMove(event: HTMLElementEvent<HTMLElement>){
        if(panFlg){
            let pt = this.panTarget.createSVGPoint();
            pt.x = event.x;
            pt.y = event.y;

            let newPt = pt.matrixTransform((this.panTarget.getScreenCTM() as DOMMatrix).inverse());
            let dx = newPt.x - this.panStartPt.x;
            let dy = newPt.y - this.panStartPt.y;
            this.panViewBox = [this.panViewBox[0] - dx, this.panViewBox[1] - dy, this.panViewBox[2], this.panViewBox[3]];

            if(this.panViewBox[0] < 0){
                this.panViewBox[0] = 0;
            }else if(this.panViewBox[0] + this.panViewBox[2] > this.panTargetW){
                this.panViewBox[0] = this.panTargetW - this.panViewBox[2];
            }

            if(this.panViewBox[1] < 0){
                this.panViewBox[1] = 0;
            }else if(this.panViewBox[1] + this.panViewBox[3] > this.panTargetH){
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
    addContextmenu(event: HTMLElementEvent<HTMLElement>){
        event.preventDefault();

        let contexts = document.getElementsByClassName(classVtContext);
        Array.from(contexts).forEach(element =>{
            element.remove();
        });

        let temp = event.target;
        while(!temp.classList.contains(classVtTable)){
            temp = temp.parentElement as HTMLElement;
        }

        contextmenuTarget = temp as any as SVGSVGElement;

        let ww = window.innerWidth;
        let wh = window.innerHeight;
        let style = "position: absolute; top: 0; left: 0; width: " + ww + "px; height: " + wh + "px;"

        let div = document.createElement("div") as HTMLElement;
        div.setAttribute("style", style);
        div.classList.add(classVtContext);
        div.classList.add(classVtContextBase);

        let contextSvg = document.createElementNS(theXmlns, "svg");
        contextSvg.setAttribute("width", "100%");
        contextSvg.setAttribute("height","100%");

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
        menuSave.setAttribute("y", (event.pageY + contextFontSize - contextFontSize*textOffset).toString());
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
        menuBoxSave.addEventListener('mouseover', contextMouseOver as EventListenerOrEventListenerObject);
        menuBoxSave.addEventListener('mouseleave', contextMouseLeave as EventListenerOrEventListenerObject);
        menuBoxSave.addEventListener("mousedown", saveAsPng as EventListenerOrEventListenerObject);
        contextSvg.appendChild(menuBoxSave);

        div.appendChild(contextSvg);
        div.addEventListener("mousedown", contextmenuDown as EventListenerOrEventListenerObject);
        document.body.appendChild(div);
    }
    /**
     * Create svg element in target element
     * 
     * @param  {string} id target element
     * @param  {SvgSize} svgSize calculated table size
     * @returns {[HTMLElement, number]} svg element and aspect rasio.
     */
    createAndAppendSVG(id: string, svgSize: SvgSize): any{
        let element: HTMLElement = <HTMLElement>document.getElementById(id);

        // Get element's width and height
        const elemWidth = element.getBoundingClientRect().width;
        const elemHeight = element.getBoundingClientRect().height;
        const viewBoxText = "0 0 "+ elemWidth + " " + elemHeight;
        let asp = Math.min(elemWidth / svgSize.w, elemHeight / svgSize.h);

        //Create SVG
        let svg = <HTMLElement>document.createElementNS(theXmlns, "svg");
        svg.setAttribute("width", elemWidth.toString());
        svg.setAttribute("height", elemHeight.toString());
        svg.setAttribute("viewBox", viewBoxText);
        svg.setAttribute("_vt-asp", asp.toString());
        svg.setAttribute("_vt-w", svgSize.w.toString());
        svg.setAttribute("_vt-h", svgSize.h.toString());
        svg.classList.add(classVtTable);

        // Append svg to elem
        element.appendChild(svg);

        // Add Zoom and Pan Event
        element.addEventListener('wheel', this.zoomByWheel as EventListenerOrEventListenerObject);
        element.addEventListener('mousedown', this.panMouseDown as EventListenerOrEventListenerObject);
        element.addEventListener('mousemove', this.panMouseMove as EventListenerOrEventListenerObject);
        element.addEventListener('contextmenu', this.addContextmenu as EventListenerOrEventListenerObject);

        // Push to Global element array
        globalElements.push(element);

        return [svg, asp];
    }
    /**
     * Create background of vector table
     * 
     * @param  {HTMLElement} svg target element
     * @param  {SettingVectorTable} setting setting of vector table 
     * @param  {SvgSize} svgSize size of element
     * @param  {number} asp aspect rasio
     */
    createAndAppendBackground(svg: HTMLElement, setting: SettingVectorTable, svgSize: SvgSize, asp: number){
        let background = document.createElementNS(theXmlns, "rect");
        background.setAttribute("x", "0");
        background.setAttribute("y", "0");
        background.setAttribute("width", (svgSize.w * asp).toString());
        background.setAttribute("height", (svgSize.h * asp).toString());
        background.setAttribute("fill", setting.background_color);

        svg.appendChild(background);
    }
    /**
     * Add Stripes of background.
     * 
     * @param  {HTMLElement} svg 
     * @param  {SettingVectorTable} setting
     * @param  {CellSize[][]} cellDataMatrix
     * @param  {SvgSize} svgSize
     * @param  {number} asp
     * @param  {number} numHeaderRow
     */
    createAndAppendStripes(svg: HTMLElement, setting: SettingVectorTable, cellDataMatrix: CellSize[][], svgSize: SvgSize, asp: number, numHeaderRow: number){
        if("shima_shima" in setting){
            for(let i=numHeaderRow; i<cellDataMatrix.length; i++){
                if((i-numHeaderRow)%2){
                    let stripe = document.createElementNS(theXmlns, "rect");
                    stripe.setAttribute("x", "0");
                    stripe.setAttribute("y", ((cellDataMatrix[i-1][0].y + setting.text_margin_bottom) * asp).toString());
                    stripe.setAttribute("width", (svgSize.w * asp).toString());
                    stripe.setAttribute("height",((cellDataMatrix[i][0].h + setting.stroke_width/2 + setting.text_margin_bottom + setting.text_margin_top) * asp).toString());
                    stripe.setAttribute("fill", setting.shima_shima.toString());
                    svg.appendChild(stripe);
                }
            }
        }
    }
    /**
     * Add header background color.
     * 
     * @param  {HTMLElement} svg
     * @param  {SettingVectorTable} setting
     * @param  {CellSize[][]} cellDataMatrix
     * @param  {SvgSize} svgSize
     * @param  {number} asp
     * @param  {number} numHeaderRow
     */
    createAndAppendHeaderBackground(svg: HTMLElement, setting: SettingVectorTable, cellDataMatrix: CellSize[][], svgSize: SvgSize, asp: number, numHeaderRow: number){
        if(setting.header_row){
            let backRow = document.createElementNS(theXmlns, "rect");
            backRow.setAttribute("x", "0");
            backRow.setAttribute("y", "0");
            backRow.setAttribute("width", (svgSize.w * asp).toString());
            backRow.setAttribute("height", ((cellDataMatrix[numHeaderRow-1][0].y + setting.text_margin_bottom - setting.stroke_width)*asp).toString());
            backRow.setAttribute("fill", setting.header_background_color);
            svg.appendChild(backRow);
        }
        if(setting.header_col){
            let backCol = document.createElementNS(theXmlns, "rect");
            backCol.setAttribute("x", "0");
            backCol.setAttribute("y", "0");
            backCol.setAttribute("width", ((cellDataMatrix[0][setting.header_col_pos].x - setting.text_margin_left)*asp).toString());
            backCol.setAttribute("height", (svgSize.h * asp).toString());
            backCol.setAttribute("fill", setting.header_background_color);
            svg.appendChild(backCol);
        }
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
function addVectorTable(id: string, setting: SettingVectorTable, head: any, body: Array<Array<string>>): void{
    try{
        let vectorTable: VectorTable = new VectorTable();
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
        vectorTable.createAndAppendBackground(svg, setting, svgSize, asp);
        vectorTable.createAndAppendStripes(svg, setting, cellMatrix, svgSize, asp, divideHeader.length);
        vectorTable.createAndAppendHeaderBackground(svg, setting, cellMatrix, svgSize, asp, divideHeader.length);
    }catch(error){
        throw new Error(error + ' [vectorTable]');
    }
}
