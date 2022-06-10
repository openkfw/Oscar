import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Plotly from 'plotly.js-dist';

const PAGE_CONTENT_WIDTH = 200;
const PAGE_CONTENT_HEIGHT = 290;
const PAGE_TOP_MARGIN = 5;
const PAGE_LEFT_MARGIN = 5;
const COMPONENT_MARGIN_BOTTOM = 0;

// add function for turning page, if not enough space left
const turnPage = (doc, cursorHeight, newHeight) => {
  if (cursorHeight + newHeight > PAGE_CONTENT_HEIGHT) {
    doc.addPage('a4', 'p');
    return PAGE_TOP_MARGIN;
  }
  return cursorHeight;
};
/**
 * Generates pdf document from given list of components
 *
 * Accepts following component types:
 * 'text' - simple text with no styling options
 *
 * @param  {Array<pdfComponent>} components - array with components which should be included in document
 */
const generatePdf = async (components) => {
  // eslint-disable-next-line new-cap
  const doc = new jsPDF({
    format: 'a4',
    unit: 'mm',
    orientation: 'p',
  });
  let cursorHeight = PAGE_TOP_MARGIN;

  const addOneComponent = async (component) => {
    switch (component.type) {
      case 'text': {
        cursorHeight = turnPage(doc, cursorHeight, 10);
        const smt = doc.text(component.text, PAGE_LEFT_MARGIN, cursorHeight, component.options || {});
        cursorHeight = cursorHeight + 15 + COMPONENT_MARGIN_BOTTOM;
        return smt;
      }
      case 'html': {
        // do not use this case,
        // waiting for release with this fix https://github.com/parallax/jsPDF/issues/2899
        const cmp = document.getElementById(component.htmlId);
        const paperHeight = Math.ceil((cmp.clientHeight * PAGE_CONTENT_WIDTH) / window.innerWidth);
        cursorHeight = turnPage(doc, cursorHeight, paperHeight);
        const smt = doc.html(cmp, {
          callback() {},
          margin: [COMPONENT_MARGIN_BOTTOM, 5, COMPONENT_MARGIN_BOTTOM, PAGE_LEFT_MARGIN],
          width: PAGE_CONTENT_WIDTH,
          windowWidth: window.innerWidth,
        });
        cursorHeight = cursorHeight + paperHeight + COMPONENT_MARGIN_BOTTOM;
        return smt;
      }
      case 'htmlViaCanvas': {
        const cmp = document.getElementById(component.htmlId);
        let contentWidth = 1;
        let contentHeight = 0;
        const paperWidth = component.size ? PAGE_CONTENT_WIDTH * component.size : PAGE_CONTENT_WIDTH;
        let paperHeight = 0;
        const img = await html2canvas(cmp).then((canvas) => {
          contentHeight = canvas.height;
          contentWidth = canvas.width;
          paperHeight = Math.ceil((contentHeight * paperWidth) / contentWidth);
          return canvas.toDataURL('image/png');
        });
        cursorHeight = turnPage(doc, cursorHeight);
        const smt = doc.addImage(img, 'PNG', PAGE_LEFT_MARGIN, cursorHeight, paperWidth, paperHeight);
        cursorHeight = cursorHeight + paperHeight + COMPONENT_MARGIN_BOTTOM;
        return smt;
      }
      case 'plotlyGraph': {
        const singlePlotly = document.getElementById(component.htmlId);
        // check  if it is not null and really plotly component, "js-plotly-plot"
        if (!singlePlotly || !singlePlotly.className.includes('js-plotly-plot')) {
          return undefined;
        }
        const graphWidth = singlePlotly.clientWidth;
        const graphHeight = singlePlotly.clientHeight;
        const paperWidth = component.size ? PAGE_CONTENT_WIDTH * component.size : PAGE_CONTENT_WIDTH;
        const paperHeight = Math.ceil((graphHeight * paperWidth) / graphWidth);
        const heightPosition = component.cursorMove ? cursorHeight + component.cursorMove * paperHeight : cursorHeight;
        cursorHeight = turnPage(doc, heightPosition, paperHeight);

        const url = await Plotly.toImage(singlePlotly, { scale: 5 });
        const smt = doc.addImage(
          url,
          'png',
          component.widthOffset ? PAGE_LEFT_MARGIN + component.widthOffset * PAGE_CONTENT_WIDTH : PAGE_LEFT_MARGIN,
          cursorHeight,
          paperWidth,
          paperHeight,
        );
        cursorHeight = cursorHeight + paperHeight + COMPONENT_MARGIN_BOTTOM;
        return smt;
      }
      default:
        return undefined;
    }
  };

  // eslint-disable-next-line
  for (let i = 0; i < components.length; i++) {
    // eslint-disable-next-line no-await-in-loop
    await addOneComponent(components[i]);
  }

  doc.save('Oscar_dashboard.pdf');
};

export default generatePdf;
