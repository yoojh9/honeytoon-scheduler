var axios = require('axios');
const FormData = require('form-data');
const { listen } = require('../app');

require("dotenv").config();

const CUSTOM_AUTH_CODE = process.env.GIFTISHOW_CUSTOM_AUTH_CODE;
const CUSTOM_AUTH_TOKEN = process.env.GIFTISHOW_CUSTOM_AUTH_TOKEN;
const DEV_YN = process.env.GIFTISHOW_DEV_YN;

let getProductList = async () => {
    var start = 1;
    var size = 3500;
    let list = [];

    list = await requestProductListApi(start, size);
    console.log('list='+list)
    console.log('size='+list.length)
    let data = list.filter(item => (item.brandCode == "BR00002" || 
        item.brandCode == "BR00007" || 
        item.brandCode == "BR00009" || 
        item.brandCode == "BR00076" ||
        item.brandCode == "BR00090" ||
        item.brandCode == "BR00315")
    )

   return data;
}

let getBrandList = async () => {
    let list = [];
    list = await requestBrandListApi();
    let data = list.filter(item => (item.brandCode == "BR00002" || 
    item.brandCode == "BR00007" || 
    item.brandCode == "BR00009" || 
    item.brandCode == "BR00076" || 
    item.brandCode == "BR00090" ||
    item.brandCode == "BR00315"));

    return data;
}

let getCouponStatus = async (trid) => {
    let couponStatus = await requestCouponStatusApi(trid);
    return couponStatus;
}

let requestProductListApi = async (start, size) => {
    console.log('requestProductListApi');
    var formData = new FormData();
    formData.append('custom_auth_code', CUSTOM_AUTH_CODE);
    formData.append('custom_auth_token', CUSTOM_AUTH_TOKEN);
    formData.append('api_code', '0101');
    formData.append('dev_yn', 'N');
    formData.append('start', start.toString());
    formData.append('size',size.toString());

    try {
        let res = await axios({
            url: 'https://bizapi.giftishow.com/bizApi/goods',
            method: 'post',
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': 'application/json',
                'custom_auth_code': CUSTOM_AUTH_CODE,
                'custom_auth_token': CUSTOM_AUTH_TOKEN,
                'api_code': '0101',
                'dev_yn': DEV_YN,
                ...formData.getHeaders(),
            },
            data: formData
        })
        console.log('result:'+res.data.result);
        return res.data.result.goodsList;
    } catch(error){
        console.log('error='+error);
    }
}

let requestBrandListApi = async (start, size) => {
    console.log('requestBrandListApi');
    var formData = new FormData();
    formData.append('custom_auth_code', CUSTOM_AUTH_CODE);
    formData.append('custom_auth_token', CUSTOM_AUTH_TOKEN);
    formData.append('api_code', '0102');
    formData.append('dev_yn', 'N');

    try {
        let res = await axios({
            url: 'https://bizapi.giftishow.com/bizApi/brands',
            method: 'post',
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': 'application/json',
                'custom_auth_code': CUSTOM_AUTH_CODE,
                'custom_auth_token': CUSTOM_AUTH_TOKEN,
                'api_code': '0102',
                'dev_yn': DEV_YN,
                ...formData.getHeaders(),
            },
            data: formData
        })
        
        return res.data.result.brandList;
    } catch(error){
        console.log('error='+error);
    }
}

let requestCouponStatusApi = async (trid) => {
    console.log('requestCouponStatusApi');
    var formData = new FormData();
    formData.append('custom_auth_code', CUSTOM_AUTH_CODE);
    formData.append('custom_auth_token', CUSTOM_AUTH_TOKEN);
    formData.append('api_code', '0201');
    formData.append('dev_yn', 'N');
    formData.append('tr_id', trid)

    try {
        let res = await axios({
            url: 'https://bizapi.giftishow.com/bizApi/coupons',
            method: 'post',
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': 'application/json',
                'custom_auth_code': CUSTOM_AUTH_CODE,
                'custom_auth_token': CUSTOM_AUTH_TOKEN,
                'api_code': '0201',
                'dev_yn': DEV_YN,
                ...formData.getHeaders(),
            },
            data: formData
        })
        return res.data.result[0].couponInfoList[0];
    } catch(error){
        console.log('error='+error);
    }
}

module.exports = {
    getProductList,
    getBrandList,
    getCouponStatus,
}