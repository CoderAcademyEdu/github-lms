import React from 'react';
import YouTubePlayer from 'react-player/lib/players/YouTube';
import ReactMarkdown from 'react-markdown/with-html';

const renderFrontMatter = (fm) => {
  const { title, lecture_video } = fm;
  return (
    <>
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
    </>
  );
}

const LessonTemplate = (props) => {
  const { fm, body } = props;
  return (
    <>
      { fm && renderFrontMatter(fm) }
      { body &&
          <ReactMarkdown
            source={body}
            escapeHtml={false}
          />
      }
    </>
  );
}

export default LessonTemplate;