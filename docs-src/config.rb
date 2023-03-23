require 'github/markup'
require "helpers/source_helpers"
# Activate and configure extensions
# https://middlemanapp.com/advanced/configuration/#configuring-extensions

# activate :autoprefixer do |prefix|
#   prefix.browsers = "last 2 versions"
# end

set :build_dir, '../docs'
activate :condenser do |config|
  config.path = Dir.each_child(UniformUi::ASSET_PATH).map { |a| File.join(UniformUi::ASSET_PATH, a) }
  config.path << File.realpath(Application.root + '/../lib')
end

# Layouts
# https://middlemanapp.com/basics/layouts/

# Per-page layout changes
page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false

# With alternative layout
# page '/path/to/file.html', layout: 'other_layout'

# Proxy pages
# https://middlemanapp.com/advanced/dynamic-pages/

# proxy(
#   '/this-page-has-no-template.html',
#   '/template-file.html',
#   locals: {
#     which_fake_page: 'Rendering a fake page with a local variable'
#   },
# )

# Helpers
# Methods defined in the helpers block are available in templates
# https://middlemanapp.com/basics/helper-methods/

# helpers do
#   def some_helper
#     'Helping'
#   end
# end

# Build-specific configuration
# https://middlemanapp.com/advanced/configuration/#environment-specific-settings

# configure :build do
#   activate :minify_css
#   activate :minify_javascript
# end

SourceHelpers.components.each do |component|
  proxy "/#{component[:name]}/index.html", "/component.html", locals: {component: component}, :layout => "layout"
end
ignore "/component.html"

helpers do
  
  def asset_path(*args)
    path = super
    path = "/komps" + path if build?
    path
  end
  
  def code(language=nil, content=nil, options={}, &block)
    unless content
      from_block = true
      raise 'The code helper requires a block to be provided.' unless block_given?
      @_out_buf, _buf_was = "", @_out_buf
      begin
        content = capture_html(&block)
      ensure
        # Reset stored buffer
        @_out_buf = _buf_was
      end
    end
    
    starting_space_indents = content.split("\n").map do |line|
      if line.match(/\S/)
        line.match(/^\s+/).to_s.size
      else
        nil
      end
    end.compact
    content.gsub!(/^[^\n]{#{starting_space_indents.min}}/, '')

    if from_block
      content = content.encode(Encoding::UTF_8)
      concat_content Middleman::Syntax::Highlighter.highlight(content, language, options).html_safe
    else
      Middleman::Syntax::Highlighter.highlight(content, language, options)
    end
  end
  
  def markdown(markup)
    return "" unless markup
    html = GitHub::Markup.render_s(GitHub::Markups::MARKUP_MARKDOWN, markup)
    html = html.gsub(/<pre><code>.*<\/code><\/pre>/m) do |match|
      code('javascript', CGI.unescapeHTML(match.sub("<pre><code>", "").sub("</code></pre>", "")))
    end
    html
  end
end