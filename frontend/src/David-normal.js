import { jsPDF } from "jspdf"
var font = 'undefined';
var callAddFont = function () {
this.addFileToVFS('David-normal.ttf', font);
this.addFont('David-normal.ttf', 'David', 'normal');
};
jsPDF.API.events.push(['addFonts', callAddFont])
