const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject("p1");
  }, 1000);
});

const p2 = Promise.reject("p2");

const p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject("p3");
  }, 2000);
});

Promise.myAny = function (promises) {
  let count = 0;
  return new Promise((resolve, reject) => {
    promises.forEach((promise) => {
      Promise.resolve(promise)
        .then(
          (res) => {
            resolve(res);
          },
          () => {
            count++;
          }
        )
        .finally(() => {
          if (count === promises.length) {
            reject(
              new AggregateError(
                [new Error("error")],
                "all promise is rejected"
              )
            );
          }
        });
    });
  });
};

Promise.myAny([p1, p2, p3]).then(
  (res) => {
    console.log(res);
  },
  (err) => {
    console.log(err);
  }
);
