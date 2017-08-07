const datbase = require("../main/datbase.js");

function printAllInfo(array, total, save) {
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

function countSaveTotalPrice(array) {
    let save = 0;
    for(let item of array) {
        if(item.discount) {
            save += item.price*item.discount;
        }
    }
    return save.toFixed(2);
}

function countFinalTotalPrice(array) {
    let sum = 0;
    for(let item of array) {
        sum += item.total;
    }
    return sum.toFixed(2);
}

function countItemTotalPrice(array) {
    for(let item of array) {
        if(item.discount) {
            item.total = item.price*(item.count - item.discount);
        } else {
            item.total = item.price*item.count;
        }
    }
    return array;
}

function countTotalInfo(array) {
    let allItemsInfo = datbase.loadAllItems();
    for(let item of allItemsInfo) {
        if(findSameEle(array, item.barcode)) {
            findSameEle(array, item.barcode).name = item.name;
            findSameEle(array, item.barcode).price = item.price;
            findSameEle(array, item.barcode).unit = item.unit;
        }
    }
    return array;
}

function discountItemsInfo(array) {
    let disCountItems = datbase.loadPromotions();
    let discount = 1;
    for(let item of disCountItems[0].barcodes) {
        if(findSameEle(array, item)) {
            findSameEle(array,item).discount = discount;
        }
    }
    return array;
}

function findSameEle(array, element) {
    for(let item of array) {
        if(item.ID === element) {
            return item;
        }
    }
    return false;
}

function pushItem(arr, str, num) {
    for(let i=0; i<num; i++) {
        arr.push(str);
    }
    return arr;
}

function expandArr(array) {
    let expandArr = [];
    for(let item of array) {
        let splitItemArr = item.split("-");
        if(splitItemArr[1]) {
            expandArr = pushItem(expandArr, splitItemArr[0], splitItemArr[1]);
        } else {
            expandArr.push(item);
        }
    }
    return expandArr;
}

function countItems(array) {
    let countItems = [];

    array = expandArr(array);
    for(let item of array) {
        let count =  1;
        if(findSameEle(countItems, item)) {
            findSameEle(countItems, item).count++;
        } else {
            countItems.push({ID:item, count});
        }
    }
    return countItems;
}

module.exports = function main(inputs) {
    let result = [];
    let countItemsID = countItems(inputs);
    let disCountInfo = discountItemsInfo(countItemsID);
    let totalItemsInfo = countTotalInfo(disCountInfo);
    let itemFinalInfo = countItemTotalPrice(totalItemsInfo);
    let finalPrice = countFinalTotalPrice(itemFinalInfo);
    let savePrice = countSaveTotalPrice(itemFinalInfo);
    result = printAllInfo(totalItemsInfo, finalPrice, savePrice);
    console.log(result);
};