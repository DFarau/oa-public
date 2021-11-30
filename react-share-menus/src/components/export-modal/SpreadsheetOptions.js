import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { defineMessages, useIntl } from 'react-intl';

import Radio from '../Radio';

const SpreadsheetOptions = ({
  languages, setChoice, fields, options
}) => {
  const [displayLanguages, setDisplayLanguages] = useState(false);
  const [displayFields, setDisplayFields] = useState(false);
  const [checkedState, setCheckedState] = useState(
    new Array(fields.length).fill(false)
  );

  const intl = useIntl();
  const messages = defineMessages({
    inputField: {
      id: 'input-field',
      defaultMessage: 'Select the fields to export',
    },
    allLanguages: {
      id: 'all-languages',
      defaultMessage: 'Export in all languages',
    },
    allFields: {
      id: 'all-fields',
      defaultMessage: 'Export every field'
    },
    selectAll: {
      id: 'select-all',
      defaultMessage: 'Select all'
    }
  });

  const handleLanguage = e => {
    if (e.target.checked) {
      return setChoice({ ...options, languages: [...options.languages, e.target.value] });
    }
    const index = options.languages.indexOf(e.target.value);

    if (index >= 0) {
      options.languages.splice(index, 1);
      setChoice({ ...options, languages: options.languages });
    }
  };

  const handleCheckAll = e => {
    if (e.target.checked) {
      const updatedCheckedState = checkedState.map(() => true);

      setCheckedState(updatedCheckedState);

      const allFields = fields.reduce((acc, field) => {
        acc.push(field.source);
        return acc;
      }, []);

      return setChoice({ ...options, fields: allFields });
    }
    const updatedCheckedState = checkedState.map(() => false);
    setCheckedState(updatedCheckedState);
    setChoice({ ...options, fields: [] });
  };

  const handleFields = (event, index = null) => {
    const updatedCheckedState = checkedState.map((item, i) => (index === i ? !item : item));
    setCheckedState(updatedCheckedState);

    if (event.target.checked) {
      return setChoice({ ...options, fields: [...options.fields, event.target.value] });
    }

    const updatedOptions = options.fields.filter(field => field !== event.target.value);
    return setChoice({ ...options, fields: updatedOptions });
  };

  const handleFormat = (value, id) => {
    setChoice({ ...options, format: id });
  };

  const formatTarget = target => {
    if (Array.isArray(target)) {
      const removeLang = target.map(el => {
        if (el.indexOf('-') >= 0) return el.substring(0, el.indexOf('-') - 1);
        return el;
      });
      const cleanArray = [...new Set(removeLang)];
      return cleanArray.join(', ');
    }
    return target;
  };

  return (
    <div className="spreadsheet-options">
      <Radio content="XLSX (MS Excel)" name="spreadsheet-format" id="xlsx" setChoice={handleFormat} defaultChecked />
      <Radio content="CSV" name="spreadsheet-format" id="csv" setChoice={handleFormat} />
      <div>
        <label htmlFor="languages">
          <input name="columns" id="languages" type="checkbox" defaultChecked={!displayLanguages} onChange={() => setDisplayLanguages(!displayLanguages)} />
          {intl.formatMessage(messages.allLanguages)}
        </label>
        {displayLanguages && (
          <div className="margin-left-sm">
            {languages.map(lang => (
              <div className="margin-left-sm" style={{ display: 'inline-block' }} key={lang}>
                <label htmlFor={lang}>
                  <input name="languages" id={lang} type="checkbox" onChange={handleLanguage} value={lang} className="margin-right-sm" />
                  {lang.toUpperCase()}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
      <label htmlFor="fields">
        <input name="columns" id="fields" type="checkbox" defaultChecked={!displayFields} onChange={() => setDisplayFields(!displayFields)} />
        {intl.formatMessage(messages.allFields)}
      </label>
      {displayFields && (
      <div className="margin-left-md checkbox-list">
        <label htmlFor="allFields">
          <input name="fields" id="allFields" type="checkbox" onChange={handleCheckAll} value="allFields" className="margin-right-sm" />
          {intl.formatMessage(messages.selectAll)}
        </label>
        {fields.map((field, index) => (
          <label htmlFor={field.source} key={field.source}>
            <input name="fields" id={field.source} type="checkbox" onChange={event => handleFields(event, index)} value={field.source} className="margin-right-sm" checked={checkedState[index]} />
            {formatTarget(field.target)}
          </label>
        ))}
      </div>
      )}
    </div>
  );
};

export default SpreadsheetOptions;

SpreadsheetOptions.propTypes = {
  options: PropTypes.shape({
    format: PropTypes.string,
    languages: PropTypes.arrayOf(PropTypes.string),
    fields: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  languages: PropTypes.arrayOf(PropTypes.string).isRequired,
  setChoice: PropTypes.func.isRequired,
  fields: PropTypes.arrayOf(PropTypes.shape({
    source: PropTypes.string,
    target: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])
  })).isRequired
};
