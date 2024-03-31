import Joi from '@hapi/joi';

export const valide = async (req, schema) => {
  try {
    const value = await schema.validateAsync(req.body);
    return { err: null, value };
  } catch (err) {
    return { err, value: null };
  }
};

export const loginValidateSchema = Joi.object({
  password: Joi.string()
    // .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .required(),
  email: Joi.string()
    // .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .regex(
      /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
    .required(),
});

export const createUserValidateSchema = Joi.object({
  password: Joi.string()
    // .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .optional()
    .default('nopassword'),
  email: Joi.string()
    // .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .regex(
      /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
    .required(),
  role: Joi.string()
    .valid(
      'superAdminUser',
      'superAdminEditor',
      'companyAdmin',
      'companyEditor',
      'manager',
      'viewer'
    )
    .required(),
}).prefs({ stripUnknown: true });

export const superAdminUserValidateSchema = Joi.object({
  superAdminUserId: Joi.string().default(Joi.ref('$uuid')),
  parentId: Joi.string().optional(),

  name: Joi.string().optional().empty(''),
  gender: Joi.string().optional().empty(''),

  email: Joi.string().email().required(),
  phoneno: Joi.string().optional().empty(''),
  password: Joi.string().required(),

  isDeleted: Joi.boolean().default(false),
  createdAt: Joi.date().default(Date.now),
}).unknown({
  only: true,
  items: Joi.string().valid('role'),
});

export const superAdminEditorValidateSchema = Joi.object({
  superAdminEditorId: Joi.string().uuid(),
  superAdminUserId: Joi.string().required(),
  name: Joi.string().allow('').optional(),
  gender: Joi.string().allow('').optional(),
  email: Joi.string().email().required(),
  phoneno: Joi.string().allow('').optional(),
  password: Joi.string().required(),
  isDeleted: Joi.boolean().default(false),
  createdAt: Joi.date().default(Date.now),
}).unknown({
  only: true,
  items: Joi.string().valid('role'),
});

export const companyAdminValidateSchema = Joi.object({
  companyAdminId: Joi.string().uuid(),
  superAdminEditorId: Joi.string().required(),
  parentId: Joi.string().allow('').optional(),

  name: Joi.string().allow('').optional(),
  gender: Joi.string().allow('').optional(),

  email: Joi.string().email().required(),
  phoneno: Joi.string().allow('').optional(),
  password: Joi.string().required(),

  isDeleted: Joi.boolean().default(false),
  createdAt: Joi.date().default(Date.now),
}).unknown({
  only: true,
  items: Joi.string().valid('role'),
});

export const companyEditorValidateSchema = Joi.object({
  companyEditorId: Joi.string().uuid(),
  companyAdminId: Joi.string().required(),

  name: Joi.string().allow('').optional(),
  gender: Joi.string().allow('').optional(),

  email: Joi.string().email().required(),
  phoneno: Joi.string().allow('').optional(),
  password: Joi.string().required(),

  isDeleted: Joi.boolean().default(false),
  createdAt: Joi.date().default(Date.now),
}).unknown({
  only: true,
  items: Joi.string().valid('role'),
});

export const managerValidateSchema = Joi.object({
  managerId: Joi.string().uuid(),
  companyEditorId: Joi.string().required(),
  parentId: Joi.string().allow('').optional(),

  name: Joi.string().allow('').optional(),
  gender: Joi.string().allow('').optional(),

  email: Joi.string().email().required(),
  phoneno: Joi.string().allow('').optional(),
  password: Joi.string().required(),

  isDeleted: Joi.boolean().default(false),
  createdAt: Joi.date().default(Date.now),
}).unknown({
  only: true,
  items: Joi.string().valid('role'),
});

export const viewerValidateSchema = Joi.object({
  viewerId: Joi.string().uuid(),
  managerId: Joi.string().required(),

  name: Joi.string().allow('').optional(),
  gender: Joi.string().allow('').optional(),

  email: Joi.string().email().required(),
  phoneno: Joi.string().allow('').optional(),
  password: Joi.string().required(),

  isDeleted: Joi.boolean().default(false),
  createdAt: Joi.date().default(Date.now),
}).unknown({
  only: true,
  items: Joi.string().valid('role'),
});
