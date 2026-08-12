const constants = {
  httpCodes: {
    // Success
    ok: 200,
    created: 201,
    noContent: 204,

    // Client Error
    badRequest: 400,
    unanthorized: 401,
    forbidden: 403,
    notFound: 404,
    conffict: 409,
    unprocessableContent: 422,
    tooManyRequsets: 429,

    // Server Error
    internalServerError: 500,
  },
};

export default constants;
