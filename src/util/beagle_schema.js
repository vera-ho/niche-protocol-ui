import * as Yup from 'yup';

const UserSchema = Yup.object().shape({
    name: Yup.string()
        .required('Name is required'),
    email: Yup.string().email()
        .required('Email is required'),
    password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters'),
    verified_email: Yup.boolean(),
    phone_number: Yup.string()
        .matches(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/, 
        'Invalid phone number'),
    last_login: Yup.date()
        .required('Last login date is required')
        .min(Yup.ref('created_at'), 'Login date cannot be before create date')
        .max(new Date(), 'Login date cannot be after today')
        .nullable(),
    role: Yup.string()
        .required('Role is required'),
    auth_provider: Yup.string()
        .required('Authentication provider type is required')
        .nullable(),
    created_at: Yup.date()
        .required('Creation date required')
        .max(new Date(), 'Create date cannot be after today')
        .nullable(),
    updated_at: Yup.date()
        .required('Update date required')
        .min(Yup.ref('created_at'), 'Update date cannot be before create date')
        .max(new Date(), 'Update date cannot be after today')
        .nullable()
})

// const UserEdgeSchema = Yup.object().shape({
//     customer: Yup.array().of(Yup.string()
//         .min(36, 'UUID must be 36 characters long')
//         .max(36, 'UUID must be 36 characters long')),
//     shopping_carts: Yup.array().of(Yup.string()
//         .min(36, 'UUID must be 36 characters long')  
//         .max(36, 'UUID must be 36 characters long'))
// });

const CustomerSchema = Yup.object().shape({
    name: Yup.string()
        .required('Name is required'),
    billing_address: Yup.string()
        .required('Billing address is required')
        .nullable(),
    shipping_address: Yup.string()
        .required('Shipping address is required')
        .nullable(),
    created_at: Yup.date()
        .required('Creation date required')
        .max(new Date(), 'Create date cannot be after today')
        .nullable(),
    updated_at: Yup.date()
        .required('Update date required')
        .min(Yup.ref('created_at'), 'Update date cannot be before create date')
        .max(new Date(), 'Update date cannot be after today')
        .nullable()
});

const CartSchema = Yup.object().shape({
    products: Yup.array().of(Yup.object()),
    created_at: Yup.date()
        .required('Creation date required')
        .max(new Date(), 'Create date cannot be after today')
        .nullable(),
    updated_at: Yup.date()
        .required('Update date required')
        .min(Yup.ref('created_at'), 'Update date cannot be before create date')
        .max(new Date(), 'Update date cannot be after today')
        .nullable()
});

const OrderSchema = Yup.object().shape({
    status: Yup.string(),
    time_placed: Yup.date().nullable(),
    total: Yup.number().nullable(),
    shipping_cost: Yup.number(),
    created_at: Yup.date()
        .required('Creation date required')
        .max(new Date(), 'Create date cannot be after today')
        .nullable(),
    updated_at: Yup.date()
        .required('Update date required')
        .min(Yup.ref('created_at'), 'Update date cannot be before create date')
        .max(new Date(), 'Update date cannot be after today')
        .nullable()
});

// TBD
// const CustomerEdgeSchema = {};
// const OrderEdgeSchema = {};
// const CartEdgeSchema = {};

export const BeagleSpecSchema = {
    user: UserSchema,
    customer: CustomerSchema,
    order: OrderSchema,
    shopping_cart: CartSchema
};

// export const BeagleEdgeSchema = {
//     user: UserEdgeSchema,
//     customer: CustomerEdgeSchema,
//     order: OrderEdgeSchema,
//     shopping_cart: CartEdgeSchema
// }