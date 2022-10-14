import React from 'react';
import { useFormik } from 'formik';
import { getSpecSchema } from './util/beagle_specs';

const SpecForm = (props) => {
  const [formValues, setFormValues] = React.useState({});
  const { specName, id, existingFieldValues, onSave } = props;
  const [specSchema, setSpecSchema] = React.useState({});

  // Get spec schema for validation and form entries
  React.useEffect( () => {
    getSpecSchema(specName, setSpecSchema);
  }, [])

  // If props has valid existing field values, set them into state each time they change
  React.useEffect(() => {
    if (!existingFieldValues) return;
    setFormValues(existingFieldValues);
  }, [existingFieldValues]);

  // Set formik up to make form updates; initialize with existing form values
  const formik = useFormik({   
    initialValues: formValues,
    enableReinitialize: true,
    onSubmit: () => {
      handleSubmit();
      setFormValues({});
    },
  });

  const handleSubmit = React.useCallback(() => {
    onSave(specName, id || null, formik.values);
  }, [specName, id, formik.values, onSave]);

  // Render each form field and it's value
  const fields = Object.keys(formik.values || []).map( (field, idx) => {
    // let fieldType;

    return (
      <label key={idx}>{field}
        <input
          type='text'
          name={field}
          value={formik.values[field]}
          onChange={formik.handleChange}
        />
        <br></br>
      </label>
    )
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className='spec-form-fields'>
        {/* <label>id: {id}
          <br></br>
        </label> */}
        {fields}
      </div>
      <div className='spec-form-submit-button'>
        <button type="submit">Save</button>
      </div>
    </form>
  );
};

export default SpecForm;
