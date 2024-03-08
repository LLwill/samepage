import ReactDOM from 'react-dom/client';
import { ConversationProvider } from '@xm/context';
import { ASYNC_SCRIOPTS_ID, MSG_PAGE_WILL_REFRESH, MSG_OPEN_MAIN } from '@/constants';
import { SCRIPTS_URL } from '@/utils';

import App from './app/app';

import '@/common/styles/frame.less';

// shadow DOM antd 样式解决方案
import { createCache, StyleProvider } from '@ant-design/cssinjs';

(() => {
    const extensionId = chrome.runtime.id;
    document.body.setAttribute('same-page-id', extensionId);
    const extensionVersion = chrome.runtime.getManifest().version;
    document.body.setAttribute('same-page-version', extensionVersion);
})();

// 创建id为CRX-container的div
const __root__ = document.createElement('div');
__root__.id = '_ml_xm_container';

// 创建shadow DOM
const shadowRoot = __root__.attachShadow({ mode: 'open' });
const container = document.createElement('div');
shadowRoot.appendChild(container);

// 移动样式
const __styles_div__ = document.getElementById('__xm_shadow_dom_style__');
const styleElements = __styles_div__?.querySelectorAll('style');
styleElements?.forEach((node) => {
    shadowRoot?.appendChild(node);
});
__styles_div__?.remove();

// 将刚创建的div插入body最后
document.body.appendChild(__root__);
// 将ReactDOM插入刚创建的div(包含了shadow DOM)
const crxContainer = ReactDOM.createRoot(container);

crxContainer.render(
    <StyleProvider container={shadowRoot} cache={createCache()}>
        <ConversationProvider>
            <App />
        </ConversationProvider>
    </StyleProvider>
);

/**
 * 异步加载脚本容器
 */

window.onload = function () {
    const iframe = document.createElement('iframe');
    iframe.id = ASYNC_SCRIOPTS_ID;
    iframe.src = SCRIPTS_URL;
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
};

/**
 * 页面即将刷新
 */
window.onbeforeunload = function () {
    chrome.runtime.sendMessage({ type: MSG_PAGE_WILL_REFRESH });
};
