function system() {
  let mws = [];
  return {
    use(fn) {
      mws.push(fn);
    },

    go(ctx) {
        console.log(mws);
        mws.reduce((prev, curr, idx)=>{
            console.log(prev, curr);
        })
    },
  };
}



let s = system()

s.use(()=>{
    console.log(1);
})


s.go({})