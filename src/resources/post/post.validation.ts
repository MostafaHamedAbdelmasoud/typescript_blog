import Joi from 'joi';
 // lookup function


const create = Joi.object({
    title: Joi.string().required(),

    body: Joi.string().required(),
});

export default { create };
