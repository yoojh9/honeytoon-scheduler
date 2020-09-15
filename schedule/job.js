const request = require('../network/request');
const db = require('../db/firebase');

let getProductList = async () => {
    try {
        console.log('start')
        let list = await request.getProductList();
        for(let item of list){
            item.honey = item.realPrice * 1.5;
            await db.setProductList(item);
        }
    } catch (error){
        console.error(error);
    }
}

let getBrandList = async () => {
    try {
        console.log('start getting brand list');
        let list = await request.getBrandList();
        for(let item of list) {
            await db.setBrandList(item)
        }
    } catch(error){
        console.error(error);
    }
}

module.exports = {
    getProductList,
    getBrandList
}