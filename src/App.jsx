import React from 'react'
import { uuidv4 } from '@firebase/util';
import { createSpec, getSpec, getSpecDocs, updateSpec } from './util/firebase';
import { getSpecTypes, getSpecSchema } from './util/beagle_specs';
import LookupForm from './LookupForm';
import SpecForm from './SpecForm';
import EdgeForm from './EdgeForm';
import './App.css'

function App() {
  const [specName, setSpecName] = React.useState('user');
  const [specTypes, setSpecTypes] = React.useState([])
  const [specSchema, setSpecSchema] = React.useState({});
  const [existingSpec, setExistingSpec] = React.useState();
  const [existingDocs, setExistingDocs] = React.useState([]);
  const [errors, setErrors] = React.useState();

  // Get spec types for document creation and loading and spec schema for validation/form entries
  React.useEffect( () => {
    getSpecTypes(setSpecTypes);
    if(!specSchema['fields']) getSpecSchema(specName, setSpecSchema);
  }, [])

  // Update database
  const handleSave = React.useCallback(async (specName, id, values) => {
    if (id === null) {
      id = uuidv4();
      await createSpec(`${specName}/${id}`, { id, ...values });
      return;
    }

    await updateSpec(`${specName}/${id}`, values);
  }, []);

  // Load one document from a spec with a given UUID
  const handleLoadOne = React.useCallback(async (specName, id) => {
    const spec = await getSpec(`${specName}/${id}`);
    if (!spec) {
      return alert(`${specName}/${id} not found!`);
    }

    setExistingSpec(spec);
    setExistingDocs([spec]);
  }, []);

  // Load all documents from a spec when no UUID is given
  const handleLoadAll = React.useCallback(async (specName) => {
    const specItems = await getSpecDocs(`${specName}`);
    if (!specItems) {
      return alert(`${specName} not found!`);
    }

    let items = [];
    specItems.forEach(doc => items.push(doc.data()));
    setExistingDocs(items);
    setExistingSpec(items[0]);
  }, []);

  // Set specName from dropdown for entire app
  const handleSpecSelect = React.useCallback((e) => {
    e.preventDefault();
    setSpecName(e.target.value);
  })

  // Reset all fields - datetime pickers seem not resettable
  const handleAddNew = React.useCallback(() => {
    let initValues = {};
    Object.keys(specSchema['fields'] || {}).forEach(field => {
      initValues[field] = specSchema['fields'][field]['initialValue'];
    });

    setExistingSpec(initValues);
  })

  return (
    <div>
      <h1>Beagle Data Manager</h1>

      <div>
        <label>spec type:
              <select name="spec_name" onChange={handleSpecSelect} value={specName}>
                  {specTypes.map((spec, idx) => <option key={idx} value={spec}>{spec}</option>)}
              </select>
          </label>
      </div>

      <div>
        <h3>Lookup Spec(s)</h3>
        <LookupForm 
          onLoadOne={handleLoadOne} 
          onLoadAll={handleLoadAll}
          specName={specName}
        />
      </div>
      <hr/>

      <div>
        <button type='button' onClick={handleAddNew}>Add New Entry</button>
      </div>
    
      <div>
        <h3>Spec Details</h3>
        {existingSpec
        ?
          <SpecForm
            specName={specName}  
            id={existingSpec.id}
            existingFieldValues={existingSpec}
            onSave={handleSave}   
            specSchema={specSchema}      
          />
        :
          <SpecForm
            specName={specName}
            specSchema={specSchema}      
            onSave={handleSave}
          />
        }
      </div>

      <hr/>
      <div>
        <h3>Edges</h3>
        <EdgeForm />

      </div>
    </div>
  )
}

export default App;