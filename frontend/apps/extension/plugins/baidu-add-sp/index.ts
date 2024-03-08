(() => {
    console.log('baidu-add-sp-init', window);
    const baiduBtn = document.querySelector('#form');
    if (baiduBtn?.parentNode) {
        const baiduParent = baiduBtn.parentNode;
        const spButton = document.createElement('button');
        spButton.innerHTML = '打开 Samepage';
        spButton.addEventListener('click', async () => {
            const res = await window.SP_getAllAssistants();
            console.log(res.data.bot, 'bots');
            const bots = res.data.bot;
            window.SP_openAssistant({
                assistant: bots[1],
                content: '测试'
            });
        });
        baiduParent.insertBefore(spButton, baiduBtn?.nextSibling);
    }
})();
