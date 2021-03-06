import React from 'react';
import { Link } from 'react-router';
import ImagePreview from './ImagePreview';
import VideoPlayer from './VideoPlayer';
import * as utils from '../utils';

export default class Article extends React.Component {
  constructor(props) {
    super(props);

    this.imgToPreview = this.imgToPreview.bind(this);
    this.enhanceVideo = this.enhanceVideo.bind(this);
  }

  componentDidMount() {
    this.componentDidUpdate();
  }
  componentDidUpdate() {
    const { chinese, english } = this.props.content.meta;
    utils.setTitle(`${chinese || english} - Ant Design`);
  }

  isPreviewImg(string) {
    return /^<img\s/i.test(string) && /preview-img/gi.test(string);
  }

  imgToPreview(node) {
    if (!this.isPreviewImg(node.children)) {
      return node;
    }

    const imgs = node.children.split(/\r|\n/);
    return <ImagePreview imgs={imgs} />;
  }

  isVideo(string) {
    return /^<video\s/i.test(string);
  }

  enhanceVideo(node) {
    if (!this.isVideo(node.children)) {
      return node;
    }

    return <VideoPlayer video={node.children} />;
  }

  render() {
    const { content, location } = this.props;
    const jumper = content.description.filter((node) => {
      return node.type === 'h2';
    }).map((node) => {
      return (
        <li key={node.children}>
          <Link to={{ pathname: location.pathname, query: { scrollTo: node.children } }}
            dangerouslySetInnerHTML={{ __html: node.children }} />
        </li>
      );
    });

    content.description = content.description
      .map(this.imgToPreview)
      .map(this.enhanceVideo);

    return (
      <article className="markdown">
        <h1>
          { content.meta.chinese || content.meta.english }
          {
            !content.meta.subtitle ? null :
              <span className="subtitle">{ content.meta.subtitle }</span>
          }
        </h1>
        {
          !content.intro ? null :
            content.intro.map(utils.objectToComponent.bind(null, location.pathname))
        }
        {
          jumper.length > 0 ?
            <section className="toc"><ul>{ jumper }</ul></section> :
            null
        }
        { content.description.map(utils.objectToComponent.bind(null, location.pathname)) }
      </article>
    );
  }
}
