class VectorTable{
    checkingTargetId(id: string): void{
        const element: HTMLInputElement = <HTMLInputElement>document.getElementById(id);
        if(element===null){
            throw new Error('No element id=' + id);
        }
    }
}
/**
 * Drow Table using SVG.
 * @param  {string} id Target id
 * @param  {object} setting Drow Setting
 * @param  {Array<Array<object>>} head Table head
 * @param  {Array<Array<string>>} body Table body
 */
function addVectorTable(id: string, setting: object, head: Array<Array<object>>, body: Array<Array<string>>): void{
    try{
        let vectorTable: VectorTable = new VectorTable();
        vectorTable.checkingTargetId(id);
    }catch(error){
        throw new Error(error + ' [vectorTable]');
    }
}
