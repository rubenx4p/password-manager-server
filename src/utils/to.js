// const to = (promise) => {
//     return promise
//       .then(data => ([data, undefined]))
//       .catch(error => Promise.resolve([undefined, error]));
// }
const to = async (promise) => {
    try {
        const data = await promise

        return [data, undefined]
    }
    catch (err) {
        return [undefined, err]
    }
}
  
module.exports = to