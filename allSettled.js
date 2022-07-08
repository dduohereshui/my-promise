const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject("p1");
  }, 1000);
});

const p2 = "p2";

const p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("p3");
  }, 2000);
});

Promise.myAllSettled = function (promises) {
  let count = 0;
  const result = [];
  return new Promise((resolve, reject) => {
    promises.forEach((promise, i) => {
      Promise.resolve(promise)
        .then(
          (res) => {
            count++;
            result[i] = { status: "fulfilled", value: res };
          },
          (err) => {
            count++;
            result[i] = { status: "rejected", reason: err };
          }
        )
        .finally(() => {
          if (count === promises.length) {
            resolve(result);
          }
        });
    });
  });
};

Promise.myAllSettled([p1, p2, p3]).then((res) => {
  console.log(res);
});
