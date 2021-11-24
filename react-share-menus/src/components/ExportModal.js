import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { defineMessages, useIntl } from 'react-intl';
import axios from 'axios';

import Modal from '@openagenda/react-shared/src/components/Modal';
import ReactSelectInput from '@openagenda/react-shared/src/components/ReactSelectInput';
import Radio from './Radio';

const ExportModal = ({
  res, languages, onClose, exportLanguage, userLogged
}) => {
  const [formatChoice, setFormatChoice] = useState({ value: '', id: '' });
  const [csvOptions, setCsvOptions] = useState(false);
  const [jsonOptions, setJsonOptions] = useState(false);
  const [jsonDetailed, setJsonDetailed] = useState(false);
  const [publicKey, setPublicKey] = useState('');
  const [gCal, setGCal] = useState(false);
  const [newTab, setNewTab] = useState(false);
  const [displayButton, setDisplayButton] = useState(false);

  const intl = useIntl();

  const messages = defineMessages({
    modalTitle: {
      id: 'modal-title',
      defaultMessage: 'Export',
    },
    inputFormat: {
      id: 'input-format',
      defaultMessage: 'Choose a format',
    },
    inputLanguage: {
      id: 'input-language',
      defaultMessage: 'Choose a language',
    },
    allLanguages: {
      id: 'all-languages',
      defaultMessage: 'All',
    },
    close: {
      id: 'close',
      defaultMessage: 'Close',
    },
    cancel: {
      id: 'cancel',
      defaultMessage: 'Cancel',
    },
    instructions: {
      id: 'instructions',
      defaultMessage: 'Instructions',
    },
    instructionsStep1: {
      id: 'instructionsStep1',
      defaultMessage: 'Copy the link in the field above',
    },
    instructionsStep2: {
      id: 'instructionsStep2',
      defaultMessage: 'Open ',
    },
    instructionsStep3: {
      id: 'instructionsStep3',
      defaultMessage: 'In the left section, open "Other Calendars > Add by URL"',
    },
    instructionsStep4: {
      id: 'instructionsStep4',
      defaultMessage: 'Follow the instructions by pasting the link you copied in step 1',
    },
    logIn: {
      id: 'login',
      defaultMessage: 'Please log in to access the export link directly from this menu'
    },
    exportJson: {
      id: 'exportJson',
      defaultMessage: 'Use the previous JSON export version'
    },
    jsonDoc1: {
      id: 'jsonDoc1',
      defaultMessage: 'Documentation'
    },
    jsonDoc2: {
      id: 'jsonDoc2',
      defaultMessage: 'here'
    },
    documentation: {
      id: 'documentation',
      defaultMessage: 'See the documentation'
    },
    detailedFormat: {
      id: 'detailed-format',
      defaultMessage: 'Use the detailed format'
    }
  });

  const formats = [
    { type: 'PDF', id: 'pdf' },
    { type: 'JSON / API', id: 'jsonV2' },
    { type: 'Microsoft Excel (xlsx)', id: 'xl' },
    { type: 'Google Agenda', id: 'gagenda' },
    { type: 'iCal', id: 'ical' },
    { type: 'ICS', id: 'ics' },
    { type: 'RSS', id: 'rss' },
    { type: 'CSV', id: 'csv' },
  ];

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(res.me);
      setPublicKey(response.data.apiKey);
    }
    fetchData();
  }, [res.me]);

  const setChoice = (value, id) => {
    setDisplayButton(false);
    setFormatChoice({ value, id });
    setGCal(false);
    setCsvOptions(false);
    setJsonOptions(false);
    if (id === 'csv' || id === 'xl') setCsvOptions(true);
    if (id === 'jsonV2' || id === 'rss') setNewTab(true);
    if (id === 'gagenda') {
      return setGCal(true);
    }
    if (id === 'jsonV2') {
      return setJsonOptions(true);
    }
    setDisplayButton(true);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (userLogged && formatChoice.id === 'jsonV2') {
      const jsonUrl = new URL(res.export.jsonV2);
      if (jsonDetailed) {
        jsonUrl.searchParams.append('detailed', 1);
      } else {
        jsonUrl.searchParams.delete('detailed');
      }
      jsonUrl.searchParams.append('key', publicKey);
      window.open(jsonUrl);
      return onClose();
    }

    if (newTab) {
      window.open(res.export[formatChoice.id]);
      return onClose();
    }

    window.open(res.export[formatChoice.id], '_self');
    return onClose();
  };

  const setLanguages = (lang = []) => {
    const languageList = lang.map(language => ({
      label: language.toUpperCase(),
      value: language,
    }));
    languageList.unshift({ label: intl.formatMessage(messages.allLanguages), value: 'all' });
    return languageList;
  };

  const selectLanguage = lang => (lang ? exportLanguage(lang.value) : null);

  const handleClick = e => e.target.select();

  return (
    <Modal classNames={{ overlay: 'popup-overlay big' }} disableBodyScroll onClose={onClose}>
      <form className="export export-form" onSubmit={handleSubmit}>
        <button className="export-close" type="button" onClick={onClose}>
          <i className="fa fa-times fa-lg" />
        </button>
        <h1 className="export-title-big">{intl.formatMessage(messages.modalTitle)}</h1>
        <h2 className="export-title-md">{intl.formatMessage(messages.inputFormat)}</h2>
        <div className="form-group">
          {formats.map(({ type, id }) => (
            <React.Fragment key={id}>
              <Radio content={type} name="format" id={id} setChoice={setChoice} json={id === 'json'} />
              {csvOptions && id === formatChoice.id && (
                <div className="input-container">
                  <ReactSelectInput
                    name="langue"
                    placeholder={intl.formatMessage(messages.inputLanguage)}
                    options={setLanguages(languages)}
                    onChange={selectLanguage}
                  />
                </div>
              )}
              {jsonOptions && id === formatChoice.id && (
                <>
                  {!userLogged && <p>{intl.formatMessage(messages.logIn)}</p>}
                  <div className="flex-container margin-bottom-xs">
                    <button type="submit" className="btn btn-primary" disabled={!userLogged}>
                      {intl.formatMessage(messages.modalTitle)}
                    </button>
                    <div className="checkbox margin-left-sm">
                      <label htmlFor="detailed" className={userLogged ? '' : 'text-muted'}>
                        <input id="detailed" type="checkbox" name="detailed" disabled={!userLogged} onChange={() => setJsonDetailed(!jsonDetailed)} /> {intl.formatMessage(messages.detailedFormat)}
                      </label><br />
                      <a href="https://developers.openagenda.com/10-lecture/" target="_blank" rel="noreferrer">{intl.formatMessage(messages.documentation)}</a>
                    </div>
                  </div>
                  <a href={res.export.jsonV1} target="_blank" rel="noreferrer">{intl.formatMessage(messages.exportJson)}</a> ({intl.formatMessage(messages.jsonDoc1)}<a href="https://developers.openagenda.com/export-json-dun-agenda/" target="_blank" rel="noreferrer"> {intl.formatMessage(messages.jsonDoc2)}</a>)
                </>
              )}
              {displayButton && id === formatChoice.id && (
                <button type="submit" className="btn btn-primary">
                  {intl.formatMessage(messages.modalTitle)}
                </button>
              )}
              {gCal && id === 'gagenda' && (
                <div>
                  <input
                    className="form-control url-input"
                    value={`https://openagenda.com${res.export.gcal}`}
                    readOnly
                    onClick={handleClick}
                  />
                  <h4>{intl.formatMessage(messages.instructions)}</h4>
                  <p>1. {intl.formatMessage(messages.instructionsStep1)}</p>
                  <p>
                    2. {intl.formatMessage(messages.instructionsStep2)}
                    <a target="_blank" href="https://calendar.google.com" rel="noreferrer" className="calendars-link">
                      Google Calendar
                    </a>
                  </p>
                  <p>3. {intl.formatMessage(messages.instructionsStep3)}</p>
                  <p>4. {intl.formatMessage(messages.instructionsStep4)}.</p>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </form>
    </Modal>
  );
};

export default ExportModal;

ExportModal.propTypes = {
  res: PropTypes.shape({
    export: PropTypes.shape({
      jsonV1: PropTypes.string,
      jsonV2: PropTypes.string,
      pdf: PropTypes.string,
      xl: PropTypes.string,
      gcal: PropTypes.string,
      ical: PropTypes.string,
      csv: PropTypes.string,
      ics: PropTypes.string,
      rss: PropTypes.string,
    }),
    me: PropTypes.string
  }).isRequired,
  languages: PropTypes.arrayOf(PropTypes.string),
  onClose: PropTypes.func.isRequired,
  exportLanguage: PropTypes.func.isRequired,
  userLogged: PropTypes.bool.isRequired
};

ExportModal.defaultProps = {
  languages: undefined,
};
