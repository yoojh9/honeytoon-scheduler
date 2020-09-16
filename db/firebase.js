require("dotenv").config();
const firebase = require("firebase-admin");


// firebase.initializeApp({
//     credential: firebase.credential.cert(serviceAccount)
// });

const db = firebase
  .initializeApp({
    credential: firebase.credential.cert({
      projectId: process.env.GCS_PROJECT_ID,
      clientEmail: process.env.GCS_CLIENT_EMAIL,
      privateKey: process.env.GCS_PRIVATE_KEY.replace(/\\n/g, "\n")
    }),
  })
  .firestore(); 

let setProductList = async (data) => {
    let productCollection = db.collection('products')
    await productCollection.doc(data.brandCode).collection('product').doc(data.goodsCode).set(data);
}

let setBrandList = async (data) => {
    let brandCollection = db.collection('brands')
    await brandCollection.doc(data.brandCode).set(data);
}

let getCouponList = async () => {
  let couponRef = db.collection('coupon');
  let coupons = [];

  let owners = await couponRef.listDocuments();

  for(owner of owners){
    console.log('owner:'+owner.id);
    let notUsedCoupons = await couponRef.doc(owner.id).collection('coupons').where('use','==','N').get();

    for(const notUsedCoupon of notUsedCoupons.docs){
      console.log('notUsedCoupon:'+notUsedCoupon.data())
      coupons.push({uid: owner.id, trid: notUsedCoupon.id, use: notUsedCoupon.data()['use']})
    }
  }
  // await couponRef.get().then(async snapshot => {
  //   console.log('snapshot:'+snapshot);
  //   let 
  //   snapshot.forEach(doc => {
  //     console.log('data:'+doc.data());
  //    let couponSnapshot = couponRef.doc(doc.id).collection('coupons').where('use',"==",'N').get();
  //     couponSnapshot.forEach(couponDoc => {
  //       console.log('coupons:'+ couponDoc.data())
  //       coupons.add({ uid: doc.id, trid : couponDoc.id, use: couponDoc.data()['use']})
  //     })
  //   })
  // })

  return coupons;
}

let updateCouponStatus = async(coupon, used) => {
  if(used){
    await db.collection('coupon').doc(coupon.uid).collection('coupons').doc(coupon.trid).update('use', 'Y')
  } 
  return;
}

let updateLeaderBoard = async (data) => {
  let batch = db.batch();
  let rankCollection = db.collection('ranks');
  let userQuery = db.collection('users').where('earned_honey', '>', 0).orderBy('earned_honey', 'desc').limit(100);
  let rank = 0;
  
  try {
    await db.runTransaction(async transaction  =>  {
      let ranks = await transaction.get(rankCollection);

      // 저장되어있는 ranks document 삭제
      for(const rank of ranks.docs){
        await batch.delete(rank.ref);
      }

      let rankUsers = await transaction.get(userQuery);

      // ranks에 새로운 document 추가
      let rank = 0;
      for(const rankUser of rankUsers.docs){
        await transaction.set(rankCollection.doc(rankUser.id), {
          'uid': rankUser.id,
          'rank': (++rank),
          'earned_honey': rankUser.data()['earned_honey'],
          'update_time': new Date()
        })
      }

      await batch.commit();
    });
  } catch( error) {
    console.error(error);
  }
}

module.exports = {
    setProductList,
    setBrandList,
    getCouponList,
    updateLeaderBoard,
    updateCouponStatus
}
