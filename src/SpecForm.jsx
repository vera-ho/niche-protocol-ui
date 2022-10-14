import React from 'react';
import { useFormik } from 'formik';
import { getSpecTypes, getSpecSchema } from './util/beagle_specs';

const SpecForm = (props) => {
  const [formValues, setFormValues] = React.useState({});
  const { specName, id, existingFieldValues, onSave } = props;
  const [specSchema, setSpecSchema] = React.useState({});

  React.useEffect( () => {
    getSpecSchema(specName, setSpecSchema);
  }, [])

  React.useEffect(() => {
    if (!existingFieldValues) {
      return;
    }

    setFormValues(existingFieldValues);
  }, [existingFieldValues]);

  const formik = useFormik({   
    initialValues: formValues,
    enableReinitialize: true,
    onSubmit: (e) => {     // formik.handleSubmit
      handleSubmit();
      setFormValues({});
    },
  });

  const handleSubmit = React.useCallback(() => {
    onSave(specName, id || null, formik.values);
  }, [specName, id, formik.values, onSave]);

  const fields = Object.keys(formik.values).map( (field, idx) => {
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
        {fields}
      </div>
      <div className='spec-form-submit-button'>
        <button type="submit">Save</button>
      </div>
    </form>
  );
};

export default SpecForm;
