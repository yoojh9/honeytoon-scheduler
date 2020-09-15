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

module.exports = {
    setProductList,
    setBrandList
}
