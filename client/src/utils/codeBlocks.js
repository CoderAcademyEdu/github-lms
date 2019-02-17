import React, { PureComponent } from "react";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/styles/hljs';

class CodeBlocks extends PureComponent {
  render() {
    const { value, language } = this.props;
    return (
      <SyntaxHighlighter language={language} style={docco}>
        {value}
      </SyntaxHighlighter>
    );
  }
}

export default CodeBlocks;