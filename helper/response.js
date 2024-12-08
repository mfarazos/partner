 const response = (res,data) => {
    res.send(
        {
            "success":true,
            "data":data
        }
    )
}
module.exports = response;