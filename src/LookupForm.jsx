import React from 'react';

const LookupForm = (props) => {
    // Should put specName in props, and dropdown in App.jsx to be used in both forms
    const { onLoadOne, onLoadAll, specName } = props;

    return (
        <form onSubmit={ (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            // const specName = formData.get('spec_name');
            const id = formData.get('id');

            if(!specName) {
                return alert('Select a spec!')
            }

            // Load all documents for given spec type or specific ID
            if(!id) {
                onLoadAll(specName);
            } else {
                onLoadOne(specName, id);
            }

        }}>

        {/* <label>spec type:
            <select name="spec_name">
                {specTypes.map((spec, idx) => <option key={idx}>{spec}</option>)}
            </select>
        </label> */}
        <label>Existing spec id:
            <input name="id" type="text" />
        </label>
        <button type="submit">Load</button>
        <button type="reset">Clear UUID</button>
        </form>
    );
};

export default LookupForm;
