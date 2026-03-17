(function () {
    // --- Configuração ---
    const WEBHOOK_PROVA = 'https://n8n.segredosdodrop.com/webhook/quantic-materialize';

    // --- Estilos Baseados na DOPE ---
    const styles = `
        :root {
            --q-primary: #000000;
            --q-bg: #ffffff;
            --q-border: #000000;
            --q-gray: #f5f5f5;
            --q-text: #000000;
            --q-text-light: #666666;
            --q-accent: #D4A017;
        }
        .q-btn-trigger-ia {
            position: absolute; top: 60px; left: 20px; z-index: 100;
            background: transparent;
            color: var(--q-accent); border: 1px solid var(--q-accent);
            padding: 6px 18px; font-family: 'Inter', sans-serif;
            font-weight: 600; font-size: 9px; letter-spacing: 1.5px; cursor: pointer; display: flex;
            align-items: center; justify-content: center; gap: 6px; text-transform: uppercase;
            transition: 0.3s ease;
            white-space: nowrap;
        }
        .q-btn-trigger-ia i { font-size: 14px; color: var(--q-accent); }
        .q-btn-trigger-ia:hover {
            background: var(--q-accent);
            color: #000000;
        }
        .q-btn-trigger-ia:hover i { color: #000000; }
        #q-modal-ia {
            display: none; position: fixed; inset: 0; background: rgba(255,255,255,0.98);
            z-index: 999999; align-items: center; justify-content: center; font-family: 'Inter', sans-serif;
        }
        .q-card-ia {
            background: var(--q-bg); width: 100%; max-width: 480px;
            padding: 0; position: relative; color: var(--q-text);
            border: 1px solid var(--q-border);
            max-height: 94vh; display: flex; flex-direction: column; overflow: hidden;
        }
        .q-content-scroll { padding: 40px 30px; overflow-y: auto; flex: 1; text-align: center; }
        .q-close-ia { position: absolute; top: 20px; right: 20px; background: none; border: none; color: var(--q-text); cursor: pointer; font-size: 24px; z-index: 100; font-weight: 300; }
        .q-tips-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; padding: 20px 0; margin: 20px 0; border-top: 1px solid var(--q-gray); border-bottom: 1px solid var(--q-gray); }
        .q-tip-item { display: flex; flex-direction: column; align-items: center; gap: 8px; font-size: 9px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: var(--q-text-light); }
        .q-tip-item i { color: var(--q-primary); font-size: 20px; }
        .q-lead-form { margin: 30px 0 20px; display: flex; flex-direction: column; gap: 20px; text-align: left; }
        .q-input-row { display: flex; gap: 15px; }
        .q-group { flex: 1; }
        .q-group label { display: block; font-size: 9px; font-weight: 600; letter-spacing: 1.5px; color: var(--q-text); margin-bottom: 8px; text-transform: uppercase; }
        .q-input { width: 100%; padding: 15px; border: 1px solid var(--q-border); font-size: 13px; font-family: 'Inter', sans-serif; background: transparent; color: var(--q-text); outline: none; box-sizing: border-box; }
        .q-input:focus { border-width: 2px; padding: 14px; }
        .q-btn-black { background: var(--q-primary); color: var(--q-bg); border: 1px solid var(--q-primary); width: 100%; padding: 18px; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; margin-top: 20px; transition: 0.3s; }
        .q-btn-black:disabled { background: var(--q-gray); color: #999; border-color: var(--q-gray); cursor: not-allowed; }
        .q-btn-black:not(:disabled):hover { background: var(--q-bg); color: var(--q-primary); }
        .q-btn-buy { background: var(--q-primary); color: var(--q-bg); border: 1px solid var(--q-primary); width: 100%; padding: 20px; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; margin-bottom: 15px; transition: 0.3s; }
        .q-btn-buy:hover { background: var(--q-bg); color: var(--q-primary); }
        .q-btn-outline { background: var(--q-bg); color: var(--q-primary); border: 1px solid var(--q-border); width: 100%; padding: 18px; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; transition: 0.3s; }
        .q-btn-outline:hover { background: var(--q-primary); color: var(--q-bg); }
        .q-powered-footer { background: var(--q-bg); padding: 20px; display: flex; align-items: center; justify-content: center; gap: 10px; flex-shrink: 0; border-top: 1px solid var(--q-gray); }
        .q-quantic-logo { height: 12px; filter: brightness(0); }
        .q-loader-ui { display:none; padding: 60px 0; }
        .q-status-msg { display:none; font-size: 10px; letter-spacing: 1px; color: #ef4444; margin-top: 8px; font-weight: 600; text-align: left; text-transform: uppercase; }
        @keyframes q-slide { from { transform: translateX(-100%); } to { transform: translateX(100%); } }
        @keyframes q-pulse-text { 0%, 100% { opacity: 0.4; transform: scale(0.98); } 50% { opacity: 1; transform: scale(1); } }

        /* Oculta scrollbar */
        .q-content-scroll::-webkit-scrollbar { width: 4px; }
        .q-content-scroll::-webkit-scrollbar-track { background: transparent; }
        .q-content-scroll::-webkit-scrollbar-thumb { background: #e5e5e5; }
    `;

    function createModalHTML() {
        const wrapper = document.createElement('div');
        wrapper.id = 'q-modal-ia';

        const card = document.createElement('div');
        card.className = 'q-card-ia';

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'q-close-ia';
        closeBtn.id = 'q-close-btn';
        closeBtn.textContent = '\u00D7';
        card.appendChild(closeBtn);

        // Content scroll
        const contentScroll = document.createElement('div');
        contentScroll.className = 'q-content-scroll';

        // Header
        const header = document.createElement('div');
        header.id = 'q-header-provador';
        const h1 = document.createElement('h1');
        h1.style.cssText = 'margin:0 0 10px 0; font-size:20px; font-weight:700; letter-spacing:2px; text-transform:uppercase;';
        h1.textContent = 'Provador Virtual';
        const subtitle = document.createElement('p');
        subtitle.style.cssText = 'margin:0; font-size:11px; color:var(--q-text-light); letter-spacing:1px; text-transform:uppercase;';
        subtitle.textContent = 'DOPE';
        header.appendChild(h1);
        header.appendChild(subtitle);
        contentScroll.appendChild(header);

        // Step upload
        const stepUpload = document.createElement('div');
        stepUpload.id = 'q-step-upload';

        // Lead form
        const leadForm = document.createElement('div');
        leadForm.className = 'q-lead-form';

        // Phone group
        const phoneGroup = document.createElement('div');
        phoneGroup.className = 'q-group';
        const phoneLabel = document.createElement('label');
        phoneLabel.textContent = 'Seu WhatsApp';
        const phoneInput = document.createElement('input');
        phoneInput.type = 'tel';
        phoneInput.id = 'q-phone';
        phoneInput.className = 'q-input';
        phoneInput.placeholder = '(11) 99999-9999';
        phoneInput.maxLength = 15;
        const phoneError = document.createElement('div');
        phoneError.id = 'q-phone-error';
        phoneError.className = 'q-status-msg';
        phoneError.textContent = 'Insira um número válido';
        phoneGroup.appendChild(phoneLabel);
        phoneGroup.appendChild(phoneInput);
        phoneGroup.appendChild(phoneError);
        leadForm.appendChild(phoneGroup);

        // Height/Weight row
        const inputRow = document.createElement('div');
        inputRow.className = 'q-input-row';

        const heightGroup = document.createElement('div');
        heightGroup.className = 'q-group';
        const heightLabel = document.createElement('label');
        heightLabel.textContent = 'Altura (cm)';
        const heightInput = document.createElement('input');
        heightInput.type = 'text';
        heightInput.id = 'q-h-val';
        heightInput.className = 'q-input';
        heightInput.placeholder = 'Ex: 175';
        heightGroup.appendChild(heightLabel);
        heightGroup.appendChild(heightInput);

        const weightGroup = document.createElement('div');
        weightGroup.className = 'q-group';
        const weightLabel = document.createElement('label');
        weightLabel.textContent = 'Peso (kg)';
        const weightInput = document.createElement('input');
        weightInput.type = 'text';
        weightInput.id = 'q-w-val';
        weightInput.className = 'q-input';
        weightInput.placeholder = 'Ex: 80';
        weightGroup.appendChild(weightLabel);
        weightGroup.appendChild(weightInput);

        inputRow.appendChild(heightGroup);
        inputRow.appendChild(weightGroup);
        leadForm.appendChild(inputRow);
        stepUpload.appendChild(leadForm);

        // Tips text
        const tipsText = document.createElement('p');
        tipsText.style.cssText = 'margin: 30px 0 10px; font-size: 10px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: var(--q-text-light); text-align: center;';
        tipsText.textContent = 'Sua foto deve seguir estes requisitos:';
        stepUpload.appendChild(tipsText);

        // Tips grid
        const tipsGrid = document.createElement('div');
        tipsGrid.className = 'q-tips-grid';
        tipsGrid.style.marginTop = '0';
        const tipData = [
            { icon: 'ph ph-t-shirt', text: 'Com Roupa' },
            { icon: 'ph ph-person', text: 'Corpo Inteiro' },
            { icon: 'ph ph-sun', text: 'Boa Luz' }
        ];
        tipData.forEach(tip => {
            const item = document.createElement('div');
            item.className = 'q-tip-item';
            const icon = document.createElement('i');
            icon.className = tip.icon;
            const span = document.createElement('span');
            span.textContent = tip.text;
            item.appendChild(icon);
            item.appendChild(span);
            tipsGrid.appendChild(item);
        });
        stepUpload.appendChild(tipsGrid);

        // Upload area
        const uploadArea = document.createElement('div');
        uploadArea.style.cssText = 'display: flex; gap: 20px; justify-content: center; margin-top: 30px;';

        const triggerUpload = document.createElement('div');
        triggerUpload.id = 'q-trigger-upload';
        triggerUpload.style.cssText = 'width:120px; height:160px; border:1px solid var(--q-border); display:flex; flex-direction:column; align-items:center; justify-content:center; cursor:pointer; background:var(--q-gray); transition:0.3s;';
        const camIcon = document.createElement('i');
        camIcon.className = 'ph ph-camera-plus';
        camIcon.style.cssText = 'font-size:32px; color:var(--q-primary); margin-bottom: 10px;';
        const uploadSpan = document.createElement('span');
        uploadSpan.style.cssText = 'font-size: 9px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;';
        uploadSpan.textContent = 'Enviar Foto';
        const realInput = document.createElement('input');
        realInput.type = 'file';
        realInput.id = 'q-real-input';
        realInput.accept = 'image/*';
        realInput.style.display = 'none';
        triggerUpload.appendChild(camIcon);
        triggerUpload.appendChild(uploadSpan);
        triggerUpload.appendChild(realInput);

        const preView = document.createElement('div');
        preView.id = 'q-pre-view';
        preView.style.cssText = 'display:none; width:120px; height:160px; overflow:hidden; border:1px solid var(--q-border);';
        const preImg = document.createElement('img');
        preImg.id = 'q-pre-img';
        preImg.style.cssText = 'width:100%; height:100%; object-fit:cover;';
        preView.appendChild(preImg);

        uploadArea.appendChild(triggerUpload);
        uploadArea.appendChild(preView);
        stepUpload.appendChild(uploadArea);

        // Generate button
        const genBtn = document.createElement('button');
        genBtn.className = 'q-btn-black';
        genBtn.id = 'q-btn-generate';
        genBtn.disabled = true;
        genBtn.textContent = 'Ver no meu corpo';
        stepUpload.appendChild(genBtn);

        contentScroll.appendChild(stepUpload);

        // Loading box
        const loadingBox = document.createElement('div');
        loadingBox.className = 'q-loader-ui';
        loadingBox.id = 'q-loading-box';
        const loadingText = document.createElement('div');
        loadingText.style.cssText = 'font-weight:600; font-size:12px; letter-spacing:3px; text-transform:uppercase; margin-bottom:20px; animation: q-pulse-text 1.5s infinite ease-in-out;';
        loadingText.textContent = 'Processando Imagem...';
        const loadingBar = document.createElement('div');
        loadingBar.style.cssText = 'height:1px; background:var(--q-gray); width:100%; position:relative; overflow:hidden;';
        const loadingBarInner = document.createElement('div');
        loadingBarInner.style.cssText = 'position:absolute; top:0; left:0; height:100%; width:30%; background:var(--q-primary); animation: q-slide 1.5s infinite linear;';
        loadingBar.appendChild(loadingBarInner);
        loadingBox.appendChild(loadingText);
        loadingBox.appendChild(loadingBar);
        contentScroll.appendChild(loadingBox);

        // Result step
        const stepResult = document.createElement('div');
        stepResult.id = 'q-step-result';
        stepResult.style.cssText = 'display:none; flex-direction:column; align-items:center;';

        const resultImgWrap = document.createElement('div');
        resultImgWrap.style.cssText = 'width:100%; border:1px solid var(--q-border); margin-bottom:30px; background:var(--q-gray);';
        const finalImg = document.createElement('img');
        finalImg.id = 'q-final-view-img';
        finalImg.style.cssText = 'width:100%; height:auto; display:block;';
        resultImgWrap.appendChild(finalImg);
        stepResult.appendChild(resultImgWrap);

        const sizeRow = document.createElement('div');
        sizeRow.style.cssText = 'border-top:1px solid var(--q-border); border-bottom:1px solid var(--q-border); padding:20px 0; width:100%; margin-bottom:30px; display:flex; justify-content:space-between; align-items:center;';
        const sizeLabel = document.createElement('span');
        sizeLabel.style.cssText = 'font-size:10px; font-weight:600; letter-spacing:2px; text-transform:uppercase; color:var(--q-text-light);';
        sizeLabel.textContent = 'Tamanho Ideal';
        const sizeLetter = document.createElement('div');
        sizeLetter.id = 'q-res-letter';
        sizeLetter.style.cssText = 'font-size:24px; font-weight:400; font-family:monospace; line-height:1;';
        sizeLetter.textContent = 'M';
        sizeRow.appendChild(sizeLabel);
        sizeRow.appendChild(sizeLetter);
        stepResult.appendChild(sizeRow);

        const buyBtn = document.createElement('button');
        buyBtn.className = 'q-btn-buy';
        buyBtn.id = 'q-add-to-cart-btn';
        buyBtn.textContent = 'Adicionar ao Carrinho';
        stepResult.appendChild(buyBtn);

        const backBtn = document.createElement('button');
        backBtn.className = 'q-btn-outline';
        backBtn.id = 'q-btn-back';
        backBtn.textContent = 'Voltar';
        stepResult.appendChild(backBtn);

        const retryBtn = document.createElement('p');
        retryBtn.id = 'q-retry-btn';
        retryBtn.style.cssText = 'margin-top:30px; font-size:10px; font-weight:600; letter-spacing:1px; text-transform:uppercase; color:var(--q-text-light); cursor:pointer; text-decoration:underline; text-underline-offset:4px;';
        retryBtn.textContent = 'Tentar outra foto';
        stepResult.appendChild(retryBtn);

        contentScroll.appendChild(stepResult);
        card.appendChild(contentScroll);

        // Footer
        const footer = document.createElement('div');
        footer.className = 'q-powered-footer';
        const footerText = document.createElement('span');
        footerText.style.cssText = 'font-size:9px; letter-spacing:1px; text-transform:uppercase; color:var(--q-text-light);';
        footerText.textContent = 'Powered by';
        const footerLogo = document.createElement('img');
        footerLogo.src = 'https://i.ibb.co/23hMHTRt/logo-quantic-na-melhor-qualidade.png';
        footerLogo.className = 'q-quantic-logo';
        footer.appendChild(footerText);
        footer.appendChild(footerLogo);
        card.appendChild(footer);

        wrapper.appendChild(card);
        return wrapper;
    }

    function init() {
        if (!document.getElementById('q-inter-font')) {
            const fontLink = document.createElement('link');
            fontLink.id = 'q-inter-font';
            fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
            fontLink.rel = 'stylesheet';
            document.head.appendChild(fontLink);
        }
        if (!window.phosphorIconsLoaded) {
            const phosphorScript = document.createElement('script');
            phosphorScript.src = 'https://unpkg.com/@phosphor-icons/web';
            document.head.appendChild(phosphorScript);
            window.phosphorIconsLoaded = true;
        }

        const styleTag = document.createElement('style');
        styleTag.textContent = styles;
        document.head.appendChild(styleTag);

        const modalEl = createModalHTML();
        document.body.appendChild(modalEl);

        const modal = document.getElementById('q-modal-ia');
        const openBtn = document.createElement('button');
        openBtn.className = 'q-btn-trigger-ia';
        openBtn.id = 'q-open-ia';
        const userIcon = document.createElement('i');
        userIcon.className = 'ph ph-user';
        const btnText = document.createElement('span');
        btnText.textContent = 'Provador Virtual';
        openBtn.appendChild(userIcon);
        openBtn.appendChild(btnText);

        // Nuvemshop product image selectors
        const imgContainers = [
            '.product-image-container',
            '.js-swiper-product',
            '.product-image-column',
            '[data-store^="product-image"]',
            '.js-product-slide',
            '.product-gallery',
            '.product-slider',
            '#single-product .col-md-auto:first-child'
        ];

        let foundContainer = false;
        for (const selector of imgContainers) {
            const container = document.querySelector(selector);
            if (container) {
                if (window.getComputedStyle(container).position === 'static') {
                    container.style.position = 'relative';
                }
                container.appendChild(openBtn);

                openBtn.style.position = 'absolute';
                openBtn.style.top = '60px';
                openBtn.style.left = '20px';
                openBtn.style.transform = 'none';
                openBtn.style.margin = '0';
                openBtn.style.bottom = 'auto';
                openBtn.style.right = 'auto';

                foundContainer = true;
                break;
            }
        }

        if (!foundContainer) {
            openBtn.style.position = 'fixed';
            openBtn.style.bottom = '30px';
            openBtn.style.left = '50%';
            openBtn.style.transform = 'translateX(-50%)';
            openBtn.style.top = 'auto';
            openBtn.style.right = 'auto';
            document.body.appendChild(openBtn);
        }

        const genBtn = document.getElementById('q-btn-generate');
        const buyBtn = document.getElementById('q-add-to-cart-btn');
        const closeBtn = document.getElementById('q-close-btn');
        const backBtn = document.getElementById('q-btn-back');
        const retryBtn = document.getElementById('q-retry-btn');
        const realInput = document.getElementById('q-real-input');
        const triggerUpload = document.getElementById('q-trigger-upload');
        const phoneInput = document.getElementById('q-phone');

        let userPhoto = null;
        let recommendedSize = "M";

        openBtn.onclick = () => {
            genBtn.style.display = 'block';
            modal.style.display = 'flex';
        };

        closeBtn.onclick = () => modal.style.display = 'none';
        backBtn.onclick = () => modal.style.display = 'none';
        retryBtn.onclick = () => {
            document.getElementById('q-step-result').style.display = 'none';
            document.getElementById('q-step-upload').style.display = 'block';
            userPhoto = null;
            document.getElementById('q-pre-view').style.display = 'none';
            checkFields();
        };
        triggerUpload.onclick = () => realInput.click();

        phoneInput.addEventListener('input', function (e) {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
            e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
            checkFields();
        });

        const checkFields = () => {
            const phoneNumbers = phoneInput.value.replace(/\D/g, '');
            const isPhoneValid = phoneNumbers.length >= 10 && phoneNumbers.length <= 11;
            const phoneError = document.getElementById('q-phone-error');

            if (phoneInput.value.length > 0 && !isPhoneValid) {
                phoneError.style.display = 'block';
                phoneInput.style.borderColor = '#ef4444';
            } else {
                phoneError.style.display = 'none';
                phoneInput.style.borderColor = 'var(--q-border)';
            }

            const allFilled = document.getElementById('q-h-val').value.length > 0 &&
                document.getElementById('q-w-val').value.length > 0 &&
                userPhoto && isPhoneValid;
            genBtn.disabled = !allFilled;
        };

        ['q-h-val', 'q-w-val'].forEach(id => document.getElementById(id).addEventListener('input', checkFields));

        realInput.onchange = (e) => {
            userPhoto = e.target.files[0];
            if (userPhoto) {
                const rd = new FileReader();
                rd.onload = (ev) => {
                    document.getElementById('q-pre-img').src = ev.target.result;
                    document.getElementById('q-pre-view').style.display = 'block';
                    checkFields();
                };
                rd.readAsDataURL(userPhoto);
            }
        };

        genBtn.onclick = async () => {
            const h = document.getElementById('q-h-val').value;
            const w = document.getElementById('q-w-val').value;

            // Nuvemshop product image selectors
            const prodImgTag = document.querySelector('.js-product-slide-img, .product-slider-image, img[srcset]');
            let prodImg = '';
            if (prodImgTag) {
                prodImg = prodImgTag.currentSrc || prodImgTag.src || prodImgTag.dataset.src || '';
            }
            if (!prodImg) {
                const ogImg = document.querySelector('meta[property="og:image"]');
                prodImg = ogImg ? ogImg.content : '';
            }
            const prodName = document.querySelector('h1, .js-product-name, .product-name')?.innerText || document.title;

            document.getElementById('q-step-upload').style.display = 'none';
            document.getElementById('q-loading-box').style.display = 'block';

            try {
                const phoneVal = phoneInput.value.replace(/\D/g, '');
                const fd = new FormData();
                fd.append('person_image', userPhoto);
                fd.append('whatsapp', '55' + phoneVal);
                fd.append('phone_raw', phoneInput.value);
                fd.append('height', h);
                fd.append('weight', w);
                fd.append('product_name', prodName);
                fd.append('origin', window.location.origin);

                if (prodImg) {
                    const b = await fetch(prodImg).then(r => r.blob());
                    fd.append('product_image', b, 'p.png');
                }

                const res = await fetch(WEBHOOK_PROVA, { method: 'POST', body: fd });
                if (res.ok) {
                    const blob = await res.blob();
                    const url = URL.createObjectURL(blob);
                    calculateFinalSize(h, w, prodName);
                    document.getElementById('q-loading-box').style.display = 'none';
                    document.getElementById('q-final-view-img').src = url;
                    document.getElementById('q-step-result').style.display = 'flex';
                } else {
                    throw new Error('Falha');
                }
            } catch (e) { alert("Ocorreu um erro ao processar sua imagem. Tente novamente."); location.reload(); }
        };

        function calculateFinalSize(h, w, name) {
            let hInt = parseFloat(h.toString().replace(',', '.'));
            let wInt = parseFloat(w.toString().replace(',', '.'));
            if (hInt < 3) hInt = hInt * 100;

            let size = "M";
            if (wInt < 60) size = "PP";
            else if (wInt < 68) size = "P";
            else if (wInt < 76) size = "M";
            else if (wInt < 84) size = "G";
            else if (wInt < 92) size = "GG";
            else if (wInt < 100) size = "XG";
            else size = "XXG";

            recommendedSize = size;
            document.getElementById('q-res-letter').textContent = size;
        }

        buyBtn.onclick = function () {
            this.textContent = "Processando...";
            this.disabled = true;

            // Nuvemshop add-to-cart integration
            const nuvemBtn = document.querySelector('.js-addtocart, .js-prod-submit-btn, button[type="submit"].addtocart, input.addtocart, .btn-add-to-cart, form[action*="/cart"] button[type="submit"]');

            if (nuvemBtn) {
                modal.style.display = 'none';
                nuvemBtn.click();
            } else {
                alert("Selecione o tamanho " + recommendedSize);
                modal.style.display = 'none';
            }

            this.textContent = "Adicionar ao Carrinho";
            this.disabled = false;
        };
    }

    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();
