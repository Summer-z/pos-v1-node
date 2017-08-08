const datbase = require("../main/datbase.js");

function printTotalList(receipt) {
    let itemsList = '***<没钱赚商店>购物清单***\n';
    for(let item of receipt.items) {
        itemsList += '名称：' + item.name +'，数量：' + item.count + item.unit + '，单价：' + item.price.toFixed(2) + '(元)' + '，小计：' + item.subTotal.toFixed(2) + '(元)\n';
    }
    itemsList += '----------------------\n' + '挥泪赠送商品：\n' ;
    for(let item of receipt.gifts) {
            itemsList += '名称：' + item.name +'，数量：' + item.count + item.unit + '\n';


    }
    itemsList += '----------------------\n' + '总计：' + receipt.summary.total.toFixed(2) + '(元)\n' + '节省：' + receipt.summary.saved.toFixed(2) + '(元)\n' + '**********************';
    return itemsList;
}

function buildTotalList(receiptItems, gifts, summary) {
    return {items: receiptItems, gifts, summary};
}

function sumItems(receiptItems) {
    let total = 0;
    let saved = 0;
    for(let item of receiptItems) {
        total += item.subTotal;
        saved += item.price * item.count - item.subTotal;
    }
    return {total,saved};
}

function countReceiptItems(cartItems, gifts, allItems) {
    let result = [];
    for(let item_1 of cartItems) {
        for(let item_2 of allItems) {
            if(item_1.barcode === item_2.barcode) {
                let subTotal = item_2.price * item_1.count;
                for(let item_3 of gifts) {
                    if(item_2.name === item_3.name) {
                        subTotal = item_2.price * (item_1.count - item_3.count);
                    }
                }
                result.push({name:item_2.name, count: item_1.count, unit: item_2.unit, price: item_2.price, subTotal });
            }
        }
    }
    return result;
}

function countGifts(cartItems, allItems, promotions) {
    let result = [];
    let temp = [];
    for(let item of cartItems) {
        for(let barcode of promotions[0].barcodes ) {
            if(item.barcode === barcode) {
                temp.push(barcode);
            }
        }
    }
    for(let item of allItems) {
        for(let barcode of temp) {
            if(item.barcode === barcode) {
                result.push({name: item.name, count: 1, unit: item.unit});
            }
        }
    }
    return result;
}

function findSameItems(array, element) {
    for(let item of array) {
        if(item.barcode === element) {
            return item;
        }
    }
    return false;
}

function countItems(array) {
    let result = [];
    for (let item of array) {
        let count = 1;
        if (item.split('-').length > 1) {
            count = parseInt(item.split('-')[1]);
            item = item.split('-')[0];
        }
        if (findSameItems(result, item)) {
            findSameItems(result, item).count += count;
        } else {
            result.push({barcode:item, count});
        }
    }
    return result;
}

function main(inputs) {
    let allItems = datbase.loadAllItems();
    let promotions = datbase.loadPromotions();
    let cartItems = countItems(inputs);
    let gifts = countGifts(cartItems, allItems, promotions);
    let receiptItems = countReceiptItems(cartItems, gifts, allItems);
    let summary = sumItems(receiptItems);
    let receipt = buildTotalList(receiptItems, gifts, summary);
    let result = printTotalList(receipt);
    console.log(result);
}

module.exports = main;
