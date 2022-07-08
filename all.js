const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("p1");
  }, 1000);
});

const p2 = "p2";

const p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("p3");
  }, 2000);
});

Promise.myAll = function (promises) {
  let count = 0;
  const result = [];
  return new Promise((resolve, reject) => {
    promises.forEach((promise, i) => {
      Promise.resolve(promise, i).then((res) => {
        result[i] = res;
        count++;
        if (count === promises.length) {
          resolve(result);
        }
      }, reject);
    });
  });
};

Promise.myAll([p1, p2, p3]).then(
  (res) => {
    console.log(res);
  },
  (err) => {
    console.log(err);
  }
);
