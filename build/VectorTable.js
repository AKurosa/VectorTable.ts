"use strict";
class VectorTable {
    checkingTargetId(id) {
        const element = document.getElementById(id);
        if (element === null) {
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
function addVectorTable(id, setting, head, body) {
    try {
        let vectorTable = new VectorTable();
        vectorTable.checkingTargetId(id);
    }
    catch (error) {
        throw new Error(error + ' [vectorTable]');
    }
}
