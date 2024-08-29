const Joi = require('joi');

class BookValidation {
    static create = Joi.object({
        title: Joi.string().trim().required(),
        subtitle: Joi.string().trim().allow('', null),
        slug: Joi.string().trim().lowercase().required(),
        authors: Joi.string().trim().default("JP Alorwu"),
        isbn: Joi.string().trim().required(),
        publisher: Joi.string().trim().allow('', null),
        publicationDate: Joi.date(),
        // language:Joi.string().trim(),
        numberOfPages: Joi.number().required(),
        genres: Joi.array().items(Joi.string().trim().lowercase()).default([]),
        category: Joi.string().trim().lowercase(),
        edition: Joi.string().trim(),
        description: Joi.string().trim().required(),
        chapter1: Joi.string().trim().lowercase(),
        bookfileUrl: Joi.string().trim().lowercase(),
        coverImageUrl: Joi.string().trim().lowercase(),
        price: Joi.number().required(),
        stock: Joi.number().default(0),
        tags: Joi.array().items(Joi.string().trim().lowercase()).required()
    });

    static get = Joi.object({
        authors: Joi.string().trim().default(''),
        genres: Joi.array().items(Joi.string().trim().lowercase()).default([]),
        category: Joi.string().trim().lowercase().default(""),
        tags: Joi.array().items(Joi.string().trim().lowercase()).default([]),
        page: Joi.number().default(1),
        limit: Joi.number().default(10),
        rating: Joi.number().min(0).max(5).default(0)
    })

    static search = Joi.object({
        q: Joi.string().trim().lowercase().required()
    })

}

const testValidation = Joi.object({
    name: Joi.string().required(),
    slug: Joi.string().regex(/^[a-z0-9-]+$/)
        .message('Invalid slug format. Only lowercase letters, numbers, and hyphens are allowed.')
        .required(),
    type: Joi.string().required().valid('hematology', 'chemical'),
    si: Joi.string().lowercase().required(),
    conventional: Joi.string().allow("", null).default(null),
})

class OrderValidation {
    static create = Joi.object({
        // userId: Joi.string().required(),
        items: Joi.array().items(Joi.object({
            book: Joi.string().required(),
            quantity: Joi.number().min(1).default(1),
            price: Joi.number().required()
        })).required(),
        shippingAddress: Joi.string().allow("", null).default("")
    });

    static updateStatus = Joi.object({
        orderStatus: Joi.string().valid('pending', 'completed', 'failed'),
        shippingStatus: Joi.string().valid('processing', 'shipped', 'delivered'),
        shippingAddress: Joi.string().allow('', null),
    })
}

class PaymentValidation{
    static create = Joi.object({
        order: Joi.string().required(),
        transactionId: Joi.string().required(),
        paymentMethod: Joi.string().trim().required(),
        amount: Joi.number().required()
    })
}


class ReviewValidation {
    static create = Joi.object({
        bookId: Joi.string().required(),
        reviewer: Joi.string().allow("", null).default(""),
        reviewText: Joi.string().required(),
        rating: Joi.number().min(1).max(5).required()
    })

    static rate = Joi.object({
        bookId: Joi.string().required(),
        rating: Joi.number().min(3).max(5).required() // Anything below 4 deserves a reason
    })
}




class UserValidation {
    static create = Joi.object({
        username: Joi.string().min(2).required(),
        firstName: Joi.string().trim().required(),
        lastName: Joi.string().trim().required(),
        email: Joi.string().trim().email().required().lowercase(),
        password: Joi.string().min(3).required(),
        // phone: Joi.string().trim().allow('', null),
        // address: Joi.string().trim().required()
        // After registering, you complete profile
    });

    static login = Joi.object({
        email: Joi.string().trim().email().required(),
        password: Joi.string().required()
    })
}


module.exports = {
    UserValidation,
    BookValidation,
    ReviewValidation,
    OrderValidation,
    PaymentValidation
}