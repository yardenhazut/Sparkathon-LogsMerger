export declare const monthNames: string[];
export declare const weekdays: string[];
export declare const leftChevron = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 320 512\"><path d=\"M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z\"/></svg>";
export declare const rightChevron = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 320 512\"><path d=\"M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z\"/></svg>";
/**
 * The HTML for the calendar element.
 */
export declare function calendarRoot(theme: string, styles: string | undefined, darkMode: boolean | undefined): string;
export declare function calendarToggleRoot(theme: string | undefined, styles: string | undefined, inputPlaceholder: string | undefined, selectedDate: string | Date | undefined): string;
export declare const unstyledTheme = "\n@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');\n\n.datedreamer__calendar {\n    -webkit-font-smoothing: antialiased;\n    -moz-osx-font-smoothing: grayscale;\n    font-family: 'Roboto', sans-serif;\n    width: 100%;\n    max-width: 240px;\n    padding: 14px;\n    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);\n    background: #fff;\n    z-index: 0;\n    position: relative;\n    box-sizing: border-box;\n}\n\n.datedreamer__calendar.dark {\n  background: #2c3e50;\n}\n\n.datedreamer__calendar_header {\n    width: 100%;\n    display: flex;\n    align-items: center;\n}\n\n.datedreamer__calendar_prev,.datedreamer__calendar_next {\n    background: none;\n    border: none;\n    width: 16px;\n    height: 16px;\n    text-align: center;\n    cursor: pointer;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    color:#2d3436;\n}\n\n.dark .datedreamer__calendar_prev, .dark .datedreamer__calendar_next {\n  color: #fff;\n}\n\n.datedreamer__calendar_prev svg, .datedreamer__calendar_next svg {\n    transform: scale(2.875);\n}\n\n.dark .datedreamer__calendar_prev svg, .dark .datedreamer__calendar_next svg {\n  fill: #fff;\n}\n\n.datedreamer__calendar_title {\n    width: 100%;\n    display: block;\n    flex-grow: 1;\n    text-align: center;\n    color: #2d3436;\n    font-weight: 600;\n    font-size: 0.875rem;\n}\n\n.dark .datedreamer__calendar_title {\n  color: #fff;\n}\n\n.datedreamer__calendar_inputs {\n    margin-top: 12px;\n}\n\n.datedreamer__calendar_inputs label {\n  width: 100%;\n}\n\n.dark .datedreamer__calendar_inputs label {\n  color: #fff;\n}\n\n.datedreamer__calendar__inputs-wrap {\n  display: flex;\n}\n\n.datedreamer__calendar_inputs input {\n  width: 100%;\n}\n\n.datedreamer__calendar_inputs input.error {\n   border: 2px solid #d63031;\n}\n\n.datedreamer__calendar_errors {\n  margin: 8px 0;\n  color: #d63031;\n}\n\n.datedreamer__calendar_days, .datedreamer__calendar_days-header {\n    margin-top: 12px;\n    display: grid;\n    grid-template-columns: repeat(7,1fr);\n    text-align: center;\n}\n\n.datedreamer__calendar_days-header {\n  color: #2d3436;\n  font-size: 1rem;\n}\n\n.dark .datedreamer__calendar_days-header {\n  color: #fff;\n}\n\n.datedreamer__calendar_day {\n    width: 100%;\n    height: 100%;\n    display: block;\n}\n\n.datedreamer__calendar_day button {\n    display: block;\n    width: 100%;\n    height: 100%;\n    cursor: pointer;\n}\n\n.datedreamer__calendar_day.active button {\n    background: blue;\n    color: white;\n}\n\n.datedreamer__calendar_day.highlight button {\n  background: #236bb9;\n  color: white;\n}\n";
export declare const litePurple = "\n.datedreamer__calendar {\n  border-radius: 8px;\n}\n\n.datedreamer__calendar_prev svg, .datedreamer__calendar_next svg {\n  transform: scale(2);\n}\n\n.datedreamer__calendar_title {\n  font-size: 12px;\n}\n\n.datedreamer__calendar_inputs input, .datedreamer__calendar_inputs button {\n  font-weight: 500;\n  border-radius: 4px;\n  border: 1px solid #e9e8ec;\n  font-size: 12px;\n  background: white;\n}\n\n.datedreamer__calendar_inputs label {\n  font-size: 12px;\n}\n\n.datedreamer__calendar_inputs input {\n  flex-grow: 1;\n  width: calc(100% - 8px);\n  display: block;\n  padding: 4px 4px 4px 8px;\n  margin-right: 8px;\n}\n\n.dark .datedreamer__calendar_inputs input {\n  background: #4b6584;\n  border: #4b6584;\n  color: #fff;\n}\n\n.datedreamer__calendar_inputs button {\n  padding: 6px 12px;\n  display: inline-block;\n  cursor: pointer;\n  color: black;\n}\n\n.dark .datedreamer__calendar_inputs button {\n  background: #4b6584;\n  border: #4b6584;\n  color: #fff;\n}\n\n.datedreamer__calendar_errors {\n  font-size: 12px;\n  font-weight: bold;\n}\n\n.datedreamer__calendar_day-header.datedreamer__calendar_day {\n  font-size: 12px;\n}\n\n.datedreamer__calendar_days {\n  margin-top: 8px;\n}\n\n.datedreamer__calendar_days .datedreamer__calendar_day {\n  margin: 2px;\n}\n\n.datedreamer__calendar_days .datedreamer__calendar_day.disabled button{\n  color: #767676;\n  cursor: default;\n  font-weight: normal;\n}\n\n.datedreamer__calendar_days .datedreamer__calendar_day.active, .datedreamer__calendar_days .datedreamer__calendar_day.highlight {\n  position: relative;\n}\n\n.datedreamer__calendar_day.highlight:before{\n  content: \"\";\n  width: 100%;\n  height: 100%;\n  background: #BFA9F3;\n  position: absolute;\n  display: block;\n  z-index: -1;\n  top: 50%;\n  right: 0;\n  left: 0;\n  transform: translateY(-50%);\n}\n\n\n.datedreamer__calendar_days .datedreamer__calendar_day.active:before {\n  content: \"\";\n  width: 100%;\n  height: 100%;\n  background: #7d56da;\n  border-radius: 2px;\n  position: absolute;\n  display: block;\n  z-index: -1;\n  top: 50%;\n  right: 0;\n  left: 0;\n  transform: translateY(-50%);\n}\n\n.datedreamer__calendar_days .datedreamer__calendar_day button {\n  background: transparent;\n  border: none;\n  padding: 5px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  font-size: 12px;\n  font-weight: bold;\n  color: black;\n}\n\n.datedreamer__calendar_days .datedreamer__calendar_day.active button {\n  color: #fff;\n}\n\n.dark .datedreamer__calendar_days .datedreamer__calendar_day button {\n  color: #ecf0f1;\n}\n";