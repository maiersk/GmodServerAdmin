// const moment = require('moment');
// const objectIdToToimestamp = require('objectid-to-timestamp');

// const time = moment(objectIdToToimestamp('563228c91ee6030100644cbc'));
// // console.log(moment(76561198098162297).format('YYYY-MM-DD HH:mm'));
// const userid = '76561198098162297';

// for (let i = 0; i < userid.length; i++) {
    
// }

// let testid = new Date().getTime() + 76561198098162297;
// let decodeid = testid - 76561198098162297;
// console.log(testid);
// console.log(moment(decodeid).format('YYYY-MM-DD HH:mm'));

// console.log(time.format('YYYY-MM-DD HH:mm'));

const createat = require('../middlewares/createat').createAt;
const idcreateat = require('../middlewares/createat').idCreateAt;

console.log(createat());
console.log(idcreateat(createat()));