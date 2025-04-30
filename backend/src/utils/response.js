exports.successResponse = function (message, data=[], meta = []) {
    return {
        status: true,
        message: message,
        data: data,
        meta: meta
    }
}