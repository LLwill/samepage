import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Browser from 'webextension-polyfill';
import { setPageOpenTime } from '@/utils';
import { MSG_OPEN_MAIN } from '@/constants';
import { GlobalWapper } from '../../global-wapper';
import { useConversationContext } from '@xm/context';
import { GetDictBotResponse } from '@/ytt-type/robot';

type IBotItem = GetDictBotResponse['bot'][0];

import styles from './index.module.less';

export const ExtAppLayout = () => {
    const navigate = useNavigate();
    const { dispatch } = useConversationContext();
    const changeRobot = (item: IBotItem) => {
        const { type, key } = item;
        navigate(`/conversation/${type}/${key}`);
        dispatch({
            type: 'i_model_info',
            payload: {
                modelInfo: item
            }
        });
    };
    useEffect(() => {
        setPageOpenTime();

        // 打开插件并跳转bot
        Browser.runtime.onMessage.addListener((message) => {
            console.log('ExtAppLayout:', message);
            const { type, data } = message;
            if (type === MSG_OPEN_MAIN && data?.bot) {
                changeRobot(data?.bot);

                dispatch({
                    type: 's_action',
                    payload: {
                        selectAction: data?.action || '问答',
                        selectText: data?.content
                    }
                });
            }
        });
    }, []);
    return (
        <div className={styles.extAppLayout}>
            <GlobalWapper>
                <Outlet />
            </GlobalWapper>
        </div>
    );
};
