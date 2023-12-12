const { getCategorys } = require("./database/oracle");

getCategorys().then(result => {
  console.table(result)
  console.table(result[0])})
  