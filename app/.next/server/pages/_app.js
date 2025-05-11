/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _solana_wallet_adapter_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @solana/wallet-adapter-react */ \"@solana/wallet-adapter-react\");\n/* harmony import */ var _solana_wallet_adapter_base__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @solana/wallet-adapter-base */ \"@solana/wallet-adapter-base\");\n/* harmony import */ var _solana_wallet_adapter_wallets__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @solana/wallet-adapter-wallets */ \"@solana/wallet-adapter-wallets\");\n/* harmony import */ var _solana_wallet_adapter_react_ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @solana/wallet-adapter-react-ui */ \"@solana/wallet-adapter-react-ui\");\n/* harmony import */ var _solana_web3_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @solana/web3.js */ \"@solana/web3.js\");\n/* harmony import */ var _solana_web3_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_solana_web3_js__WEBPACK_IMPORTED_MODULE_6__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_7__);\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_solana_wallet_adapter_react__WEBPACK_IMPORTED_MODULE_2__, _solana_wallet_adapter_base__WEBPACK_IMPORTED_MODULE_3__, _solana_wallet_adapter_wallets__WEBPACK_IMPORTED_MODULE_4__, _solana_wallet_adapter_react_ui__WEBPACK_IMPORTED_MODULE_5__]);\n([_solana_wallet_adapter_react__WEBPACK_IMPORTED_MODULE_2__, _solana_wallet_adapter_base__WEBPACK_IMPORTED_MODULE_3__, _solana_wallet_adapter_wallets__WEBPACK_IMPORTED_MODULE_4__, _solana_wallet_adapter_react_ui__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\n\n\n\n// Import styles\n\n// Default styles for the wallet\n__webpack_require__(/*! @solana/wallet-adapter-react-ui/styles.css */ \"./node_modules/@solana/wallet-adapter-react-ui/styles.css\");\nfunction App({ Component, pageProps }) {\n    // Can be set to 'devnet', 'testnet', or 'mainnet-beta'\n    const network = _solana_wallet_adapter_base__WEBPACK_IMPORTED_MODULE_3__.WalletAdapterNetwork.Devnet;\n    // You can also provide a custom RPC endpoint\n    const endpoint = (0,_solana_web3_js__WEBPACK_IMPORTED_MODULE_6__.clusterApiUrl)(network);\n    // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking\n    const wallets = [\n        new _solana_wallet_adapter_wallets__WEBPACK_IMPORTED_MODULE_4__.PhantomWalletAdapter(),\n        new _solana_wallet_adapter_wallets__WEBPACK_IMPORTED_MODULE_4__.SolflareWalletAdapter({\n            network\n        })\n    ];\n    // Handle Next.js hydration issue\n    const [mounted, setMounted] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        setMounted(true);\n    }, []);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_solana_wallet_adapter_react__WEBPACK_IMPORTED_MODULE_2__.ConnectionProvider, {\n        endpoint: endpoint,\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_solana_wallet_adapter_react__WEBPACK_IMPORTED_MODULE_2__.WalletProvider, {\n            wallets: wallets,\n            autoConnect: true,\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_solana_wallet_adapter_react_ui__WEBPACK_IMPORTED_MODULE_5__.WalletModalProvider, {\n                children: mounted && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                    ...pageProps\n                }, void 0, false, {\n                    fileName: \"D:\\\\Company Projects\\\\Solana-Token-presale\\\\app\\\\pages\\\\_app.tsx\",\n                    lineNumber: 37,\n                    columnNumber: 23\n                }, this)\n            }, void 0, false, {\n                fileName: \"D:\\\\Company Projects\\\\Solana-Token-presale\\\\app\\\\pages\\\\_app.tsx\",\n                lineNumber: 36,\n                columnNumber: 9\n            }, this)\n        }, void 0, false, {\n            fileName: \"D:\\\\Company Projects\\\\Solana-Token-presale\\\\app\\\\pages\\\\_app.tsx\",\n            lineNumber: 35,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"D:\\\\Company Projects\\\\Solana-Token-presale\\\\app\\\\pages\\\\_app.tsx\",\n        lineNumber: 34,\n        columnNumber: 5\n    }, this);\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUM0QztBQUNzQztBQUNmO0FBQzBCO0FBQ3ZCO0FBQ3RCO0FBRWhELGdCQUFnQjtBQUNlO0FBQy9CLGdDQUFnQztBQUNoQ1MsbUJBQU9BLENBQUM7QUFFTyxTQUFTQyxJQUFJLEVBQUVDLFNBQVMsRUFBRUMsU0FBUyxFQUFZO0lBQzVELHVEQUF1RDtJQUN2RCxNQUFNQyxVQUFVVCw2RUFBb0JBLENBQUNVLE1BQU07SUFFM0MsNkNBQTZDO0lBQzdDLE1BQU1DLFdBQVdQLDhEQUFhQSxDQUFDSztJQUUvQixxRkFBcUY7SUFDckYsTUFBTUcsVUFBVTtRQUNkLElBQUlYLGdGQUFvQkE7UUFDeEIsSUFBSUMsaUZBQXFCQSxDQUFDO1lBQUVPO1FBQVE7S0FDckM7SUFFRCxpQ0FBaUM7SUFDakMsTUFBTSxDQUFDSSxTQUFTQyxXQUFXLEdBQUdsQiwrQ0FBUUEsQ0FBQztJQUN2Q0MsZ0RBQVNBLENBQUM7UUFDUmlCLFdBQVc7SUFDYixHQUFHLEVBQUU7SUFFTCxxQkFDRSw4REFBQ2hCLDRFQUFrQkE7UUFBQ2EsVUFBVUE7a0JBQzVCLDRFQUFDWix3RUFBY0E7WUFBQ2EsU0FBU0E7WUFBU0csV0FBVztzQkFDM0MsNEVBQUNaLGdGQUFtQkE7MEJBQ2pCVSx5QkFBVyw4REFBQ047b0JBQVcsR0FBR0MsU0FBUzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBSzlDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcHJlc2FsZS1mcm9udGVuZC8uL3BhZ2VzL19hcHAudHN4PzJmYmUiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBBcHBQcm9wcyB9IGZyb20gJ25leHQvYXBwJztcclxuaW1wb3J0IHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgQ29ubmVjdGlvblByb3ZpZGVyLCBXYWxsZXRQcm92aWRlciB9IGZyb20gJ0Bzb2xhbmEvd2FsbGV0LWFkYXB0ZXItcmVhY3QnO1xyXG5pbXBvcnQgeyBXYWxsZXRBZGFwdGVyTmV0d29yayB9IGZyb20gJ0Bzb2xhbmEvd2FsbGV0LWFkYXB0ZXItYmFzZSc7XHJcbmltcG9ydCB7IFBoYW50b21XYWxsZXRBZGFwdGVyLCBTb2xmbGFyZVdhbGxldEFkYXB0ZXIgfSBmcm9tICdAc29sYW5hL3dhbGxldC1hZGFwdGVyLXdhbGxldHMnO1xyXG5pbXBvcnQgeyBXYWxsZXRNb2RhbFByb3ZpZGVyIH0gZnJvbSAnQHNvbGFuYS93YWxsZXQtYWRhcHRlci1yZWFjdC11aSc7XHJcbmltcG9ydCB7IGNsdXN0ZXJBcGlVcmwgfSBmcm9tICdAc29sYW5hL3dlYjMuanMnO1xyXG5cclxuLy8gSW1wb3J0IHN0eWxlc1xyXG5pbXBvcnQgJy4uL3N0eWxlcy9nbG9iYWxzLmNzcyc7XHJcbi8vIERlZmF1bHQgc3R5bGVzIGZvciB0aGUgd2FsbGV0XHJcbnJlcXVpcmUoJ0Bzb2xhbmEvd2FsbGV0LWFkYXB0ZXItcmVhY3QtdWkvc3R5bGVzLmNzcycpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQXBwKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfTogQXBwUHJvcHMpIHtcclxuICAvLyBDYW4gYmUgc2V0IHRvICdkZXZuZXQnLCAndGVzdG5ldCcsIG9yICdtYWlubmV0LWJldGEnXHJcbiAgY29uc3QgbmV0d29yayA9IFdhbGxldEFkYXB0ZXJOZXR3b3JrLkRldm5ldDtcclxuXHJcbiAgLy8gWW91IGNhbiBhbHNvIHByb3ZpZGUgYSBjdXN0b20gUlBDIGVuZHBvaW50XHJcbiAgY29uc3QgZW5kcG9pbnQgPSBjbHVzdGVyQXBpVXJsKG5ldHdvcmspO1xyXG5cclxuICAvLyBAc29sYW5hL3dhbGxldC1hZGFwdGVyLXdhbGxldHMgaW5jbHVkZXMgYWxsIHRoZSBhZGFwdGVycyBidXQgc3VwcG9ydHMgdHJlZSBzaGFraW5nXHJcbiAgY29uc3Qgd2FsbGV0cyA9IFtcclxuICAgIG5ldyBQaGFudG9tV2FsbGV0QWRhcHRlcigpLFxyXG4gICAgbmV3IFNvbGZsYXJlV2FsbGV0QWRhcHRlcih7IG5ldHdvcmsgfSksXHJcbiAgXTtcclxuXHJcbiAgLy8gSGFuZGxlIE5leHQuanMgaHlkcmF0aW9uIGlzc3VlXHJcbiAgY29uc3QgW21vdW50ZWQsIHNldE1vdW50ZWRdID0gdXNlU3RhdGUoZmFsc2UpO1xyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBzZXRNb3VudGVkKHRydWUpO1xyXG4gIH0sIFtdKTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxDb25uZWN0aW9uUHJvdmlkZXIgZW5kcG9pbnQ9e2VuZHBvaW50fT5cclxuICAgICAgPFdhbGxldFByb3ZpZGVyIHdhbGxldHM9e3dhbGxldHN9IGF1dG9Db25uZWN0PlxyXG4gICAgICAgIDxXYWxsZXRNb2RhbFByb3ZpZGVyPlxyXG4gICAgICAgICAge21vdW50ZWQgJiYgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPn1cclxuICAgICAgICA8L1dhbGxldE1vZGFsUHJvdmlkZXI+XHJcbiAgICAgIDwvV2FsbGV0UHJvdmlkZXI+XHJcbiAgICA8L0Nvbm5lY3Rpb25Qcm92aWRlcj5cclxuICApO1xyXG59ICJdLCJuYW1lcyI6WyJ1c2VTdGF0ZSIsInVzZUVmZmVjdCIsIkNvbm5lY3Rpb25Qcm92aWRlciIsIldhbGxldFByb3ZpZGVyIiwiV2FsbGV0QWRhcHRlck5ldHdvcmsiLCJQaGFudG9tV2FsbGV0QWRhcHRlciIsIlNvbGZsYXJlV2FsbGV0QWRhcHRlciIsIldhbGxldE1vZGFsUHJvdmlkZXIiLCJjbHVzdGVyQXBpVXJsIiwicmVxdWlyZSIsIkFwcCIsIkNvbXBvbmVudCIsInBhZ2VQcm9wcyIsIm5ldHdvcmsiLCJEZXZuZXQiLCJlbmRwb2ludCIsIndhbGxldHMiLCJtb3VudGVkIiwic2V0TW91bnRlZCIsImF1dG9Db25uZWN0Il0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "@solana/web3.js":
/*!**********************************!*\
  !*** external "@solana/web3.js" ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@solana/web3.js");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "@solana/wallet-adapter-base":
/*!**********************************************!*\
  !*** external "@solana/wallet-adapter-base" ***!
  \**********************************************/
/***/ ((module) => {

"use strict";
module.exports = import("@solana/wallet-adapter-base");;

/***/ }),

/***/ "@solana/wallet-adapter-react":
/*!***********************************************!*\
  !*** external "@solana/wallet-adapter-react" ***!
  \***********************************************/
/***/ ((module) => {

"use strict";
module.exports = import("@solana/wallet-adapter-react");;

/***/ }),

/***/ "@solana/wallet-adapter-react-ui":
/*!**************************************************!*\
  !*** external "@solana/wallet-adapter-react-ui" ***!
  \**************************************************/
/***/ ((module) => {

"use strict";
module.exports = import("@solana/wallet-adapter-react-ui");;

/***/ }),

/***/ "@solana/wallet-adapter-wallets":
/*!*************************************************!*\
  !*** external "@solana/wallet-adapter-wallets" ***!
  \*************************************************/
/***/ ((module) => {

"use strict";
module.exports = import("@solana/wallet-adapter-wallets");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/@solana"], () => (__webpack_exec__("./pages/_app.tsx")));
module.exports = __webpack_exports__;

})();