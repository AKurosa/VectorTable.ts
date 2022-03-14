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

class CellSize{
    public w: number = 0.0;
    public h: number = 0.0;
    public row: boolean = true;
    public col: boolean = true;
}

/** Class Drow vector table */
class VectorTable{
    private theXmlns: string = "http://www.w3.org/2000/svg";
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
        if(!('col_dir_line' in setting)){setting.col_dir_line = true;} //If no col_dir_line
        if(!('stroke_width' in setting)){setting.stroke_width = 1.0;} //If no stroke_width
        if(!('stroke' in setting)){setting.stroke = 'black';} //If no stroke
        if(!('background_color' in setting)){setting.background_color = 'white';} //If no background_color
        if(!('text_font_size' in setting)){setting.text_font_size = 10.0;} //If no text_font_size
        if(!('text_font_stroke_width' in setting)){setting.text_font_stroke_width = 0.1;} //If no text_font_stroke_width
        if(!('text_font_stroke' in setting)){setting.text_font_stroke = 'black';} //If no text_font_stroke
        if(!('text_margin_top' in setting)){setting.text_margin_top = 0.0;} //If no text_margin_top
        if(!('text_margin_bottom' in setting)){setting.text_margin_bottom = 0.0;} //If no text_margin_bottom
        if(!('text_margin_right' in setting)){setting.text_margin_right = 0.0;} //If no text_margin_right
        if(!('text_margin_left' in setting)){setting.text_margin_left = 0.0;} //If no text_margin_left
        if(!('outer_frame' in setting)){setting.outer_frame = false;} //If no outer_frame
        if(!('outer_frame_stroke_width' in setting)){setting.outer_frame_stroke_width = setting.stroke_width;} //If no outer_frame_stroke_width
        if(!('outer_frame_stroke' in setting)){setting.outer_frame_stroke = setting.stroke;} //If no outer_frame_stroke
        if(!('header_row' in setting)){setting.header_row = false;} //If no header_row
        if(!('header_col' in setting)){setting.header_col = false;} //If no header_col
        if(!('header_col_pos' in setting)){setting.header_col_pos = 0;} //If no header_col_pos
        if(!('header_stroke_width' in setting)){setting.header_stroke_width = setting.stroke_width;} //If no header_stroke_width
        if(!('header_stroke' in setting)){setting.header_stroke = setting.stroke;} //If no header_stroke
        if(!('header_font_stroke_width' in setting)){setting.header_font_stroke_width = setting.text_font_stroke_width} //If no header_font_stroke_width
        if(!('header_font_stroke' in setting)){setting.header_font_stroke = setting.text_font_stroke;} //If no header_font_stroke
        if(!('header_background_color' in setting)){setting.header_background_color = setting.background_color;} //If no header_background_color
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
        const svg: HTMLElement = <HTMLElement>document.createElementNS(this.theXmlns, "svg");
        const g: HTMLElement = <HTMLElement>document.createElementNS(this.theXmlns,"g");
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
                    let text: HTMLElement = <HTMLElement>document.createElementNS(this.theXmlns, "text");
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
                let text = <HTMLElement>document.createElementNS(this.theXmlns,"text");
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
        console.log(maxColWidths);
        console.log(maxRowHeights);
    }catch(error){
        throw new Error(error + ' [vectorTable]');
    }
}
