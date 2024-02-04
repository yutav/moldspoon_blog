import { marked } from 'marked';
import React from 'react';

var renderer = new marked.Renderer();
renderer.link = function (href, title, text) {
  var link = marked.Renderer.prototype.link.call(this, href, title, text);
  return link.replace("<a", "<a target='_blank' ");
};

const MarkdownView = ({
  markdownStringBody,
}: {
  markdownStringBody: string
}) => {


  const options = {
    gfm: true,
    breaks: true,
    pedantic: true,
    smartLists: true,
    smartypants: true,
    renderer: renderer
  };

  const renderMarkdown = (text: string) => {
    return marked(text, options);
  };

  return <div dangerouslySetInnerHTML={{ __html: renderMarkdown(markdownStringBody) }} />

}

export default MarkdownView