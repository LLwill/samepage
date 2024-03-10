// ==UserScript==
// @name         social grow 增强分析
// @namespace    same-page-extension
// @version      1
// @description  分析社交数据
// @match        https://socialgrow.miaozhen.com/*
// @grant        none
// @status       enabled
// @runAt        document_end
// ==/UserScript==

(() => {
    // 监听div[class^="chart-container]相关节点是否渲染
    const __sp_plugin_key__ = '__sp_plugin_logo__';
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const elements = document.querySelectorAll('div[class^="chart-container"]');
                elements.forEach((element) => {
                    const hasLogo = element.querySelectorAll(`img.${__sp_plugin_key__}`);
                    if (hasLogo.length <= 0) {
                        element.setAttribute('style', 'position: relative');
                        const logo = document.createElement('img');
                        logo.className = __sp_plugin_key__;
                        logo.src = 'https://xming.ai/home-logo.1d771e26aa42d1b59f28bc073f620210.svg';
                        logo.style.position = 'absolute';
                        logo.style.top = '-10px';
                        logo.style.right = '-10px';
                        logo.style.width = '20px';
                        logo.style.height = '20px';
                        // 调整层级为 10001
                        logo.style.zIndex = '10001';
                        // 鼠标 hover 为手
                        logo.style.cursor = 'pointer';

                        logo.onclick = (e) => {
                            const parent = (e?.target as HTMLImageElement)?.parentNode;
                            console.log('parent', parent);
                            const _button = parent?.querySelector('span[class^="chart-container-icon"]');
                            console.log('_button', _button);
                            if (_button) {
                                const _dataView = parent?.querySelector('div[class^="data-view"]');
                                if (!_dataView) {
                                    (_button as HTMLSpanElement)?.click();
                                }
                                setTimeout(async () => {
                                    // 获取 div[class^="data-view"] 下的所有内容
                                    const dataView = parent?.querySelector('div[class^="data-view"]');
                                    const title = (
                                        parent?.querySelector(
                                            '.ant-pro-card-header .ant-pro-card-title'
                                        ) as HTMLDivElement
                                    )?.innerText;
                                    console.log('dataView', dataView);
                                    if (dataView) {
                                        const content = (dataView as HTMLDivElement)?.innerText;
                                        const res = await window.SP_getAllAssistants();
                                        console.log(res.data.bot, 'bots');
                                        const bots = res.data.bot;
                                        window.SP_openAssistant({
                                            assistant: bots[1],
                                            content: `这是一个社交相关的${title}的数据\n${content}\n 请帮我分析一下`
                                        });
                                    }
                                }, 0);
                            }
                        };

                        element.appendChild(logo);
                    }
                });
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
