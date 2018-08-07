import moment from 'moment';
import styled from 'styled-components';
import React from 'react';
import { Button, Container, Form } from 'semantic-ui-react';


// style
const StyledForm = styled(Form)`
  margin-top: 2rem;
`;


// view
const EditorForm = ({
  onSubmit,
  isSubmittable,
  post: { title, featured, category, tags, state, time, content } = {},
}) => (
  <Container as={StyledForm} autoComplete="off" onSubmit={onSubmit} loading={!isSubmittable}>
    <Form.Group>
      <Form.Input
        label="Post Title"
        aria-label="Post Title"
        placeholder="Post Title"
        name="post[title]"
        defaultValue={title}
        width={8}
      />
      <Form.Input
        label="Featured Image Url"
        aria-label="Featured Image Url"
        placeholder="Featured Image"
        name="post[featured]"
        defaultValue={featured}
        width={8}
      />
    </Form.Group>
    <Form.Group>
      <Form.Input
        label="Category"
        aria-label="Category"
        name="post[category]"
        placeholder="Category"
        defaultValue={category}
        width={4}
      />
      <Form.Input
        label="Tags"
        aria-label="Tags"
        name="post[tags]"
        placeholder="Tags"
        defaultValue={tags}
        width={4}
      />
      <Form.Input
        label="State"
        aria-label="State"
        name="post[state]"
        placeholder="State"
        width={4}
        disabled
      />
      <Form.Input
        label="Time"
        aria-label="Time"
        name="post[time]"
        placeholder="Time"
        defaultValue={time && moment(time._created).format('MM/DD/YYYY')}
        width={4}
        disabled
      />
    </Form.Group>
    <Form.Field
      label="Content (markdown supported)"
      aria-label="content"
      name="post[content]"
      control="textarea"
      rows="20"
      defaultValue={content}
    />
    <Button
      floated="right"
      color="blue"
      type="submit"
      disabled={!isSubmittable}
      content={title ? 'UPDATE' : 'SUBMIT'}
    />
  </Container>
);


// exports
export default EditorForm;
