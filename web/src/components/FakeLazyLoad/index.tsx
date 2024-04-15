const FakeLazy = () => {
  // Fake promise
  throw new Promise((resolve) => {
    setTimeout(() => {
      resolve('foo');
    }, 1000);
  });
};

export default FakeLazy;
