import React from 'react';

const SpecItem = props => {
    const { itemNum, spec, setExistingSpec } = props;

    const handleSetSpec = React.useCallback((e) => {
        e.preventDefault();
        setExistingSpec(spec)
    })

    return (
        <div className='spec-list-item'>
            <span>{itemNum + ': '}</span>
            <button type='button' value={spec} onClick={handleSetSpec}>id: {spec.id ? spec.id : 'no id available'}</button>
            <span>name: {spec.name ? spec.name : 'no name available'}</span>
        </div>
    )
}

export default SpecItem;