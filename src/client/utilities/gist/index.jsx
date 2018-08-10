import React, { PureComponent } from 'react';
import styled from 'styled-components';


// template
const template = (scriptSrc) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <base target="_parent" />
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  </head>
  <body>
    <script src="${scriptSrc}"></script>
  </body>
  </html>
`;


// component
const StyledIFrameContainer = styled.div`
  position: relative;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  
  > iframe {
    box-sizing: border-box;
    margin: 0 auto;
    max-width: 100%;
    position: relative;
  }
`;

const StyledIframe = styled.iframe`
  border: none;
  overflow: scroll;
  height: ${({ _height }) => `${_height}px` || '100%'};
  width: 100%;
`;


// container
class Gist extends PureComponent {
  iframe = React.createRef();
  state = { loaded: false, _height: 0 };

  _loadGistContent = () => {
    const { loaded } = this.state;
    const { id, file } = this.props;
    if (!loaded && id) {
      const scriptSrc = `https://gist.github.com/${id}.js${file ? `?file=${file}` : ''}`;
      const iframe = this.iframe.current;
      this.iframeDocument = iframe.contentDocument ? iframe.contentDocument : iframe.contentWindow.document;
      this.iframeDocument.open('text/html', 'replace');
      this.iframeDocument.write(template(scriptSrc));
      this.iframeDocument.close();
    }
  };

  _handleOnLoadIframe = () => {
    if (this.iframeDocument) {
      this.setState(() => ({
        loaded: true,
        _height: this.iframeDocument.documentElement.scrollHeight,
      }));
    }
  };

  componentDidMount = this._loadGistContent;

  componentDidUpdate = this._loadGistContent;

  render = () => {
    const { _height } = this.state;
    const { className, id } = this.props;
    return id
      ? (
        <StyledIFrameContainer>
          <StyledIframe
            innerRef={this.iframe}
            onLoad={this._handleOnLoadIframe}
            className={className}
            title="code snippet"
            _height={_height}
          />
        </StyledIFrameContainer>
      )
      : null;
  };
}


// exports
export default Gist;
