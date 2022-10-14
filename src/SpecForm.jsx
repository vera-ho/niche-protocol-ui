import React from 'react';
import { useFormik } from 'formik';
import { getSpecSchema } from './util/beagle_specs';
import { BeagleSchema } from './util/beagle_schema';

const SpecForm = (props) => {
  let { specName, id, existingFieldValues, onSave } = props;
  const [formValues, setFormValues] = React.useState({});
  const [specSchema, setSpecSchema] = React.useState({});

  // Get spec schema for validation and form entries
  React.useEffect( () => {
    if(!specSchema['fields']) getSpecSchema(specName, setSpecSchema);
  }, [])

  React.useEffect(() => {
    if (!existingFieldValues) return;
    setFormValues(existingFieldValues);
  }, [existingFieldValues]);

  // Create object with initial values to use in Formik; ignores fields from db that are not in schema
  const initValues = {};
  Object.keys(specSchema['fields'] || {}).forEach(field => {
    initValues[field] = formValues[field] ? formValues[field] : specSchema['fields'][field]['initialValue'];
  });

  // Set formik up to make form updates; initialize with existing form values
  const formik = useFormik({   
    initialValues: initValues,
    enableReinitialize: true,
    // validationSchema: BeagleSchema[specName],
    onSubmit: () => {
      console.log('submit!')
      handleSubmit();     // update database
      setFormValues({});  // reset form
    },
  });

  const handleSubmit = React.useCallback(() => {
    onSave(specName, id || null, formik.values);
  }, [specName, id, formik.values, onSave]);

  // Render each form field and its value
  const fields = Object.keys(formik.values || []).map( (field, idx) => {
    let fieldType;
    if(field === 'email') fieldType = 'email';
    else if(field === 'password') fieldType = 'password';
    else if(field === 'verified_email') fieldType = 'checkbox';
    else if(field === 'phone_number') fieldType = 'number';
    else if(['last_login', 'created_at', 'updated_at'].includes(field)) fieldType = 'datetime-local';
    else fieldType = 'text';
    
    // formik functions values, handleChange, handleSubmit, errors, touched, handleBlur, isValid, dirty
    if(field === 'role' || field === 'auth_provider') {
      const options = specSchema['fields'][field]['type'].split(' | ')

      return (
        <label key={idx}>{field}
          <select 
            name={field}
            value={formik.values[field]}
            onChange={formik.handleChange}
            onBlur={formik.handleChange}
          >
            {options.map((option, idxo) => {
              return (
                <option value={option} label={option} key={idxo}>
                  {option}
                </option>
              )
            })}
          </select>
          <br></br>
        </label>
      )
    } else {
      return (
        <label key={idx}>{field}
          <input
            type={fieldType}
            name={field}
            value={formik.values[field]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={formik.errors}
          />
          <br></br>
        </label>
      )
    }

  });

  // SpecForm 
  return (
    <form onSubmit={formik.handleSubmit}>
      <div className='spec-form-fields'>
        <label>id: {id}
          <br></br>
        </label>
        {fields}
      </div>
      <div className='spec-form-submit-button'>
        <button type="submit">Save</button>
      </div>
    </form>
  );
};

export default SpecForm;
