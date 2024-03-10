// ==UserScript==
// @name         SamePage Extension
// @namespace    same-page-extension
// @version      1
// @description  same-page-extension
// @match        *://*/*
// @grant        none
// @status       enabled
// ==/UserScript==

import { MSG_OPEN_MAIN, MSG_OPEN_BOT } from '@/constants';
import services from '@xm/services';
(() => {
    console.log('init', window);

    // Your code here
    window.SP_isloaded = true;
    window.SP_openExtension = (url?: string) => {
        try {
            console.log('SP_openExtension 执行了');
            const extensionId = window.document.body.getAttribute('same-page-id');
            const extensionVersion = window.document.body.getAttribute('same-page-version');
            chrome.runtime.sendMessage({
                type: MSG_OPEN_MAIN,
                data: {
                    url,
                    version: extensionVersion
                }
            });
        } catch (e) {
            console.log('SP_openExtension error', e);
        }
    };

    window.SP_getAllAssistants = async () => {
        return await services.robot.getRobotDict();
    };

    window.SP_openAssistant = ({ assistant, content }) => {
        console.log('open assistant');
        chrome.runtime.sendMessage({
            type: MSG_OPEN_BOT,
            data: {
                bot: assistant,
                content
            }
        });
    };
})();
