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

let updateLeaderBoard = async (data) => {
  let batch = db.batch();
  let rankCollection = db.collection('ranks');
  let userQuery = db.collection('users').where('earned_honey', '>', 0).orderBy('earned_honey', 'desc').limit(100);
  let rank = 0;
  
  try {
    await db.runTransaction(async transaction  =>  {
      let ranks = await transaction.get(rankCollection);

      for(const rank of ranks.docs){
        console.log('delete data : ' + rank)
        await batch.delete(rank.ref);
      }

      let rankUsers = await transaction.get(userQuery);
      let rank = 0;

      for(const rankUser of rankUsers.docs){
        console.log('set rank data : ' + rankUser);
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
    updateLeaderBoard
}
