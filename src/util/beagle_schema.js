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
        .required('Last login date is required'),
        // need to check last login date is after creation date and before current date?
    role: Yup.string()
        .required('Role is required'),
    auth_provider: Yup.string()
        .required('Authentication provider type is required'),
    created_at: Yup.date()
        .required('Creation date required'),
        // need to check creation date is not after current date?
    updated_at: Yup.date()
        .required('Update date required')   
        // need to check update date is after creation date and before current date?
})

//     edges: Yup.object().shape({
//         customer: Yup.array().of(Yup.string()
//             .min(36, 'UUID must be 36 characters long')
//             .max(36, 'UUID must be 36 characters long')),
//         shopping_carts: Yup.array().of(Yup.string()
//             .min(36, 'UUID must be 36 characters long')
//             .max(36, 'UUID must be 36 characters long'))

// TBD
const CustomerSchema = {};
const OrderSchema = {};
const CartSchema = {};

export const BeagleSchema = {
    user: UserSchema,
    customer: CustomerSchema,
    order: OrderSchema,
    shopping_cart: CartSchema
};