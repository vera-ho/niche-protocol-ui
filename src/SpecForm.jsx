import React from 'react';
import { useFormik } from 'formik';
import { deleteSpec } from './util/firebase';
import { BeagleSpecSchema } from './util/beagle_schema';

const SpecForm = (props) => {
  const { specName, id, existingFieldValues, onSave, specSchema } = props;
  const [formValues, setFormValues] = React.useState({});

  React.useEffect(() => {
    if (!existingFieldValues) return;
    setFormValues(existingFieldValues);
  }, [existingFieldValues, specName]);

  // Create object with initial values to use in Formik; ignores fields from db that are not in schema
  const initValues = {};
  Object.keys(specSchema['fields'] || {}).forEach(field => {
    initValues[field] = formValues[field] ? formValues[field] : specSchema['fields'][field]['initialValue'];
  });

  // Set formik up to make form updates; initialize with existing form values
  const formik = useFormik({   
    initialValues: initValues,
    enableReinitialize: true,
    validationSchema: BeagleSpecSchema[specName],
    onSubmit: () => {
      handleSubmit();     // update database
      setFormValues({});  // reset form
    }
  });

  // Submit to database
  const handleSubmit = React.useCallback(() => {
    onSave(specName, id || null, formik.values);
  }, [specName, id, formik.values, onSave]);

  // Delete entire spec from database
  const handleDelete = React.useCallback(async () => {
    let msg = 'Are you sure you want to delete this spec?';
    if(confirm(msg)) {
      await deleteSpec(`${specName}/${id}`);
    } 
  })

  // Render each form field and its value
  const fields = Object.keys(formik.values || []).map( (field, idx) => {
    let fieldType = 'text';
    if(field === 'email') fieldType = 'email';
    else if(field === 'password') fieldType = 'password';
    else if(field === 'verified_email') fieldType = 'checkbox';
    else if(['last_login', 'created_at', 'updated_at', 'time_placed'].includes(field)) fieldType = 'datetime-local';
    
    const error = formik.errors[field] && formik.touched[field] && 
      (<><br/><span className='form-error'>{formik.errors[field]}</span></>)

    // Select type of input element per field
    if(((field === 'role' || field === 'auth_provider') && specName === 'user') ||
        (field === 'status' && specName === 'order')) {
      const options = specSchema['fields'][field]['type'].split(' | ');
      
      return (
        <label key={idx}>{field}
          <select 
            name={field}
            value={formik.values[field]}
            onChange={formik.handleChange}
            onBlur={formik.handleChange}
            className={formik.errors}
          >
            {options.map((option, idxo) => {
              return (
                <option value={option} label={option} key={idxo}>
                  {option}
                </option>
              )
            })}
          </select>
          {error}
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
          />
          {error}
          <br></br>
        </label>
      )
    }

  });

  // SpecForm 
  // reset intermittently works?
  return (
    <form onSubmit={formik.handleSubmit}>
      <div className='spec-form-fields'>
        <label>id: {id}
          <br></br>
        </label>
        {fields}
      </div>

      <div>
        <button type='button' onClick={handleDelete}>🗑</button>
        <button type='button' onClick={formik.handleReset}>Reset Form</button>
        <button type="submit">Save</button>
      </div>
    </form>
  );
};

export default SpecForm;