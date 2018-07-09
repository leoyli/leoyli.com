import moment from 'moment';
import React from 'react';


// components
const EditorView = ({ onSubmit, isSubmittable, post: { title, featured, category, tags, time, content } = {} }) => (
  <form autoComplete="off" className="container d-flex pt-3 _-form" onSubmit={onSubmit}>
    <div className="form-row">
      <div className="_-form__row">
        <input
          id="title"
          aria-label="title"
          name="post[title]"
          placeholder="TITLE"
          className="col-12"
          defaultValue={title}
        />
      </div>
      <div className="_-form__row">
        <input
          id="featured"
          aria-label="featured"
          name="post[featured]"
          placeholder="FEATURED IMAGE URL"
          className="col-4"
          defaultValue={featured}
        />
        <input
          id="category"
          aria-label="category"
          name="post[category]"
          placeholder="CATEGORY"
          className="col-2"
          defaultValue={category}
        />
        <input
          id="tags"
          aria-label="tags"
          name="post[tags]"
          placeholder="TAGS"
          className="col-2"
          defaultValue={tags}
        />
        <input
          id="state"
          aria-label="state"
          name="post[state]"
          placeholder="STATE"
          className="col-2"
          disabled="true"
        />
        <input
          id="time"
          aria-label="time"
          name="post[time]"
          placeholder="TIME"
          disabled="true"
          className="col-2"
          defaultValue={time && moment(time._created).format('MM/DD/YYYY')}
        />
      </div>
      <div className="_-form__row">
        <textarea
          id="content"
          name="post[content]"
          aria-label="content"
          placeholder="CONTENT"
          className="col-12"
          rows="15"
          defaultValue={content}
        />
      </div>
      <div className="_-form__row d-inline-flex">
        <div className="col-10">&nbsp;</div>
        <button type="submit" className="col-2" disabled={!isSubmittable}>{title ? 'UPDATE' : 'SUBMIT'}</button>
      </div>
    </div>
  </form>
);


// exports
export default EditorView;
