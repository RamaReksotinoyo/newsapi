const ErrorResponse = (err, res) => {
    console.log(err.message);
    return res.status(500).json({
        data: null,
        code: 500,
        message: "Server error: " + err.message,
    });
};

const BaseResponse = (data, code, message) => {
    return {
        data: data,
        code: code,
        message: message
    };
};

module.exports = {BaseResponse, ErrorResponse};