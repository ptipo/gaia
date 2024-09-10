const assetBundle = '{{assetBundle}}';
const assetHtmlTag = '{{assetHtmlTag}}';
const assetId = '{{assetId}}';
const assetConfig = `{{assetAccessPoint}}/assets/${assetId}/latest/config.json`;

//engage id
const engageId = _pt_popup_info.engage_id;
const engageElementId = `engage_${_pt_popup_info.popup_id}`;
const email = window.shopifyEmail || '';
// TODO 需要定制邮箱获取方式
let uid = (window.ptengine && window.ptengine.__ptePeid) || Date.now() + '';

// 加loading
const loadingEl = document.querySelector(`#${engageElementId} [data-menu-action="insert.popup"]`);
addLoading(loadingEl);

function addLoading(wrap, className = 'pt-popup-loading', styleId = 'pt-popup-loading-style') {
    if (!wrap || wrap.querySelector('.' + className)) return;
    const loadingHTML = `<div class="${className}">
    <svg viewbox="25 25 50 50" class="circular">
    <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
    </svg>
    </div>`;
    const loadingStyle = `.${className} {
    position: fixed;
    left: 0;
    right: 0;
    top: 50%;
    margin-top: -21px;
    display:flex;
    justify-content:center;
    overflow: hidden;
    z-index: 111;
    }
    .${className} .circular {
    width: 42px;
    height: 42px;
    overflow: hidden;
    -webkit-animation: pt-popup-loading-rotate 2s linear infinite;
    animation: pt-popup-loading-rotate 2s linear infinite;
    }
    .${className} .path {
    -webkit-animation: pt-popup-loading-dash 1.5s ease-in-out infinite;
    animation: pt-popup-loading-dash 1.5s ease-in-out infinite;
    stroke-dasharray: 90, 150;
    stroke-dashoffset: 0;
    stroke-width: 2;
    stroke: #cec7d0;
    stroke-linecap: round;
    }
    .${className} i {
    color: #cec7d0;
    }
    @-webkit-keyframes pt-popup-loading-rotate {
    100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
    }
    }
    @keyframes pt-popup-loading-rotate {
    100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
    }
    }
    @-webkit-keyframes pt-popup-loading-dash {
    0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
    }
    50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -40px;
    }
    100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -120px;
    }
    }
    @keyframes pt-popup-loading-dash {
    0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
    }
    50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -40px;
    }
    100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -120px;
    }
    }`;
    // add dom
    const loading = document.createElement('div');
    loading.innerHTML = loadingHTML;
    wrap.appendChild(loading.firstChild);
    // add style
    if (document.querySelector('#' + styleId)) return;
    const head = document.getElementsByTagName('head')[0];
    const styleEle = document.createElement('style');
    styleEle.setAttribute('id', styleId);
    styleEle.innerHTML = loadingStyle;
    head.appendChild(styleEle);
}
function removeLoading(wrap, className = 'pt-popup-loading') {
    const loading = wrap.querySelector('.' + className);
    if (loading) {
        loading.remove();
    }
}

async function onSdkLoad(appVersion) {
    return new Promise((resolve) => {
        var script = document.createElement('script');
        script.src = `https://compnpmcache.ptengine.com/${assetBundle}@${appVersion}/dist/index.js`;
        script.type = 'module';
        script.onload = () => {
            resolve();
        };
        document.head.appendChild(script);
    });
}

async function fetchConfig() {
    const response = await fetch(assetConfig);
    return response.json();
}

// This function should be rewritten for different app
function assetEventHandler(assetHtmlElement) {
    assetHtmlElement.addEventListener('form-answer', (e) => submitData(e.detail));
    assetHtmlElement.addEventListener('save-user-tag', (e) => saveUserTag(e.detail));

    function submitData(data) {
        console.log('submit form data:' + data);
        try {
            submitForm(data);
        } catch (ex) {
            console.log(ex);
        }
        submit2BI(data);
    }

    function saveUserTag(data) {
        console.log('save user tag:' + data);

        submit2Identify(data);
    }

    function submit2BI(data) {
        // 表单id 如果需要从BI读取数据，需要填写
        let formId = assetId;
        const url = 'https://ecagent.ptengine.com/api/form';
        if (query('preview_ptx_token')) {
            formId = `preview-${formId}`;
        }
        const body = {
            timestamp: new Date().getTime(),
            formId,
            email,
            uid,
            data,
        };

        const ptSid = window.ptengine?.__sid;

        if (ptSid) {
            const ptCookie = document.cookie.split(';').find((cookie) => cookie.trim().startsWith(`pt_${ptSid}`));

            if (ptCookie) {
                const decodeURI = decodeURIComponent(ptCookie);
                const params = new URLSearchParams(decodeURI);
                const sessionId = params.get('sessionId');
                if (sessionId) {
                    body.data['pt_session_id'] = sessionId;
                }
            }
        }

        //You can use Fetch API to send the data to your server, eg.:
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
    }

    function submit2Identify(data) {
        if (!data) {
            return;
        }
        try {
            if (!query('preview_ptx_token')) {
                ptengine.identify('', {
                    ...data,
                });
            } else {
                console.log('identify:', data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    var checkValue = '';

    function generateFieldInfo(optionName, value) {
        var fieldID = 'single-text_' + encodeURIComponent(optionName);
        var fieldName = optionName;
        var fieldValue = value;
        //使checkValue值始终保持最新
        checkValue = fieldValue;
        console.log(checkValue);
        var dataType = Array.isArray(fieldValue) ? 'array' : 'string';
        var fieldType = dataType === 'array' ? 'list' : 'single-text';
        var connectProperty = optionName;
        var alowDuplicate = true;
        var allowConnect = false;
        var error = false;
        var fieldIDList = {
            fieldID: fieldID,
            fieldName: fieldName,
            fieldValue: fieldValue,
            fieldType: fieldType,
        };
        var formContent = {
            fieldID: fieldID,
            fieldName: fieldName,
            fieldValue: fieldValue,
            connectProperty: connectProperty,
            alowDuplicate: alowDuplicate,
            allowConnect: allowConnect,
            error: error,
        };
        return {
            fieldIDList: fieldIDList,
            formContent: formContent,
        };
    }

    function submitForm(data) {
        if (!data) {
            console.error('No data provided to submitForm.');
            return;
        }

        const currEngage = window.ptEngage && window.ptEngage[engageId];
        if (!currEngage || !currEngage.current) {
            console.error('Current engagement or variant is undefined.');
            return;
        }

        const fields = [];
        const values = [];
        if (email) {
            const emailField = generateFieldInfo('email', email);
            fields.push(emailField.fieldIDList);
            values.push(emailField.formContent);
        }

        for (const key in data) {
            console.log(key + ':' + data[key]);
            const field = generateFieldInfo(key, data[key]);
            fields.push(field.fieldIDList);
            values.push(field.formContent);
        }

        console.log('checkValue:', checkValue);

        if (currEngage.current) {
            currEngage.current.variant = {
                fieldIDList: JSON.stringify(fields),
                formContent: JSON.stringify(values),
            };

            // 非预览状态再提交数据
            if (!query('preview_ptx_token')) {
                console.log('Data submit:', data, 'email', email);
                currEngage.submitCallback(
                    {
                        send: currEngage.context.send,
                        setting: {
                            sid: localStorage.getItem('PTX_SID'),
                        },
                    },
                    currEngage.current
                );
            } else {
                console.log('Data submit (Preview):', data, 'email', email);
            }
        }
    }

    function query(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substring(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]);
        return null;
    }
}

fetchConfig().then((config) => {
    const appVersion = config.appVersion;
    onSdkLoad(appVersion);

    const el = ptKit.querySelector(`#${engageElementId} [data-menu-action="insert.popup"]`);

    const div = document.createElement('div');
    div.className = 'ptx-engage-popup-form-wrapper';
    el.appendChild(div);
    div.style = 'max-height: 100%; overflow-y: auto; border-radius: inherit;';

    const assetHtmlElement = document.createElement(assetHtmlTag);
    assetHtmlElement.setAttribute('config', JSON.stringify(config));

    div.appendChild(assetHtmlElement);

    assetEventHandler(assetHtmlElement);

    removeLoading(loadingEl);
});
