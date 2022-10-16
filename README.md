## Beagle Data Management UI
UI interface using Beagle Schema and Firestore database
* `formik` and `yup`
* `react` and `vite`
* `axios`

## Milestones
- [x] SpecForm - add and load/update specs from the database
- [x] EdgeForm - load current edges, add new edge and delete edge
- [ ] Modal - Skip 
- [x] List all specs in collection 
- [x] Show details of a specific spec 
- [x] Search for a spec by it's ID 

## Main App
A dropdown menu is used to select a spec type, which is then the spec type for the entire app. The main app also has the following functions to query and update the Firestore database:
* handleSave
* handleLoadOne
* handleLoadAll
* handleAddNew

## LookupForm
The lookup form will query for one Firestore document (spec) if an ID is supplied. If the load button is pressed while the textbox is empty, it will query all documents within the specified Firestore collection (spec type). The results will then be saved to the state within the main app.

## SpecForm
`Formik` is used to validate in conjunction with `Yup` and manage form values. The form fields come from the spec schema (in turn from the main app), and the values are initialized to either an existing spec value or the inital value specified by the schema. By using the schema to generate the form field elements, misfits between the database and the schema are effectively ignored. 

The form can be reset to intial values, saved if values have changed, saved to a new entry in the database, or delete a spec from the database. Since the form can be used as a new entry form by clicking the 'Add new entry' button, the modal feature has not been implemented to reduce redundancy. 

Note: It seems the datetime pickers behave differently for each browser, and values cannot be reset visually even though the actual value has been reset. 

### Form Validations
`Yup` is used to validate form elements for the SpecForm component. Validations are specified by the Beagle REST API provided by Niche Protocol. Fields are validated for type, required-ness and dates are validated to be before current date. The creation date for a spec must be before all other dates. Regex is used to validate a basic phone number. 

For example:

``` javascript
const UserSchema = Yup.object().shape({  // partial, see full code in repo
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
```

## Edge Form
A dropdown menu is used to select the edge and will display all edges between the two spec types. A form is also used to input an ID of the selected edge to add a new edge between the two spec types. The function will add the entered ID to it's own spec, and add it's own ID to the entered ID's spec. Each edge connection can also be deleted and the function will delete the edge for both specs.

```javascript
// Add edgeID to current spec if it doesn't exist
if(existingFieldValues[edgeName].includes(edgeID)) {
    alert(`${edgeID} already exists in ${edgeName}`);
} else {
    existingFieldValues[edgeName].push(edgeID);
    onSave(specName, specID, existingFieldValues);
}

// Add current spec ID to edgeID's spec if it doesn't exist
if(edgeSpec[specName].includes(specID)) {
    alert(`${specID} already exists in ${specName}`)
} else {
    edgeSpec[specName].push(specID);
    onSave(edgeName, edgeID, edgeSpec);
}
```