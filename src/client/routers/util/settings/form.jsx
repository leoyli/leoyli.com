import styled from 'styled-components';
import React, { Fragment } from 'react';
import { Button, Container, Form, Header } from 'semantic-ui-react';


// style
const StyledSettingsForm = styled(Form)`
  margin-top: 2rem;
`;


// components
const GeneralSettings = ({ siteName, domain }) => (
  <Fragment>
    <Header as="h2" content="General" dividing />
    <Form.Group>
      <Form.Input
        label="Website Name"
        aria-label="Website Name"
        name="config[general][siteName]"
        defaultValue={siteName}
      />
      <Form.Input
        label="Domain Name"
        aria-label="Domain Name"
        name="config[general][domain]"
        defaultValue={domain}
      />
    </Form.Group>
  </Fragment>
);

const DisplaySettings = ({ language, timezone, timeFormat, sort, num }) => (
  <Fragment>
    <Header as="h2" content="Display" dividing />
    <Form.Group>
      <Form.Select
        label="Language"
        aria-label="Language"
        name="config[display][language]"
        defaultValue={language}
        options={[{
          text: 'English (en)',
          value: 'en',
        }]}
      />
      <Form.Input
        type="number"
        label="Posts (per page)"
        aria-label="Posts (per page)"
        name="config[display][num]"
        defaultValue={num}
      />
    </Form.Group>
    <Form.Group>
      <Form.Select
        label="Time Zone"
        aria-label="Time Zone"
        name="config[display][timezone]"
        defaultValue={timezone}
        options={[{
          text: 'UTC−06:00 (MST)',
          value: 'UTC−6',
        }]}
      />
      <Form.Select
        label="Time Format"
        aria-label="Time Format"
        name="config[display][timeFormat]"
        defaultValue={timeFormat}
        options={[{
          text: 'YYYY-MM-DD',
          value: 'YYYY-MM-DD',
        }]}
      />
    </Form.Group>
  </Fragment>
);

const SEOSettings = ({ googleAnalytics, facebookApp, twitter }) => (
  <Fragment>
    <Header as="h2" content="SEO & Marketing" dividing />
    <Form.Group>
      <Form.Input
        label="Google Analytics"
        aria-label="Google Analytics"
        name="config[services][googleAnalytics]"
        defaultValue={googleAnalytics}
      />
      <Form.Input
        label="Facebook App ID"
        aria-label="Facebook App ID"
        name="config[services][facebookApp]"
        defaultValue={facebookApp}
      />
      <Form.Input
        label="Twitter Creator ID"
        aria-label="Twitter Creator ID"
        name="config[services][twitter]"
        defaultValue={twitter}
      />
    </Form.Group>
  </Fragment>
);


// view
const SettingsForm = ({ isSubmittable, onSubmit, services, general, display }) => (
  <Container as={StyledSettingsForm} onSubmit={onSubmit} widths="equal" loading={!isSubmittable}>
    <GeneralSettings {...general} />
    <DisplaySettings {...display} />
    <SEOSettings {...services} />
    <Button
      aria-label="Update"
      content="Update"
      type="submit"
      color="blue"
      floated="right"
      disabled={!isSubmittable}
    />
  </Container>
);


// exports
export default SettingsForm;
