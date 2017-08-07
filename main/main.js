const datbase = require("../main/datbase.js");

function printVersion(array, total, save) {
    let result = '***<没钱赚商店>购物清单***\n';
    for(let item of array) {
        result += '名称：'+ item.name + '，数量：' + item.count + item.unit + '，单价：' + item.price.toFixed(2) + '(元)，小计：' + item.total.toFixed(2) + '(元)\n';
    }
    result += '----------------------\n' +  '挥泪赠送商品：\n';
    for(let item of array) {
        if(item.discount) {
            result += '名称：' + item.name + '，数量：' + item.discount + item.unit + '\n';
        }
    }
    result += '----------------------\n' + '总计：' + total + '(元)\n' + '节省：' + save + '(元)\n' + '**********************';
    return result;
}

function saveTotalPrice(array) {
    let save = 0;
    for(let item of array) {
        if(item.discount) {
            save += item.price*item.discount;
        }
    }
    return save.toFixed(2);
}

function finalTotalPrice(array) {
    let sum = 0;
    for(let item of array) {
        sum += item.total;
    }
    return sum.toFixed(2);
}

function itemTotalPrice(array) {
    for(let item of array) {
        if(item.discount) {
            item.total = item.price*(item.count - item.discount);
        } else {
            item.total = item.price*item.count;
        }
    }
    return array;
}

function total(array) {
    let allItemsInfo = datbase.loadAllItems();
    for(let item of allItemsInfo) {
        if(find(array, item.barcode)) {
            find(array, item.barcode).name = item.name;
            find(array, item.barcode).price = item.price;
            find(array, item.barcode).unit = item.unit;
        }
    }
    return array;
}

function discount(array) {
    let disCountItems = datbase.loadPromotions();
    let discount = 1;
    for(let item of disCountItems[0].barcodes) {
        if(find(array, item)) {
            find(array,item).discount = discount;
        }
    }
    return array;
}

function find(array, element) {
    for(let item of array) {
        if(item.ID === element) {
            return item;
        }
    }
    return false;
}

function push(arr, str, num) {
    for(let i=0; i<num; i++) {
        arr.push(str);
    }
    return arr;
}

function expand(array) {
    let expandArr = [];
    for(let item of array) {
        let splitItemArr = item.split("-");
        if(splitItemArr[1]) {
            expandArr = push(expandArr, splitItemArr[0], splitItemArr[1]);
        } else {
            expandArr.push(item);
        }
    }
    return expandArr;
}

function count(array) {
    let countItems = [];

    array = expand(array);
    for(let item of array) {
        let count =  1;
        if(find(countItems, item)) {
            find(countItems, item).count++;
        } else {
            countItems.push({ID:item, count});
        }
    }
    return countItems;
}

module.exports = function main(inputs) {
    let result = [];
    let countItemsID = count(inputs);
    let disCountInfo = discount(countItemsID);
    let totalItemsInfo = total(disCountInfo);
    let itemFinalInfo = itemTotalPrice(totalItemsInfo);
    let finalPrice = finalTotalPrice(itemFinalInfo);
    let savePrice = saveTotalPrice(itemFinalInfo);
    result = printVersion(totalItemsInfo, finalPrice, savePrice);
    console.log(result);
};