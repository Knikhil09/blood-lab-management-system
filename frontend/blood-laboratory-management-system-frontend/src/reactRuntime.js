import * as ReactNamespace from 'react';
import * as ReactDOMNamespace from 'react-dom/client';

const React = ReactNamespace.default ?? ReactNamespace;
export const createRoot = ReactDOMNamespace.createRoot ?? ReactDOMNamespace.default?.createRoot;
export default React;
