//index.js 
import 'bootstrap/dist/css/bootstrap.css';

const arr1 = [
  {coupon_id: 21, amount: 350, name: "顾问专属优惠", expire_time: "2019-08-20T23:59:00"},
  {coupon_id: 22, amount: 1000, name: "提早申请 III 阶段--寒课", expire_time: "2018-11-20T23:59:00"},
  {coupon_id: 17, amount: 1500, name: "老学员优惠", expire_time: "2019-08-20T23:59:00"},
  {coupon_id: 23, amount: 1500, name: "老学员优惠", expire_time: "2019-08-20T23:59:00"},
  {coupon_id: 24, amount: 1500, name: "老学员优惠", expire_time: "2019-08-20T23:59:00"},
  {coupon_id: 25, amount: 1500, name: "老学员优惠", expire_time: "2019-08-20T23:59:00"},
  {coupon_id: 26, amount: 1500, name: "老学员优惠", expire_time: "2019-08-20T23:59:00"},
]
const arr2 = [
  {id: 22, coupon_code: "2Q9EJYL8SA", balance: 1000, start_at: "2018-10-21T00:00:00"},
  {id: 23, coupon_code: "LCMXOJN9T4", balance: 3500, start_at: "2018-10-21T00:00:00"},
  {id: 24, coupon_code: "LCMXOJN9T4", balance: 3500, start_at: "2018-10-21T00:00:00"},
]

for (let i = 0; i < arr1.length; i++) {
  const arrItem1 = arr1[i];
  for (let j = 0; j < arr2.length; j++) {
    const arrItem2 = arr2[j];
    if(arrItem1.coupon_id == arrItem2.id) {
      arrItem1.check = true;
      break;
    } else {
      arrItem1.check = false;
    }

    // console.log(`arrItem1.coupon_id:${arrItem1.coupon_id }`)
    // console.log(`arrItem2.id:${arrItem2.id }`)
  }
}
console.log(arr1)
