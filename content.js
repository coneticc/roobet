const targetInputSelector = 'input[data-test="input-game-amount"]';
const targetInputSelectorProfit = 'input[data-test="profit-input"]';
const targetDivSelector = 'div[data-testid="conversion-amount"]';
const targetSelectorPath = 'path';
const targetSelectorSpan = "span";

const prices = { // TODO: fetch exchange rates
  "eth": 2471.577,
  "btc": 41736.227,
  "ltc": 71.02273,
  "doge": 0.08695652,
  "bch": 239.34897,
  "xrp": 0.55157197,
  "trx": 0.11085246,
  "eos": 0.72780204,
  "bnb": 318.26862,
  "ape": 1.397624,
  "busd": 1.0368066,
  "cro": 0.08312552,
  "dai": 1,
  "link": 15.698587,
  "matic": 0.79302144,
  "sand": 0.4935834,
  "shib": 0.000009479758,
  "uni": 6.4599485,
  "usdc": 1.0004002,
  "usdt": 1,
  "usd": 1,
  "eur": 1.09146,
  "jpy": 0.0067503536,
  "rub": 0.0111818835,
  "cny": 0.1405066,
  "php": 0.017894048,
  "inr": 0.012030083,
  "idr": 0.00006402192,
  "krw": 0.0007485842,
  "brl": 0.20279694,
  "mxn": 0.058529492,
  "dkk": 0.14613388,
  "gold": 0.0001,
  "sweeps": 1,
  "try": 0.03310925,
  "pln": 0.25021204,
  "vnd": 0.000040733197,
  "pen": 0.2679571,
  "ars": 0.0007990411,
  "clp": 0.0011011853
}

function handleInputChange(inputElement, index) {
    const inputValue = parseFloat(inputElement.value);
    if (!isNaN(inputValue)) {
        const targetDiv = document.querySelectorAll(targetDivSelector)[index];
        const currency = targetDiv.textContent.split(" ")[1]
        const currentLTCPrice = prices[currency.toLowerCase()]

        const result = inputValue / currentLTCPrice;
        const formattedResult = result.toFixed(8) + ' ' + currency;
        if (targetDiv) {
            targetDiv.textContent = formattedResult;
        }
    }
}

function updatePathAttributes(pathElement) {
    const dAttribute = pathElement.getAttribute("d");
    const fillAttribute = pathElement.getAttribute("fill");

    if (dAttribute === "M48 96c26.51 0 48-21.49 48-48S74.51 0 48 0 0 21.49 0 48s21.49 48 48 48Z" && fillAttribute === "#EB0A29") {
        pathElement.setAttribute("fill", "#6CDE07");
    } else if (dAttribute === "M65.84 28.24h-3.76V64.8H51.44v-3.88c-2.8 3.2-6.2 4.72-9.96 4.72-8.28 0-14.88-6.28-14.88-17.68 0-11.4 6.48-17.6 14.88-17.6 3.68 0 7.24 1.48 9.96 4.8v-6.88h-9.76v-5.84h9.76V18.4h10.64v4.04h3.76v5.84-.04ZM33.6 71.76h25.28v5.92H33.6v-5.92ZM51.44 42.8c-1.4-1.8-4.16-3-6.48-3-4.24 0-7.36 3.12-7.36 8.16s3.12 8.2 7.36 8.2c2.28 0 5.08-1.24 6.48-3.08V42.76v.04Z") {
        pathElement.setAttribute("d", "M51.52 73.32v6.56h-5.8V73.4c-7.56-.6-13.08-3.56-16.92-7.64l4.72-6.56c2.84 3 6.96 5.68 12.2 6.48V51.64c-7.48-1.88-15.4-4.64-15.4-14.12 0-7.4 6.04-13.32 15.4-14.12v-6.68h5.8v6.84c5.96.6 10.84 2.92 14.6 6.56l-4.88 6.32c-2.68-2.68-6.12-4.36-9.76-5.08v12.52c7.56 2.04 15.72 4.88 15.72 14.6 0 7.4-4.8 13.8-15.72 14.84h.04Zm-5.8-30.96V31.04c-4.16.44-6.68 2.68-6.68 5.96 0 2.84 2.84 4.28 6.68 5.36ZM58.6 59.28c0-3.36-3-4.88-7.04-6.12v12.52c5-.72 7.04-3.64 7.04-6.4Z");
        pathElement.setAttribute("fill", "#1B3802");
    }
}

function replaceCurrencySymbol(spanElement) {
    spanElement.childNodes.forEach((node) => {
        if (node.nodeType === 3) { // Text node
            const replacedContent = node.nodeValue.replace(/₫/g, "$");
            if (node.nodeValue !== replacedContent) {
                node.nodeValue = replacedContent;
            }
        }
    });
}

function handleMutations(mutationsList) {
    mutationsList.forEach((mutation) => {
        if (mutation.type === 'characterData' && mutation.target.parentNode.matches(targetSelectorSpan)) {
            replaceCurrencySymbol(mutation.target.parentNode);
        } else if (mutation.type === 'childList') { // mutation.type === 'attributes'
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.matches(targetSelectorPath)) {
                        updatePathAttributes(node);
                    } else if (node.matches(targetSelectorSpan)) {
                        replaceCurrencySymbol(node);
                    }
                }
            });
            const targetInput = document.querySelector(targetInputSelector);
            if (targetInput) {
                try {
                    handleInputChange(targetInput, 0);
                } catch (error) {}
            }
            const targetInputProfit = document.querySelector(targetInputSelectorProfit);
            if (targetInputProfit) {
                try {
                    handleInputChange(targetInputProfit, 1)                    
                } catch (error) {}
            }
        }
    });
}

const observer = new MutationObserver(handleMutations);

observer.observe(document.body, { childList: true, subtree: true, characterData: true });

document.querySelectorAll(`${targetSelectorPath}, ${targetSelectorSpan}`).forEach(function (element) {
    if (element.matches(targetSelectorPath)) {
        updatePathAttributes(element);
    } else if (element.matches(targetSelectorSpan)) {
        replaceCurrencySymbol(element);
    }
});

const initialInput = document.querySelector(targetInputSelector);
if (initialInput) {
    handleInputChange(initialInput);
}
