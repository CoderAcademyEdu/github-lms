import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import YouTubePlayer from 'react-player/lib/players/YouTube';
import ReactMarkdown from 'react-markdown/with-html';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FileSaver from 'file-saver';
import axios from 'axios';
import { convertSpacesToUnderscores } from '../utils/pathToDisplay';
import 'highlight.js/styles/github-gist.css'
import hljs from 'highlight.js'

const Download = styled.button`
  background-color: rgba(0, 0, 0, 0.05);
  padding: 10px;
  color: #333;
  margin: 5px;
  font-size: 12px;
  cursor: pointer;
`

const Flex = styled.div`
  display: flex;
`

class LessonTemplate extends Component {

  downloadFile = (download) => {
    const { url: fileUrl, name } = download;
    const { REACT_APP_COHORT: cohort } = process.env;
    const { module } = this.props.match.params;
    const url = `/api/${cohort}/download/${module}/${fileUrl}`;
    const options = {
      responseType: 'blob'
    }
    axios.get(url, options)
      .then(resp => {
        const fileName = `${convertSpacesToUnderscores(name)}.zip`;
        FileSaver.saveAs(resp.data, fileName);
      })
      .catch(err => console.log(err));
  }

  renderDownloads = (downloads) => {
    return (
      <Flex>
        {
          downloads.map(download => (
            <Download key={download.name} onClick={() => this.downloadFile(download)}>
              <FontAwesomeIcon icon="download" /> { download.name }
            </Download>
          ))
        }
      </Flex>
    );
  }

  renderFrontMatter = (fm) => {
    const { title, lecture_video, downloads } = fm;
    return (
      <>
        <Helmet>
          <title>{process.env.REACT_APP_COHORT} - {title}</title>
        </Helmet>
        { title && <h1>{title}</h1> }
        { lecture_video &&
            <YouTubePlayer
              url={lecture_video}
              controls
              width="100%"
              config={{
                youtube: {
                  playerVars: { showinfo: 1 }
                }
              }}
            />
        }
        { downloads && this.renderDownloads(downloads) }
      </>
    );
  }

  convertCodeBlocks() {
    const codeBlocks = document.querySelectorAll('code')
    codeBlocks.forEach((el) => {
      el.innerHTML = hljs.highlightAuto(el.innerText).value
    })
  }

  renderBody(body) {
    return (
      <div className="markdown-body">
        <div id="code">
          <ReactMarkdown
            source={body}
            escapeHtml={false}
          />
        </div>
      </div>
    )
  }

  componentDidMount() {
    this.convertCodeBlocks()
  }

  render() {
    const { fm, body } = this.props;
    return (
      <>
        { fm && this.renderFrontMatter(fm) }
        { body && this.renderBody(body) }
      </>
    );
  }
}

export default withRouter(LessonTemplate);