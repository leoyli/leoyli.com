import React from 'react';


// components
const SettingsView = ({ _$CONFIG, onSubmit, isSubmittable }) => (
  <form className="pt-3" onSubmit={onSubmit}>
    <div className="input-group my-1">
      <div className="input-group-prepend col-2 px-0">
        <span className="input-group-text w-100">
          Website name
        </span>
      </div>
      <input
        type="text"
        id="siteName"
        name="config[siteName]"
        className="form-control"
        defaultValue={_$CONFIG.siteName}
        placeholder="Website name"
      />
    </div>
    <div className="input-group my-1">
      <div className="input-group-prepend col-2 px-0">
        <span className="input-group-text w-100">
          Description
        </span>
      </div>
      <input
        type="text"
        id="description"
        name="config[description]"
        className="form-control"
        placeholder="Description"
        defaultValue={_$CONFIG.description}
      />
    </div>
    <div className="input-group my-1">
      <div className="input-group-prepend col-2 px-0">
        <span className="input-group-text w-100">
          Keywords
        </span>
      </div>
      <input
        type="text"
        id="keywords"
        name="config[keywords]"
        className="form-control"
        defaultValue={_$CONFIG.keywords}
        placeholder="Keywords (separated by ',')"
      />
    </div>
    <div className="input-group my-1">
      <div className="input-group-prepend col-2 px-0">
        <span className="input-group-text w-100">
          Language
        </span>
      </div>
      <select id="language" name="config[sets][language]" className="custom-select">
        <option value="en">
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
      <select id="timezone" name="config[sets][timezone]" className="custom-select">
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
      <select id="time-format" name="config[sets][timeFormat]" className="custom-select">
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
        id="num"
        name="config[sets][num]"
        className="form-control"
        defaultValue={_$CONFIG.sets.num}
      />
    </div>
    <button
      type="submit"
      aria-label="Update"
      className="btn btn-outline-primary text-uppercase float-right mx-1 mt-3"
      disabled={!isSubmittable}
    >
      Update
    </button>
  </form>
);


// exports
export default SettingsView;
