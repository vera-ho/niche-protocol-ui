import { uuidv4 } from '@firebase/util';
import React from 'react'
import './App.css'
import { createSpec, getSpec, getSpecDocs, updateSpec } from './firebase';
import LookupForm from './LookupForm';
import SpecForm from './SpecForm'

function App() {
  const [specName, setSpecName] = React.useState('user');
  const [existingSpec, setExistingSpec] = React.useState();
  const [existingDocs, setExistingDocs] = React.useState([]);
  const [errors, setErrors] = React.useState();

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

  return (
    <div>
      <h1>Beagle Data Manager</h1>
      <div>
        <LookupForm 
          onLoadOne={handleLoadOne} 
          onLoadAll={handleLoadAll}
        />
      </div>
      <hr/>
      <div>
        {existingSpec
        ?
          <SpecForm
            specName={specName}  
            id={existingSpec.id}
            existingFieldValues={existingSpec}
            onSave={handleSave}         
          />
        :
          <SpecForm
            specName={specName}
            onSave={handleSave}
          />
        }
      </div>
    </div>
  )
}

export default App;
