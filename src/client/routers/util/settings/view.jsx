import React, { Fragment } from 'react';


// components
const GeneralSettings = ({ siteName, domain }) => (
  <Fragment>
    <h3>
      General
    </h3>
    <div className="input-group my-1">
      <div className="input-group-prepend col-2 px-0">
        <span className="input-group-text w-100">
          Website name
        </span>
      </div>
      <input
        type="text"
        name="config[general][siteName]"
        className="form-control"
        defaultValue={siteName}
        placeholder="Website name"
      />
    </div>
    <div className="input-group my-1">
      <div className="input-group-prepend col-2 px-0">
        <span className="input-group-text w-100">
          Domain
        </span>
      </div>
      <input
        type="text"
        name="config[general][domain]"
        className="form-control"
        defaultValue={domain}
        placeholder="Website domain"
      />
    </div>
    <hr className="pb-4" />
  </Fragment>
);

const DisplaySettings = ({ language, timezone, timeFormat, sort, num }) => (
  <Fragment>
    <h3>
      Display
    </h3>
    <div className="input-group my-1">
      <div className="input-group-prepend col-2 px-0">
        <span className="input-group-text w-100">
          Language
        </span>
      </div>
      <select name="config[general][language]" className="custom-select">
        <option value={language}>
          English (en)
        </option>
      </select>
    </div>
    <div className="input-group my-1">
      <div className="input-group-prepend col-2 px-0">
        <span className="input-group-text w-100">
            Timezone
        </span>
      </div>
      <select name="config[display][timezone]" className="custom-select">
        <option value="UTC−06:00 (MST)">
          UTC−06:00 (MST)
        </option>
      </select>
    </div>
    <div className="input-group my-1">
      <div className="input-group-prepend col-2 px-0">
        <span className="input-group-text w-100">
          Time Format
        </span>
      </div>
      <select name="config[display][timeFormat]" className="custom-select">
        <option value="YYYY-MM-DD">
          YYYY-MM-DD
        </option>
      </select>
    </div>
    <div className="input-group my-1">
      <div className="input-group-prepend col-2 px-0">
        <span className="input-group-text w-100">
          Posts per page
        </span>
      </div>
      <input
        type="number"
        name="config[display][num]"
        className="form-control"
        defaultValue={num}
      />
    </div>
    <hr className="pb-4" />
  </Fragment>
);

const SEOSettings = ({ googleAnalytics, facebookApp, twitter }) => (
  <Fragment>
    <h3>
      SEO & Marketing
    </h3>
    <div className="input-group my-1">
      <div className="input-group-prepend col-2 px-0">
        <span className="input-group-text w-100">
          Google Analytics
        </span>
      </div>
      <input
        type="text"
        name="config[services][googleAnalytics]"
        className="form-control"
        defaultValue={googleAnalytics}
      />
    </div>
    <div className="input-group my-1">
      <div className="input-group-prepend col-2 px-0">
        <span className="input-group-text w-100">
          Facebook App ID
        </span>
      </div>
      <input
        type="text"
        name="config[services][facebookApp]"
        className="form-control"
        defaultValue={facebookApp}
      />
    </div>
    <div className="input-group my-1">
      <div className="input-group-prepend col-2 px-0">
        <span className="input-group-text w-100">
          Twitter Creator ID
        </span>
      </div>
      <input
        type="text"
        name="config[services][twitter]"
        className="form-control"
        defaultValue={twitter}
      />
    </div>
    <hr className="pb-4" />
  </Fragment>
);

const SettingsView = ({ isSubmittable, onSubmit, services, general, display }) => (
  <form className="pt-3" onSubmit={onSubmit}>
    <GeneralSettings {...general} />
    <DisplaySettings {...display} />
    <SEOSettings {...services} />
    <div className="text-right">
      <button
        type="submit"
        aria-label="Update"
        className="btn btn-outline-primary text-uppercase mx-1"
        disabled={!isSubmittable}
      >
        Update
      </button>
    </div>
  </form>
);


// exports
export default SettingsView;
