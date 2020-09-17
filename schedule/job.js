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
            console.log('brand:'+item);
            await db.setBrandList(item)
        }
    } catch(error){
        console.error(error);
    }
}

let updateCouponStatus = async() => {
    try {
        console.log('updateCouponStatus')
        let coupons = await db.getCouponList();
        for(let coupon of coupons){
        console.log('coupon:'+coupon)
        let couponStatus = await request.getCouponStatus(coupon.trid)
        if(couponStatus.pinStatusCd!="01"){  // pinCode가 01(발행)이 아닌 경우
            let used = true;
            await db.updateCouponStatus(coupon, used)
        }
        }
    } catch(error){
        console.error(error);
    }
}

let updateLeaderBoard = async () => {
    try {
        console.log('start updating leader board');
        await db.updateLeaderBoard();
    } catch(error) {
        console.error(error);
    }
}

module.exports = {
    getProductList,
    getBrandList,
    updateLeaderBoard,
    updateCouponStatus
}