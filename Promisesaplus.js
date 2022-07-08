const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

const resolvePromise = (promise2, x, resolve, reject) => {
  // console.log(promise2, x);
  if (promise2 === x) {
    return reject(
      new TypeError("Chaining cycle detected for promise #<Promise>")
    );
  }
  if ((typeof x === "object" && x !== null) || typeof x === "function") {
    let called;
    try {
      let then = x.then;
      // 说明x是一个promise
      if (typeof then === "function") {
        then.call(
          x,
          (y) => {
            // y可能还是promise, 递归处理，直到y是一个普通值
            if (!called) resolvePromise(promise2, y, resolve, reject);
            called = true;
          },
          (r) => {
            if (!called) reject(r);
            called = true;
          }
        );
      } else {
        //x是一个有then属性的普通对象
        resolve(x);
      }
    } catch (error) {
      if (!called) reject(error);
      called = true;
    }
  } else {
    // x 是普通值
    resolve(x);
  }
};
class MYPromise {
  constructor(executor) {
    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onfulfilledCallbacks = [];
    this.onrejectedCallbacks = [];
    const resolve = (value) => {
      //状态一旦改变就不能成为别的状态
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;

        if (this.onfulfilledCallbacks.length)
          this.onfulfilledCallbacks.forEach((fn) => fn());
      }
    };

    const reject = (reason) => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
        if (this.onrejectedCallbacks.length)
          this.onrejectedCallbacks.forEach((fn) => fn());
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
  //then方法返回一个新的promise,resolve或者reject函数中，返回普通值将会被链式的promise捕获，抛出错误会被catch，返回新的promise将会使用该promise的状态。
  then(onfulfilled, onrejected) {
    //onfulfilled 和 onrejected是可选参数
    onfulfilled =
      typeof onfulfilled === "function" ? onfulfilled : (val) => val;

    onrejected =
      typeof onrejected === "function"
        ? onrejected
        : (err) => {
            throw err;
          };

    let promise2 = new MYPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        //使用定时器的原因是异步执行该段代码，以便拿到promise2
        setTimeout(() => {
          try {
            let x = onfulfilled(this.value);
            // x可能是普通值，也可能是promise
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }
      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onrejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }
      // 应对 setTimeout的类似于发布订阅模式
      if (this.status === PENDING) {
        this.onfulfilledCallbacks.push(() => {
          // todo
          setTimeout(() => {
            try {
              let x = onfulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
        this.onrejectedCallbacks.push(() => {
          // todo
          setTimeout(() => {
            try {
              let x = onrejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
      }
    });
    return promise2;
  }
}

// const p = new Promise((resolve, reject) => {
//   // throw new Error("错误");
//   // reject(100);
//   resolve("成功");
// });

// let p2 = p.then(
//   (res) => {
//     // console.log(res);
//     // return 1000;
//     // throw new Error("错误");
//     return new Promise((resolve, reject) => {
//       resolve("哈哈哈");
//     });
//   },
//   (err) => {
//     console.log(err);
//   }
// );
// p2.then(
//   (res) => {
//     console.log(res);
//   },
//   (err) => {
//     console.log(err);
//   }
// );

// MYPromise.defer = MYPromise.deferred = function () {
//   let dfd = {};
//   dfd.promise = new MYPromise((resolve, reject) => {
//     dfd.resolve = resolve;
//     dfd.reject = reject;
//   });
//   return dfd;
// };
